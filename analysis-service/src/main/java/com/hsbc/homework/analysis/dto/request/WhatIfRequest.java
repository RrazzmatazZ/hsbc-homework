package com.hsbc.homework.analysis.dto.request;

import com.hsbc.homework.analysis.model.PropertyFeatures;
import com.hsbc.homework.analysis.model.PropertyInfo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "What-if request content")
public class WhatIfRequest {

    @Valid
    @NotNull
    @Schema(description = "previous property Info", requiredMode = Schema.RequiredMode.REQUIRED)
    private PropertyInfo previousInfo;

    @Valid
    @NotNull
    @Schema(description = "Modified property features", requiredMode = Schema.RequiredMode.REQUIRED)
    private PropertyFeatures modifiedFeatures;
}
