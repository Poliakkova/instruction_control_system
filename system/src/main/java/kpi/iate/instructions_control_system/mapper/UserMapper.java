package kpi.iate.instructions_control_system.mapper;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.Instructions;
import kpi.iate.instructions_control_system.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = InstructionMapper.class)
public interface UserMapper {
//    @Mapping(target = "instructions", source = "instructions", qualifiedByName = "mapInstructions")
    UserEntityDto userToDto(UserEntity entity);
//    @Named("mapInstructions")
//    default InstructionsDto mapUsers(Instructions instructions){
//        InstructionsDto instructionsDto = new InstructionsDto();
//        userEntityDto.setUserName(userEntity.getUserName());
//        userEntityDto.setUserPatronymic(userEntity.getUserPatronymic());
//        userEntityDto.setUserSurname(userEntity.getUserSurname());
//        userEntityDto.setUserJobTitle(userEntity.getUserJobTitle());
//        userEntityDto.setUserEmail(userEntity.getUserEmail());
//        userEntityDto.setUserLogin(userEntity.getUserLogin());
//        return userEntityDto;
//    }
}
