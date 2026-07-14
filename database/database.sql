CREATE DATABASE disaster_relief_db;

USE disaster_relief_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address VARCHAR(500) NOT NULL,
    role ENUM('admin', 'victim') NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE shelters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_shelters_capacity CHECK (capacity >= 0),
    CONSTRAINT chk_shelters_occupancy CHECK (
        current_occupancy >= 0 AND current_occupancy <= capacity
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE supplies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_supplies_quantity CHECK (quantity >= 0),
    INDEX idx_supplies_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE relief_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    shelter_id INT NOT NULL,
    priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    status ENUM('Pending', 'Approved', 'Completed', 'Rejected') NOT NULL DEFAULT 'Pending',
    remarks TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_relief_requests_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_relief_requests_shelter
        FOREIGN KEY (shelter_id) REFERENCES shelters(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_relief_requests_user (user_id),
    INDEX idx_relief_requests_shelter (shelter_id),
    INDEX idx_relief_requests_status_priority (status, priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE distributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL UNIQUE,
    distributed_by INT NOT NULL,
    distribution_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    CONSTRAINT fk_distributions_request
        FOREIGN KEY (request_id) REFERENCES relief_requests(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_distributions_distributed_by
        FOREIGN KEY (distributed_by) REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_distributions_distributed_by (distributed_by),
    INDEX idx_distributions_date (distribution_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE distribution_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    distribution_id INT NOT NULL,
    supply_id INT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT chk_distribution_items_quantity CHECK (quantity > 0),
    CONSTRAINT uq_distribution_items_distribution_supply
        UNIQUE (distribution_id, supply_id),
    CONSTRAINT fk_distribution_items_distribution
        FOREIGN KEY (distribution_id) REFERENCES distributions(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_distribution_items_supply
        FOREIGN KEY (supply_id) REFERENCES supplies(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_distribution_items_supply (supply_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (full_name, email, password, phone, address, role) VALUES
    ('System Administrator', 'admin@disasterrelief.org', '$2b$10$sampleAdminHashForDevelopmentOnly', '+8801700000001', 'Dhaka Relief Operations Center', 'admin'),
    ('Ayesha Rahman', 'ayesha.rahman@example.com', '$2b$10$sampleVictimHash000000000000001', '+8801700000002', 'Mirpur, Dhaka', 'victim'),
    ('Karim Hasan', 'karim.hasan@example.com', '$2b$10$sampleVictimHash000000000000002', '+8801700000003', 'Uttara, Dhaka', 'victim'),
    ('Nusrat Jahan', 'nusrat.jahan@example.com', '$2b$10$sampleVictimHash000000000000003', '+8801700000004', 'Mohammadpur, Dhaka', 'victim'),
    ('Rafiq Ahmed', 'rafiq.ahmed@example.com', '$2b$10$sampleVictimHash000000000000004', '+8801700000005', 'Dhanmondi, Dhaka', 'victim'),
    ('Salma Begum', 'salma.begum@example.com', '$2b$10$sampleVictimHash000000000000005', '+8801700000006', 'Badda, Dhaka', 'victim');

INSERT INTO shelters (name, location, contact_number, capacity, current_occupancy) VALUES
    ('Dhaka Central Shelter', 'Tejgaon, Dhaka', '+8801800000001', 500, 320),
    ('Mirpur Community Shelter', 'Mirpur-10, Dhaka', '+8801800000002', 300, 185),
    ('Uttara Emergency Shelter', 'Sector 7, Uttara, Dhaka', '+8801800000003', 250, 142);

INSERT INTO supplies (name, category, description, quantity, unit) VALUES
    ('Rice', 'Food', 'Five-kilogram rice bags remaining in inventory.', 180, 'bag'),
    ('Lentils', 'Food', 'One-kilogram lentil packets remaining in inventory.', 140, 'packet'),
    ('Bottled Water', 'Water', 'One-litre sealed drinking-water bottles remaining in inventory.', 420, 'bottle'),
    ('Oral Rehydration Salts', 'Medical', 'Oral rehydration sachets remaining in inventory.', 250, 'sachet'),
    ('First Aid Kit', 'Medical', 'Standard household first-aid kits remaining in inventory.', 75, 'kit'),
    ('Blanket', 'Shelter', 'Warm blankets remaining in inventory.', 110, 'piece'),
    ('Hygiene Kit', 'Hygiene', 'Personal hygiene kits remaining in inventory.', 95, 'kit'),
    ('Baby Food', 'Food', 'Infant cereal containers remaining in inventory.', 60, 'container'),
    ('Sanitary Pads', 'Hygiene', 'Sanitary-pad packets remaining in inventory.', 160, 'packet'),
    ('Flashlight', 'Equipment', 'Battery-powered flashlights remaining in inventory.', 45, 'piece');

INSERT INTO relief_requests (user_id, shelter_id, priority, status, remarks, created_at) VALUES
    (2, 1, 'High', 'Completed', 'Food, water, and blankets requested for a family of four.', '2026-07-10 09:15:00'),
    (3, 2, 'Medium', 'Completed', 'Request for hygiene supplies and drinking water.', '2026-07-10 11:30:00'),
    (4, 3, 'High', 'Completed', 'Urgent request for medical and food supplies.', '2026-07-11 08:45:00'),
    (5, 1, 'Medium', 'Pending', 'Request awaiting assessment.', '2026-07-12 14:20:00'),
    (6, 2, 'Low', 'Rejected', 'Duplicate request; assistance already provided.', '2026-07-12 16:05:00');

INSERT INTO distributions (request_id, distributed_by, distribution_date, notes) VALUES
    (1, 1, '2026-07-10 15:00:00', 'Items handed over at Dhaka Central Shelter.'),
    (2, 1, '2026-07-10 16:30:00', 'Items handed over at Mirpur Community Shelter.'),
    (3, 1, '2026-07-11 13:15:00', 'Urgent medical and food supplies handed over at Uttara Emergency Shelter.');

INSERT INTO distribution_items (distribution_id, supply_id, quantity) VALUES
    (1, 1, 20),
    (1, 3, 48),
    (1, 6, 8),
    (2, 3, 36),
    (2, 7, 10),
    (2, 9, 12),
    (3, 1, 15),
    (3, 2, 10),
    (3, 4, 20),
    (3, 5, 5);
