package kpi.iate.instructions_control_system.service;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.entity.AuthKey;
import kpi.iate.instructions_control_system.entity.Instructions;
import kpi.iate.instructions_control_system.enums.InstructionStatus;
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

    InstructionsDto updateInstruction(final UUID key, final InstructionsDto instructionsDto);

    InstructionsDto createInstruction(final UUID key, final InstructionsDto instructionsDto);

    void deleteInstructionByTitle(final UUID key, final String instructionTitle);

    List<InstructionsDto> getArchivedInstructions();

    void updateInstructionStatus(final UUID key, final InstructionsDto instructionsDto);
}
