# NovaMart — Fullstack E-Commerce Platform

A production-grade, fully responsive fullstack e-commerce web application built with **Spring Boot 3**, **React 18**, **MySQL**, and **JWT Authentication**.

---

## 🌟 Key Features

- **JWT Authentication & Role-Based Access Control**:
  - **Customer Role (`ROLE_USER`)**: Register, login, view profile, manage cart, place instant orders, and view current & past order history.
  - **Admin Role (`ROLE_ADMIN`)**: Dedicated Admin Portal to create, update, and delete products, plus monitor and update customer order statuses (`PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
  - **1-Click Demo Accounts**: Instant pre-filled login buttons for both Admin and Customer in the login modal.
- **Dynamic Product Catalog**:
  - Live search across product names and descriptions.
  - Category filter pills (Electronics, Fashion, Home & Office, Accessories, etc.).
  - Price and rating sorting (Low to High, High to Low, Newest, Top Rated).
  - High-res product images with responsive cards, stock indicators, and quick-view modals.
- **Cart & Instant 1-Click Buy (No Payment Gateway Required)**:
  - Slide-out cart drawer with item thumbnail, quantity controls, and free shipping tracker ($50 threshold).
  - **Direct Auto-Purchase**: As specified in requirements, clicking **"Buy Now"** completes the order automatically without requiring credit cards or payment gateways. Product stock is instantly updated, payment status is recorded as **PAID**, and cart is cleared.
- **Order Tracking (Current & Past Orders)**:
  - **Current Orders Tab**: Real-time 4-step delivery progress bar (`Order Placed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
  - **Past Orders Tab**: Displays delivered or archived orders with full item breakdowns and receipts.
- **Admin Management Portal**:
  - Live metric dashboards for Total Revenue, Total Customer Orders, and Catalog Count.
  - Add / Edit / Delete products modal dialog.
  - Live order status updater.

---

## 🔑 Default Seeded Accounts

The application automatically seeds the following accounts upon initial boot:

| Role | Email | Password | Privileges |
|---|---|---|---|
| **Administrator** | `admin@ecommerce.com` | `admin123` | Full Admin Portal, Product CRUD, Order Status Management |
| **Customer User** | `user@ecommerce.com` | `user123` | Shopping Cart, 1-Click Buy, Current & Past Order History |

*Note: You can also click the quick **"Demo User"** or **"Demo Admin"** buttons inside the sign-in modal to log in with 1 click.*

---

## 🚀 How to Run

### 1. Start the Spring Boot Backend

Run the startup script:
```bash
./start-backend.sh
```
- **If MySQL is running on port 3306**: It will connect directly to MySQL (`jdbc:mysql://localhost:3306/ecommerce_db`).
- **If MySQL is not running on your machine**: The script automatically falls back to the built-in database (in MySQL compatibility mode) so the application **never crashes** and starts immediately in ~1.5 seconds!
- **To explicitly use MySQL**: Ensure MySQL is started (`brew services start mysql` or MySQL Workbench) and run:
  ```bash
  ./start-backend.sh mysql
  ```

*(The backend will be available at `http://localhost:8080`)*

---

### 2. Start the React Frontend

In a separate terminal tab:
```bash
./start-frontend.sh
# Or manually:
cd frontend && npm run dev
```
Open your browser at **`http://localhost:5173`**.

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Login and receive JWT token + role
- `GET /api/auth/me` — Get current logged-in user details

### Products (`/api/products`)
- `GET /api/products` — List all products (supports `?category=...&search=...&sort=...`)
- `GET /api/products/{id}` — Get single product details
- `GET /api/products/categories` — List distinct categories
- `POST /api/products` — *(Admin)* Create a new product
- `PUT /api/products/{id}` — *(Admin)* Update an existing product
- `DELETE /api/products/{id}` — *(Admin)* Delete a product

### Shopping Cart (`/api/cart`)
- `GET /api/cart` — Get logged-in user's cart items, subtotal, and shipping fee
- `POST /api/cart` — Add product to cart or increment quantity
- `PUT /api/cart/{itemId}` — Update quantity
- `DELETE /api/cart/{itemId}` — Remove item
- `DELETE /api/cart` — Clear entire cart

### Orders (`/api/orders`)
- `POST /api/orders/checkout` — **Instant 1-Click Buy**: Places order, clears cart, deducts stock, sets paymentStatus to `PAID`
- `GET /api/orders/my-orders?type=all|current|past` — Get user's orders with current vs past filtering
- `GET /api/orders/{id}` — View order details
- `GET /api/orders` — *(Admin)* View all customer orders
- `PUT /api/orders/{id}/status` — *(Admin)* Update order status (`PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
