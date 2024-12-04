package kpi.iate.instructions_control_system.validation;

import kpi.iate.instructions_control_system.entity.AuthKey;
import kpi.iate.instructions_control_system.exception.KeyIsNotValidException;
import kpi.iate.instructions_control_system.repository.AuthKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuthKeyValidator {

    private final AuthKeyRepository authKeyRepository;

    public boolean validate(UUID keyId){
        AuthKey authKey = authKeyRepository.findById(keyId).orElseThrow( () -> new KeyIsNotValidException("No key with that id found!! "));
        return authKey.getExpTime() > new Date().getTime();
    }
}
