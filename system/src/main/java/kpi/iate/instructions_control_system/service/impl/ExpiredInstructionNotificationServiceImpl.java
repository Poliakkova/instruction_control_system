package kpi.iate.instructions_control_system.service.impl;

import kpi.iate.instructions_control_system.entity.Instructions;
import kpi.iate.instructions_control_system.entity.UserEntity;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpiredInstructionNotificationServiceImpl implements ExpiredInstructionNotificationService {

    private final InstructionsRepository instructionsRepository;
    private final MailService mailService;
    private final UnixDateToStringParser unixDateToStringParser;


    @Scheduled(cron = "0 37 15 ? * MON", zone = "Europe/Kiev") // Щопонеділка о 9:00 ранку
    @Override
    @Transactional
    public void sendWeeklyReport() {
        // Поточна дата на початку дня
        LocalDateTime today = LocalDateTime.now(ZoneId.systemDefault()).toLocalDate().atStartOfDay();
        long currentTimeMillis = today.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        // Кінець тижня (неділя 23:59)
        LocalDateTime endOfWeek = today.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        long endOfWeekMillis = endOfWeek.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        // Завантажуємо всі інструкції
        List<Instructions> instructionsList = new ArrayList<>();
        instructionsRepository.findAll().forEach(instructionsList::add);

        // Розділяємо завдання на дві категорії: цього тижня та прострочені
        Map<UserEntity, List<Instructions>> tasksForWeek = new HashMap<>();
        Map<UserEntity, List<Instructions>> overdueTasks = new HashMap<>();
        Map<UserEntity, List<Instructions>> unacquaintedTasks = new HashMap<>();

        instructionsList.stream()
                .filter(instruction -> "CREATED".equals(instruction.getStatus()) ||
                        "IN_PROGRESS".equals(instruction.getStatus()) ||
                        "REGISTERED".equals(instruction.getStatus()))
                .forEach(instruction -> {
                    long expTimeMillis = instruction.getExpTime() * 1000; // Дедлайн у мілісекундах

                    if (expTimeMillis >= currentTimeMillis && expTimeMillis <= endOfWeekMillis) {
                        // Додати до списку завдань на цей тиждень
                        instruction.getHeads().forEach(user ->
                                tasksForWeek.computeIfAbsent(user, k -> new ArrayList<>()).add(instruction));
                    } else if (expTimeMillis < currentTimeMillis) {
                        // Додати до списку прострочених завдань
                        instruction.getHeads().forEach(user ->
                                overdueTasks.computeIfAbsent(user, k -> new ArrayList<>()).add(instruction));
                    }

                    // Додати незасвідчені доручення до окремого списку
                    if (!instruction.isAcquainted()) {
                        instruction.getHeads().forEach(user ->
                                unacquaintedTasks.computeIfAbsent(user, k -> new ArrayList<>()).add(instruction));
                    }
                });

        // Генерація та надсилання звітів
        tasksForWeek.forEach((user, tasks) -> sendWeeklyReportEmail(user, tasks, overdueTasks.getOrDefault(user, new ArrayList<>()), unacquaintedTasks.getOrDefault(user, new ArrayList<>())));
    }

    // Надсилання звіту на пошту
    private void sendWeeklyReportEmail(UserEntity user, List<Instructions> tasksForWeek, List<Instructions> overdueTasks, List<Instructions> unacquaintedTasks) {
        if (user.isNotifyWeekReport() && user.getUserEmail() != null) {
            StringBuilder messageBuilder = new StringBuilder();

            // Заголовок
            messageBuilder.append(String.format("Вітаю, %s!\n\n", user.getUserName()));
            messageBuilder.append("Ваш звіт на тиждень:\n\n");

            // Список завдань на цей тиждень
            messageBuilder.append("Завдання, які потрібно виконати цього тижня:\n");
            tasksForWeek.forEach(task -> messageBuilder.append(formatInstructionForEmail(task)));

            // Список прострочених завдань
            if (!overdueTasks.isEmpty()) {
                messageBuilder.append("\nПрострочені завдання:\n");
                overdueTasks.forEach(task -> messageBuilder.append(formatInstructionForEmail(task)));
            }

            // Список незасвідчених доручень
            if (!unacquaintedTasks.isEmpty()) {
                messageBuilder.append("\nТакож обовʼязково ознайомтеся з іншими завданнями. Для цього перейдіть на сторінку доручення і натисніть кнопку \"Я ознайомлений\":\n");
                unacquaintedTasks.forEach(task -> messageBuilder.append(formatInstructionForEmail(task)));
            }

            messageBuilder.append("\nЗ найкращими побажаннями, кафедра НН ІАТЕ");

            // Надсилання листа
            mailService.send(
                    user.getUserEmail(),
                    "НН ІАТЕ - Щотижневий звіт про доручення",
                    messageBuilder.toString()
            );
        }
    }

    // Форматування завдання для електронного листа
    private String formatInstructionForEmail(Instructions instruction) {
        String formattedDateExp = unixDateToStringParser.unixDateToString(instruction.getExpTime());
        return String.format(
                "- Назва: %s\n  Статус: %s\n  Кінцевий термін: %s\n  Опис: %s\n  Посилання: http://localhost:3000/instructions/%s\n\n",
                instruction.getTitle(),
                StatusMapper.getStatusName(instruction.getStatus()),
                formattedDateExp,
                instruction.getShortDescription(),
                instruction.getCode()
        );
    }

    //second minute hour day-of-month month day-of-week
    @Scheduled(cron = "0 3 16 * * ?", zone = "Europe/Kiev") // Запуск щодня о 9:00 ранку
    @Override
    @Transactional
    public void sendDeadlineNotification() {
        // Поточна дата на початку дня
        LocalDateTime today = LocalDateTime.now(ZoneId.systemDefault()).toLocalDate().atStartOfDay();
        long currentTimeMillis = today.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        // Завантажуємо всі інструкції
        List<Instructions> instructionsList = new ArrayList<>();
        instructionsRepository.findAll().forEach(instructionsList::add);

        // Структури для зберігання завдань за категоріями
        Map<UserEntity, List<Instructions>> deadlinesByUser = new HashMap<>();
        Map<UserEntity, List<Instructions>> missedDeadlinesByUser = new HashMap<>();

        // Розділення завдань за категоріями
        instructionsList.stream()
                .filter(instruction -> "CREATED".equals(instruction.getStatus()) ||
                        "IN_PROGRESS".equals(instruction.getStatus()) ||
                        "REGISTERED".equals(instruction.getStatus()))
                .forEach(instruction -> {
                    long expTimeMillis = instruction.getExpTime() * 1000; // Дедлайн у мілісекундах
                    long daysToDeadline = (expTimeMillis - currentTimeMillis) / (24 * 60 * 60 * 1000); // Дні до дедлайну
                    long daysAfterDeadline = (currentTimeMillis - expTimeMillis) / (24 * 60 * 60 * 1000); // Дні після дедлайну

                    // Завдання до дедлайну
                    if (daysToDeadline == 1 || daysToDeadline == 3 || daysToDeadline == 7) {
                        instruction.getHeads().forEach(user ->
                                deadlinesByUser.computeIfAbsent(user, k -> new ArrayList<>()).add(instruction));
                    }

                    // Прострочені завдання
                    if (daysAfterDeadline == 0) { // Завдання, пропущені вчора
                        instruction.getHeads().forEach(user ->
                                missedDeadlinesByUser.computeIfAbsent(user, k -> new ArrayList<>()).add(instruction));
                    }
                });

        // Надсилання листів із дедлайнами
        deadlinesByUser.forEach((user, instructions) -> sendConsolidatedReminderEmail(user, instructions));

        // Надсилання листів із простроченими завданнями
        missedDeadlinesByUser.forEach((user, instructions) -> sendMissedDeadlinesEmail(user, instructions));
    }

    // Надсилання листа із завданнями з дедлайнами через 1, 3 та 7 днів
    private void sendConsolidatedReminderEmail(UserEntity user, List<Instructions> instructions) {
        if (user.isNotifyMissedDeadline() && user.getUserEmail() != null) {
            StringBuilder messageBuilder = new StringBuilder();
            messageBuilder.append(String.format("Вітаю, %s!\n\n", user.getUserName()));
            messageBuilder.append("Нагадуємо про наближення кінцевого терміну виконання доручень:\n\n");

            // Сортуємо завдання за кількістю днів до дедлайну (1, 3, 7)
            instructions.sort((instr1, instr2) -> {
                long daysToDeadline1 = (instr1.getExpTime() * 1000 - System.currentTimeMillis()) / (24 * 60 * 60 * 1000);
                long daysToDeadline2 = (instr2.getExpTime() * 1000 - System.currentTimeMillis()) / (24 * 60 * 60 * 1000);
                return Long.compare(daysToDeadline1, daysToDeadline2);
            });

            instructions.forEach(instruction -> {
                long daysToDeadline = (instruction.getExpTime() * 1000 - System.currentTimeMillis()) / (24 * 60 * 60 * 1000);
                String formattedDateExp = unixDateToStringParser.unixDateToString(instruction.getExpTime());
                messageBuilder.append(String.format(
                        "- Назва: %s\n  Залишилось днів: %s\n  Кінцевий термін: %s\n  Опис: %s\n  Посилання: http://localhost:3000/instructions/%s\n\n",
                        instruction.getTitle(),
                        daysToDeadline+1,
                        formattedDateExp,
                        instruction.getShortDescription(),
                        instruction.getCode()
                ));
            });

            messageBuilder.append("\nЗ найкращими побажаннями, кафедра НН ІАТЕ");
            mailService.send(user.getUserEmail(), "НН ІАТЕ - Наближення кінцевого терміну", messageBuilder.toString());
        }
    }

    // Надсилання листа із простроченими завданнями
    private void sendMissedDeadlinesEmail(UserEntity user, List<Instructions> instructions) {
        if (user.isNotifyMissedDeadline() && user.getUserEmail() != null) {
            StringBuilder messageBuilder = new StringBuilder();
            messageBuilder.append(String.format("Вітаю, %s!\n\n", user.getUserName()));
            messageBuilder.append("Нагадуємо про завдання з пропущеним кінцевим терміном виконання (пропущені вчора):\n\n");

            instructions.forEach(instruction -> {
                String formattedDateExp = unixDateToStringParser.unixDateToString(instruction.getExpTime());
                messageBuilder.append(String.format(
                        "- Назва: %s\n  Кінцевий термін: %s\n  Опис: %s\n  Посилання: http://localhost:3000/instructions/%s\n\n",
                        instruction.getTitle(),
                        formattedDateExp,
                        instruction.getShortDescription(),
                        instruction.getCode()
                ));
            });

            messageBuilder.append("\nЗ найкращими побажаннями, кафедра НН ІАТЕ");
            mailService.send(user.getUserEmail(), "НН ІАТЕ - Прострочений кінцевий термін", messageBuilder.toString());
        }
    }
}
