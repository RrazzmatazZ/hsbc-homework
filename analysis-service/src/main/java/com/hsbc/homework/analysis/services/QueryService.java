package com.hsbc.homework.analysis.services;

import java.util.List;

import com.hsbc.homework.analysis.dto.request.PropertyPageRequest;
import com.hsbc.homework.analysis.dto.request.PropertyFilter;
import com.hsbc.homework.analysis.dto.response.PageResponse;
import com.hsbc.homework.analysis.model.PropertyInfo;

public interface QueryService {

    PageResponse<PropertyInfo> search(PropertyPageRequest<PropertyFilter> request);

    List<PropertyInfo> searchAll(PropertyFilter filter, String sortBy, boolean isASC);

    PropertyInfo findById(long id);
}
