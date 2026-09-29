package com.hsbc.homework.analysis.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsbc.homework.analysis.dto.request.WhatIfRequest;
import com.hsbc.homework.analysis.dto.response.WhatIfResponse;
import com.hsbc.homework.analysis.services.WhatIfService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/what-if")
@Tag(name = "What-If Tool")
public class WhatIfController {

    private final WhatIfService whatIfService;

    public WhatIfController(WhatIfService whatIfService) {
        this.whatIfService = whatIfService;
    }

    @PostMapping
    @Operation(summary = "Evaluate a property what-if scenario")
    public WhatIfResponse evaluate(@Valid @RequestBody WhatIfRequest request) {
        return whatIfService.evaluate(request);
    }

}
