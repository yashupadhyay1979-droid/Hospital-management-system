package com.aspataal.hms.hl7;

import ca.uhn.hl7v2.DefaultHapiContext;
import ca.uhn.hl7v2.HapiContext;
import ca.uhn.hl7v2.app.HL7Service;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class HL7MllpServer {

    @Value("${hl7.server.port:2575}")
    private int port;

    private final HL7MessageHandler messageHandler;
    private HL7Service server;

    @PostConstruct
    public void startServer() {
        try {
            HapiContext context = new DefaultHapiContext();
            server = context.newServer(port, false);
            
            // Register handler for all message types
            server.registerApplication("*", "*", messageHandler);
            
            server.startAndWait();
            log.info("HL7 MLLP Server started on port {}", port);
        } catch (Exception e) {
            log.error("Failed to start HL7 Server", e);
        }
    }

    @PreDestroy
    public void stopServer() {
        if (server != null) {
            server.stopAndWait();
            log.info("HL7 MLLP Server stopped.");
        }
    }
}
