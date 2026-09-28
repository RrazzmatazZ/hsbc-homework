package com.hsbc.homework.analysis.model;

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
@Schema(description = "Property information")
public class PropertyInfo {

    @Schema(description = "Property identifier", example = "1")
    private long id;

    @Schema(description = "Square footage", example = "1250")
    private int squareFootage;

    @Schema(description = "Number of bedrooms", example = "2")
    private int bedrooms;

    @Schema(description = "Number of bathrooms", example = "1.5")
    private BigDecimal bathrooms;

    @Schema(description = "Year the property was built", example = "1985")
    private int yearBuilt;

    @Schema(description = "Lot size", example = "5200")
    private int lotSize;

    @Schema(description = "Distance to the city center", example = "3.2")
    private BigDecimal distanceToCityCenter;

    @Schema(description = "School rating", example = "7.1", minimum = "0", maximum = "10")
    private BigDecimal schoolRating;

    @Schema(description = "Property price", example = "185000")
    private BigDecimal price;
}
