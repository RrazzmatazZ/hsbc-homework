package com.hsbc.homework.analysis.services.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.hsbc.homework.analysis.dto.request.PropertyFilter;
import com.hsbc.homework.analysis.dto.request.PropertySummaryRequest;
import com.hsbc.homework.analysis.dto.response.PropertySummaryResponse;
import com.hsbc.homework.analysis.model.PropertyInfo;
import com.hsbc.homework.analysis.services.QueryService;

class AnalysisServiceImplTest {

    private final QueryService queryService = mock(QueryService.class);
    private final AnalysisServiceImpl service = new AnalysisServiceImpl(queryService);

    @Test
    void testSummarizesProperties() {
        PropertyFilter filter = PropertyFilter.builder().build();
        PropertySummaryRequest request = PropertySummaryRequest.builder()
                .filter(filter)
                .build();
        when(queryService.searchAll(filter, "price", true)).thenReturn(List.of(
                property(1, 1000, "100000"),
                property(2, 2000, "200000"),
                property(3, 2000, "400000")));

        PropertySummaryResponse response = service.summary(request);

        assertThat(response.getPropertyCount()).isEqualTo(3);
        assertThat(response.getAveragePrice()).isEqualByComparingTo("233333.33");
        assertThat(response.getMinPrice()).isEqualByComparingTo("100000.00");
        assertThat(response.getMaxPrice()).isEqualByComparingTo("400000.00");
        assertThat(response.getAverageSquareFootage()).isEqualByComparingTo("1666.67");
        assertThat(response.getAveragePricePerSquareFoot()).isEqualByComparingTo("133.33");
    }

    private PropertyInfo property(long id, int squareFootage, String price) {
        return PropertyInfo.builder()
                .id(id)
                .squareFootage(squareFootage)
                .price(new BigDecimal(price))
                .build();
    }
}
