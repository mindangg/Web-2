DROP DATABASE IF EXISTS mobile_store;

CREATE DATABASE IF NOT EXISTS mobile_store;
USE mobile_store;

CREATE TABLE user_account
(
    user_account_id INT PRIMARY KEY AUTO_INCREMENT,
    username        VARCHAR(50) UNIQUE,
    password        VARCHAR(60), -- hash password 60 kí tự
    email           VARCHAR(50) UNIQUE,
    status          ENUM ('Hoạt động', 'Bị khóa') DEFAULT 'Hoạt động',
    is_delete       BOOLEAN                       DEFAULT FALSE,
    created_at      DATETIME                      DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE user_information
(
    user_information_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id          INT,
    full_name           VARCHAR(30),
    phone_number        VARCHAR(10),           -- Bỏ UNIQUE để hỗ trợ nhiều địa chỉ
    house_number        VARCHAR(10),
    street              VARCHAR(50),
    ward                VARCHAR(50),
    district            VARCHAR(50),
    city                VARCHAR(50),
    is_default          BOOLEAN DEFAULT FALSE, -- Thêm để đánh dấu địa chỉ mặc định
    FOREIGN KEY (account_id) REFERENCES user_account (user_account_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE brand
(
    brand_id   INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(30) NOT NULL
);

CREATE TABLE internal_option
(
    internal_option_id INT PRIMARY KEY AUTO_INCREMENT,
    storage            ENUM ('128GB', '256GB', '512GB', '1TB', '2TB'),
    ram                ENUM ('4GB', '6GB', '8GB', '10GB', '12GB', '16GB', '18GB')
);

CREATE TABLE color
(
    color_id INT PRIMARY KEY AUTO_INCREMENT,
    color    VARCHAR(30)
);

CREATE TABLE provider
(
    provider_id     INT PRIMARY KEY AUTO_INCREMENT,
    provider_name   VARCHAR(30),
    phone           VARCHAR(20),
    address         VARCHAR(255),
    email           VARCHAR(50),
    provider_status BOOLEAN DEFAULT TRUE
);

CREATE TABLE product
(
    product_id      INT PRIMARY KEY AUTO_INCREMENT,
    brand           INT,
    provider        INT,
    series          VARCHAR(50),
    name            VARCHAR(50),
    image           VARCHAR(255),
    cpu             VARCHAR(50),
    screen          VARCHAR(50),
    battery         VARCHAR(50),
    front_camera    VARCHAR(100),
    back_camera     VARCHAR(100),
    description     TEXT,
    base_price      INT     DEFAULT 0,
    release_date    DATE,
    warranty_period TINYINT,
    status          BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (brand) REFERENCES brand (brand_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (provider) REFERENCES provider (provider_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE sku
(
    sku_id        INT PRIMARY KEY AUTO_INCREMENT,
    product_id    INT,
    internal_id   INT,
    color_id      INT,
    sku_code      VARCHAR(255),
    sku_name      VARCHAR(255),
    image         VARCHAR(255),
    import_price  INT,
    invoice_price INT,
    sold          INT      DEFAULT 0,
    stock         INT      DEFAULT 0,
    update_date   DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (product_id) REFERENCES product (product_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (internal_id) REFERENCES internal_option (internal_option_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (color_id) REFERENCES color (color_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE receipt
(
    receipt_id          INT PRIMARY KEY AUTO_INCREMENT,
    account_id          INT,
    user_information_id INT,
    created_at          DATETIME                                                             DEFAULT CURRENT_TIMESTAMP,
    total_price         INT,
    status              ENUM ('pending','confirmed', 'cancelled', 'on_deliver', 'delivered') DEFAULT 'pending',
    payment_method ENUM('direct_payment', 'transfer_payment') DEFAULT 'direct_payment',
    FOREIGN KEY (account_id) REFERENCES user_account (user_account_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE receipt_detail
(
    detail_id  INT PRIMARY KEY AUTO_INCREMENT,
    receipt_id INT,
    sku_id     INT,
    quantity   INT,
    price      INT,
    FOREIGN KEY (receipt_id) REFERENCES receipt (receipt_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (sku_id) REFERENCES sku (sku_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE role
(
    role_id   INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(30)
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE functional
(
    functional_id INT PRIMARY KEY AUTO_INCREMENT,
    function_name VARCHAR(30)
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE role_function
(
    role_id     INT,
    function_id INT,
    action      ENUM ('Xem', 'Thêm', 'Xóa', 'Sửa'),
    PRIMARY KEY (role_id, function_id, action),
    FOREIGN KEY (role_id) REFERENCES role (role_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (function_id) REFERENCES functional (functional_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE employee
(
    employee_id  INT PRIMARY KEY AUTO_INCREMENT,
    full_name    VARCHAR(30),
    email        VARCHAR(50) UNIQUE,
    password     VARCHAR(60), -- hash password 60 kí tự
    phone_number VARCHAR(10) UNIQUE,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    role         INT,
    FOREIGN KEY (role) REFERENCES role (role_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE import
(
    import_id   INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    date        DATETIME                                                DEFAULT (CURRENT_TIMESTAMP),
    total       INT,
    provider_id INT,
    status      ENUM ('pending', 'confirmed', 'cancelled', 'on_deliver', 'delivered') DEFAULT 'pending',
    FOREIGN KEY (employee_id) REFERENCES employee (employee_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES provider (provider_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE import_detail
(
    import_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    import_id        INT,
    sku_id           INT,
    quantity         INT,
    price            INT,
    FOREIGN KEY (import_id) REFERENCES import (import_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (sku_id) REFERENCES sku (sku_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE imei
(
    imei              INT PRIMARY KEY AUTO_INCREMENT,
    receipt_detail_id INT,
    date              DATETIME DEFAULT CURRENT_TIMESTAMP,
    expired_date      DATE,
    status            ENUM('Hoạt động', 'Đang bảo hành', 'Hết hạn') NOT NULL DEFAULT 'Hoạt động',
    FOREIGN KEY (receipt_detail_id) REFERENCES receipt_detail (detail_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DELIMITER $$

CREATE TRIGGER trg_after_insert_sku
AFTER INSERT
ON sku
FOR EACH ROW
BEGIN
    UPDATE product
    SET base_price = (SELECT MIN(invoice_price)
                      FROM sku
                      WHERE product_id = NEW.product_id)
    WHERE product_id = NEW.product_id;
END$$

CREATE TRIGGER trg_after_update_sku
AFTER UPDATE
ON sku
FOR EACH ROW
BEGIN
    UPDATE product
    SET base_price = (SELECT MIN(invoice_price)
                      FROM sku
                      WHERE product_id = NEW.product_id)
    WHERE product_id = NEW.product_id;
END$$

CREATE TRIGGER trg_after_delete_sku
AFTER DELETE
ON sku
FOR EACH ROW
BEGIN
    UPDATE product
    SET base_price = IFNULL(
            (SELECT MIN(invoice_price)
             FROM sku
             WHERE product_id = OLD.product_id),
            0)
    WHERE product_id = OLD.product_id;
END$$

DELIMITER ;
