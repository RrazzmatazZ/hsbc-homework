package com.hsbc.homework.analysis.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Inclusive range. Either boundary may be omitted.")
public class Range<T extends Comparable<? super T>> {

    @Schema(description = "Inclusive lower boundary")
    private T from;

    @Schema(description = "Inclusive upper boundary")
    private T to;

    public boolean contains(T value) {
        if (value == null) {
            return false;
        }
        return (from == null || value.compareTo(from) >= 0)
                && (to == null || value.compareTo(to) <= 0);
    }

    @JsonIgnore
    @AssertTrue(message = "range 'from' must be less than or equal to 'to'")
    public boolean isOrdered() {
        return from == null || to == null || from.compareTo(to) <= 0;
    }
}
