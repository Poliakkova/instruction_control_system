package kpi.iate.instructions_control_system.controller;

import io.swagger.v3.oas.annotations.Operation;
import kpi.iate.instructions_control_system.dto.UserEntityDto;
import kpi.iate.instructions_control_system.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    @Operation(summary = "get all users")
    @GetMapping("/all")
    public List<UserEntityDto> getUsers() {
        return userService.findAllUsers();
    }
    @Operation(summary = "create user")
    @PostMapping("/new")
    public void createUser(@RequestBody UserEntityDto userEntityDto) {
         userService.createUser(userEntityDto);
    }
    @Operation(summary = "update user")
    @PutMapping("/update")
    public void updateUser(@RequestBody UserEntityDto userEntityDto) {
        userService.updateUser(userEntityDto);
    }
    @Operation(summary = "delete user")
    @PostMapping("/delete/{userLogin}")
    public void deleteUser(@RequestParam String userLogin) {
        userService.deleteUser(userLogin);
    }

    @Operation(summary = "get user by login")
    @GetMapping("/get/{userLogin}")
    public UserEntityDto getUserByLogin(@RequestParam String userLogin) {
        return userService.findUserByLoginConverted(userLogin);
    }
}
