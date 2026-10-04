package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
    
    List<Order> findAllByOrderByOrderDateDesc();

    @Query("SELECT o FROM Order o WHERE o.user = :user AND o.status IN :statuses ORDER BY o.orderDate DESC")
    List<Order> findByUserAndStatusIn(@Param("user") User user, @Param("statuses") List<OrderStatus> statuses);
}
