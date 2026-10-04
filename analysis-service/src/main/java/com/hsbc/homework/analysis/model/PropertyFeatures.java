package com.hsbc.homework.analysis.model;

import java.math.BigDecimal;
import java.time.Year;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Property features that inflecting the house price")
public class PropertyFeatures {

    @NotNull
    @Min(value = 1, message = "must be at least 1")
    @Schema(description = "Square footage", example = "1250", minimum = "1")
    private Integer squareFootage;

    @NotNull
    @Min(value = 0, message = "must be at least 0")
    @Schema(description = "Number of bedrooms", example = "2")
    private Integer bedrooms;

    @NotNull
    @DecimalMin(value = "0", message = "must be at least 0")
    @Schema(description = "Number of bathrooms", example = "1.5")
    private BigDecimal bathrooms;

    @NotNull
    @Min(value = 1800, message = "must be at least 1800")
    @Schema(description = "Year the property was built", example = "1985", minimum = "1800")
    private Integer yearBuilt;

    @NotNull
    @Min(value = 1, message = "must be at least 1")
    @Schema(description = "Lot size", example = "5200", minimum = "1")
    private Integer lotSize;

    @NotNull
    @DecimalMin(value = "0", message = "must be at least 0")
    @Schema(description = "Distance to the city center", example = "3.2")
    private BigDecimal distanceToCityCenter;

    @NotNull
    @DecimalMin(value = "0", message = "must be at least 0")
    @DecimalMax(value = "10", message = "must be no more than 10")
    @Schema(description = "School rating", example = "7.1", minimum = "0", maximum = "10")
    private BigDecimal schoolRating;

    @JsonIgnore
    @AssertTrue(message = "year built must not be in the future")
    public boolean isYearBuiltNotInFuture() {
        return yearBuilt == null || yearBuilt <= Year.now().getValue();
    }
}
