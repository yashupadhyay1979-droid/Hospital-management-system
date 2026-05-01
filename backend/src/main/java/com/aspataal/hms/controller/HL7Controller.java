package com.aspataal.hms.controller;

import ca.uhn.hl7v2.DefaultHapiContext;
import ca.uhn.hl7v2.HapiContext;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.parser.Parser;
import com.aspataal.hms.hl7.HL7MessageHandler;
import com.aspataal.hms.model.HL7MessageEntity;
import com.aspataal.hms.repository.HL7MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hl7")
@RequiredArgsConstructor
@Slf4j
public class HL7Controller {

    private final HL7MessageRepository hl7MessageRepository;
    private final HL7MessageHandler hl7MessageHandler;

    @GetMapping("/messages")
    public ResponseEntity<List<HL7MessageEntity>> getMessages() {
        return ResponseEntity.ok(hl7MessageRepository.findTop100ByOrderByReceivedAtDesc());
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, String>> simulateMessage(@RequestBody Map<String, String> payload) {
        String rawMessage = payload.get("message");
        Map<String, String> response = new HashMap<>();
        
        try (HapiContext context = new DefaultHapiContext()) {
            Parser p = context.getPipeParser();
            Message hapiMsg = p.parse(rawMessage);
            
            // Pass it to our handler just like the MLLP server does
            Message ack = hl7MessageHandler.processMessage(hapiMsg, new HashMap<>());
            
            response.put("status", "SUCCESS");
            response.put("ack", ack.encode());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to simulate HL7 message", e);
            response.put("status", "ERROR");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
