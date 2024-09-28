package kpi.iate.instructions_control_system.service;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.entity.AuthKey;
import kpi.iate.instructions_control_system.entity.Instructions;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.UUID;

public interface InstructionsService {
    AuthKey getKey();

    InstructionsDto getInstructionByTitle(final UUID key, final String instructionTitle);

    List<InstructionsDto> getAllInstructions(final UUID key);

    List<InstructionsDto> getInstructionsFilteredByHeadSurname(UUID key, String headSurname);

    List<InstructionsDto> getInstructionsFilteredByStartDate(UUID key, String startDate);

    List<InstructionsDto> getInstructionsFilteredByExpDate(UUID key,  String expDate);

    InstructionsDto updateInstructionByTitle(final UUID key, final String instructionTitle, final String newTitle,
                                          final String newHeadSurname, final String newHeadName, final String newHeadPatronymic,
                                          final String headControlSurname, final String headControlName, final String headControlPatronymic, final String status, final String sourceOfInstruction,
                                          final String newShortDescription, final String newFullDescription, final String newText,
                                          final String newStartTime, final String newExpTime);

    InstructionsDto createInstruction(final UUID key, final String newTitle,
                                      final String newHeadSurname, final String newHeadName, final String newHeadPatronymic,
                                      final String headControlSurname, final String headControlName, final String headControlPatronymic, final String status, final String sourceOfInstruction,
                                      final String newShortDescription, final String newFullDescription,  final String newText,
                                      final String newStartTime, final String newExpTime);

    void deleteInstructionByTitle(final UUID key, final String instructionTitle);
}
