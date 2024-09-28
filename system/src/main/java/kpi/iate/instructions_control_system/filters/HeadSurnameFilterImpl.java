package kpi.iate.instructions_control_system.filters;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class HeadSurnameFilterImpl implements  HeadSurnameFilter {

    @Override
    public List<InstructionsDto> filterInstructionsByHeadSurname(final String headSurname, List<InstructionsDto> instructionsDtoList) {
        return instructionsDtoList.stream().filter( instructionsDto -> instructionsDto.getHeadSurname().equals(headSurname)).collect(Collectors.toList());
    }
}
