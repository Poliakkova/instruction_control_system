package kpi.iate.instructions_control_system.filters;

import kpi.iate.instructions_control_system.dto.InstructionsDto;

import java.util.List;

public interface DateFilter {

    List<InstructionsDto> filterInstructionsByStartDate(final String startDate, List<InstructionsDto> instructionsDtoList);

    List<InstructionsDto> filterInstructionsByExpDate(final String expDate, List<InstructionsDto> instructionsDtoList);

}
