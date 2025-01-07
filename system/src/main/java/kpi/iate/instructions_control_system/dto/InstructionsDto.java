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

    private List<UserEntityDto> users;

    private String code;

    private String status;

    private String sourceOfInstruction;

    private String shortDescription;

    private String report;

    private Date startTime;

    private Date expTime;

    private Date doneTime;

    private String protocol;

    private String mapProcess;

    private String type;

    private String comment;

    private boolean acquainted;
}