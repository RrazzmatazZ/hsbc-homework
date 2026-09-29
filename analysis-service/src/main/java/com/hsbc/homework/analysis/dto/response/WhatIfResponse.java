package com.hsbc.homework.analysis.dto.response;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "What-if request content")
public class WhatIfResponse {

    @Schema(description = "Predicted property price", example = "285000.00")
    private BigDecimal predictedPrice;

    @Schema(description = "Price difference ", example = "25000.00")
    private BigDecimal priceChange;

    @Schema(description = "Percentage change ", example = "0.14")
    private BigDecimal percentageChange;

}
