package com.example.ecommerce_api.service;

import com.example.ecommerce_api.entity.Product;
import com.example.ecommerce_api.entity.User;
import com.example.ecommerce_api.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAllByDeletedFalse();
    }

    public Product getProductById(Long id) {
        return productRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<Product> getAllProductsForAdmin(Long ownerId) {
        return productRepository.findAllByOwnerId(ownerId);
    }

    public Product getProductForAdmin(Long id, Long ownerId) {
        return productRepository.findByIdAndOwnerId(id, ownerId).orElse(null);
    }

    public Product createProduct(Product product, User owner) {
        product.setOwner(owner);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Long ownerId, Product product) {

        Product existingProduct = productRepository.findByIdAndOwnerId(id, ownerId)
                .orElse(null);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setQuantity(product.getQuantity());

        return productRepository.save(existingProduct);
    }

    public boolean deleteProduct(Long id, Long ownerId) {
        Product product = productRepository.findByIdAndOwnerId(id, ownerId).orElse(null);
        if (product == null) {
            return false;
        }
        product.setDeleted(true);
        productRepository.save(product);
        return true;
    }

    public boolean restoreProduct(Long id, Long ownerId) {
        Product product = productRepository.findByIdAndOwnerId(id, ownerId).orElse(null);

        if (product == null) {
            return false;
        }

        product.setDeleted(false);
        productRepository.save(product);
        return true;
    }
}
