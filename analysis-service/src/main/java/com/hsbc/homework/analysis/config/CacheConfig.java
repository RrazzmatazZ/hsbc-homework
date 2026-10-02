package com.hsbc.homework.analysis.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
@EnableCaching
@EnableConfigurationProperties(CacheProperties.class)
public class CacheConfig {

    public static final String PROPERTY_PAGES = "propertyPages";
    public static final String PROPERTY_SUMMARIES = "propertySummaries";
    public static final String PROPERTY_SEGMENTS = "propertySegments";

    @Bean
    @SuppressWarnings("null")
    public CacheManager cacheManager(CacheProperties properties) {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                PROPERTY_PAGES,
                PROPERTY_SUMMARIES,
                PROPERTY_SEGMENTS);
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(properties.maximumSize())
                .expireAfterAccess(properties.expireAfterAccess())
                .recordStats());
        return cacheManager;
    }
}
