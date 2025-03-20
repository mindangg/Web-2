DROP DATABASE IF EXISTS mobile_store;

CREATE DATABASE IF NOT EXISTS mobile_store;
USE mobile_store;

CREATE TABLE user_account
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(50),
    email    VARCHAR(50)
);

CREATE TABLE user_information
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    account_id   INT,
    full_name    VARCHAR(30),
    address      VARCHAR(255),
    phone_number VARCHAR(10),
    FOREIGN KEY (account_id) REFERENCES user_account (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE brand
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE internal_option
(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    storage ENUM ('128GB', '256GB', '512GB', '1TB', '2TB'),
    ram     ENUM ('4GB', '6GB', '8GB', '10GB', '12GB', '16GB', '18GB')
);

CREATE TABLE color
(
    id    INT PRIMARY KEY AUTO_INCREMENT,
    color VARCHAR(30)
);

CREATE TABLE product
(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    brand           INT,
    series          VARCHAR(50),
    name            VARCHAR(50),
    image           VARCHAR(255),
    cpu             VARCHAR(50),
    screen          VARCHAR(50),
    battery         VARCHAR(50),
    front_camera    VARCHAR(100),
    back_camera     VARCHAR(100),
    description     TEXT,
    base_price      INT,
    release_date    DATE,
    warranty_period TINYINT,
    status          BOOLEAN,
    FOREIGN KEY (brand) REFERENCES brand (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE sku
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    product_id    INT,
    internal_id   INT,
    color_id      INT,
    sku_code      VARCHAR(255),
    sku_name      VARCHAR(255),
    image         VARCHAR(255),
    import_price  INT,
    invoice_price INT,
    sold          INT,
    stock         TINYINT,
    update_date   DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (product_id) REFERENCES product (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (internal_id) REFERENCES internal_option (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (color_id) REFERENCES color (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE receipt
(
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    account_id          INT,
    user_information_id INT,
    date                DATETIME DEFAULT (CURRENT_TIMESTAMP),
    total_price         INT,
    status              ENUM ('pending', 'cancelled', 'on deliver', 'delivered'),
    FOREIGN KEY (account_id) REFERENCES user_account (id)
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
    FOREIGN KEY (receipt_id) REFERENCES receipt (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (sku_id) REFERENCES sku (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE role
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(30)
);

CREATE TABLE functional
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    function_name VARCHAR(30)
);

CREATE TABLE role_function
(
    role_id     INT,
    function_id INT,
    action      VARCHAR(30),
    PRIMARY KEY (role_id, function_id),
    FOREIGN KEY (role_id) REFERENCES role (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (function_id) REFERENCES functional (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE employee
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    account_id    INT,
    email         VARCHAR(50) UNIQUE,
    gender        BOOLEAN,
    date_of_birth DATE,
    phone_number  VARCHAR(10),
    address       VARCHAR(255),
    role          INT,
    FOREIGN KEY (role) REFERENCES role (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE provider
(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    name    VARCHAR(30),
    phone   VARCHAR(20),
    address VARCHAR(255)
);

CREATE TABLE import
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    date        DATETIME DEFAULT (CURRENT_TIMESTAMP),
    total       INT,
    provider_id INT,
    FOREIGN KEY (employee_id) REFERENCES employee (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES provider (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE import_detail
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    import_id INT,
    sku_id    INT,
    quantity  INT,
    price     INT,
    FOREIGN KEY (import_id) REFERENCES import (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (sku_id) REFERENCES sku (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE imei
(
    imei              VARCHAR(20) PRIMARY KEY,
    sku_id            INT,
    receipt_detail_id INT,
    import_detail_id  INT,
    expired_date      DATE,
    FOREIGN KEY (sku_id) REFERENCES sku (id),
    FOREIGN KEY (receipt_detail_id) REFERENCES receipt_detail (detail_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (import_detail_id) REFERENCES import_detail (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE warranty_detail
(
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    employee_id         INT,
    user_information_id INT,
    receipt_id          INT,
    imei                VARCHAR(20),
    date                DATE DEFAULT (CURRENT_DATE),
    status              ENUM ('Pending', 'Success', 'Decline'),
    FOREIGN KEY (employee_id) REFERENCES employee (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (user_information_id) REFERENCES user_information (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (receipt_id) REFERENCES receipt (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (imei) REFERENCES imei (imei)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

SELECT *
FROM product
WHERE status = 1;
