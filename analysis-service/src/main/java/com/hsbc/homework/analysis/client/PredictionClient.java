package com.hsbc.homework.analysis.client;

import java.net.URI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PredictionClient {

    private final RestClient restClient;
    private final ObjectMapper requestMapper;
    private final URI predictUrl;

    public PredictionClient(
            RestClient predictionRestClient,
            ObjectMapper objectMapper,
            @Value("${app.prediction-service.predict-url}") URI predictUrl) {
        this.restClient = predictionRestClient;

        // parse key style to snake case
        this.requestMapper = objectMapper.copy()
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
                
        this.predictUrl = predictUrl;
    }

    public PredictionResponse predict(PredictionRequest request) {
        JsonNode requestBody = requestMapper.valueToTree(request);
        PredictionResponse response = restClient.post()
                .uri(predictUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(PredictionResponse.class);

        if (response == null || response.getPredictions() == null) {
            throw new IllegalStateException("Prediction service returned an empty response");
        }
        return response;
    }
}
