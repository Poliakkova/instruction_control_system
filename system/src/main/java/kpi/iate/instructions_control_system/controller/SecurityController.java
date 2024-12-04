package kpi.iate.instructions_control_system.controller;

import kpi.iate.instructions_control_system.dto.ReqRes;
import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/")
public class SecurityController {

    @Autowired
    UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(path = "auth/create-admin")
    public UserEntityDto createAdmin (@RequestBody UserEntityDto admin) {
        userService.createUser(admin);
        return admin;
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
}
