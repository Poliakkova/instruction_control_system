package kpi.iate.instructions_control_system.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import kpi.iate.instructions_control_system.entity.UserEntity;
import kpi.iate.instructions_control_system.enums.UserRole;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties (ignoreUnknown = true)
public class ReqRes {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;

    private String surname;
    private String name;
    private String patronymic;
    private String jobTitle;
    private String email;
    private String login;
    private boolean enableNotification;
    private String password;

    private UserEntity user;
    private List<UserEntityDto> usersList;

}
