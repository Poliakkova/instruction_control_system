package kpi.iate.instructions_control_system.exception;

public class InstructionNotFoundException extends RuntimeException{

    public InstructionNotFoundException(String message){
        super(message);
    }
}
