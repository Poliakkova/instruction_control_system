package kpi.iate.instructions_control_system.mapper;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.Instructions;
import kpi.iate.instructions_control_system.entity.UserEntity;
import kpi.iate.instructions_control_system.enums.UserRole;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Date;


@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface InstructionMapper {

    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "mapDate")
    @Mapping(target = "expTime", source = "expTime", qualifiedByName = "mapDate")
    @Mapping(target = "doneTime", source = "doneTime", qualifiedByName = "mapDate")
    @Mapping(target = "users", source = "heads", qualifiedByName = "mapUsers")
    InstructionsDto instructionToDto (Instructions instructions);

    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "mapFromDate")
    @Mapping(target = "expTime", source = "expTime", qualifiedByName = "mapFromDate")
    @Mapping(target = "doneTime", source = "doneTime", qualifiedByName = "mapFromDate")
    Instructions instructionDtoToEntity (InstructionsDto instructionsDto);

    @Named("mapDate")
    default Date mapDate(Long milliseconds){
        return new Date(milliseconds * 1000);
    }

    @Named("mapFromDate")
    default Long mapFromDate(Date milliseconds){
        return milliseconds.getTime()/1000;
    }

    @Named("mapUsers")
    default UserEntityDto mapUsers(UserEntity userEntity){
        UserEntityDto userEntityDto = new UserEntityDto();
        userEntityDto.setUserName(userEntity.getUserName());
        userEntityDto.setUserPatronymic(userEntity.getUserPatronymic());
        userEntityDto.setUserSurname(userEntity.getUserSurname());
        userEntityDto.setUserJobTitle(UserRole.valueOf(userEntity.getUserJobTitle()));
        userEntityDto.setUserEmail(userEntity.getUserEmail());
        userEntityDto.setUserLogin(userEntity.getUserLogin());
        return userEntityDto;
    }
}
