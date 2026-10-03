package com.hsbc.homework.analysis.repository;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;

import com.hsbc.homework.analysis.common.PropertyDataUtils;
import com.hsbc.homework.analysis.exception.DataLoadException;
import com.hsbc.homework.analysis.model.PropertyInfo;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class PropertyRepository {

    private final List<PropertyInfo> properties;

    public PropertyRepository(@Value("${app.data.path}") Resource propertyCsvResource) {
        this.properties = loadPropertyCsv(propertyCsvResource);
    }

    public List<PropertyInfo> findAll() {
        return properties;
    }

    public Optional<PropertyInfo> findById(long id) {
        return properties.stream()
                .filter(property -> property.getId() == id)
                .findFirst();
    }

    public int count() {
        return properties.size();
    }

    private List<PropertyInfo> loadPropertyCsv(Resource propertyCsvResource) {
        try (InputStream inputStream = propertyCsvResource.getInputStream()) {
            log.info("start loading property csv...");
            List<PropertyInfo> loadedProperties = PropertyDataUtils.readPropertiesFromCsv(inputStream);
            if (loadedProperties.isEmpty()) {
                throw new DataLoadException(
                        "Property CSV contains no data: " + propertyCsvResource.getDescription());
            }
             log.info("successful loading! ");
            return List.copyOf(loadedProperties);
        } catch (IOException | IllegalArgumentException exception) {
            throw new DataLoadException(
                    "Failed to load property CSV: " + propertyCsvResource.getDescription(),
                    exception);
        }
    }
}
