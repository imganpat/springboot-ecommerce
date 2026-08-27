package com.example.ecommerce_api.controller;

import com.example.ecommerce_api.entity.Product;
import com.example.ecommerce_api.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import com.example.ecommerce_api.service.ImageStorageService;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final ImageStorageService imageStorageService;

    public ProductController(ProductService productService, ImageStorageService imageStorageService) {
        this.productService = productService;
        this.imageStorageService = imageStorageService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {

        Product product = productService.getProductById(id);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(product);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<Resource> getProductImage(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product == null || product.getImageFilename() == null) {
            return ResponseEntity.notFound().build();
        }

        Path imagePath = imageStorageService.load(product.getImageFilename());
        if (!Files.exists(imagePath)) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        try {
            String contentType = Files.probeContentType(imagePath);
            if (contentType != null) {
                mediaType = MediaType.parseMediaType(contentType);
            }
        } catch (Exception ignored) {
            // Return the file with a generic type when the OS cannot detect it.
        }

        return ResponseEntity.ok().contentType(mediaType).body(new FileSystemResource(imagePath));
    }

}