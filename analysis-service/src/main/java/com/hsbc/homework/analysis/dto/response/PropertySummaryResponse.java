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
@Schema(description = "Aggregate statistics for properties matching the filter")
public class PropertySummaryResponse {

    @Schema(description = "Number of matching properties", example = "50", minimum = "0")
    private long propertyCount;

    @Schema(description = "Average property price", example = "264600.00", minimum = "0")
    private BigDecimal averagePrice;

    @Schema(description = "Lowest property price", example = "160000.00", minimum = "0")
    private BigDecimal minPrice;

    @Schema(description = "Highest property price", example = "410000.00", minimum = "0")
    private BigDecimal maxPrice;

    @Schema(description = "Average property square footage", example = "1690.20", minimum = "0")
    private BigDecimal averageSquareFootage;

    @Schema(description = "Average price per square foot", example = "155.09", minimum = "0")
    private BigDecimal averagePricePerSquareFoot;

}
