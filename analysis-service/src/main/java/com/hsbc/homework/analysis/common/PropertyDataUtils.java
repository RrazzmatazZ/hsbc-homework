package com.hsbc.homework.analysis.common;

import static java.nio.charset.StandardCharsets.UTF_8;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.ByteOrderMark;
import org.apache.commons.io.input.BOMInputStream;
import org.openpdf.text.Document;
import org.openpdf.text.DocumentException;
import org.openpdf.text.PageSize;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;

import com.hsbc.homework.analysis.model.PropertyInfo;

public final class PropertyDataUtils {

    private static final String ID = "id";
    private static final String SQUARE_FOOTAGE = "square_footage";
    private static final String BEDROOMS = "bedrooms";
    private static final String BATHROOMS = "bathrooms";
    private static final String YEAR_BUILT = "year_built";
    private static final String LOT_SIZE = "lot_size";
    private static final String DISTANCE_TO_CITY_CENTER = "distance_to_city_center";
    private static final String SCHOOL_RATING = "school_rating";
    private static final String PRICE = "price";

    private static final String[] PROPERTY_HEADERS = {
            ID,
            SQUARE_FOOTAGE,
            BEDROOMS,
            BATHROOMS,
            YEAR_BUILT,
            LOT_SIZE,
            DISTANCE_TO_CITY_CENTER,
            SCHOOL_RATING,
            PRICE
    };

    private static final CSVFormat PROPERTY_INPUT_FORMAT = CSVFormat.DEFAULT.builder()
            .setHeader()
            .setSkipHeaderRecord(true)
            .setIgnoreHeaderCase(true)
            .setIgnoreSurroundingSpaces(true)
            .setTrim(true)
            .get();

    private static final CSVFormat PROPERTY_OUTPUT_FORMAT = CSVFormat.DEFAULT.builder()
            .setHeader(PROPERTY_HEADERS)
            .setRecordSeparator(System.lineSeparator())
            .get();

    private PropertyDataUtils() {
    }

    /**
     * Parses the housing dataset from CSV InputStream.
     *
     * @param inputStream CSV input stream
     * @return list of parsed properties
     * @throws IOException              if the stream cannot be read
     * @throws IllegalArgumentException if a required value is missing or invalid
     */
    public static List<PropertyInfo> readPropertiesFromCsv(InputStream inputStream) throws IOException {
        Objects.requireNonNull(inputStream, "inputStream must not be null");

        try (BOMInputStream bomInputStream = BOMInputStream.builder()
                .setInputStream(inputStream)
                .setByteOrderMarks(ByteOrderMark.UTF_8)
                .setInclude(false)
                .get();
                Reader reader = new InputStreamReader(bomInputStream, UTF_8);
                CSVParser parser = PROPERTY_INPUT_FORMAT.parse(reader)) {

            validateHeaders(parser);
            return parser.stream()
                    .map(PropertyDataUtils::toPropertyInfo)
                    .toList();
        }
    }

    /**
     * Serializes properties to a UTF-8 CSV document including the header row.
     *
     * @param properties properties to export
     * @return CSV content as UTF-8 bytes
     * @throws IOException if the CSV cannot be generated
     */
    public static byte[] exportPropertiesToCsv(List<PropertyInfo> properties) throws IOException {
        Objects.requireNonNull(properties, "properties must not be null");

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try (Writer writer = new OutputStreamWriter(outputStream, UTF_8);
                CSVPrinter printer = new CSVPrinter(writer, PROPERTY_OUTPUT_FORMAT)) {
            for (PropertyInfo property : properties) {
                Objects.requireNonNull(property, "properties must not contain null elements");
                printer.printRecord(
                        property.getId(),
                        property.getSquareFootage(),
                        property.getBedrooms(),
                        property.getBathrooms(),
                        property.getYearBuilt(),
                        property.getLotSize(),
                        property.getDistanceToCityCenter(),
                        property.getSchoolRating(),
                        property.getPrice());
            }
        }
        return outputStream.toByteArray();
    }

    /**
     * Serializes properties to a landscape A4 PDF report.
     *
     * @param properties properties to export
     * @return PDF content as bytes
     * @throws IOException if the PDF cannot be generated
     */
    public static byte[] exportPropertiesToPdf(List<PropertyInfo> properties) throws IOException {
        Objects.requireNonNull(properties, "properties must not be null");
        properties.forEach(property ->
                Objects.requireNonNull(property, "properties must not contain null elements"));

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            PdfPTable table = new PdfPTable(PROPERTY_HEADERS.length);
            table.setHeaderRows(1);
            List.of(PROPERTY_HEADERS).forEach(table::addCell);
            properties.forEach(property -> addPdfRow(table, property));

            document.add(table);
        } catch (DocumentException exception) {
            throw new IOException("Failed to generate property PDF", exception);
        } finally {
            document.close();
        }

        return outputStream.toByteArray();
    }

    private static void addPdfRow(PdfPTable table, PropertyInfo property) {
        table.addCell(Long.toString(property.getId()));
        table.addCell(Integer.toString(property.getSquareFootage()));
        table.addCell(Integer.toString(property.getBedrooms()));
        table.addCell(property.getBathrooms().toPlainString());
        table.addCell(Integer.toString(property.getYearBuilt()));
        table.addCell(Integer.toString(property.getLotSize()));
        table.addCell(property.getDistanceToCityCenter().toPlainString());
        table.addCell(property.getSchoolRating().toPlainString());
        table.addCell(property.getPrice().toPlainString());
    }

    private static void validateHeaders(CSVParser parser) {
        List<String> headers = parser.getHeaderNames();
        for (String requiredHeader : PROPERTY_HEADERS) {
            if (headers.stream().noneMatch(header -> requiredHeader.equalsIgnoreCase(header))) {
                throw new IllegalArgumentException("Missing required CSV header: " + requiredHeader);
            }
        }
    }

    private static PropertyInfo toPropertyInfo(CSVRecord record) {
        try {
            return PropertyInfo.builder()
                    .id(Long.parseLong(record.get(ID)))
                    .squareFootage(Integer.parseInt(record.get(SQUARE_FOOTAGE)))
                    .bedrooms(Integer.parseInt(record.get(BEDROOMS)))
                    .bathrooms(new BigDecimal(record.get(BATHROOMS)))
                    .yearBuilt(Integer.parseInt(record.get(YEAR_BUILT)))
                    .lotSize(Integer.parseInt(record.get(LOT_SIZE)))
                    .distanceToCityCenter(new BigDecimal(record.get(DISTANCE_TO_CITY_CENTER)))
                    .schoolRating(new BigDecimal(record.get(SCHOOL_RATING)))
                    .price(new BigDecimal(record.get(PRICE)))
                    .build();
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Invalid property data at CSV record " + record.getRecordNumber(),
                    exception);
        }
    }

}
