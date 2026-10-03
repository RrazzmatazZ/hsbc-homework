package com.hsbc.homework.analysis.config;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.hsbc.homework.analysis.dto.request.PropertyFilter;
import com.hsbc.homework.analysis.dto.request.PropertyPageRequest;
import com.hsbc.homework.analysis.repository.PropertyRepository;
import com.hsbc.homework.analysis.services.QueryService;
import com.hsbc.homework.analysis.services.impl.QueryServiceImpl;

@SpringJUnitConfig(classes = { CacheConfig.class, CacheTest.TestConfig.class })
class CacheTest {

    @Autowired
    private PropertyRepository repository;

    @Autowired
    private QueryService queryService;

    @Test
    void cachesRepeatedSearches() {
        when(repository.findAll()).thenReturn(List.of());
        PropertyPageRequest<PropertyFilter> firstRequest = pageRequest();
        PropertyPageRequest<PropertyFilter> equivalentRequest = pageRequest();

        queryService.search(firstRequest);
        queryService.search(equivalentRequest);

        verify(repository, times(1)).findAll();
    }

    private PropertyPageRequest<PropertyFilter> pageRequest() {
        return PropertyPageRequest.<PropertyFilter>builder()
                .page(0)
                .size(10)
                .sortBy("id")
                .isASC(true)
                .build();
    }

    @Configuration
    static class TestConfig {

        @Bean
        PropertyRepository propertyRepository() {
            return mock(PropertyRepository.class);
        }

        @Bean
        QueryService queryService(PropertyRepository repository) {
            return new QueryServiceImpl(repository);
        }
    }
}
