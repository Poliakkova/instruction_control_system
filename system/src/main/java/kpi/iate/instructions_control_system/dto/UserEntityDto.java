package kpi.iate.instructions_control_system.dto;

import kpi.iate.instructions_control_system.enums.UserRole;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntityDto {

    private String userSurname;

    private String userName;

    private String userPatronymic;

    private UserRole userJobTitle;

    private String userEmail;

    private String userLogin;

    private List<InstructionsDto> instructions;

    private boolean enableNotification;
}
