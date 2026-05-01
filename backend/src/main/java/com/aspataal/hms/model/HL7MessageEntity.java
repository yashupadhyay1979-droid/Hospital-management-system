package com.aspataal.hms.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "hl7_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HL7MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String messageType; // e.g., ADT^A01
    private String controlId; // MSH-10
    
    @Column(columnDefinition = "TEXT")
    private String rawMessage;
    
    @Column(columnDefinition = "TEXT")
    private String parsedJson;

    private LocalDateTime receivedAt;
    
    private String status; // SUCCESS, ERROR
    
    @Column(columnDefinition = "TEXT")
    private String errorMessage;
}
