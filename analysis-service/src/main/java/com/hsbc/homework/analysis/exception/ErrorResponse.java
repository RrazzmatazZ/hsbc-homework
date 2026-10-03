package com.hsbc.homework.analysis.exception;

public record ErrorResponse(String code, String message, int status) {
}
