package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.AddToCartRequest;
import com.ecommerce.backend.dto.CartItemDto;
import com.ecommerce.backend.dto.CartResponseDto;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("50.00");
    private static final BigDecimal STANDARD_SHIPPING_FEE = new BigDecimal("5.99");

    @Transactional(readOnly = true)
    public CartResponseDto getCartForCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        List<CartItem> items = cartItemRepository.findByUser(user);

        List<CartItemDto> itemDtos = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : items) {
            Product p = item.getProduct();
            BigDecimal itemSubtotal = p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);
            totalItems += item.getQuantity();

            itemDtos.add(new CartItemDto(
                    item.getId(),
                    p.getId(),
                    p.getName(),
                    p.getImageUrl(),
                    p.getCategory(),
                    p.getPrice(),
                    item.getQuantity(),
                    p.getStockQuantity(),
                    itemSubtotal
            ));
        }

        BigDecimal shippingFee = BigDecimal.ZERO;
        if (totalItems > 0) {
            shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : STANDARD_SHIPPING_FEE;
        }
        BigDecimal total = subtotal.add(shippingFee);

        return new CartResponseDto(itemDtos, totalItems, subtotal, shippingFee, total);
    }

    @Transactional
    public CartResponseDto addToCart(AddToCartRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStockQuantity() <= 0) {
            throw new BadRequestException("Product is out of stock!");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProductId(user, product.getId());
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStockQuantity()) {
                throw new BadRequestException("Cannot add more than available stock (" + product.getStockQuantity() + ")");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            if (request.getQuantity() > product.getStockQuantity()) {
                throw new BadRequestException("Cannot add more than available stock (" + product.getStockQuantity() + ")");
            }
            CartItem newItem = new CartItem(user, product, request.getQuantity());
            cartItemRepository.save(newItem);
        }

        return getCartForCurrentUser();
    }

    @Transactional
    public CartResponseDto updateQuantity(Long itemId, int quantity) {
        User user = authService.getCurrentAuthenticatedUser();
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            Product product = cartItem.getProduct();
            if (quantity > product.getStockQuantity()) {
                throw new BadRequestException("Quantity exceeds available stock (" + product.getStockQuantity() + ")");
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return getCartForCurrentUser();
    }

    @Transactional
    public CartResponseDto removeItem(Long itemId) {
        User user = authService.getCurrentAuthenticatedUser();
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(cartItem);
        return getCartForCurrentUser();
    }

    @Transactional
    public void clearCart() {
        User user = authService.getCurrentAuthenticatedUser();
        cartItemRepository.deleteByUser(user);
    }
}
