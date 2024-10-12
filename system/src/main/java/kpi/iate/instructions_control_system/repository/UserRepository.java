package kpi.iate.instructions_control_system.repository;

import kpi.iate.instructions_control_system.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface UserRepository extends CrudRepository<UserEntity, UUID> {
}
