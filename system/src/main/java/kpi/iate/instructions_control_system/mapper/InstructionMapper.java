package kpi.iate.instructions_control_system.mapper;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.entity.Instructions;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Date;


@Mapper(componentModel = "spring")
public interface InstructionMapper {

    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "mapDate")
    @Mapping(target = "expTime", source = "expTime", qualifiedByName = "mapDate")
    InstructionsDto instructionToDto (Instructions instructions);

    @Named("mapDate")
    default Date map(Long milliseconds){
        return new Date(milliseconds * 1000);
    }
}
