package com.hsbc.homework.analysis.dto.request;

import java.math.BigDecimal;

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
@Schema(description = "Optional criteria for filtering properties")
public class PropertyFilter {

    @Valid
    @Schema(description = "Property price range")
    private Range<BigDecimal> price;

    @Valid
    @Schema(description = "Square footage range")
    private Range<Integer> squareFootage;

    @Valid
    @Schema(description = "Bedroom count range")
    private Range<Integer> bedrooms;

    @Valid
    @Schema(description = "Bathroom count range")
    private Range<BigDecimal> bathrooms;

    @Valid
    @Schema(description = "Year-built range")
    private Range<Integer> yearBuilt;

    @Valid
    @Schema(description = "Lot-size range")
    private Range<Integer> lotSize;

    @Valid
    @Schema(description = "Distance-to-city-center range")
    private Range<BigDecimal> distanceToCityCenter;

    @Valid
    @Schema(description = "School-rating range")
    private Range<BigDecimal> schoolRating;
}
