package kpi.iate.instructions_control_system.entity;

import kpi.iate.instructions_control_system.enums.UserRole;
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
@Table(name = "control_system_user")
public class UserEntity {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column(name = "user_surname")
    private String userSurname;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_patronymic")
    private String userPatronymic;

    @Column(name = "user_job_title")
    private String userJobTitle;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "user_login", unique = true)
    private String userLogin;

    @Column(name = "user_password")
    private String userPassword;

    @ManyToMany(cascade = {CascadeType.ALL})
    @JoinTable(
            name = "users_instructions",
            joinColumns = @JoinColumn(name = "user_entity_id"),
            inverseJoinColumns = @JoinColumn(name = "instruction_id"))
    private List<Instructions> instructions;

    @Column(name = "user_enable_notification")
    private boolean enableNotification;

}
