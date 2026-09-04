package com.example.ecommerce_api.controller;

import com.example.ecommerce_api.entity.Product;

import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String description,
        double price,
        int quantity,
        boolean deleted,
        String imageFilename,
        List<String> imageFilenames,
        OwnerResponse owner) {

    public static ProductResponse from(Product product) {
        OwnerResponse owner = product.getOwner() == null
                ? null
                : new OwnerResponse(product.getOwner().getId(), product.getOwner().getName());

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.isDeleted(),
                product.getImageFilename(),
                product.getImageFilenames(),
                owner);
    }

    public record OwnerResponse(Long id, String name) {
    }
}