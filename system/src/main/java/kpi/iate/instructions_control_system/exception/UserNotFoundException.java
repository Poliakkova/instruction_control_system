package kpi.iate.instructions_control_system.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException (String message) {
        super(message);
    }
}
