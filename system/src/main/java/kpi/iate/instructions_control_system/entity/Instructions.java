package kpi.iate.instructions_control_system.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "instructions")
public class Instructions {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column(name = "instruction_title")
    private String title;

    @ManyToMany(mappedBy = "instructions")
    private List<UserEntity> heads;

    @Column(name = "instruction_code", unique = true, nullable = false)
    private String code;

    @Column(name = "instruction_status")
    private String status;

    @Column(name = "instruction_source_of_instruction")
    private String sourceOfInstruction;

    @Column(name = "instruction_short_description")
    private String shortDescription;

    @Column(name = "instruction_full_description")
    private String fullDescription;

    @Column(name = "instruction_text", length = 2000)
    private String text;

    @Column(name = "start_time")
    private Long startTime;

    @Column(name = "exp_time")
    private Long expTime;

    @Column(name = "making_time")
    private Long makingTime;

    @Column(name = "instruction_protocol")
    private String protocol;

    @Column(name = "instruction_map_process", length = 10000)
    private String mapProcess;

    @Column(name = "instruction_type")
    private String type;

    @Column(name = "instruction_comment", length = 5000)
    private String comment;

}
