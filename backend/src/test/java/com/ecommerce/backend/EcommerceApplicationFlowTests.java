package com.ecommerce.backend;

import com.ecommerce.backend.dto.*;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.service.AuthService;
import com.ecommerce.backend.service.CartService;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class EcommerceApplicationFlowTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Test
    void testAuthProductCartAndOrderFlow() {
        // 1. Verify seeded products exist
        List<ProductDto> products = productService.getProducts(null, null, "newest");
        assertFalse(products.isEmpty(), "Products should be seeded");
        ProductDto firstProduct = products.get(0);

        // 2. Authenticate as regular user
        AuthResponse loginResponse = authService.authenticateUser(
                new LoginRequest("user@ecommerce.com", "user123")
        );
        assertNotNull(loginResponse.getToken(), "Token should not be null");
        assertEquals("ROLE_USER", loginResponse.getRole());

        // Set security context for user operations
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(loginResponse.getEmail(), null, List.of())
        );

        // 3. Add product to cart
        CartResponseDto cart = cartService.addToCart(new AddToCartRequest(firstProduct.getId(), 2));
        assertFalse(cart.getItems().isEmpty(), "Cart should contain items");
        assertEquals(2, cart.getTotalItems());

        // 4. Checkout (direct 1-click buy without payment gateway)
        CheckoutRequest checkoutReq = new CheckoutRequest(
                "123 Test Street",
                "San Francisco",
                "94103",
                "+1 555-9876"
        );
        OrderDto order = orderService.checkout(checkoutReq);
        assertNotNull(order, "Order should be created");
        assertEquals(OrderStatus.PROCESSING, order.getStatus());
        assertTrue(order.getPaymentStatus().contains("PAID"));
        assertTrue(order.isCurrentOrder(), "New order should be marked as current");

        // 5. Verify cart is cleared after checkout
        CartResponseDto cartAfter = cartService.getCartForCurrentUser();
        assertEquals(0, cartAfter.getTotalItems(), "Cart should be empty after checkout");

        // 6. Verify user can see current orders and past orders
        List<OrderDto> myOrders = orderService.getMyOrders("all");
        assertFalse(myOrders.isEmpty(), "User orders should be retrievable");

        List<OrderDto> currentOrders = orderService.getMyOrders("current");
        assertFalse(currentOrders.isEmpty(), "Current orders should contain the new order");

        List<OrderDto> pastOrders = orderService.getMyOrders("past");
        assertFalse(pastOrders.isEmpty(), "Past orders should contain the seeded delivered order");
    }
}
