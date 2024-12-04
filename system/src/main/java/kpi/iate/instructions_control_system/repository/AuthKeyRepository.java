package kpi.iate.instructions_control_system.repository;

import kpi.iate.instructions_control_system.entity.AuthKey;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface AuthKeyRepository extends CrudRepository<AuthKey, UUID> {
}
