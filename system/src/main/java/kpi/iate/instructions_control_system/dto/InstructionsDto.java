package kpi.iate.instructions_control_system.dto;

import lombok.*;

import java.util.Date;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InstructionsDto {

    private String title;

    private String status;

    private String sourceOfInstruction;

    private String shortDescription;

    private String fullDescription;

    private String type;

    private String text;

    private List<UserEntityDto> users;

    private Date startTime;

    private Date expTime;

    private Long makingTime;

    private String mapProcess;

    private String protocol;

}