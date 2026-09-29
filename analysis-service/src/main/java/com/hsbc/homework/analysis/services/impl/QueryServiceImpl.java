package com.hsbc.homework.analysis.services.impl;

import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hsbc.homework.analysis.dto.request.PropertyPageRequest;
import com.hsbc.homework.analysis.dto.request.PropertyFilter;
import com.hsbc.homework.analysis.dto.request.Range;
import com.hsbc.homework.analysis.dto.response.PropertyPageResponse;
import com.hsbc.homework.analysis.model.PropertyInfo;
import com.hsbc.homework.analysis.repository.PropertyRepository;
import com.hsbc.homework.analysis.services.QueryService;

@Service
public class QueryServiceImpl implements QueryService {

    private final PropertyRepository propertyRepository;

    public QueryServiceImpl(PropertyRepository repository) {
        this.propertyRepository = repository;
    }

    @Override
    public PropertyPageResponse<PropertyInfo> search(PropertyPageRequest<PropertyFilter> request) {
        List<PropertyInfo> matchingProperties = searchAll(
                request.getFilter(),
                request.getSortBy(),
                request.getIsASC());

        long totalElements = matchingProperties.size();
        int totalPages = totalElements == 0
                ? 0
                : (int) ((totalElements + request.getSize() - 1) / request.getSize());
        int fromIndex = (int) Math.min((long) request.getPage() * request.getSize(), totalElements);
        int toIndex = (int) Math.min((long) fromIndex + request.getSize(), totalElements);
        List<PropertyInfo> content = List.copyOf(matchingProperties.subList(fromIndex, toIndex));

        return PropertyPageResponse.<PropertyInfo>builder()
                .content(content)
                .page(request.getPage())
                .size(request.getSize())
                .totalElements(totalElements)
                .totalPages(totalPages)
                .first(request.getPage() == 0)
                .last(totalPages == 0 || request.getPage() >= totalPages - 1)
                .empty(content.isEmpty())
                .build();
    }

    @Override
    public List<PropertyInfo> searchAll(PropertyFilter filter, String sortBy, boolean isASC) {
        Comparator<PropertyInfo> comparator = comparatorFor(sortBy);
        if (!isASC) {
            comparator = comparator.reversed();
        }

        return propertyRepository.findAll().stream()
                .filter(property -> matches(property, filter))
                .sorted(comparator)
                .toList();
    }

    @Override
    public PropertyInfo findById(long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Property not found: " + id));
    }

    private boolean matches(PropertyInfo property, PropertyFilter filter) {
        if (filter == null) {
            return true;
        }

        return range(property.getPrice(), filter.getPrice())
                && range(property.getSquareFootage(), filter.getSquareFootage())
                && range(property.getBedrooms(), filter.getBedrooms())
                && range(property.getBathrooms(), filter.getBathrooms())
                && range(property.getYearBuilt(), filter.getYearBuilt())
                && range(property.getLotSize(), filter.getLotSize())
                && range(property.getDistanceToCityCenter(), filter.getDistanceToCityCenter())
                && range(property.getSchoolRating(), filter.getSchoolRating());
    }

    private Comparator<PropertyInfo> comparatorFor(String sortBy) {
        return switch (sortBy) {
            case "id" -> Comparator.comparingLong(i -> i.getId());
            case "squareFootage" -> Comparator.comparingInt(i -> i.getSquareFootage());
            case "bedrooms" -> Comparator.comparingInt(i -> i.getBedrooms());
            case "bathrooms" -> Comparator.comparing(i -> i.getBathrooms());
            case "yearBuilt" -> Comparator.comparingInt(i -> i.getYearBuilt());
            case "lotSize" -> Comparator.comparingInt(i -> i.getLotSize());
            case "distanceToCityCenter" -> Comparator.comparing(i -> i.getDistanceToCityCenter());
            case "schoolRating" -> Comparator.comparing(i -> i.getSchoolRating());
            case "price" -> Comparator.comparing(i -> i.getPrice());
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unsupported sort field: " + sortBy);
        };
    }

    private <T extends Comparable<? super T>> boolean range(T value, Range<T> range) {
        return range == null || range.contains(value);
    }
}
