package com.hsbc.homework.analysis.services;

import com.hsbc.homework.analysis.dto.request.PropertyExportRequest;

public interface ExportService {

    /**
     * export filterd property data to PDF file.
     * 
     * @param request Request for exporting all properties matching the query
     *                criteria
     * @return the generated PDF file as a byte array
     */
    byte[] exportPDF(PropertyExportRequest request);

    /**
     * export filterd property data to CSV file.
     * 
     * @param request Request for exporting all properties matching the query
     *                criteria
     * @return the generated CSV file as a byte array
     */
    byte[] exportCSV(PropertyExportRequest request);

}
