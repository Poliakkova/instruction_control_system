package kpi.iate.instructions_control_system.controller;

//import kpi.iate.instructions_control_system.dto.LoginDTO;
//import kpi.iate.instructions_control_system.responce.LoginResponce;
import kpi.iate.instructions_control_system.dto.ReqRes;
import kpi.iate.instructions_control_system.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin("*")
@RequestMapping("/")
public class SecurityController {

    @Autowired
    UserService userService;

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

//    @PostMapping(path = "/login")
//    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
//        LoginResponce loginResponse = userService.loginUser(loginDTO);
//        return ResponseEntity.ok(loginResponse);
////        if (loginResponse.isStatus()) {
////            // Генерація JWT
////            String jwtToken = userService.generateJwtToken(loginDTO);
////
////            // Збереження токену у HTTP-only куку
////            Cookie cookie = new Cookie("authToken", jwtToken);
////            cookie.setHttpOnly(true);
////            cookie.setPath("/");
////            cookie.setMaxAge(60 * 60); // Час дії токену (1 година)
////            response.addCookie(cookie);
////
////            return ResponseEntity.ok(loginResponse);
////        } else {
////            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
////        }
//    }
}
