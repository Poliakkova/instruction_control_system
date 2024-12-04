package kpi.iate.instructions_control_system.filters;

import kpi.iate.instructions_control_system.dto.InstructionsDto;

import java.util.List;

public interface HeadSurnameFilter {

    List<InstructionsDto> filterInstructionsByHeadSurname(final String headSurname, List<InstructionsDto> instructionsDtoList);
}
