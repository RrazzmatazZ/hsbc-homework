package com.hsbc.homework.analysis.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Property filtered summary request")
public class PropertySummaryRequest {

    @Valid
    @Schema(description = "Property filter")
    private PropertyFilter filter;

}
