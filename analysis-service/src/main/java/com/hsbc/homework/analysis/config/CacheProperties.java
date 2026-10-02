package com.hsbc.homework.analysis.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "app.cache")
public record CacheProperties(
        @DefaultValue("500") long maximumSize,
        @DefaultValue("10m") Duration expireAfterAccess) {
}
