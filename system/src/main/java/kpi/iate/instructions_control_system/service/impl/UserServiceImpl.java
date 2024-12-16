package kpi.iate.instructions_control_system.service.impl;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.dto.ReqRes;
import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.UserEntity;
import kpi.iate.instructions_control_system.exception.UserNotFoundException;
import kpi.iate.instructions_control_system.mapper.UserMapper;
import kpi.iate.instructions_control_system.repository.InstructionsRepository;
import kpi.iate.instructions_control_system.repository.UserRepository;
import kpi.iate.instructions_control_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    MailService mailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;

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
        userEntity.setNotifyNewInstruction(userEntityDto.isNotifyNewInstruction());
        userEntity.setNotifyNewComment(userEntityDto.isNotifyNewComment());
        userEntity.setNotifyMissedDeadline(userEntityDto.isNotifyMissedDeadline());
        userEntity.setNotifyStatusChange(userEntityDto.isNotifyStatusChange());
        userEntity.setNotifyWeekReport(userEntityDto.isNotifyWeekReport());
        userEntity.setUserPassword(this.passwordEncoder.encode(userEntityDto.getUserPassword()));
        userRepository.save(userEntity);

        if (userEntity.getUserEmail() != null) {
            String message = String.format(
                    "Вітаю, %s %s %s!\n" +
                            "Вам було створено акаунт у Доручення НН ІАТЕ\n" +
                            "Логін: %s\n" +
                            "Пароль: %s\n" +
                            "Ознайомтеся з особистим кабінетом http://127.0.0.1:3000/instructions\n" +
                            "Якщо виявили помилку, будь ласка, повідомте відповідального!\n" +
                            "Гарного дня!",
                    userEntity.getUserSurname(), userEntity.getUserName(), userEntity.getUserPatronymic(),
                    userEntity.getUserLogin(),
                    userEntity.getPassword()
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
        userEntity.setNotifyNewInstruction(userEntityDto.isNotifyNewInstruction());
        userEntity.setNotifyNewComment(userEntityDto.isNotifyNewComment());
        userEntity.setNotifyMissedDeadline(userEntityDto.isNotifyMissedDeadline());
        userEntity.setNotifyStatusChange(userEntityDto.isNotifyStatusChange());
        userEntity.setNotifyWeekReport(userEntityDto.isNotifyWeekReport());
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

    @Override
    @Transactional
    public void changePassword(String userLogin, String oldPassword, String newPassword) {
        UserEntity userEntity = userRepository.findByUserLogin(userLogin)
                .orElseThrow(() -> new UserNotFoundException("Користувача з логіном " + userLogin + " не знайдено"));

        // Перевірка старого пароля
        if (!Objects.equals(oldPassword, "")) {
            System.out.println("-- changePassword: oldPassword not null");
            if (!passwordEncoder.matches(oldPassword, userEntity.getUserPassword())) {
                throw new IllegalArgumentException("Старий пароль введено неправильно");
            }
        }

        // Оновлення нового пароля
        userEntity.setUserPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userEntity);
    }

    @Override
    @Transactional
    public ReqRes login(ReqRes loginRequest){
        System.out.println("-- Login attempt with: " + loginRequest.getLogin());

        ReqRes response = new ReqRes();
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getLogin(),
                            loginRequest.getPassword()));
            System.out.println("userRepository");
            var user = userRepository.findByUserLogin(loginRequest.getLogin()).orElseThrow();
            System.out.println("-- User login: " + user.getUserLogin());
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.setToken(jwt);

            response.setJobTitle(user.getUserJobTitle());
            response.setSurname(user.getUserSurname());
            response.setName(user.getUserName());
            response.setPatronymic(user.getUserPatronymic());
            response.setEmail(user.getUserEmail());
            response.setLogin(user.getUserLogin());
            response.setPassword(user.getUserPassword());
            response.setNotifyNewInstruction(user.isNotifyNewInstruction());
            response.setNotifyNewComment(user.isNotifyNewComment());
            response.setNotifyMissedDeadline(user.isNotifyMissedDeadline());
            response.setNotifyStatusChange(user.isNotifyStatusChange());
            response.setNotifyWeekReport(user.isNotifyWeekReport());

            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @Override
    public ReqRes refreshToken(ReqRes refreshTokenRequest){
        ReqRes response = new ReqRes();
        try{
            String ourLogin = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            UserEntity users = userRepository.findByUserLogin(ourLogin).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    @Override
    public ReqRes getMyInfo(String login){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<UserEntity> userOptional = userRepository.findByUserLogin(login);
            if (userOptional.isPresent()) {
                reqRes.setUser(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }


//    @Override
//    public LoginResponce loginUser(LoginDTO loginDTO) {
//        String msg = "";
//         UserEntity user1 = userRepository.findByUserEmail(loginDTO.getUserEmail());
//
//        if (user1 != null) {
//            String password = loginDTO.getUserPassword();
//            String encodedPassword = user1.getUserPassword();
//            boolean isPwdRight = passwordEncoder.matches(password, encodedPassword);
//
//            if (isPwdRight) {
//                Optional<UserEntity> user = userRepository.findOneByUserEmailAndUserPassword(loginDTO.getUserEmail(), encodedPassword);
//
//                if (user.isPresent()) {
//                    return new LoginResponce("login success", true);
//                } else {
//                    return new LoginResponce("login failed", false);
//                }
//            } else {
//                return new LoginResponce("incorrect password", false);
//            }
//        }else {
//            return new LoginResponce("email does not exist", false);
//        }
//    }
//

}
