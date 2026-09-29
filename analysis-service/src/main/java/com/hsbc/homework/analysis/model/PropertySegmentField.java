package com.hsbc.homework.analysis.model;

import java.math.BigDecimal;
import java.util.Arrays;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Schema(description = "Property field used to build segments")
public enum PropertySegmentField {

    PRICE("price"),
    SQUARE_FOOTAGE("squareFootage"),
    BEDROOMS("bedrooms"),
    BATHROOMS("bathrooms"),
    YEAR_BUILT("yearBuilt"),
    LOT_SIZE("lotSize"),
    DISTANCE_TO_CITY_CENTER("distanceToCityCenter"),
    SCHOOL_RATING("schoolRating");

    private final String fieldName;

    @JsonCreator
    public static PropertySegmentField fromValue(String value) {
        return Arrays.stream(values())
                .filter(field -> field.fieldName.equalsIgnoreCase(value)
                        || field.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unsupported segment field: " + value));
    }

    @JsonValue
    public String value() {
        return fieldName;
    }

    public BigDecimal valueOf(PropertyInfo property) {
        return switch (this) {
            case PRICE -> property.getPrice();
            case SQUARE_FOOTAGE -> BigDecimal.valueOf(property.getSquareFootage());
            case BEDROOMS -> BigDecimal.valueOf(property.getBedrooms());
            case BATHROOMS -> property.getBathrooms();
            case YEAR_BUILT -> BigDecimal.valueOf(property.getYearBuilt());
            case LOT_SIZE -> BigDecimal.valueOf(property.getLotSize());
            case DISTANCE_TO_CITY_CENTER -> property.getDistanceToCityCenter();
            case SCHOOL_RATING -> property.getSchoolRating();
        };
    }
}
