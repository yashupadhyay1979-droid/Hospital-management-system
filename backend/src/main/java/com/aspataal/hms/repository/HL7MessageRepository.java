package com.aspataal.hms.repository;

import com.aspataal.hms.model.HL7MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HL7MessageRepository extends JpaRepository<HL7MessageEntity, Long> {
    List<HL7MessageEntity> findTop100ByOrderByReceivedAtDesc();
}
