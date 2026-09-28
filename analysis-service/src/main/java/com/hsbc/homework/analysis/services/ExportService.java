package com.hsbc.homework.analysis.services;

import com.hsbc.homework.analysis.dto.request.PropertyExportRequest;

public interface ExportService {

    byte[] exportPDF(PropertyExportRequest request);

    byte[] exportCSV(PropertyExportRequest request);

}
