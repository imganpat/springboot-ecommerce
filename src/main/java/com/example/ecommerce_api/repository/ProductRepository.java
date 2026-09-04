package com.example.ecommerce_api.repository;

import com.example.ecommerce_api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // @Query("SELECT p FROM Product p WHERE p.deleted = false")
    List<Product> findAllByDeletedFalse();

    List<Product> findAllByOwnerId(Long ownerId);

    Optional<Product> findByIdAndOwnerId(Long id, Long ownerId);

    Optional<Product> findByIdAndDeletedFalse(Long id);
}