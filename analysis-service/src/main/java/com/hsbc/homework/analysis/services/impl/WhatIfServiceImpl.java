package com.hsbc.homework.analysis.services.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;

import org.springframework.stereotype.Service;

import com.hsbc.homework.analysis.client.PredictionClient;
import com.hsbc.homework.analysis.client.PredictionRequest;
import com.hsbc.homework.analysis.client.PredictionResponse;
import com.hsbc.homework.analysis.dto.request.WhatIfRequest;
import com.hsbc.homework.analysis.dto.response.WhatIfResponse;
import com.hsbc.homework.analysis.exception.InvalidQueryException;
import com.hsbc.homework.analysis.model.PropertyFeatures;
import com.hsbc.homework.analysis.model.PropertyInfo;
import com.hsbc.homework.analysis.services.WhatIfService;

@Service
public class WhatIfServiceImpl implements WhatIfService {

    private final PredictionClient client;

    public WhatIfServiceImpl(PredictionClient client) {
        this.client = client;
    }

    @Override
    public WhatIfResponse evaluate(WhatIfRequest request) {
        PropertyFeatures modifiedFeatures = request.getModifiedFeatures();
        PropertyInfo previousInfo = request.getPreviousInfo();
        BigDecimal previousPrice = previousInfo.getPrice();
        if (previousPrice == null || previousPrice.signum() <= 0) {
            throw new InvalidQueryException("Previous price must be greater than zero");
        }

        PredictionRequest requestContent = PredictionRequest.builder()
                .data(Collections.singletonList(modifiedFeatures))
                .build();
        PredictionResponse response = client.predict(requestContent);

        BigDecimal predictedPrice = response.getPredictions().get(0);
        BigDecimal priceChange = predictedPrice.subtract(previousPrice);

        BigDecimal percentageChange = priceChange
                .multiply(BigDecimal.valueOf(100))
                .divide(previousPrice, 2, RoundingMode.HALF_UP);

        return WhatIfResponse.builder()
                .predictedPrice(predictedPrice)
                .priceChange(priceChange)
                .percentageChange(percentageChange)
                .build();
    }
}
