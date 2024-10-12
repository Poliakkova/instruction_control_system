package kpi.iate.instructions_control_system.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntityDto {

    private String userSurname;

    private String userName;

    private String userPatronymic;

    private String userJobTitle;
}
