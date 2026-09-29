package com.hsbc.homework.analysis.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsbc.homework.analysis.dto.request.PropertySegmentRequest;
import com.hsbc.homework.analysis.dto.request.PropertySummaryRequest;
import com.hsbc.homework.analysis.dto.response.PropertySegmentResponse;
import com.hsbc.homework.analysis.dto.response.PropertySummaryResponse;
import com.hsbc.homework.analysis.services.AnalysisService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/analysis")
@Tag(name = "Property Analysis")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get aggregate statistics for filtered properties")
    public PropertySummaryResponse summary(@Valid @RequestBody PropertySummaryRequest request) {
        return analysisService.summary(request);
    }

    @PostMapping("/segments")
    @Operation(summary = "Count filtered properties in equal-width segments")
    public PropertySegmentResponse segments(@Valid @RequestBody PropertySegmentRequest request) {
        return analysisService.segments(request);
    }

}
