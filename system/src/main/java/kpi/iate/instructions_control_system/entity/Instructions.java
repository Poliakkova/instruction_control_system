package kpi.iate.instructions_control_system.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
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

    @Column(name = "instruction_head_surname")
    private String headSurname;

    @Column(name = "instruction_head_name")
    private String headName;

    @Column(name = "instruction_head_patronymic")
    private String headPatronymic;

    @Column(name = "instruction_head_control_surname")
    private String headControlSurname;

    @Column(name = "instruction_head_control_name")
    private String headControlName;

    @Column(name = "instruction_head_control_patronymic")
    private String headControlPatronymic;

    @Column(name = "instruction_status")
    private String status;

    @Column(name = "instruction_source_of_instruction")
    private String sourceOfInstruction;

    @Column(name = "instruction_short_description")
    private String shortDescription;

    @Column(name = "instruction_full_description")
    private String fullDescription;

    @Column(name = "instruction_text")
    private String text;

    @Column(name = "start_time")
    private Long startTime;

    @Column(name = "exp_time")
    private Long expTime;



}
