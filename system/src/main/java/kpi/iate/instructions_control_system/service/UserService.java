package kpi.iate.instructions_control_system.service;

import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.UserEntity;

import java.util.List;

public interface UserService {
    UserEntity findUserById (final String userId);

    UserEntity findUserByLogin (final String userLogin);

    void createUser(UserEntityDto userEntityDto);

    void updateUser(UserEntityDto userEntityDto);

    void deleteUser(String userLogin);

    List <UserEntityDto> findAllUsers();
}
