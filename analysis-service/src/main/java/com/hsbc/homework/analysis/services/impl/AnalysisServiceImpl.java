package com.hsbc.homework.analysis.services.impl;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.hsbc.homework.analysis.config.CacheConfig;
import com.hsbc.homework.analysis.dto.request.PropertyFilter;
import com.hsbc.homework.analysis.dto.request.PropertySegmentRequest;
import com.hsbc.homework.analysis.dto.request.PropertySummaryRequest;
import com.hsbc.homework.analysis.dto.request.Range;
import com.hsbc.homework.analysis.dto.response.PropertySegmentBucketResponse;
import com.hsbc.homework.analysis.dto.response.PropertySegmentResponse;
import com.hsbc.homework.analysis.dto.response.PropertySummaryResponse;
import com.hsbc.homework.analysis.model.PropertyInfo;
import com.hsbc.homework.analysis.model.PropertySegmentField;
import com.hsbc.homework.analysis.services.AnalysisService;
import com.hsbc.homework.analysis.services.QueryService;

@Service
public class AnalysisServiceImpl implements AnalysisService {

    private static final int BUCKET_SCALE = 4;
    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;

    private final QueryService queryService;

    public AnalysisServiceImpl(QueryService queryService) {
        this.queryService = queryService;
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.PROPERTY_SUMMARIES, sync = true)
    public PropertySummaryResponse summary(PropertySummaryRequest request) {
        List<PropertyInfo> properties = queryService.searchAll(
                request.getFilter(),
                "price",
                true);

        if (properties.isEmpty()) {
            return PropertySummaryResponse.builder()
                    .propertyCount(0)
                    .averagePrice(BigDecimal.ZERO)
                    .minPrice(BigDecimal.ZERO)
                    .maxPrice(BigDecimal.ZERO)
                    .averageSquareFootage(BigDecimal.ZERO)
                    .averagePricePerSquareFoot(BigDecimal.ZERO)
                    .build();
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        BigDecimal totalSquareFootage = BigDecimal.ZERO;
        BigDecimal totalPricePerSquareFoot = BigDecimal.ZERO;

        for (PropertyInfo property : properties) {
            totalPrice = totalPrice.add(property.getPrice());
            totalSquareFootage = totalSquareFootage.add(
                    BigDecimal.valueOf(property.getSquareFootage()));
            totalPricePerSquareFoot = totalPricePerSquareFoot.add(
                    pricePerSquareFoot(property));
        }

        int count = properties.size();
        BigDecimal propertyCount = BigDecimal.valueOf(count);

        return PropertySummaryResponse.builder()
                .propertyCount(count)
                .averagePrice(average(totalPrice, propertyCount))
                .minPrice(properties.get(0).getPrice())
                .maxPrice(properties.get(count - 1).getPrice())
                .averageSquareFootage(average(totalSquareFootage, propertyCount))
                .averagePricePerSquareFoot(average(totalPricePerSquareFoot, propertyCount))
                .build();
    }

    private BigDecimal average(BigDecimal total, BigDecimal count) {
        return total.divide(count, 2, ROUNDING_MODE);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.PROPERTY_SEGMENTS, sync = true)
    public PropertySegmentResponse segments(PropertySegmentRequest request) {
        PropertySegmentField segmentBy = request.getSegmentBy();
        List<PropertyInfo> properties = queryService.searchAll(
                request.getFilter(),
                segmentBy.getFieldName(),
                true);

        if (properties.isEmpty()) {
            return PropertySegmentResponse.builder()
                    .segmentBy(segmentBy)
                    .buckets(List.of())
                    .build();
        }

        BigDecimal dataMin = segmentBy.valueOf(properties.get(0));
        BigDecimal dataMax = segmentBy.valueOf(properties.get(properties.size() - 1));
        BigDecimal configuredMin = filterBoundary(request.getFilter(), segmentBy, true);
        BigDecimal configuredMax = filterBoundary(request.getFilter(), segmentBy, false);
        BigDecimal minValue = configuredMin == null ? dataMin : configuredMin;
        BigDecimal maxValue = configuredMax == null ? dataMax : configuredMax;
        BigDecimal valueRange = maxValue.subtract(minValue);

        int bucketCount = valueRange.signum() == 0 ? 1 : request.getBucketCount();

        List<PropertySegmentBucketResponse> buckets = new ArrayList<>(bucketCount);
        BigDecimal currentFrom = minValue;

        // collect bucket range value
        for (int index = 0; index < bucketCount; index++) {
            BigDecimal currentTo = index == bucketCount - 1
                    ? maxValue
                    : minValue.add(valueRange
                            .multiply(BigDecimal.valueOf(index + 1))
                            .divide(BigDecimal.valueOf(bucketCount), BUCKET_SCALE, ROUNDING_MODE));

            buckets.add(PropertySegmentBucketResponse.builder()
                    .from(currentFrom)
                    .to(currentTo)
                    .count(0)
                    .build());
            currentFrom = currentTo;
        }

        int currentBucketIndex = 0;
        for (PropertyInfo property : properties) {
            BigDecimal value = segmentBy.valueOf(property);

            while (currentBucketIndex < buckets.size() - 1
                    && value.compareTo(buckets.get(currentBucketIndex).getTo()) >= 0) {
                currentBucketIndex++;
            }

            PropertySegmentBucketResponse bucket = buckets.get(currentBucketIndex);
            bucket.setCount(bucket.getCount() + 1);
        }

        return PropertySegmentResponse.builder()
                .segmentBy(segmentBy)
                .buckets(List.copyOf(buckets))
                .build();
    }

    private BigDecimal filterBoundary(
            PropertyFilter filter,
            PropertySegmentField segmentBy,
            boolean lowerBoundary) {
        if (filter == null) {
            return null;
        }

        return switch (segmentBy) {
            case PRICE -> boundaryValue(filter.getPrice(), lowerBoundary);
            case SQUARE_FOOTAGE -> boundaryValue(filter.getSquareFootage(), lowerBoundary);
            case BEDROOMS -> boundaryValue(filter.getBedrooms(), lowerBoundary);
            case BATHROOMS -> boundaryValue(filter.getBathrooms(), lowerBoundary);
            case YEAR_BUILT -> boundaryValue(filter.getYearBuilt(), lowerBoundary);
            case LOT_SIZE -> boundaryValue(filter.getLotSize(), lowerBoundary);
            case DISTANCE_TO_CITY_CENTER -> boundaryValue(
                    filter.getDistanceToCityCenter(), lowerBoundary);
            case SCHOOL_RATING -> boundaryValue(filter.getSchoolRating(), lowerBoundary);
        };
    }

    private BigDecimal boundaryValue(Range<? extends Number> range, boolean lowerBoundary) {
        if (range == null) {
            return null;
        }

        Number value = lowerBoundary ? range.getFrom() : range.getTo();
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal decimal) {
            return decimal;
        }
        return BigDecimal.valueOf(value.longValue());
    }

    private BigDecimal pricePerSquareFoot(PropertyInfo property) {
        return property.getPrice().divide(
                BigDecimal.valueOf(property.getSquareFootage()),
                MathContext.DECIMAL128);
    }
}
