package com.aspataal.hms.hl7;

import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.protocol.ReceivingApplication;
import ca.uhn.hl7v2.protocol.ReceivingApplicationException;
import ca.uhn.hl7v2.util.Terser;
import com.aspataal.hms.model.HL7MessageEntity;
import com.aspataal.hms.model.Patient;
import com.aspataal.hms.model.LabResult;
import com.aspataal.hms.model.Diagnosis;
import com.aspataal.hms.repository.HL7MessageRepository;
import com.aspataal.hms.repository.PatientRepository;
import com.aspataal.hms.repository.LabResultRepository;
import com.aspataal.hms.repository.DiagnosisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class HL7MessageHandler implements ReceivingApplication<Message> {

    private final HL7MessageRepository hl7MessageRepository;
    private final PatientRepository patientRepository;
    private final LabResultRepository labResultRepository;
    private final DiagnosisRepository diagnosisRepository;

    @Override
    public Message processMessage(Message message, Map<String, Object> metadata) throws ReceivingApplicationException, HL7Exception {
        String rawMessage = message.encode();
        log.info("Received HL7 Message: \n{}", rawMessage);

        HL7MessageEntity entity = new HL7MessageEntity();
        entity.setRawMessage(rawMessage);
        entity.setReceivedAt(LocalDateTime.now());
        
        try {
            Terser terser = new Terser(message);
            String messageType = terser.get("/MSH-9-1") + "^" + terser.get("/MSH-9-2");
            entity.setMessageType(messageType);
            
            if (messageType.startsWith("ADT")) {
                String patientId = terser.get("/.PID-3-1");
                String lastName = terser.get("/.PID-5-1");
                String firstName = terser.get("/.PID-5-2");
                
                if (patientId != null) {
                    Patient patient = patientRepository.findByPatientId(patientId).orElse(new Patient());
                    patient.setPatientId(patientId);
                    if(firstName != null) patient.setFirstName(firstName);
                    if(lastName != null) patient.setLastName(lastName);
                    patientRepository.save(patient);
                    log.info("Saved/Updated Patient from ADT: {} {}", firstName, lastName);
                }
            } else if (messageType.startsWith("ORU")) {
                // Lab Result
                String lastName = terser.get("/.PID-5-1");
                String firstName = terser.get("/.PID-5-2");
                String patientName = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
                String testName = terser.get("/.OBR-4-2"); 
                String resultValue = terser.get("/.OBX-5");
                String unit = terser.get("/.OBX-6-1");
                String refRange = terser.get("/.OBX-7");
                
                LabResult lab = new LabResult();
                lab.setPatientName(patientName.trim());
                lab.setTestName(testName != null ? testName : "General Lab Test");
                lab.setResultValue(resultValue != null ? resultValue : "N/A");
                lab.setUnit(unit != null ? unit : "");
                lab.setReferenceRange(refRange != null ? refRange : "");
                lab.setTestDate(LocalDate.now());
                lab.setStatus("COMPLETED");
                labResultRepository.save(lab);
                log.info("Saved Lab Result from ORU: {}", testName);
            } else if (messageType.startsWith("MDM")) {
                // EMR Details
                String lastName = terser.get("/.PID-5-1");
                String firstName = terser.get("/.PID-5-2");
                String patientName = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
                
                String docLastName = terser.get("/.TXA-5-1");
                String docFirstName = terser.get("/.TXA-5-2");
                String doctorName = (docFirstName != null ? docFirstName : "") + " " + (docLastName != null ? docLastName : "");
                
                String condition = terser.get("/.OBX-5"); // 1st OBX is condition
                String icd = terser.get("/.OBX-3-1"); 
                
                String rx = terser.get("/.OBX(1)-5"); // 2nd OBX is prescription
                
                Diagnosis diag = new Diagnosis();
                diag.setPatientName(patientName.trim());
                diag.setDoctorName(!doctorName.trim().isEmpty() ? doctorName.trim() : "Unknown Doctor");
                diag.setConditionName(condition != null ? condition : "Clinical Note");
                diag.setIcd10Code(icd != null ? icd : "N/A");
                diag.setPrescription(rx != null ? rx : "N/A");
                diag.setNotes("Imported via HL7 MDM^T02 message.");
                diag.setVisitDate(LocalDate.now());
                
                diagnosisRepository.save(diag);
                log.info("Saved EMR Diagnosis from MDM: {}", condition);
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
