package kpi.iate.instructions_control_system.service.impl;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.entity.AuthKey;
import kpi.iate.instructions_control_system.entity.Instructions;
import kpi.iate.instructions_control_system.exception.InstructionNotFoundException;
import kpi.iate.instructions_control_system.exception.KeyIsNotValidException;
import kpi.iate.instructions_control_system.filters.DateFilter;
import kpi.iate.instructions_control_system.filters.HeadSurnameFilter;
import kpi.iate.instructions_control_system.mapper.InstructionMapper;
import kpi.iate.instructions_control_system.parser.StringToDateLongParser;
import kpi.iate.instructions_control_system.repository.AuthKeyRepository;
import kpi.iate.instructions_control_system.repository.InstructionsRepository;
import kpi.iate.instructions_control_system.service.InstructionsService;
import kpi.iate.instructions_control_system.validation.AuthKeyValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructionsServiceImpl implements InstructionsService {

    private final AuthKeyRepository authKeyRepository;

    private final AuthKeyValidator authKeyValidator;

    private final InstructionsRepository instructionsRepository;

    private final InstructionMapper instructionMapper;

    private final DateFilter dateFilter;

    private final HeadSurnameFilter headSurnameFilter;

    private final StringToDateLongParser stringToDateLongParser;

    @Transactional(readOnly = true)
    public AuthKey getKey(){
        List<AuthKey> list = new ArrayList<>();
        authKeyRepository.findAll().forEach(list::add);
        return list.get(0);
    }

    @Override
    @Transactional(readOnly = true)
    public InstructionsDto getInstructionByTitle(final UUID key, final String instructionTitle) {
        validateKey(key);

        return instructionMapper.instructionToDto(instructionsRepository
                .getInstructionByTitle(instructionTitle)
                .orElseThrow( () ->  new InstructionNotFoundException("No instruction found with " + instructionTitle + " title")));
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
    public List<InstructionsDto> getInstructionsFilteredByHeadSurname(final UUID key, final String headSurname){
        validateKey(key);

        List <Instructions> listOfInstructions = getAllInstructionsFromRepo();
        List <InstructionsDto> listOfInstructionsDto = convertInstructionListToDtoList(listOfInstructions);

       return headSurnameFilter.filterInstructionsByHeadSurname(headSurname, listOfInstructionsDto);
    }

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
    public InstructionsDto updateInstructionByTitle(final UUID key, final String instructionTitle, final String newTitle,
                                                    final String newHeadSurname, final String newHeadName, final String newHeadPatronymic,
                                                    final String newHeadControlSurname, final String newHeadControlName, final String newHeadControlPatronymic, final String newStatus, final String newSourceOfInstruction,
                                                    final String newShortDescription, final String newFullDescription, final String newText,
                                                    final String newStartTime, final String newExpTime) {
        validateKey(key);

        Instructions instructions = instructionsRepository.getInstructionByTitle(instructionTitle)
                .orElseThrow( () ->  new InstructionNotFoundException("No instruction found with " + instructionTitle + " title"));
        instructions.setTitle(newTitle);
        instructions.setHeadSurname(newHeadSurname);
        instructions.setHeadName(newHeadName);
        instructions.setHeadPatronymic(newHeadPatronymic);
        instructions.setHeadControlSurname(newHeadControlSurname);
        instructions.setHeadControlName(newHeadControlName);
        instructions.setHeadControlPatronymic(newHeadControlPatronymic);
        instructions.setStatus(newStatus);
        instructions.setSourceOfInstruction(newSourceOfInstruction);
        instructions.setShortDescription(newShortDescription);
        instructions.setFullDescription(newFullDescription);
        instructions.setStartTime(stringToDateLongParser.parseStringToGetLongTime(newStartTime)/1000);
        instructions.setExpTime(stringToDateLongParser.parseStringToGetLongTime(newExpTime)/1000);
        instructions.setText(newText);
        instructionsRepository.save(instructions);

        return instructionMapper.instructionToDto(instructions);
    }

    @Override
    @Transactional
    public InstructionsDto createInstruction(final UUID key, final String newTitle,
                                             final String newHeadSurname, final String newHeadName, final String newHeadPatronymic,
                                             final String newHeadControlSurname, final String newHeadControlName, final String newHeadControlPatronymic, final String newStatus, final String newSourceOfInstruction,
                                             final String newShortDescription, final String newFullDescription,  final String newText,
                                             final String newStartTime, final String newExpTime) {
        validateKey(key);

        Instructions instructions = new Instructions(key, newTitle, newHeadSurname, newHeadName,
                newHeadPatronymic, newHeadControlSurname, newHeadControlName, newHeadControlPatronymic, newStatus, newSourceOfInstruction, newShortDescription, newFullDescription, newText,
                stringToDateLongParser.parseStringToGetLongTime(newStartTime)/1000, stringToDateLongParser.parseStringToGetLongTime(newExpTime)/1000);
        instructionsRepository.save(instructions);

        return instructionMapper.instructionToDto(instructions);

    }

    @Override
    @Transactional
    public void deleteInstructionByTitle(final UUID key, final String instructionTitle) {
        validateKey(key);

        instructionsRepository.delete(instructionsRepository
                .getInstructionByTitle(instructionTitle)
                .orElseThrow( () ->  new InstructionNotFoundException("No instruction found with " + instructionTitle + " title")));
        instructionsRepository.deleteInstructionByTitle(instructionTitle);
    }

    private List<Instructions> getAllInstructionsFromRepo() {
        List <Instructions> listOfInstructions= new ArrayList<>();
        instructionsRepository.findAll().forEach(instruction -> listOfInstructions.add(instruction));
        return listOfInstructions;
    }

    private List<InstructionsDto> convertInstructionListToDtoList(List<Instructions> listOfInstructions){
        return  listOfInstructions.stream()
                .map(instruction -> instructionMapper.instructionToDto(instruction)).collect(Collectors.toList());
    }

    private boolean validateKey(final UUID key){
        if(authKeyValidator.validate(key)) {
            return true;
        } else throw new KeyIsNotValidException("Key is not valid " +  new Date().getTime() );
    }
}
