package com.hsbc.homework.analysis.services;

import com.hsbc.homework.analysis.dto.request.PropertySegmentRequest;
import com.hsbc.homework.analysis.dto.request.PropertySummaryRequest;
import com.hsbc.homework.analysis.dto.response.PropertySegmentResponse;
import com.hsbc.homework.analysis.dto.response.PropertySummaryResponse;

public interface AnalysisService {

    /**
     * Aggregate the filtered property data and summarize multiple metrics,
     * including the number of matching properties, average price, minimum and
     * maximum prices, average property square footage, and average price per square
     * foot.
     * 
     * @param request filter criteria for property summary
     * @return property summarize metrics
     */
    PropertySummaryResponse summary(PropertySummaryRequest request);

    /**
     * Aggregate the property data based on the specified metric, and divide it into
     * multiple buckets according to the data range.
     * 
     * @param request including filter criteria, segment element and bucket size
     * @return aggeregate result on the specified metric
     */
    PropertySegmentResponse segments(PropertySegmentRequest request);
}
