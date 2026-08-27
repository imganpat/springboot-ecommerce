package com.example.ecommerce_api.service;

import com.example.ecommerce_api.entity.Product;
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

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {

        Product existingProduct = productRepository.findById(id)
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

    public boolean deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            return false;
        }

        Product product = productRepository.findById(id).orElseThrow();
        product.setDeleted(true);
        productRepository.save(product);
        return true;
    }

    public boolean restoreProduct(Long id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product == null) {
            return false;
        }

        product.setDeleted(false);
        productRepository.save(product);
        return true;
    }
}