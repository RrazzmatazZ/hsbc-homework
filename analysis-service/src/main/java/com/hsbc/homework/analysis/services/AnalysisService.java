package com.hsbc.homework.analysis.services;

import com.hsbc.homework.analysis.dto.request.PropertySegmentRequest;
import com.hsbc.homework.analysis.dto.request.PropertySummaryRequest;
import com.hsbc.homework.analysis.dto.response.PropertySegmentResponse;
import com.hsbc.homework.analysis.dto.response.PropertySummaryResponse;

public interface AnalysisService {

    PropertySummaryResponse summary(PropertySummaryRequest request);

    PropertySegmentResponse segments(PropertySegmentRequest request);
}
