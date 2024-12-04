package kpi.iate.instructions_control_system.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kpi.iate.instructions_control_system.enums.UserRole;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntityDto implements UserDetails {

    private String userSurname;

    private String userName;

    private String userPatronymic;

    private UserRole userJobTitle;

    private String userEmail;

    private String userLogin;

    private List<InstructionsDto> instructions;

    private boolean enableNotification;

    private String userPassword;

    @JsonIgnore // Ігноруємо під час серіалізації
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userJobTitle.getAuthority()));
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
