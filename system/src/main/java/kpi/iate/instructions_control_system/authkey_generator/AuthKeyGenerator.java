package kpi.iate.instructions_control_system.authkey_generator;

import kpi.iate.instructions_control_system.entity.AuthKey;
import kpi.iate.instructions_control_system.repository.AuthKeyRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
@AllArgsConstructor
public class AuthKeyGenerator {
    private final AuthKeyRepository authKeyRepository;

    @Scheduled(cron = "0 0/3 * * * *")
    public void recreateKey(){
        authKeyRepository.deleteAll();
        AuthKey authKey = new AuthKey(UUID.randomUUID() , new Date().getTime() + 300_000);
        authKeyRepository.save(authKey);
    }
}
