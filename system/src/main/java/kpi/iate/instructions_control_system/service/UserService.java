package kpi.iate.instructions_control_system.service;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.dto.ReqRes;
import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.UserEntity;

import java.util.List;

public interface UserService {
    UserEntity findUserById (final String userId);

    UserEntity findUserByLogin (final String userLogin);
    UserEntityDto findUserByLoginConverted(final String userLogin);

    void createUser(UserEntityDto userEntityDto);

    void updateUser(UserEntityDto userEntityDto);

    void deleteUser(String userLogin);

    List <UserEntityDto> findAllUsers();

    void changePassword(String userLogin, String oldPassword, String newPassword);

    ReqRes login(ReqRes req);

    ReqRes refreshToken(ReqRes req);

    ReqRes getMyInfo(String email);

    UserEntity findByEmail(String email);

    void savePasswordResetToken(UserEntity user, String token);

    boolean resetPassword(String token, String newPassword);


}
