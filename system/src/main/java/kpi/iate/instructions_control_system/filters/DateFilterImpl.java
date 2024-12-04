package kpi.iate.instructions_control_system.filters;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.parser.StringToDateLongParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DateFilterImpl implements DateFilter {

    private final StringToDateLongParser stringToDateLongParser;
    @Override
    public List<InstructionsDto> filterInstructionsByStartDate(final String startDate, List<InstructionsDto> instructionsDtoList) {
        return instructionsDtoList
                .stream()
                .filter(instructionsDto -> instructionsDto.getStartTime().getTime() >= stringToDateLongParser.parseStringToGetLongTime(startDate))
                .collect(Collectors.toList());
    }

    @Override
    public List<InstructionsDto> filterInstructionsByExpDate(final String expDate, List<InstructionsDto> instructionsDtoList) {
        return instructionsDtoList
                .stream()
                .filter(instructionsDto -> instructionsDto.getExpTime().getTime() <= stringToDateLongParser.parseStringToGetLongTime(expDate))
                .collect(Collectors.toList());
    }
}
