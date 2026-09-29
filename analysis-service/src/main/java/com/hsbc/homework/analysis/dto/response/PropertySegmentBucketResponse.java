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
@Schema(description = "Property count for one segment bucket")
public class PropertySegmentBucketResponse {

    @Schema(description = "Inclusive lower boundary", example = "160000.0000")
    private BigDecimal from;

    @Schema(description = "Exclusive upper boundary", example = "210000.0000")
    private BigDecimal to;

    @Schema(description = "Number of properties in this bucket", example = "12")
    private long count;
}
