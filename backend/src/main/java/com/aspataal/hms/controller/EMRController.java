package com.aspataal.hms.controller;

import com.aspataal.hms.model.Diagnosis;
import com.aspataal.hms.repository.DiagnosisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/emr")
@RequiredArgsConstructor
public class EMRController {

    private final DiagnosisRepository diagnosisRepository;

    @GetMapping
    public ResponseEntity<List<Diagnosis>> getAllRecords() {
        return ResponseEntity.ok(diagnosisRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Diagnosis> createRecord(@RequestBody Diagnosis diagnosis) {
        if(diagnosis.getVisitDate() == null) {
            diagnosis.setVisitDate(LocalDate.now());
        }
        return ResponseEntity.ok(diagnosisRepository.save(diagnosis));
    }
}
