package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CheckoutRequest;
import com.ecommerce.backend.dto.OrderDto;
import com.ecommerce.backend.dto.OrderItemDto;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("50.00");
    private static final BigDecimal STANDARD_SHIPPING_FEE = new BigDecimal("5.99");

    @Transactional
    public OrderDto checkout(CheckoutRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cannot checkout: Shopping cart is empty!");
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        // Verify stock for all items first
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName() +
                        ". Available: " + product.getStockQuantity() + ", requested: " + item.getQuantity());
            }
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : STANDARD_SHIPPING_FEE;
        BigDecimal grandTotal = subtotal.add(shippingFee);

        String shippingAddress = (request.getShippingAddress() != null && !request.getShippingAddress().trim().isEmpty())
                ? request.getShippingAddress().trim()
                : (user.getAddress() != null ? user.getAddress() : "Standard Delivery Address");

        String orderNumber = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        // Direct purchase with no payment method required (auto-bought as requested)
        Order order = new Order(
                orderNumber,
                user,
                grandTotal,
                OrderStatus.PROCESSING,
                "PAID (Instant Auto-Payment)",
                shippingAddress,
                request.getShippingCity(),
                request.getShippingZip(),
                request.getContactPhone() != null ? request.getContactPhone() : user.getPhone()
        );

        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            // Deduct product stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getName(),
                    product.getImageUrl(),
                    product.getPrice(),
                    item.getQuantity()
            );
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful order creation
        cartItemRepository.deleteByUser(user);

        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getMyOrders(String type) {
        User user = authService.getCurrentAuthenticatedUser();
        List<Order> orders;

        if ("current".equalsIgnoreCase(type)) {
            orders = orderRepository.findByUserAndStatusIn(user, List.of(OrderStatus.PROCESSING, OrderStatus.SHIPPED));
        } else if ("past".equalsIgnoreCase(type)) {
            orders = orderRepository.findByUserAndStatusIn(user, List.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED));
        } else {
            orders = orderRepository.findByUserOrderByOrderDateDesc(user);
        }

        return orders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = order.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new BadRequestException("Unauthorized access to order details");
        }

        return mapToDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();
        return orders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToDto(updated);
    }

    public OrderDto mapToDto(Order order) {
        List<OrderItemDto> itemDtos = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                itemDtos.add(new OrderItemDto(
                        item.getId(),
                        item.getProduct() != null ? item.getProduct().getId() : null,
                        item.getProductName(),
                        item.getProductImage(),
                        item.getPrice(),
                        item.getQuantity(),
                        subtotal
                ));
            }
        }

        boolean isCurrent = order.getStatus() == OrderStatus.PROCESSING || order.getStatus() == OrderStatus.SHIPPED;

        return new OrderDto(
                order.getId(),
                order.getOrderNumber(),
                order.getUser().getId(),
                order.getUser().getEmail(),
                order.getUser().getFullName(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentStatus(),
                order.getShippingAddress(),
                order.getShippingCity(),
                order.getShippingZip(),
                order.getContactPhone(),
                isCurrent,
                itemDtos
        );
    }
}
