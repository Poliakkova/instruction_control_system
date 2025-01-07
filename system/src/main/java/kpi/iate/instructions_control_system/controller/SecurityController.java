package kpi.iate.instructions_control_system.controller;

import kpi.iate.instructions_control_system.dto.InstructionsDto;
import kpi.iate.instructions_control_system.dto.ReqRes;
import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.entity.UserEntity;
import kpi.iate.instructions_control_system.enums.UserRole;
import kpi.iate.instructions_control_system.service.UserService;
import kpi.iate.instructions_control_system.service.impl.MailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.UUID;

@RestController
@CrossOrigin("*")
@RequestMapping("/")
public class SecurityController {

    @Autowired
    UserService userService;

    @Autowired
    MailService mailService;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${adminuseremail}")
    private String adminUserEmail;


    @Value("${baseurl}")
    private String BASE_URL;

    @PostMapping(path = "auth/create-admin")
    public UserEntityDto createAdmin () {
        UserEntityDto userEntityDto = new UserEntityDto("admin", "admin", "admin", UserRole.HEAD_ADMIN,
                adminUserEmail, "admin", new ArrayList<InstructionsDto>(), true, true, true, true, true, "1");
        userService.createUser(userEntityDto);
        return userEntityDto;
    }

    @PostMapping(path = "auth/login")
    public ResponseEntity<ReqRes> login (@RequestBody ReqRes req) {
        return ResponseEntity.ok(userService.login(req));
    }

    @PostMapping(path = "auth/refresh")
    public ResponseEntity<ReqRes> refreshToken (@RequestBody ReqRes req) {
        return ResponseEntity.ok(userService.refreshToken(req));
    }

    @GetMapping(path = "users/get-profile")
    public ResponseEntity<ReqRes> getMyProfile () {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = userService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        System.out.println("--forgotPassword");
        UserEntity user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("Користувача з таким email не знайдено");
        }

        // Генеруємо токен відновлення
        String token = UUID.randomUUID().toString();
        System.out.println(token);
        userService.savePasswordResetToken(user, token);

        // Надсилаємо email з посиланням на відновлення
        String resetLink = BASE_URL+"reset-password?token=" + token;
        mailService.send(email, "Відновлення пароля", "Для відновлення пароля перейдіть за посиланням: " + resetLink);

        return ResponseEntity.ok("Інструкція для відновлення пароля відправлена на вашу пошту");
    }

    @PostMapping("auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        System.out.println("--resetPassword");

        boolean isResetSuccessful = userService.resetPassword(token, newPassword);
        if (!isResetSuccessful) {
            return ResponseEntity.badRequest().body("Невалідний токен або токен прострочено");
        }
        return ResponseEntity.ok("Пароль успішно змінено");
    }
}
