package com.aspataal.hms.controller;

import com.aspataal.hms.model.LabResult;
import com.aspataal.hms.repository.LabResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/lab")
@RequiredArgsConstructor
public class LabController {

    private final LabResultRepository labResultRepository;

    @GetMapping
    public ResponseEntity<List<LabResult>> getAllResults() {
        return ResponseEntity.ok(labResultRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<LabResult> createResult(@RequestBody LabResult labResult) {
        labResult.setTestDate(LocalDate.now());
        if(labResult.getStatus() == null) {
            labResult.setStatus("PENDING");
        }
        return ResponseEntity.ok(labResultRepository.save(labResult));
    }
}
