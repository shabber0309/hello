-- =================================================================
-- Live Fix: Live Camera Monitored Hardware Service
-- Production Database Schema (MySQL 8.0+)
-- =================================================================

DROP DATABASE IF EXISTS livefix_db;
CREATE DATABASE livefix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE livefix_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) UNIQUE NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'technician', 'admin') NOT NULL DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. LAPTOP REPAIR ORDERS TABLE
CREATE TABLE IF NOT EXISTS laptop_repair_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(32) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    technician_id INT NULL,
    laptop_brand VARCHAR(50) NOT NULL,
    laptop_model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100),
    issue_category VARCHAR(100) NOT NULL,
    issue_description TEXT,
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(50) DEFAULT 'Hyderabad',
    pickup_slot VARCHAR(100) NOT NULL,
    tamper_seal_code VARCHAR(50),
    status ENUM('Order Placed', 'Picked Up', 'In Repair', 'Repaired & Awaiting Payment', 'Delivered') NOT NULL DEFAULT 'Order Placed',
    quote_amount DECIMAL(10, 2) DEFAULT 0.00,
    quote_approved BOOLEAN DEFAULT FALSE,
    technician_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_order_status (status),
    INDEX idx_customer_orders (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. STREAM SESSIONS TABLE (Google Meet / WebRTC Live Camera Link)
CREATE TABLE IF NOT EXISTS stream_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    meet_url VARCHAR(255) NOT NULL,
    stream_key VARCHAR(64),
    is_live BOOLEAN DEFAULT FALSE,
    started_at DATETIME,
    ended_at DATETIME,
    current_milestone VARCHAR(100) DEFAULT 'Unsealing & Initial Inspection',
    camera_source VARCHAR(50) DEFAULT 'Overhead Bench 4K',
    FOREIGN KEY (order_id) REFERENCES laptop_repair_orders(id) ON DELETE CASCADE,
    INDEX idx_stream_order (order_id),
    INDEX idx_stream_live (is_live)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. PART REPLACEMENT LOGS (On-Camera Verification & Serial Audit)
CREATE TABLE IF NOT EXISTS part_replacement_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    part_name VARCHAR(120) NOT NULL,
    old_serial_no VARCHAR(100),
    new_serial_no VARCHAR(100),
    verified_on_camera BOOLEAN DEFAULT TRUE,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES laptop_repair_orders(id) ON DELETE CASCADE,
    INDEX idx_parts_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. PAYMENTS & TAMPER WARRANTY
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(40) DEFAULT 'UPI',
    transaction_id VARCHAR(64) NOT NULL UNIQUE,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Completed',
    paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    warranty_code VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES laptop_repair_orders(id) ON DELETE CASCADE,
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_txn (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TRIGGERS: Auto-audit status changes
DELIMITER //
CREATE TRIGGER before_order_status_update
BEFORE UPDATE ON laptop_repair_orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'In Repair' AND OLD.status != 'In Repair' THEN
        -- Order moved to live repair
        SET NEW.updated_at = NOW();
    END IF;
END; //
DELIMITER ;
