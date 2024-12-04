package kpi.iate.instructions_control_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kpi.iate.instructions_control_system.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "control_system_user")
public class UserEntity implements UserDetails {

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

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userJobTitle));
    }

    @Override
    public String getPassword() {
        return userPassword;
    }

    @Override
    public String getUsername() {
        return userLogin;
    }

    public String getUserName() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
