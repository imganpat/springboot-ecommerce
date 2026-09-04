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
import java.util.ArrayList;
import java.util.List;

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
        User owner = findAdmin(email);
        if (owner == null) {
            return forbidden();
        }

        Product product = productService.getProductForAdmin(id, owner.getId());
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            String previousFilename = product.getImageFilename();
            product.setImageFilename(imageStorageService.store(image));
            Product savedProduct = productService.createProduct(product, owner);
            imageStorageService.delete(previousFilename);
            return ResponseEntity.ok(ProductResponse.from(savedProduct));
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
        User owner = findAdmin(email);
        if (owner == null) {
            return forbidden();
        }

        Product product = productService.getProductForAdmin(id, owner.getId());
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            String previousFilename = product.getImageFilename();
            product.setImageFilename(imageStorageService.store(new ByteArrayInputStream(image), contentType));
            Product savedProduct = productService.createProduct(product, owner);
            imageStorageService.delete(previousFilename);
            return ResponseEntity.ok(ProductResponse.from(savedProduct));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        } catch (IOException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to store image");
        }
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<Object> uploadProductImages(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestPart("images") MultipartFile[] images) {
        User owner = findAdmin(email);
        if (owner == null) {
            return forbidden();
        }

        Product product = productService.getProductForAdmin(id, owner.getId());
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        if (images == null || images.length == 0) {
            return ResponseEntity.badRequest().body("At least one image is required");
        }

        try {
            List<String> storedImages = new ArrayList<>();
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    storedImages.add(imageStorageService.store(image));
                }
            }

            if (storedImages.isEmpty()) {
                return ResponseEntity.badRequest().body("At least one valid image is required");
            }

            List<String> previousImages = new ArrayList<>(product.getImageFilenames());
            product.setImageFilenames(storedImages);
            Product savedProduct = productService.createProduct(product, owner);

            for (String previousImage : previousImages) {
                if (previousImage != null && !storedImages.contains(previousImage)) {
                    imageStorageService.delete(previousImage);
                }
            }

            return ResponseEntity.ok(ProductResponse.from(savedProduct));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        } catch (IOException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to store images");
        }
    }

    @GetMapping
    public ResponseEntity<Object> getAllProducts(
            @RequestHeader(value = "X-User-Email", required = false) String email) {
        User owner = findAdmin(email);
        if (owner == null) {
            return forbidden();
        }
        return ResponseEntity.ok(productService.getAllProductsForAdmin(owner.getId()).stream()
                .map(ProductResponse::from)
                .toList());
    }

    @PostMapping
    public ResponseEntity<Object> createProduct(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody ProductRequest request) {
        User owner = findAdmin(email);
        if (owner == null) {
            return forbidden();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProductResponse.from(productService.createProduct(toProduct(request), owner)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProduct(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestBody ProductRequest request) {
        User owner = findAdmin(email);
        if (owner == null) {
            return forbidden();
        }

        Product updatedProduct = productService.updateProduct(id, owner.getId(), toProduct(request));
        return updatedProduct == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(ProductResponse.from(updatedProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduct(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        User owner = findAdmin(email);
        if (owner == null) {
            return forbidden();
        }

        return productService.deleteProduct(id, owner.getId())
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<Object> restoreProduct(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        User owner = findAdmin(email);
        if (owner == null) {
            return forbidden();
        }

        return productService.restoreProduct(id, owner.getId())
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    private User findAdmin(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return userRepository.findByEmail(email.trim().toLowerCase())
                .filter(User::isAdmin)
                .orElse(null);
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