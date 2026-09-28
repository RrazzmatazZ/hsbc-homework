package com.hsbc.homework.analysis.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
@Schema(description = "Generic paginated search request")
public class PropertyPageRequest<T> {

    @Min(0)
    @Builder.Default
    @Schema(description = "page index", example = "0", defaultValue = "0", minimum = "0")
    private int page = 0;

    @Min(1)
    @Max(100)
    @Builder.Default
    @Schema(description = "page size", example = "10", defaultValue = "10", minimum = "1", maximum = "100")
    private int size = 10;

    @NotBlank
    @Builder.Default
    @Schema(description = "Field used for sorting", example = "price", defaultValue = "id")
    private String sortBy = "id";

    @NotNull
    @Builder.Default
    @Schema(description = "Whether results are sorted in ascending order", example = "true", defaultValue = "true")
    private Boolean isASC = true;

    @Valid
    @Schema(description = "Optional domain-specific filtering criteria")
    private T filter;
}
