package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.AddToCartRequest;
import com.ecommerce.backend.dto.CartResponseDto;
import com.ecommerce.backend.dto.UpdateCartRequest;
import com.ecommerce.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponseDto> getCart() {
        return ResponseEntity.ok(cartService.getCartForCurrentUser());
    }

    @PostMapping
    public ResponseEntity<CartResponseDto> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<CartResponseDto> updateQuantity(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(itemId, request.getQuantity()));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<CartResponseDto> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(itemId));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }
}
