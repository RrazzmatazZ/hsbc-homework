package com.hsbc.homework.analysis.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsbc.homework.analysis.dto.request.PropertyExportRequest;
import com.hsbc.homework.analysis.services.ExportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/export")
@Tag(name = "Property Exporter")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @PostMapping("/pdf")
    @Operation(summary = "export filtered property to PDF")
    public ResponseEntity<byte[]> exportPDF(@Valid @RequestBody PropertyExportRequest request) {
        byte[] pdf = exportService.exportPDF(request);
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"market-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping(value = "/csv", produces = "text/csv")
    @Operation(summary = "export filtered properties to CSV")
    public ResponseEntity<byte[]> exportCSV(@Valid @RequestBody PropertyExportRequest request) {
        byte[] csv = exportService.exportCSV(request);
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"market-report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .contentLength(csv.length)
                .body(csv);
    }

}
