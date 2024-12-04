package kpi.iate.instructions_control_system.service.impl;

import kpi.iate.instructions_control_system.entity.Instructions;
import kpi.iate.instructions_control_system.mapper.StatusMapper;
import kpi.iate.instructions_control_system.parser.UnixDateToStringParser;
import kpi.iate.instructions_control_system.repository.InstructionsRepository;
import kpi.iate.instructions_control_system.service.ExpiredInstructionNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpiredInstructionNotificationServiceImpl implements ExpiredInstructionNotificationService {

    private final InstructionsRepository instructionsRepository;
    private final MailService mailService;
    private final UnixDateToStringParser unixDateToStringParser;


    //second minute hour day-of-month month day-of-week
    @Scheduled(cron = "0 48 2 * * ?", zone = "Europe/Kiev")
    @Override
    @Transactional
    public void sendDeadlineNotification() {
        // Поточна дата о 00:00
        LocalDateTime currentDate = LocalDateTime.now(ZoneId.systemDefault()).toLocalDate().atStartOfDay();
        long currentTimeMillis = currentDate.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        // Завантажуємо всі інструкції
        List<Instructions> listInst = new ArrayList<>();
        instructionsRepository.findAll().forEach(listInst::add);

        // Надсилання повідомлень для наближення дедлайну
        listInst.stream()
                .filter(instruction -> "CREATED".equals(instruction.getStatus()) || "IN_PROGRESS".equals(instruction.getStatus()))
                .forEach(instruction -> {
                    long expTimeMillis = instruction.getExpTime() * 1000; // Дедлайн у мілісекундах
                    long daysToDeadline = (expTimeMillis - currentTimeMillis) / (24 * 60 * 60 * 1000); // Різниця в днях

                    if (daysToDeadline == 7 || daysToDeadline == 3 || daysToDeadline == 1) {
                        sendReminderEmail(instruction, daysToDeadline);
                    }
                });

        // Надсилання повідомлень про пропущений дедлайн
        listInst.stream()
                .filter(instruction -> "CREATED".equals(instruction.getStatus()) || "IN_PROGRESS".equals(instruction.getStatus()))
                .forEach(instruction -> {
                    long expTimeMillis = instruction.getExpTime() * 1000; // Дедлайн у мілісекундах
                    long daysAfterDeadline = (currentTimeMillis - expTimeMillis) / (24 * 60 * 60 * 1000); // Різниця в днях після дедлайну

                    if (daysAfterDeadline == 0) { // другий день після дедлайну
                        sendMissedDeadlineEmail(instruction);
                    }
                });
    }

    // Надсилання повідомлення про наближення дедлайну
    private void sendReminderEmail(Instructions instruction, long daysToDeadline) {
        instruction.getHeads().forEach(user -> {
            if (user.isEnableNotification() && user.getUserEmail() != null) {
                String formattedDateExp = unixDateToStringParser.unixDateToString(instruction.getExpTime());
                String translatedStatus = StatusMapper.getStatusName(instruction.getStatus());

                String message = String.format(
                            "Вітаю, %s!\n" +
                                    "Нагадуємо, що дедлайн виконання доручення \"%s\" наближається. Залишилось %s днів.\n" +
                                    "Кінцевий термін: %s\n\n" +
                                    "Статус: %s\n\n" +
                                    "Короткий опис: %s\n\n" +
                                    "Повний опис: %s\n\n" +
                                    "Текст доручення: %s\n\n" +
                                    "Ознайомтеся детальніше за посиланням: http://localhost:3000/instructions/%s\n" +
                                    "З найкращими побажаннями, кафедра НН ІАТЕ",
                            user.getUserName(),
                            instruction.getTitle(),
                            daysToDeadline,
                            formattedDateExp,
                            translatedStatus,
                            instruction.getShortDescription(),
                            instruction.getFullDescription(),
                            instruction.getText(),
                            instruction.getCode()
                    );
                mailService.send(user.getUserEmail(), "НН ІАТЕ - Наближається дедлайн", message);
            }
        });
    }

    // Надсилання повідомлення про пропущений дедлайн
    private void sendMissedDeadlineEmail(Instructions instruction) {
        instruction.getHeads().forEach(user -> {
            if (user.isEnableNotification() && user.getUserEmail() != null) {
                String formattedDateExp = unixDateToStringParser.unixDateToString(instruction.getExpTime());
                String translatedStatus = StatusMapper.getStatusName(instruction.getStatus());

                String message = String.format(
                        "Вітаю, %s!\n" +
                                "Нагадуємо, що дедлайн виконання доручення \"%s\" було пропущено!\n" +
                                "Будь ласка, займіться якнайшвидше" +
                                "Кінцевий термін: %s\n\n" +
                                "Статус: %s\n\n" +
                                "Короткий опис: %s\n\n" +
                                "Повний опис: %s\n\n" +
                                "Текст доручення: %s\n\n" +
                                "Ознайомтеся детальніше за посиланням: http://localhost:3000/instructions/%s\n" +
                                "З найкращими побажаннями, кафедра НН ІАТЕ",
                        user.getUserName(),
                        instruction.getTitle(),
                        formattedDateExp,
                        translatedStatus,
                        instruction.getShortDescription(),
                        instruction.getFullDescription(),
                        instruction.getText(),
                        instruction.getCode()
                );
                mailService.send(user.getUserEmail(), "НН ІАТЕ - Пропущений дедлайн", message);
            }
        });
    }
}
