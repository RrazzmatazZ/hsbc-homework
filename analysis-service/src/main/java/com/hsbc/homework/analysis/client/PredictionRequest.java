package com.hsbc.homework.analysis.client;

import java.util.List;

import com.hsbc.homework.analysis.model.PropertyFeatures;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {

    private List<PropertyFeatures> data;
}
