package com.hsbc.homework.analysis.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Hello World")
public class HelloWorldController {

    @GetMapping("/hello")
    @Operation(summary = "Return a Hello World message")
    @ApiResponse(responseCode = "200", description = "Hello World message returned")
    public Map<String, String> helloWorld() {
        return Map.of("message", "Hello World");
    }
}
