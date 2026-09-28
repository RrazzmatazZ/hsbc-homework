package com.hsbc.homework.analysis.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request for exporting all properties matching the query criteria")
public class PropertyExportRequest {

    @NotBlank
    @Builder.Default
    @Schema(description = "Field used for sorting", example = "price", defaultValue = "id")
    private String sortBy = "id";

    @NotNull
    @Builder.Default
    @Schema(description = "Whether results are sorted in ascending order", example = "true", defaultValue = "true")
    private Boolean isASC = true;

    @Valid
    @Schema(description = "Optional property filtering criteria")
    private PropertyFilter filter;
}
