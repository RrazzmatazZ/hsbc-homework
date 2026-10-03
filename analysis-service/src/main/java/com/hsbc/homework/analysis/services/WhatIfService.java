package com.hsbc.homework.analysis.services;

import com.hsbc.homework.analysis.dto.request.WhatIfRequest;
import com.hsbc.homework.analysis.dto.response.WhatIfResponse;

public interface WhatIfService {

    /**
     * Evaluates a what-if scenario by predicting the property price based on
     * the modified property information and comparing it with the original price.
     *
     * @param request the what-if request containing the original property
     *                information and the modified property attributes
     * @return the what-if analysis result, including the predicted price,
     *         price change, and percentage change compared with the original price
     */
    WhatIfResponse evaluate(WhatIfRequest request);
}