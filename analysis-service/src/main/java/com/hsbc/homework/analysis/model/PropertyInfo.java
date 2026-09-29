package com.hsbc.homework.analysis.model;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Schema(description = "Property information")
public class PropertyInfo extends PropertyFeatures {

    @Schema(description = "Property identifier", example = "1")
    private long id;

    @Schema(description = "Property price", example = "185000")
    private BigDecimal price;
}
