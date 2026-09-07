package com.example.ecommerce_api.controller;

import com.example.ecommerce_api.entity.CartItem;
import com.example.ecommerce_api.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<?> getCart(@RequestHeader(value = "X-User-Email", required = false) String email) {
        try {
            return ResponseEntity.ok(toResponses(cartService.getCart(email)));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> addToCart(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody AddToCartRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(toResponse(cartService.addToCart(email, request.productId(), request.quantity())));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeFromCart(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long itemId) {
        try {
            return cartService.removeFromCart(email, itemId)
                    ? ResponseEntity.noContent().build()
                    : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private List<CartItemResponse> toResponses(List<CartItem> items) {
        return items.stream().map(this::toResponse).toList();
    }

    private CartItemResponse toResponse(CartItem item) {
        return new CartItemResponse(item.getId(), item.getProduct().getId(), item.getProduct().getName(),
                item.getProduct().getPrice(), item.getQuantity());
    }

    public record AddToCartRequest(Long productId, int quantity) {
    }

    public record CartItemResponse(Long id, Long productId, String productName, double price, int quantity) {
    }
}