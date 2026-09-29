package com.hsbc.homework.analysis.services;

import com.hsbc.homework.analysis.dto.request.WhatIfRequest;
import com.hsbc.homework.analysis.dto.response.WhatIfResponse;

public interface WhatIfService {
    WhatIfResponse evaluate(WhatIfRequest request);
}