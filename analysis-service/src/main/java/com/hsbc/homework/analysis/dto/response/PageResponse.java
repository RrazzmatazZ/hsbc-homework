package com.hsbc.homework.analysis.dto.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Generic paginated response")
public class PageResponse<T> {

    @Schema(description = "Records in the current page")
    private List<T> content;

    @Schema(description = "Zero-based current page index", example = "0")
    private int page;

    @Schema(description = "Requested page size", example = "10")
    private int size;

    @Schema(description = "Total number of matching records", example = "50")
    private long totalElements;

    @Schema(description = "Total number of pages", example = "5")
    private int totalPages;

    @Schema(description = "Whether this is the first page", example = "true")
    private boolean first;

    @Schema(description = "Whether this is the last page", example = "false")
    private boolean last;

    @Schema(description = "Whether the current page contains no records", example = "false")
    private boolean empty;
}
