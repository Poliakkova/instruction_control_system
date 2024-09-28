package kpi.iate.instructions_control_system.repository;

import kpi.iate.instructions_control_system.entity.Instructions;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstructionsRepository extends CrudRepository<Instructions, UUID> {
    Optional<Instructions> getInstructionByTitle(String title);

    void deleteInstructionByTitle(String title);
}
