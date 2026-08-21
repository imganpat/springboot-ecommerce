package com.example.ecommerce_api.repository;

import com.example.ecommerce_api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}