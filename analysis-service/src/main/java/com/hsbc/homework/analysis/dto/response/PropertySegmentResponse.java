package com.hsbc.homework.analysis.dto.response;

import java.util.List;

import com.hsbc.homework.analysis.model.PropertySegmentField;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response for property segment statistics")
public class PropertySegmentResponse {

    @Schema(description = "Property field used to build segments", example = "price")
    private PropertySegmentField segmentBy;

    @Builder.Default
    @Schema(description = "Buckets ordered by their lower boundary")
    private List<PropertySegmentBucketResponse> buckets = List.of();
}
