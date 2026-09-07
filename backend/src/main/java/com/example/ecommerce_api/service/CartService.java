package com.example.ecommerce_api.service;

import com.example.ecommerce_api.entity.CartItem;
import com.example.ecommerce_api.entity.Product;
import com.example.ecommerce_api.entity.User;
import com.example.ecommerce_api.repository.CartItemRepository;
import com.example.ecommerce_api.repository.ProductRepository;
import com.example.ecommerce_api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, UserRepository userRepository,
            ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCart(String email) {
        return cartItemRepository.findAllByUserId(findUser(email).getId());
    }

    public CartItem addToCart(String email, Long productId, int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        User user = findUser(email);
        Product product = productRepository.findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        CartItem item = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseGet(() -> new CartItem(user, product, 0));
        item.setQuantity(item.getQuantity() + quantity);
        return cartItemRepository.save(item);
    }

    public boolean removeFromCart(String email, Long itemId) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("User email is required");
        }

        CartItem item = cartItemRepository.findById(itemId).orElse(null);
        if (item == null || !item.getUser().getEmail().equalsIgnoreCase(email.trim())) {
            return false;
        }
        cartItemRepository.delete(item);
        return true;
    }

    private User findUser(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("User email is required");
        }
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}