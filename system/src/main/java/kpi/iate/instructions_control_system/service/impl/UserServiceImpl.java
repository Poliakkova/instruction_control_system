package kpi.iate.instructions_control_system.service.impl;

import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.UserEntity;
import kpi.iate.instructions_control_system.exception.UserNotFoundException;
import kpi.iate.instructions_control_system.mapper.UserMapper;
import kpi.iate.instructions_control_system.repository.UserRepository;
import kpi.iate.instructions_control_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    @Override
    public UserEntity findUserById(final String userId) {
        UserEntity userEntity = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new UserNotFoundException(String.format("User with id %s not found!", userId)));
        return userEntity;
    }

    @Override
    public void createUser(UserEntityDto userEntityDto) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUserJobTitle(userEntityDto.getUserJobTitle());
        userEntity.setUserName(userEntityDto.getUserName());
        userEntity.setUserPatronymic(userEntityDto.getUserPatronymic());
        userEntity.setUserSurname(userEntityDto.getUserSurname());
        userRepository.save(userEntity);
    }
    @Override
    public List<UserEntityDto> findAllUsers() {
        List <UserEntityDto> users = new ArrayList<>();
        userRepository.findAll().forEach( user -> {
            users.add(userMapper.userToDto(user));
        });
        return users;
    }
}
