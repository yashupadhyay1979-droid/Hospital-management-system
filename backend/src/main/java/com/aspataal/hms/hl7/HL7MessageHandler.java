package com.aspataal.hms.hl7;

import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.model.v24.message.ADT_A01;
import ca.uhn.hl7v2.model.v24.segment.PID;
import ca.uhn.hl7v2.protocol.ReceivingApplication;
import ca.uhn.hl7v2.protocol.ReceivingApplicationException;
import com.aspataal.hms.model.HL7MessageEntity;
import com.aspataal.hms.model.Patient;
import com.aspataal.hms.repository.HL7MessageRepository;
import com.aspataal.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class HL7MessageHandler implements ReceivingApplication<Message> {

    private final HL7MessageRepository hl7MessageRepository;
    private final PatientRepository patientRepository;

    @Override
    public Message processMessage(Message message, Map<String, Object> metadata) throws ReceivingApplicationException, HL7Exception {
        String rawMessage = message.encode();
        log.info("Received HL7 Message: \n{}", rawMessage);

        HL7MessageEntity entity = new HL7MessageEntity();
        entity.setRawMessage(rawMessage);
        entity.setReceivedAt(LocalDateTime.now());
        
        try {
            // Very basic parsing for demo
            String messageType = message.getName();
            entity.setMessageType(messageType);
            
            if (message instanceof ADT_A01) {
                ADT_A01 adt = (ADT_A01) message;
                PID pid = adt.getPID();
                
                String patientId = pid.getPatientIdentifierList(0).getID().getValue();
                String firstName = pid.getPatientName(0).getGivenName().getValue();
                String lastName = pid.getPatientName(0).getFamilyName().getSurname().getValue();
                
                Patient patient = patientRepository.findByPatientId(patientId).orElse(new Patient());
                patient.setPatientId(patientId);
                patient.setFirstName(firstName);
                patient.setLastName(lastName);
                
                patientRepository.save(patient);
                log.info("Saved/Updated Patient from ADT_A01: {} {}", firstName, lastName);
            }

            entity.setStatus("SUCCESS");
        } catch (Exception e) {
            log.error("Error processing HL7 message", e);
            entity.setStatus("ERROR");
            entity.setErrorMessage(e.getMessage());
        }

        hl7MessageRepository.save(entity);

        try {
            return message.generateACK();
        } catch (Exception e) {
            throw new HL7Exception(e);
        }
    }

    @Override
    public boolean canProcess(Message message) {
        return true;
    }
}
