package kpi.iate.instructions_control_system.service;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.entity.AuthKey;

import java.util.List;
import java.util.UUID;

public interface InstructionsService {
    AuthKey getKey();

    InstructionsDto getInstructionByCode(final UUID key, final String instructionCode);

    List<InstructionsDto> getAllInstructions(final UUID key);

    List<InstructionsDto> getInstructionsFilteredByStartDate(UUID key, String startDate);

    List<InstructionsDto> getInstructionsFilteredByExpDate(UUID key,  String expDate);

    InstructionsDto updateInstruction(final UUID key, final InstructionsDto instructionsDto);

    InstructionsDto createInstruction(final UUID key, final InstructionsDto instructionsDto);

    void deleteInstructionByCode(final UUID key, final String instructionCode);

    List<InstructionsDto> getArchivedInstructions();

    void updateInstructionStatus(final UUID key, final InstructionsDto instructionsDto);

    void sendEmailToInstructionUsers(UUID key, InstructionsDto instructionsDto);

}
