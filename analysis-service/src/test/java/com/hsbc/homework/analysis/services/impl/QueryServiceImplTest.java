package com.hsbc.homework.analysis.services.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.hsbc.homework.analysis.dto.request.PropertyPageRequest;
import com.hsbc.homework.analysis.dto.request.PropertyFilter;
import com.hsbc.homework.analysis.dto.request.Range;
import com.hsbc.homework.analysis.dto.response.PropertyPageResponse;
import com.hsbc.homework.analysis.model.PropertyInfo;
import com.hsbc.homework.analysis.repository.PropertyRepository;

class QueryServiceImplTest {

        private final PropertyRepository repository = mock(PropertyRepository.class);
        private final QueryServiceImpl service = new QueryServiceImpl(repository);

        @Test
        void testQueryWithFilter() {
                when(repository.findAll()).thenReturn(List.of(
                                property(1, 2, "180000"),
                                property(2, 3, "260000"),
                                property(3, 4, "380000")));

                PropertyPageRequest<PropertyFilter> request = PropertyPageRequest.<PropertyFilter>builder()
                                .page(0)
                                .size(1)
                                .sortBy("price")
                                .isASC(false)
                                .filter(PropertyFilter.builder()
                                                .bedrooms(Range.<Integer>builder().from(3).build())
                                                .build())
                                .build();

                PropertyPageResponse<PropertyInfo> response = service.search(request);

                assertThat(response.getContent())
                                .extracting(PropertyInfo::getId)
                                .containsExactly(3L);
                assertThat(response.getTotalElements()).isEqualTo(2);
                assertThat(response.getTotalPages()).isEqualTo(2);
                assertThat(response.isFirst()).isTrue();
                assertThat(response.isLast()).isFalse();
        }

        private PropertyInfo property(long id, int bedrooms, String price) {
                return PropertyInfo.builder()
                                .id(id)
                                .squareFootage(1500)
                                .bedrooms(bedrooms)
                                .bathrooms(new BigDecimal("2"))
                                .yearBuilt(2000)
                                .lotSize(7000)
                                .distanceToCityCenter(new BigDecimal("4"))
                                .schoolRating(new BigDecimal("8"))
                                .price(new BigDecimal(price))
                                .build();
        }
}
