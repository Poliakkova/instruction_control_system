package kpi.iate.instructions_control_system.enums;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
    ADMIN,
    HEAD_ADMIN,
    TEACHER,
    STUDENT;

    @Override
    public String getAuthority() {
        return name();
    }
}
