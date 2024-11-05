package kpi.iate.instructions_control_system.service.impl;

import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.UserEntity;
import kpi.iate.instructions_control_system.enums.UserRole;
import kpi.iate.instructions_control_system.exception.UserNotFoundException;
import kpi.iate.instructions_control_system.mapper.StatusMapper;
import kpi.iate.instructions_control_system.mapper.UserMapper;
import kpi.iate.instructions_control_system.repository.InstructionsRepository;
import kpi.iate.instructions_control_system.repository.UserRepository;
import kpi.iate.instructions_control_system.service.MailService;
import kpi.iate.instructions_control_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    MailService mailService;

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final InstructionsRepository instructionsRepository;
    @Override
    @Transactional(readOnly = true)
    public UserEntity findUserById(final String userId) {
        UserEntity userEntity = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new UserNotFoundException(String.format("User with id %s not found!", userId)));
        return userEntity;
    }
    @Override
    @Transactional(readOnly = true)
    public UserEntity findUserByLogin(final String userLogin) {
        UserEntity userEntity = userRepository.findByUserLogin(userLogin)
                .orElseThrow(() -> new UserNotFoundException(String.format("User with login %s not found!", userLogin)));
        return userEntity;
    }
    @Override
    @Transactional(readOnly = true)
    public UserEntityDto findUserByLoginConverted(final String userLogin) {
        UserEntity userEntity = userRepository.findByUserLogin(userLogin)
                .orElseThrow(() -> new UserNotFoundException(String.format("User with login %s not found!", userLogin)));
        return userMapper.userToDto(userEntity);
    }

    @Override
    @Transactional
    public void createUser(UserEntityDto userEntityDto) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUserJobTitle(userEntityDto.getUserJobTitle().name());
        userEntity.setUserName(userEntityDto.getUserName());
        userEntity.setUserPatronymic(userEntityDto.getUserPatronymic());
        userEntity.setUserSurname(userEntityDto.getUserSurname());
        userEntity.setUserEmail(userEntityDto.getUserEmail());
        userEntity.setUserLogin(userEntityDto.getUserLogin());
        userEntity.setEnableNotification(userEntityDto.isEnableNotification());
        userRepository.save(userEntity);

        if (userEntity.getUserEmail() != null && userEntity.isEnableNotification()) {
            System.out.println("HAS EMAIL");
            String message = String.format(
                    "Вітаю, %s %s %s!\n" +
                            "Вам було створено акаунт у Доручення НН ІАТЕ\n" +
                            "Логін: %s\n" +
                            "Пароль: 1\n" +
                            "Ознайомтеся з особистим кабінетом http://127.0.0.1:3000/instructions\n" +
                            "Якщо виявили помилку, будь ласка, повідомте відповідального!\n" +
                            "Гарного дня!",
                    userEntity.getUserSurname(), userEntity.getUserName(), userEntity.getUserPatronymic(),
                    userEntity.getUserLogin()
            );
            mailService.send(userEntity.getUserEmail(), "Доручення НН ІАТЕ", message);
        }
    }
    @Override
    @Transactional(readOnly = true)
    public List<UserEntityDto> findAllUsers() {
        List <UserEntityDto> users = new ArrayList<>();
        userRepository.findAll().forEach( user -> {
            users.add(userMapper.userToDto(user));
        });
        return users;
    }
    @Override
    @Transactional
    public void updateUser(UserEntityDto userEntityDto) {
        UserEntity userEntity = userRepository.findByUserLogin(userEntityDto
                .getUserLogin())
                .orElseThrow( () -> new UserNotFoundException(
                        String.format("User with login %s not found", userEntityDto.getUserLogin())));
        userEntity.setUserEmail(userEntityDto.getUserEmail());
        userEntity.setUserSurname(userEntityDto.getUserSurname());
        userEntity.setUserName(userEntityDto.getUserName());
        userEntity.setUserPatronymic(userEntityDto.getUserPatronymic());
        userEntity.setUserJobTitle(userEntityDto.getUserJobTitle().name());
        userEntity.setEnableNotification(userEntityDto.isEnableNotification());

        userRepository.save(userEntity);
    }

    @Override
    @Transactional
    public void deleteUser(String userLogin) {
        UserEntity userEntity = userRepository.findByUserLogin(userLogin)
                .orElseThrow( () -> new UserNotFoundException(
                        String.format("User with login %s not found", userLogin)));
        userEntity.getInstructions().stream().forEach(instructions -> {
            instructions.getHeads().remove(userEntity);
            instructionsRepository.save(instructions);
        });
        userEntity.setInstructions(new ArrayList<>());
        userRepository.delete(userEntity);
    }
}
