use mobile_store;

INSERT INTO internal_option (storage, ram)
SELECT s.storage,
       r.ram
FROM (SELECT '4GB' AS ram
      UNION
      SELECT '6GB'
      UNION
      SELECT '8GB'
      UNION
      SELECT '10GB'
      UNION
      SELECT '12GB'
      UNION
      SELECT '16GB'
      UNION
      SELECT '18GB') AS r
         CROSS JOIN
     (SELECT '2TB' AS storage
      UNION
      SELECT '1TB'
      UNION
      SELECT '512GB'
      UNION
      SELECT '256GB'
      UNION
      SELECT '128GB') AS s;

INSERT INTO user_account (username, password, email)
VALUES ('user1', 'pass1', 'user1@example.com'),
       ('user2', 'pass2', 'user2@example.com'),
       ('user3', 'pass3', 'user3@example.com'),
       ('user4', 'pass4', 'user4@example.com'),
       ('user5', 'pass5', 'user5@example.com'),
       ('user6', 'pass6', 'user6@example.com'),
       ('user7', 'pass7', 'user7@example.com'),
       ('user8', 'pass8', 'user8@example.com'),
       ('user9', 'pass9', 'user9@example.com'),
       ('user10', 'pass10', 'user10@example.com'),
       ('user11', 'pass11', 'user11@example.com'),
       ('user12', 'pass12', 'user12@example.com'),
       ('user13', 'pass13', 'user13@example.com'),
       ('user14', 'pass14', 'user14@example.com'),
       ('user15', 'pass15', 'user15@example.com');

INSERT INTO brand (brand_name)
VALUES ('Apple'),
       ('Samsung'),
       ('Xiaomi'),
       ('Oppo'),
       ('Vivo'),
       ('Huawei'),
       ('Realme');

INSERT INTO color (color)
VALUES ('Black'),
       ('White'),
       ('Blue'),
       ('Red'),
       ('Green'),
       ('Pink'),
       ('Purple'),
       ('Gold'),
       ('Silver'),
       ('Gray'),
       ('Yellow'),
       ('Orange'),
       ('Brown'),
       ('Beige'),
       ('Teal'),
       ('Navy Blue');

INSERT INTO product (brand, series, name, image, cpu, screen, battery, front_camera, back_camera, description,
                     base_price, release_date, warranty_period, status)
VALUES (1, 'iPhone 14 Series', 'iPhone 14 Pro Max', 'iphone14promax.jpg', 'A16 Bionic', '6.7 inch', '4323 mAh', '12 MP',
        '48 MP', 'iPhone 14 Pro Max with new design', 1500, '2022-09-14', 12, 1),
       (1, 'iPhone 13 Series', 'iPhone 13 Pro', 'iphone13pro.jpg', 'A15 Bionic', '6.1 inch', '3095 mAh', '12 MP', '12 MP',
        'iPhone 13 Pro with super retina display', 1300, '2021-09-14', 12, 1),
       (2, 'Samsung Galaxy S23 Series', 'Samsung Galaxy S23 Ultra', 'samsunggalaxys23ultra.jpg', 'Snapdragon 8 Gen 2', '6.8 inch', '5000 mAh', '12 MP',
        '200 MP', 'Samsung Galaxy S23 Ultra with 100x zoom', 1400, '2023-02-17', 12, 1),
       (2, 'Samsung Galaxy S22 Series', 'Samsung Galaxy S22 Plus', 'samsunggalaxys22plus.jpg', 'Snapdragon 8 Gen 1', '6.6 inch', '4500 mAh', '10 MP',
        '50 MP', 'Samsung Galaxy S22 Plus with 120Hz display', 1100, '2022-02-25', 12, 1),
       (3, 'Xiaomi 12 Series', 'Xiaomi 12 Pro', 'xiaomi12pro.jpg', 'Snapdragon 8 Gen 1', '6.73 inch', '4600 mAh', '32 MP',
        '50 MP', 'Xiaomi 12 Pro with WQHD+ display', 1000, '2022-03-28', 12, 1),
       (3, 'Xiaomi 11 Series', 'Xiaomi 11 Ultra', 'xiaomi11ultra.jpg', 'Snapdragon 888', '6.81 inch', '5000 mAh', '20 MP',
        '50 MP', 'Xiaomi 11 Ultra with ceramic design', 1200, '2021-03-29', 12, 1),
       (4, 'Oppo Find X5 Series', 'Oppo Find X5 Pro', 'oppofindx5pro.jpg', 'Snapdragon 8 Gen 1', '6.7 inch', '5000 mAh', '32 MP', '50 MP',
        'Find X5 Pro with Hasselblad camera', 1300, '2022-02-24', 12, 1),
       (4, 'Oppo Reno 8 Series', 'Oppo Reno 8 Pro', 'opporeno8pro.jpg', 'Dimensity 8100', '6.7 inch', '4500 mAh', '32 MP', '50 MP',
        'Reno 8 Pro with AMOLED display', 800, '2022-07-21', 12, 1),
       (5, 'Vivo X80 Series', 'Vivo X80 Pro', 'vivox80pro.jpg', 'Snapdragon 8 Gen 1', '6.78 inch', '4700 mAh', '32 MP',
        '50 MP', 'Vivo X80 Pro with Zeiss optics', 1100, '2022-04-29', 12, 1),
       (5, 'Vivo V23 Series', 'Vivo V23', 'vivov23.jpg', 'Dimensity 920', '6.44 inch', '4200 mAh', '50 MP', '64 MP',
        'Vivo V23 with color-changing design', 600, '2022-01-05', 12, 1),
       (1, 'iPhone 15 Series', 'iPhone 15 Pro Max', 'iphone15promax.jpg', 'A17 Pro', '6.7 inch', '4422 mAh', '12 MP', '48 MP',
        'iPhone 15 Pro Max with titanium frame', 1600, '2023-09-12', 12, 1),
       (2, 'Samsung Galaxy Z Fold 5', 'Samsung Galaxy Z Fold 5', 'samsunggalaxyzfold5.jpg', 'Snapdragon 8 Gen 2', '7.6 inch', '4400 mAh', '10 MP',
        '50 MP', 'Samsung Galaxy Z Fold 5 with foldable design', 1800, '2023-08-11', 12, 1),
       (3, 'Redmi Note 12 Series', 'Redmi Note 12 Pro', 'redminote12pro.jpg', 'Snapdragon 732G', '6.67 inch', '5000 mAh',
        '16 MP', '108 MP', 'Redmi Note 12 Pro with 120Hz display', 400, '2023-01-01', 12, 1),
       (4, 'Oppo Reno 10 Series', 'Oppo Reno 10 Pro+', 'opporeno10pro+.jpg', 'Snapdragon 8 Gen 2', '6.7 inch', '4500 mAh', '32 MP', '50 MP',
        'Reno 10 Pro+ with periscope zoom', 900, '2023-06-06', 12, 1),
       (5, 'Vivo Y100 Series', 'Vivo Y100', 'vivoy100.jpg', 'Dimensity 810', '6.38 inch', '4500 mAh', '16 MP', '64 MP',
        'Vivo Y100 with AMOLED display', 350, '2023-02-16', 12, 1);

INSERT INTO sku (product_id, internal_id, color_id, sku_code, sku_name, image, import_price, invoice_price, sold, stock)
VALUES (1, 1, 1, 'IPHONE14PROMAX-BLACK-4GB/128GB', 'iPhone 14 Pro Max 4GB/128GB Black', 'iphone14promaxblack.jpg', 1400, 1500, 0, 10),
       (1, 7, 2, 'IPHONE14PROMAX-WHITE-6GB/256GB', 'iPhone 14 Pro Max 6GB/256GB White', 'iphone14promaxwhite.jpg', 1450, 1550, 0, 8),
       (1, 13, 7, 'IPHONE14PROMAX-PURPLE-8GB/512GB', 'iPhone 14 Pro Max 8GB/512GB Purple', 'iphone14promaxpurple.jpg', 1500, 1600, 0, 5),
       (2, 1, 2, 'IPHONE13PRO-WHITE-4GB/128GB', 'iPhone 13 Pro 6GB/256GB White', 'iphone13prowhite.jpg', 1200, 1300, 10, 15),
       (2, 13, 3, 'IPHONE13PRO-BLUE-8GB/512GB', 'iPhone 13 Pro 8GB/512GB Blue', 'iphone13problue.jpg', 1250, 1350, 5, 10),
       (2, 25, 5, 'IPHONE13PRO-GREEN-12GB/1TB', 'iPhone 13 Pro 12GB/1TB Green', 'iphone13progreen.jpg', 1300, 1400, 2, 7),
       (3, 13, 1, 'SAMSUNGGALAXYS23ULTRA-BLACK-8GB/512GB', 'Samsung Galaxy S23 Ultra 8GB/512GB Black', 'samsunggalaxys23ultrablack.jpg', 1300, 1400, 4, 12),
       (3, 24, 2, 'SAMSUNGGALAXYS23ULTRA-WHITE-12GB/1TB', 'Samsung Galaxy S23 Ultra 12GB/1TB White', 'samsunggalaxys23ultrawhite.jpg', 1350, 1450, 3, 9),
       (3, 30, 7, 'SAMSUNGGALAXYS23ULTRA-PURPLE-16GB/2TB', 'Samsung Galaxy S23 Ultra 16GB/2TB Purple', 'samsunggalaxys23ultrapurple.jpg', 1400, 1500, 1, 6),
       (1, 1, 2, 'IPHONE14PROMAX-WHITE-4GB/128GB', 'iPhone 14 Pro Max 4GB/128GB White', 'iphone14promaxwhite.jpg', 1400, 1500, 0, 10),
       (1, 13, 2, 'IPHONE14PROMAX-WHITE-8GB/512GB', 'iPhone 14 Pro Max 8GB/512GB White', 'iphone14promaxwhite.jpg', 1500, 1600, 0, 0)


