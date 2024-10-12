package kpi.iate.instructions_control_system.mapper;

import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserEntityDto userToDto(UserEntity entity);
}
