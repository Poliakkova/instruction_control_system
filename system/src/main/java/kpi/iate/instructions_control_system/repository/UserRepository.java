package kpi.iate.instructions_control_system.repository;

import kpi.iate.instructions_control_system.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends CrudRepository<UserEntity, UUID> {
    Optional<UserEntity> findByUserLogin(String userLogin);

    Optional<UserEntity> findOneByUserEmailAndUserPassword(String userLogin, String userPassword);

    Optional<UserEntity> findByUserEmail(String userEmail);
}
