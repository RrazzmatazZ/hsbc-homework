package com.hsbc.homework.analysis.client;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import com.hsbc.homework.analysis.model.PropertyFeatures;

class PredictionClientTest {

        @Test
        void testSendPrediction() {
                RestClient.Builder restClientBuilder = RestClient.builder();
                MockRestServiceServer server = MockRestServiceServer
                                .bindTo(restClientBuilder)
                                .build();
                PredictionClient client = new PredictionClient(
                                restClientBuilder.build(),
                                new ObjectMapper(),
                                URI.create("http://localhost:8000/predict"));
                PredictionRequest request = PredictionRequest.builder()
                                .data(List.of(property()))
                                .build();

                server.expect(requestTo("http://localhost:8000/predict"))
                                .andExpect(method(POST))
                                .andRespond(withSuccess(
                                                "{\"predictions\":[250000.25]}",
                                                MediaType.APPLICATION_JSON));

                PredictionResponse response = client.predict(request);

                assertThat(response.getPredictions())
                                .containsExactly(new BigDecimal("250000.25"));
                server.verify();
        }

        private PropertyFeatures property() {
                return PropertyFeatures.builder()
                                .squareFootage(1550)
                                .bedrooms(3)
                                .bathrooms(new BigDecimal("2"))
                                .yearBuilt(1997)
                                .lotSize(6800)
                                .distanceToCityCenter(new BigDecimal("4.1"))
                                .schoolRating(new BigDecimal("7.6"))
                                .build();
        }
}
