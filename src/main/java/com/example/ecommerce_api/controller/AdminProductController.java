package com.example.ecommerce_api.controller;

import com.example.ecommerce_api.entity.Product;
import com.example.ecommerce_api.entity.User;
import com.example.ecommerce_api.repository.UserRepository;
import com.example.ecommerce_api.service.ImageStorageService;
import com.example.ecommerce_api.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {
    private final ProductService productService;
    private final UserRepository userRepository;
    private final ImageStorageService imageStorageService;

    public AdminProductController(ProductService productService, UserRepository userRepository,
            ImageStorageService imageStorageService) {
        this.productService = productService;
        this.userRepository = userRepository;
        this.imageStorageService = imageStorageService;
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<Object> uploadProductImage(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestPart("image") MultipartFile image) {
        if (!isAdmin(email)) {
            return forbidden();
        }

        Product product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            String previousFilename = product.getImageFilename();
            product.setImageFilename(imageStorageService.store(image));
            Product savedProduct = productService.createProduct(product);
            imageStorageService.delete(previousFilename);
            return ResponseEntity.ok(savedProduct);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        } catch (IOException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to store image");
        }
    }

    @PostMapping(value = "/{id}/image", consumes = "image/*")
    public ResponseEntity<Object> uploadProductImageAsBinary(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestHeader(value = "Content-Type") String contentType,
            @RequestBody byte[] image) {
        if (!isAdmin(email)) {
            return forbidden();
        }

        Product product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            String previousFilename = product.getImageFilename();
            product.setImageFilename(imageStorageService.store(new ByteArrayInputStream(image), contentType));
            Product savedProduct = productService.createProduct(product);
            imageStorageService.delete(previousFilename);
            return ResponseEntity.ok(savedProduct);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        } catch (IOException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to store image");
        }
    }

    @GetMapping
    public ResponseEntity<Object> getAllProducts(
            @RequestHeader(value = "X-User-Email", required = false) String email) {
        if (!isAdmin(email)) {
            return forbidden();
        }
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    @PostMapping
    public ResponseEntity<Object> createProduct(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody ProductRequest request) {
        if (!isAdmin(email)) {
            return forbidden();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(toProduct(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProduct(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestBody ProductRequest request) {
        if (!isAdmin(email)) {
            return forbidden();
        }

        Product updatedProduct = productService.updateProduct(id, toProduct(request));
        return updatedProduct == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduct(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        if (!isAdmin(email)) {
            return forbidden();
        }

        return productService.deleteProduct(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<Object> restoreProduct(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        if (!isAdmin(email)) {
            return forbidden();
        }

        return productService.restoreProduct(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    private boolean isAdmin(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        return userRepository.findByEmail(email.trim().toLowerCase())
                .map(User::isAdmin)
                .orElse(false);
    }

    private Product toProduct(ProductRequest request) {
        return new Product(request.name(), request.description(), request.price(), request.quantity());
    }

    private ResponseEntity<Object> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
    }

    public record ProductRequest(String name, String description, double price, int quantity) {
    }
}