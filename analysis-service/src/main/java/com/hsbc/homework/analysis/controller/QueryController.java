package com.hsbc.homework.analysis.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsbc.homework.analysis.dto.request.PropertyFilter;
import com.hsbc.homework.analysis.dto.request.PropertyPageRequest;
import com.hsbc.homework.analysis.dto.response.PropertyPageResponse;
import com.hsbc.homework.analysis.model.PropertyInfo;
import com.hsbc.homework.analysis.services.QueryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/properties")
@Tag(name = "Property Queries")
public class QueryController {

    private final QueryService queryService;

    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    @PostMapping(value = "/search")
    @Operation(summary = "search properties")
    public PropertyPageResponse<PropertyInfo> search(
            @Valid @RequestBody PropertyPageRequest<PropertyFilter> request) {
        return queryService.search(request);
    }

    @GetMapping(value = "/{id}")
    @Operation(summary = "get property by ID")
    public PropertyInfo findById(@PathVariable long id) {
        return queryService.findById(id);
    }
}
