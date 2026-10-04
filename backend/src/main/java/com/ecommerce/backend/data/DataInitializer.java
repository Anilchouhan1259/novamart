package com.ecommerce.backend.data;

import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Checking database initialization...");

        User adminUser = null;
        User regularUser = null;

        // 1. Seed Users if not present
        if (!userRepository.existsByEmail("admin@ecommerce.com")) {
            adminUser = new User(
                    "admin@ecommerce.com",
                    passwordEncoder.encode("admin123"),
                    "Admin Manager",
                    "100 Tech Blvd, Silicon Valley, CA 94025",
                    "+1 555-0100",
                    Role.ROLE_ADMIN
            );
            userRepository.save(adminUser);
            logger.info("Created default Admin: admin@ecommerce.com / admin123");
        } else {
            adminUser = userRepository.findByEmail("admin@ecommerce.com").orElse(null);
        }

        if (!userRepository.existsByEmail("user@ecommerce.com")) {
            regularUser = new User(
                    "user@ecommerce.com",
                    passwordEncoder.encode("user123"),
                    "Alex Morgan",
                    "742 Evergreen Terrace, Springfield, IL 62704",
                    "+1 555-0199",
                    Role.ROLE_USER
            );
            userRepository.save(regularUser);
            logger.info("Created default User: user@ecommerce.com / user123");
        } else {
            regularUser = userRepository.findByEmail("user@ecommerce.com").orElse(null);
        }

        // 2. Seed Products if empty
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                    new Product(
                            "Sony WH-1000XM5 Wireless Headphones",
                            "Industry-leading noise cancellation with two processors and 8 microphones. Ultra-comfortable lightweight design with soft fit leather and up to 30 hours battery life.",
                            new BigDecimal("399.99"),
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                            "Electronics",
                            25,
                            4.9,
                            true
                    ),
                    new Product(
                            "Apple MacBook Air M3 15-inch",
                            "Strikingly thin design with blazing-fast Apple M3 chip, Liquid Retina display, 18 hours of battery life, 1080p FaceTime HD camera, and MagSafe charging.",
                            new BigDecimal("1299.00"),
                            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
                            "Electronics",
                            15,
                            4.8,
                            true
                    ),
                    new Product(
                            "Mechanical RGB Gaming Keyboard",
                            "Custom hot-swappable tactile switches, double-shot PBT keycaps, per-key RGB backlighting, aircraft-grade aluminum top frame, and detachable USB-C cable.",
                            new BigDecimal("89.99"),
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
                            "Electronics",
                            40,
                            4.6,
                            false
                    ),
                    new Product(
                            "Minimalist Classic Chronograph Watch",
                            "Sleek stainless steel case with genuine Italian leather strap, scratch-resistant sapphire crystal glass, Japanese quartz movement, and 50m water resistance.",
                            new BigDecimal("135.50"),
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                            "Fashion",
                            30,
                            4.7,
                            true
                    ),
                    new Product(
                            "Ergonomic Breathable Mesh Desk Chair",
                            "Multi-adjustable lumbar support, 3D armrests, dynamic recline lock, and high-density pneumatic cylinder for supreme all-day posture comfort.",
                            new BigDecimal("249.00"),
                            "https://images.unsplash.com/photo-1580481077195-c990264b19db?w=800&auto=format&fit=crop&q=80",
                            "Home & Office",
                            18,
                            4.5,
                            false
                    ),
                    new Product(
                            "Vintage Washed Denim Trucker Jacket",
                            "Crafted from premium 100% durable cotton denim, classic button flap chest pockets, adjustable waist tabs, and timeless relaxed silhouette.",
                            new BigDecimal("79.99"),
                            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
                            "Fashion",
                            50,
                            4.4,
                            false
                    ),
                    new Product(
                            "Smart Health & Fitness Tracker Ultra",
                            "High-precision AMOLED display, continuous heart rate and SpO2 tracking, sleep coach, built-in GPS, 100+ sport modes, and 12-day battery lifespan.",
                            new BigDecimal("189.95"),
                            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
                            "Electronics",
                            35,
                            4.7,
                            true
                    ),
                    new Product(
                            "Artisan Ceramic Pour-Over Coffee Set",
                            "Handcrafted matte finish ceramic dripper, thermal glass serving carafe, heat-resistant collar, and 40 natural unbleached paper filters.",
                            new BigDecimal("45.00"),
                            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
                            "Home & Office",
                            60,
                            4.8,
                            false
                    ),
                    new Product(
                            "Pro Noise-Cancelling Wireless Earbuds",
                            "Spatial audio with dynamic head tracking, transparency mode, IPX4 sweat and water resistance, and wireless fast charging case with 28h playtime.",
                            new BigDecimal("149.00"),
                            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
                            "Electronics",
                            45,
                            4.6,
                            false
                    ),
                    new Product(
                            "Heavyweight Canvas Weekend Travel Duffel",
                            "Water-resistant waxed cotton canvas, vegetable-tanned leather accents, dedicated shoe compartment, and removable padded shoulder strap.",
                            new BigDecimal("85.00"),
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
                            "Fashion",
                            22,
                            4.9,
                            true
                    ),
                    new Product(
                            "UltraWide 34-Inch Curved Monitor",
                            "WQHD 3440 x 1440 resolution, 144Hz refresh rate, 1ms response time, HDR400, USB-C 90W power delivery, and height-adjustable ergonomic stand.",
                            new BigDecimal("499.00"),
                            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
                            "Electronics",
                            12,
                            4.9,
                            false
                    ),
                    new Product(
                            "Ultrasonic Aromatherapy Essential Oil Diffuser",
                            "Natural wood grain exterior, 500ml capacity, 7 soothing ambient LED lighting colors, whisper-quiet operation, and waterless auto-shutoff.",
                            new BigDecimal("34.99"),
                            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
                            "Home & Office",
                            70,
                            4.5,
                            false
                    )
            );

            productRepository.saveAll(products);
            logger.info("Successfully seeded {} products.", products.size());

            // 3. Seed sample orders for regular user so they can immediately inspect current and past orders!
            if (regularUser != null && orderRepository.count() == 0) {
                Product pHeadphones = products.get(0);
                Product pWatch = products.get(3);
                Product pCoffee = products.get(7);

                // Past / Delivered Order
                Order pastOrder = new Order(
                        "ORD-20260920-PAST01",
                        regularUser,
                        pCoffee.getPrice(),
                        OrderStatus.DELIVERED,
                        "PAID (Instant Auto-Payment)",
                        regularUser.getAddress(),
                        "Springfield",
                        "62704",
                        regularUser.getPhone()
                );
                pastOrder.setOrderDate(LocalDateTime.now().minusDays(14));
                OrderItem item1 = new OrderItem(pastOrder, pCoffee, pCoffee.getName(), pCoffee.getImageUrl(), pCoffee.getPrice(), 1);
                pastOrder.addItem(item1);
                orderRepository.save(pastOrder);

                // Current / Processing Order
                BigDecimal currentTotal = pHeadphones.getPrice().add(pWatch.getPrice());
                Order currentOrder = new Order(
                        "ORD-20261002-CURR02",
                        regularUser,
                        currentTotal,
                        OrderStatus.PROCESSING,
                        "PAID (Instant Auto-Payment)",
                        regularUser.getAddress(),
                        "Springfield",
                        "62704",
                        regularUser.getPhone()
                );
                currentOrder.setOrderDate(LocalDateTime.now().minusHours(5));
                OrderItem item2 = new OrderItem(currentOrder, pHeadphones, pHeadphones.getName(), pHeadphones.getImageUrl(), pHeadphones.getPrice(), 1);
                OrderItem item3 = new OrderItem(currentOrder, pWatch, pWatch.getName(), pWatch.getImageUrl(), pWatch.getPrice(), 1);
                currentOrder.addItem(item2);
                currentOrder.addItem(item3);
                orderRepository.save(currentOrder);

                logger.info("Seeded 1 past order (DELIVERED) and 1 current order (PROCESSING) for user demo.");
            }
        }
    }
}
