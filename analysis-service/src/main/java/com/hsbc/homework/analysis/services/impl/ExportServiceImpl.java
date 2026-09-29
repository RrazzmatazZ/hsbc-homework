package com.hsbc.homework.analysis.services.impl;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hsbc.homework.analysis.common.PropertyDataUtils;
import com.hsbc.homework.analysis.dto.request.PropertyExportRequest;
import com.hsbc.homework.analysis.model.PropertyInfo;
import com.hsbc.homework.analysis.services.ExportService;
import com.hsbc.homework.analysis.services.QueryService;

@Service
public class ExportServiceImpl implements ExportService {

    private final QueryService queryService;

    public ExportServiceImpl(QueryService queryService) {
        this.queryService = queryService;
    }

    @Override
    public byte[] exportPDF(PropertyExportRequest request) {
        List<PropertyInfo> properties = queryService.searchAll(
                request.getFilter(),
                request.getSortBy(),
                request.getIsASC());

        try {
            return PropertyDataUtils.exportPropertiesToPdf(properties);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to generate property PDF", exception);
        }
    }

    @Override
    public byte[] exportCSV(PropertyExportRequest request) {
        List<PropertyInfo> properties = queryService.searchAll(
                request.getFilter(),
                request.getSortBy(),
                request.getIsASC());

        try {
            return PropertyDataUtils.exportPropertiesToCsv(properties);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to generate property CSV", exception);
        }
    }

}
