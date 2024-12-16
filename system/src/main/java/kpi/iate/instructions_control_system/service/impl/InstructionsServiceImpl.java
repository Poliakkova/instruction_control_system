package kpi.iate.instructions_control_system.service.impl;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.entity.AuthKey;
import kpi.iate.instructions_control_system.entity.Instructions;
import kpi.iate.instructions_control_system.entity.UserEntity;
import kpi.iate.instructions_control_system.enums.InstructionStatus;
import kpi.iate.instructions_control_system.exception.InstructionNotFoundException;
import kpi.iate.instructions_control_system.filters.DateFilter;
import kpi.iate.instructions_control_system.filters.HeadSurnameFilter;
import kpi.iate.instructions_control_system.mapper.InstructionMapper;
import kpi.iate.instructions_control_system.mapper.StatusMapper;
import kpi.iate.instructions_control_system.mapper.UserMapper;
import kpi.iate.instructions_control_system.parser.StringToDateLongParser;
import kpi.iate.instructions_control_system.parser.UnixDateToStringParser;
import kpi.iate.instructions_control_system.repository.AuthKeyRepository;
import kpi.iate.instructions_control_system.repository.InstructionsRepository;
import kpi.iate.instructions_control_system.repository.UserRepository;
import kpi.iate.instructions_control_system.service.InstructionsService;
import kpi.iate.instructions_control_system.service.UserService;
import kpi.iate.instructions_control_system.validation.AuthKeyValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructionsServiceImpl implements InstructionsService {

    @Autowired
    MailService mailService;

    private final AuthKeyRepository authKeyRepository;

    private final AuthKeyValidator authKeyValidator;

    private final InstructionsRepository instructionsRepository;

    private final UserRepository userRepository;

    private final InstructionMapper instructionMapper;

    private final UserMapper userMapper;

    private final DateFilter dateFilter;

    private final HeadSurnameFilter headSurnameFilter;

    private final StringToDateLongParser stringToDateLongParser;

    private final UserService userService;

    private final UnixDateToStringParser unixDateToStringParser;

    @Transactional(readOnly = true)
    public AuthKey getKey(){
        List<AuthKey> list = new ArrayList<>();
        authKeyRepository.findAll().forEach(list::add);
        return list.stream().filter(Objects::nonNull).findFirst().orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public InstructionsDto getInstructionByCode(final UUID key, final String instructionCode) {
        validateKey(key);

        return instructionMapper.instructionToDto(instructionsRepository
                .getInstructionByCode(instructionCode)
                .orElseThrow( () ->  new InstructionNotFoundException("No instruction found with " + instructionCode + " code")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstructionsDto> getAllInstructions(final UUID key){
        validateKey(key);

        List <Instructions> listOfInstructions = getAllInstructionsFromRepo();
        List <InstructionsDto> listOfInstructionDto = convertInstructionListToDtoList(listOfInstructions);

        return listOfInstructionDto;
    }
//--------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<InstructionsDto> getInstructionsFilteredByStartDate(final UUID key, final String startDate){
        validateKey(key);

        List <Instructions> listOfInstructions = getAllInstructionsFromRepo();
        List <InstructionsDto> listOfInstructionDto = convertInstructionListToDtoList(listOfInstructions);

        return dateFilter.filterInstructionsByStartDate(startDate, listOfInstructionDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstructionsDto> getInstructionsFilteredByExpDate(final UUID key, final String expDate){
        validateKey(key);

        List <Instructions> listOfInstructions = getAllInstructionsFromRepo();
        List <InstructionsDto> listOfInstructionDto = convertInstructionListToDtoList(listOfInstructions);

        return dateFilter.filterInstructionsByExpDate(expDate, listOfInstructionDto);
    }
    ////////////////////---------------------------------------------------------------------------------

    @Override
    @Transactional
    public InstructionsDto updateInstruction(final UUID key, InstructionsDto instructionsDto) {
        validateKey(key);

        Assert.notNull(instructionsDto, "instructionDto cant be null");
        String instructionsCode = instructionsDto.getCode();
        Instructions instructions = instructionsRepository.getInstructionByCode(instructionsCode)
                .orElseThrow( () ->  new InstructionNotFoundException("No instruction found with " + instructionsCode + " code"));
        if (!CollectionUtils.isEmpty(instructionsDto.getUsers())) {
            deleteInstructionsFromUsers(instructions, instructions.getHeads());
            instructions.setHeads(new ArrayList<>());
            instructionsDto.getUsers().stream().filter(Objects::nonNull).forEach(user -> {
                UserEntity updatedUser = userService.findUserByLogin(user.getUserLogin());
                updatedUser.getInstructions().add(instructions);
                instructions.getHeads().add(updatedUser);
                userRepository.save(updatedUser);
                instructionsRepository.save(instructions);

                System.out.printf("SEND INSTRUCTION FROM SERVICE TO %s %s%n",
                        user.getUserEmail(), user.getUserLogin());
                if (user.getUserEmail() != null && user.isNotifyNewInstruction()) {
                    String formattedDateExp = unixDateToStringParser.unixDateToString(instructions.getExpTime());
//                    String formattedDateStart = unixDateToStringParser.unixDateToString(instructions.getStartTime());
                    String translatedStatus = StatusMapper.getStatusName(instructions.getStatus());

                    String message = String.format(
                            "Вітаю, %s!\n" +
                                    "Вас призначено відповідальним за доручення \"%s\"\n" +
                                    "по протоколу засідання кафедри №%s\n\n" +
                                    "Статус: %s\n\n" +
                                    "Джерело: %s\n\n" +
                                    "Тип доручення: %s\n\n" +
                                    "Короткий опис: %s\n\n" +
                                    "Повний опис: %s\n\n" +
                                    "Текст доручення: %s\n\n" +
//                                    "Початок роботи: %s\n\n" +
                                    "Виконати до: %s\n\n" +
                                    "Ознайомтеся детальніше на http://localhost:3000//instructions/%s\n" +
                                    "Гарного дня!",
                            user.getUserName(),
                            instructions.getTitle(),
                            instructions.getProtocol(),
                            translatedStatus,
                            instructions.getSourceOfInstruction(),
                            instructions.getType(),
                            instructions.getShortDescription(),
                            instructions.getFullDescription(),
                            instructions.getText(),
//                            formattedDateStart,
                            formattedDateExp,
                            instructions.getCode()
                    );
                    mailService.send(user.getUserEmail(), "НН ІАТЕ - Нове доручення", message);
                }

            });
        }
        instructions.setTitle(instructionsDto.getTitle());
        instructions.setStatus(instructionsDto.getStatus());
        instructions.setSourceOfInstruction(instructionsDto.getSourceOfInstruction());
        instructions.setShortDescription(instructionsDto.getShortDescription());
        instructions.setFullDescription(instructionsDto.getFullDescription());
        instructions.setText(instructionsDto.getText());
        instructions.setStartTime(instructionsDto.getStartTime().getTime()/1000);
        instructions.setExpTime((instructionsDto.getExpTime().getTime()/1000));
        instructions.setExpTime(instructionsDto.getExpTime().getTime()/1000);
        instructions.setMakingTime(instructionsDto.getMakingTime());
        instructions.setProtocol(instructionsDto.getProtocol());
        instructions.setMapProcess(instructionsDto.getMapProcess());
        instructions.setType(instructionsDto.getType());
        instructions.setComment(instructionsDto.getComment());

        instructionsRepository.save(instructions);

        return instructionMapper.instructionToDto(instructions);
    }

    @Override
    @Transactional
    public InstructionsDto createInstruction(final UUID key, final InstructionsDto instructionsDto) {
        validateKey(key);

        Instructions instructions =  instructionMapper.instructionDtoToEntity(instructionsDto);
        if (instructions != null) {
            instructionsDto.getUsers().stream()
                    .filter(Objects::nonNull)
                    .forEach(user -> {
                        UserEntity userEntity = userService.findUserByLogin(user.getUserLogin());
                        if (userEntity != null) {
                            addUserToInstruction(instructions, userEntity);
                            addInstructionsToUser(userEntity, instructions);
                            instructionsRepository.save(instructions);
                            userRepository.save(userEntity);

                            System.out.printf("SEND INSTRUCTION FROM SERVICE TO %s %s%n",
                                    userEntity.getUserEmail(), userEntity.getUserLogin());
                            if (userEntity.getUserEmail() != null && userEntity.isNotifyNewInstruction()) {

                                String formattedDateExp = unixDateToStringParser.unixDateToString(instructions.getExpTime());
//                                String formattedDateStart = unixDateToStringParser.unixDateToString(instructions.getStartTime());
                                String translatedStatus = StatusMapper.getStatusName(instructions.getStatus());

                                String message = String.format(
                                        "Вітаю, %s!\n" +
                                                "Вас призначено відповідальним за доручення \"%s\"\n" +
                                                "по протоколу засідання кафедри №%s\n\n" +
                                                "Статус: %s\n\n" +
                                                "Джерело: %s\n\n" +
                                                "Тип доручення: %s\n\n" +
                                                "Короткий опис: %s\n\n" +
                                                "Повний опис: %s\n\n" +
                                                "Текст доручення: %s\n\n" +
//                                                "Початок роботи: %s\n\n" +
                                                "Виконати до: %s\n\n" +
                                                "Ознайомтеся детальніше на http://localhost:3000//instructions/%s\n" +
                                                "Гарного дня!",
                                        userEntity.getUserName(),
                                        instructions.getTitle(),
                                        instructions.getProtocol(),
                                        translatedStatus,
                                        instructions.getSourceOfInstruction(),
                                        instructions.getType(),
                                        instructions.getShortDescription(),
                                        instructions.getFullDescription(),
                                        instructions.getText(),
//                                        formattedDateStart,
                                        formattedDateExp,
                                        instructions.getCode()
                                );
                                mailService.send(userEntity.getUserEmail(), "НН ІАТЕ - Нове доручення", message);
                            }
                        }
                    });
            return instructionMapper.instructionToDto(instructions);
        }
        return new InstructionsDto();
    }

    @Override
    @Transactional
    public void deleteInstructionByCode(final UUID key, final String instructionCode) {
        validateKey(key);

        Instructions instructions = instructionsRepository.getInstructionByCode(instructionCode).orElseThrow( () ->  new InstructionNotFoundException("No instruction found with " + instructionCode + " code"));
        instructions.getHeads().stream().forEach(user -> {
            user.getInstructions().remove(instructions);
            userRepository.save(user);
        });
        instructions.setHeads(new ArrayList<>());
        instructionsRepository.delete(instructions);
    }

    @Override
    @Transactional
    public List<InstructionsDto> getArchivedInstructions() {
        List <Instructions> instructions = new ArrayList<>();
        instructionsRepository.findAll().forEach(instruction -> {
            if (InstructionStatus.FINISHED.name().equals(instruction.getStatus())) {
                instructions.add(instruction);
            }
        });
        return instructions.stream()
                .filter(Objects::nonNull)
                .map(instructionMapper::instructionToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateInstructionStatus(final UUID key, final InstructionsDto instructionsDto) {
        Assert.notNull(instructionsDto, "Instruction DTO couldn`t be null while updating status");
        validateKey(key);
        Instructions instructions = instructionsRepository.getInstructionByCode(instructionsDto.getCode())
                .orElseThrow(() -> new InstructionNotFoundException(String.format("No instruction with code %s was found", instructionsDto.getCode())));
        InstructionStatus instructionStatus = InstructionStatus.valueOf(instructionsDto.getStatus());
        instructions.setStatus(instructionStatus.name());
        instructionsRepository.save(instructions);

        instructionsDto.getUsers().stream()
                .filter(Objects::nonNull)
                .forEach(user -> {
                    UserEntity userEntity = userService.findUserByLogin(user.getUserLogin());
                    if (userEntity != null) {
                        System.out.printf("SEND INSTRUCTION FROM SERVICE TO %s %s%n",
                                userEntity.getUserEmail(), userEntity.getUserLogin());
                        if (userEntity.getUserEmail() != null && userEntity.isNotifyStatusChange()) {

                            String formattedDateExp = unixDateToStringParser.unixDateToString(instructions.getExpTime());
//                            String formattedDateStart = unixDateToStringParser.unixDateToString(instructions.getStartTime());
                            String translatedStatus = StatusMapper.getStatusName(instructions.getStatus());
                            String message = String.format(
                                    "Вітаю, %s!\n" +
                                            "Змінено статус доручення \"%s\"\n" +
                                            "Новий статус: %s\n\n" +
                                            "Джерело: %s\n\n" +
                                            "Тип доручення: %s\n\n" +
                                            "Короткий опис: %s\n\n" +
                                            "Повний опис: %s\n\n" +
                                            "Текст доручення: %s\n\n" +
//                                            "Початок роботи: %s\n\n" +
                                            "Виконати до: %s\n\n" +
                                            "Ознайомтеся детальніше на http://localhost:3000/instructions/%s\n" +
                                            "Гарного дня!",
                                    userEntity.getUserName(),
                                    instructions.getTitle(),
                                    translatedStatus,
                                    instructions.getSourceOfInstruction(),
                                    instructions.getType(),
                                    instructions.getShortDescription(),
                                    instructions.getFullDescription(),
                                    instructions.getText(),
//                                    formattedDateStart,
                                    formattedDateExp,
                                    instructions.getCode()
                            );
                            mailService.send(userEntity.getUserEmail(), "Доручення НН ІАТЕ - Новий статус", message);
                        }


                    }
                });
    }

    private List<Instructions> getAllInstructionsFromRepo() {
        List <Instructions> listOfInstructions= new ArrayList<>();
        instructionsRepository.findAll().forEach(listOfInstructions::add);
        return listOfInstructions;
    }

    private List<InstructionsDto> convertInstructionListToDtoList(List<Instructions> listOfInstructions){
        return  listOfInstructions.stream()
                .filter(Objects::nonNull)
                .map(instructionMapper::instructionToDto)
                .collect(Collectors.toList());
    }

    private boolean validateKey(final UUID key){
        return  true; //todo return normal logic
        //        if(authKeyValidator.validate(key)) {
//            return true;
//        } else throw new KeyIsNotValidException("Key is not valid " +  new Date().getTime() );
    }
    private void addUserToInstruction(Instructions instructions, UserEntity userEntity){
        Assert.notNull(instructions, "instruction couldn`t be nll");
        Assert.notNull(userEntity, "userEntity couldn`t be nll");
        if (CollectionUtils.isEmpty(instructions.getHeads())) {
            ArrayList<UserEntity> users = new ArrayList<>();
            users.add(userEntity);
            instructions.setHeads(users);
        }
        //instructions.getHeads().add(userEntity);
    }
    private void addInstructionsToUser(UserEntity userEntity, Instructions instructions){
        Assert.notNull(instructions, "instruction couldn`t be nll");
        Assert.notNull(userEntity, "userEntity couldn`t be nll");
        if (userEntity.getInstructions() == null) {
            userEntity.setInstructions(new ArrayList<Instructions>());
        }
        userEntity.getInstructions().add(instructions);
    }
    private void deleteInstructionsFromUsers(Instructions instructions, List<UserEntity> users) {
        users.stream().filter(Objects::nonNull).forEach(user -> {
            user.getInstructions().remove(instructions);
            userRepository.save(user);

//            System.out.printf("SEND INSTRUCTION FROM SERVICE TO %s %s%n",
//                    user.getUserEmail(), user.getUserLogin());
//            if (user.getUserEmail() != null && user.isEnableNotification()) {
//                System.out.println("HAS EMAIL");
//                String message = String.format(
//                        "Вітаю, %s!\n" +
//                                "Ви були усунуті від доручення \"%s\"\n" +
//                                "Ознайомтеся детальніше на http://127.0.0.1:3000/instructions\n" +
//                                "Гарного дня!",
//                        user.getUserName(), instructions.getTitle()
//                );
//                mailService.send(user.getUserEmail(), "Доручення НН ІАТЕ", message);
//            }
        });
    }

    @Override
    public void sendEmailToInstructionUsers(UUID key, InstructionsDto instructionsDto) {
        Assert.notNull(instructionsDto, "Instruction DTO couldn`t be null while updating status");
        validateKey(key);

        Instructions instructions = instructionsRepository.getInstructionByCode(instructionsDto.getCode())
                .orElseThrow(() -> new InstructionNotFoundException(String.format("No instruction with code %s was found", instructionsDto.getCode())));

        instructionsDto.getUsers().stream()
                .filter(Objects::nonNull)
                .forEach(user -> {
                    UserEntity userEntity = userService.findUserByLogin(user.getUserLogin());
                    if (userEntity != null) {
                        if (userEntity.getUserEmail() != null && userEntity.isNotifyNewComment()) {

                            String formattedDateExp = unixDateToStringParser.unixDateToString(instructions.getExpTime());
                            String translatedStatus = StatusMapper.getStatusName(instructions.getStatus());
                            String message = String.format(
                                    "Вітаю, %s!\n" +
                                            "Ви отримали новий коментар до доручення \"%s\"\n\n" +
                                            "Короткий опис доручення: %s\n\n" +
                                            "Статус доручення: %s\n\n" +
                                            "Виконати до: %s\n\n" +
                                            "Перегляньте коментар на http://localhost:3000/instructions/%s\n" +
                                            "Гарного дня!",
                                    userEntity.getUserName(),
                                    instructions.getTitle(),
                                    instructions.getShortDescription(),
                                    translatedStatus,
                                    formattedDateExp,
                                    instructions.getCode()
                            );
                            mailService.send(userEntity.getUserEmail(), "Доручення НН ІАТЕ - Новий коментар", message);
                        }
                    }
                });
    }
}
