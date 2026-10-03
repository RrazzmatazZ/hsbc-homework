package com.hsbc.homework.analysis.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

/**
 * Converts application and request exceptions into API error responses.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handles invalid query and sort parameters.
     *
     * @param exception {@link InvalidQueryException} raised for an invalid
     *                  query
     * @return a 400 Bad Request response
     */
    @ExceptionHandler(InvalidQueryException.class)
    public ResponseEntity<ErrorResponse> handleInvalidQuery(InvalidQueryException exception) {
        log.warn("Invalid query: {}", exception.getMessage());
        return response(HttpStatus.BAD_REQUEST, "INVALID_QUERY", exception.getMessage());
    }

    /**
     * Handles requests for a property that does not exist.
     *
     * @param exception {@link PropertyNotFoundException} raised by the query
     *                  service
     * @return a 404 Not Found response
     */
    @ExceptionHandler(PropertyNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePropertyNotFound(PropertyNotFoundException exception) {
        log.warn("Property not found: {}", exception.getMessage());
        return response(HttpStatus.NOT_FOUND, "PROPERTY_NOT_FOUND", exception.getMessage());
    }

    /**
     * Handles errors returned while calling the prediction service.
     *
     * @param exception {@link PredictionServiceException} raised by the
     *                  prediction client
     * @return a 502 Bad Gateway response
     */
    @ExceptionHandler(PredictionServiceException.class)
    public ResponseEntity<ErrorResponse> handlePredictionService(PredictionServiceException exception) {
        log.error("Prediction service error", exception);
        return response(HttpStatus.BAD_GATEWAY, "PREDICTION_SERVICE_ERROR", exception.getMessage());
    }

    /**
     * Handles failures while generating CSV or PDF exports.
     *
     * @param exception {@link ExportException} raised by the export service
     * @return a 500 Internal Server Error response
     */
    @ExceptionHandler(ExportException.class)
    public ResponseEntity<ErrorResponse> handleExport(ExportException exception) {
        log.error("Property export failed", exception);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "EXPORT_FAILED", exception.getMessage());
    }

    /**
     * Handles failures while loading the property dataset.
     *
     * @param exception {@link DataLoadException} raised while loading property
     *                  data
     * @return a 500 Internal Server Error response
     */
    @ExceptionHandler(DataLoadException.class)
    public ResponseEntity<ErrorResponse> handleDataLoad(DataLoadException exception) {
        log.error("Property data loading failed", exception);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "DATA_LOAD_FAILED", exception.getMessage());
    }

    /**
     * Handles request body validation failures.
     *
     * @param exception {@link MethodArgumentNotValidException} raised by Bean
     *                  Validation
     * @return a 400 Bad Request response
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        var fieldError = exception.getBindingResult().getFieldError();
        String message = fieldError == null
                ? "Request validation failed"
                : fieldError.getField() + ": " + fieldError.getDefaultMessage();
        log.warn("Request validation failed: {}", message);
        return response(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
    }

    /**
     * Handles malformed or unreadable request bodies.
     *
     * @param exception {@link HttpMessageNotReadableException} raised while
     *                  reading the request
     * @return a 400 Bad Request response
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadableMessage(HttpMessageNotReadableException exception) {
        log.warn("Malformed request body: {}", exception.getMessage());
        return response(HttpStatus.BAD_REQUEST, "MALFORMED_REQUEST", "Malformed request body");
    }

    /**
     * Handles unexpected application errors.
     *
     * @param exception Unexpected {@link Exception}
     * @return a 500 Internal Server Error response
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpectedException(Exception exception) {
        log.error("Unexpected server error", exception);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Unexpected server error");
    }

    /**
     * Builds the standard error response.
     *
     * @param status  the HTTP response status
     * @param code    the application error code
     * @param message the error message
     * @return the response containing the standard error body
     */
    private ResponseEntity<ErrorResponse> response(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status)
                .body(new ErrorResponse(code, message, status.value()));
    }
}
