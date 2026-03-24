-- J Tower Admin System - MySQL Database Schema
-- Database: jtower
-- Import via phpMyAdmin or: mysql -u root -p jtower < jtower.sql

CREATE DATABASE IF NOT EXISTS jtower;
USE jtower;

CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    full_name  VARCHAR(255) NOT NULL,
    role       VARCHAR(50) NOT NULL DEFAULT 'staff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incident_reports (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    ref_number      VARCHAR(50) NOT NULL UNIQUE,
    date            DATE,
    location        VARCHAR(255),
    incident_title  VARCHAR(255),
    department      VARCHAR(100),
    image_path      VARCHAR(255),
    prepared_by     VARCHAR(255),
    noted_by        VARCHAR(255),
    received_by     VARCHAR(255),
    description     TEXT,
    status          VARCHAR(50) DEFAULT 'Open',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transmittal_reports (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    ref_number      VARCHAR(50) NOT NULL UNIQUE,
    date            DATE,
    to_party        VARCHAR(255),
    from_party      VARCHAR(255),
    subject         VARCHAR(255),
    document_count  INT DEFAULT 1,
    prepared_by     VARCHAR(255),
    received_by     VARCHAR(255),
    remarks         TEXT,
    status          VARCHAR(50) DEFAULT 'Pending',
    image_path      VARCHAR(255),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress_reports (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    ref_number      VARCHAR(50) NOT NULL UNIQUE,
    date            DATE,
    department      VARCHAR(100),
    employee_name   VARCHAR(255),
    employee_position VARCHAR(255),
    reporting_period VARCHAR(255),
    work_accomplishments TEXT,
    tasks_completed TEXT,
    issues_concerns TEXT,
    actions_taken   TEXT,
    planned_tasks   TEXT,
    remarks         TEXT,
    reviewed_by     VARCHAR(255),
    reviewer_position VARCHAR(255),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS explanation_reports (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    ref_number      VARCHAR(50) NOT NULL UNIQUE,
    date            DATE,
    location        VARCHAR(255),
    department      VARCHAR(100),
    status          VARCHAR(50) DEFAULT 'Pending',
    description     TEXT,
    prepared_by     VARCHAR(255),
    received_by     VARCHAR(255),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS unit_turnover (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    control_number  VARCHAR(50) NOT NULL UNIQUE,
    unit_number     VARCHAR(50),
    unit_owner_name VARCHAR(255),
    to_date         DATE,
    unit_type       VARCHAR(100),
    tower_floor     VARCHAR(100),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default users (password = SHA256 hash)
-- admin / admin123
-- mresilosa / hoku2024
INSERT IGNORE INTO users (username, password, full_name, role) VALUES
('admin',     SHA2('admin123', 256), 'Administrator',       'admin'),
('mresilosa', SHA2('hoku2024', 256), 'Michael P. Resilosa', 'manager');
