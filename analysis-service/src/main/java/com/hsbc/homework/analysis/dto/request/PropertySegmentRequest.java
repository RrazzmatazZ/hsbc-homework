package com.hsbc.homework.analysis.dto.request;

import com.hsbc.homework.analysis.model.PropertySegmentField;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request for property segment statistics")
public class PropertySegmentRequest {

    @NotNull
    @Schema(description = "Property field used to build segments", example = "price")
    private PropertySegmentField segmentBy;

    @Min(1)
    @Max(20)
    @Builder.Default
    @Schema(description = "Number of segment buckets", example = "5", defaultValue = "5")
    private int bucketCount = 5;

    @Valid
    @Schema(description = "segment filter")
    private PropertyFilter filter;
}
