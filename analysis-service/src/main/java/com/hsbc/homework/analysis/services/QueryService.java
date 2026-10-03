package com.hsbc.homework.analysis.services;

import java.util.List;

import com.hsbc.homework.analysis.dto.request.PropertyPageRequest;
import com.hsbc.homework.analysis.dto.request.PropertyFilter;
import com.hsbc.homework.analysis.dto.response.PropertyPageResponse;
import com.hsbc.homework.analysis.model.PropertyInfo;

public interface QueryService {

    /**
     * Query property data and return paginated results.
     * 
     * @param request pagination and filter criteria for the property search
     * @return paginated result
     */
    PropertyPageResponse<PropertyInfo> search(PropertyPageRequest<PropertyFilter> request);

    /**
     * Searches for all properties matching the specified filter criteria, and then
     * returns the results sorted by the specified field.
     * 
     * @param filter filter criteria
     * @param sortBy sort field.
     * @param isASC  to sort in ascending order or not.
     * @return the list of properties matching the specified criteria
     */
    List<PropertyInfo> searchAll(PropertyFilter filter, String sortBy, boolean isASC);

    /**
     * Finds a property by its ID.
     * 
     * @param id unique ID
     * @return the property matching the specified identifier
     */
    PropertyInfo findById(long id);
}
