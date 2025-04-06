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
       ('Pink');

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
       (2, 7, 2, 'IPHONE13PRO-WHITE-4GB/128GB', 'iPhone 13 Pro 6GB/256GB White', 'iphone13prowhite.jpg', 1200, 1300, 10, 15),
       (3, 13, 1, 'SAMSUNGGALAXYS23ULTRA-BLACK-8GB/512GB', 'Samsung Galaxy S23 Ultra 8GB/512GB Black', 'samsunggalaxys23ultrablack.jpg', 1300, 1400, 4, 12),
       (4, 24, 6, 'SAMSUNGGALAXYS22PLUS-PINK-12GB/1TB', 'Samsung Galaxy S22 Plus 12GB/1TB Pink', 'samsunggalaxys22pluspink.jpg', 1000, 1100, 0, 18),
       (5, 30, 3, 'XIAOMI12PRO-BLUE-16GB/2TB', 'Xiaomi 12 Pro 16GB/2TB Blue', 'xiaomi12problue.jpg', 900, 1000, 5, 14);


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
       
INSERT INTO user_information (account_id, full_name, phone_number, house_number, street, ward, district, city)
VALUES (1, 'Alice Nguyen', '0909123456', '12', 'Nguyen Trai', 'Ward 1', 'District 1', 'Ho Chi Minh City'),
       (2, 'Bao Tran', '0909876543', '45', 'Le Loi', 'Ward 5', 'District 3', 'Ho Chi Minh City'),
       (3, 'Chi Le', '0912345678', '89', 'Tran Hung Dao', 'Ward 3', 'District 5', 'Ho Chi Minh City'),
       (4, 'Duy Vo', '0934567890', '7', 'Pham Ngu Lao', 'Ward 2', 'District 1', 'Ho Chi Minh City'),
       (5, 'Emi Pham', '0908765432', '101', 'Ly Thuong Kiet', 'Ward 10', 'District 10', 'Ho Chi Minh City'),
       (6, 'Phuc Tran', '0911122334', '33', 'Nguyen Hue', 'Ward 7', 'District 4', 'Ho Chi Minh City'),
       (7, 'Giang Dang', '0933445566', '55', 'Le Van Sy', 'Ward 8', 'District 3', 'Ho Chi Minh City'),
       (8, 'Hoa Nguyen', '0922334455', '77', 'CMT8', 'Ward 6', 'District 10', 'Ho Chi Minh City'),
       (9, 'Huy Hoang', '0909988776', '90', 'Hoang Sa', 'Ward 11', 'District 3', 'Ho Chi Minh City'),
       (10, 'Khanh Do', '0944556677', '22', 'Bach Dang', 'Ward 9', 'District Binh Thanh', 'Ho Chi Minh City'),
       (11, 'Lan Truong', '0933667788', '100', 'To Hien Thanh', 'Ward 13', 'District 10', 'Ho Chi Minh City'),
       (12, 'Minh Chau', '0911999888', '68', 'Vo Thi Sau', 'Ward 5', 'District 1', 'Ho Chi Minh City'),
       (13, 'Nam Pham', '0922446688', '29', 'Dien Bien Phu', 'Ward 15', 'District Binh Thanh', 'Ho Chi Minh City'),
       (14, 'Oanh Le', '0933778899', '44', 'Tran Quang Khai', 'Ward 12', 'District 1', 'Ho Chi Minh City'),
       (15, 'Phuong Mai', '0909333222', '37', 'Pasteur', 'Ward 14', 'District 3', 'Ho Chi Minh City'); 


INSERT INTO role (role_name)
VALUES ('Điều hành'),
       ('Admin'),
       ('Quản lí kho'),
       ('Bán hàng');

INSERT INTO functional (function_name)
VALUES ('User'),
       ('Employee'),
       ('Product'),
       ('Stock'),
       ('Order'),
       ('Statistic');

INSERT INTO role_function (role_id, function_id, action)
VALUES (1, 1, 'Create'),
       (1, 1, 'Read'),
       (1, 1, 'Update'),
       (1, 1, 'Delete'),
       (1, 2, 'Create'),
       (1, 2, 'Read'),
       (1, 2, 'Update'),
       (1, 2, 'Delete'),
       (1, 3, 'Create'),
       (1, 3, 'Read'),
       (1, 3, 'Update'),
       (1, 3, 'Delete'),
       (1, 4, 'Create'),
       (1, 4, 'Read'),
       (1, 4, 'Update'),
       (1, 4, 'Delete'),
       (1, 5, 'Create'),
       (1, 5, 'Read'),
       (1, 5, 'Update'),
       (1, 5, 'Delete'),
       (1, 6, 'Create'),
       (1, 6, 'Read'),
       (1, 6, 'Update'),
       (1, 6, 'Delete'),
       (2, 1, 'Create'),
       (2, 1, 'Read'),
       (2, 1, 'Update'),
       (2, 1, 'Delete'),
       (2, 2, 'Create'),
       (2, 2, 'Read'),
       (2, 2, 'Update'),
       (2, 2, 'Delete'),
       (3, 3, 'Create'),
       (3, 3, 'Read'),
       (3, 3, 'Update'),
       (3, 3, 'Delete'),
       (3, 4, 'Create'),
       (3, 4, 'Read'),
       (3, 4, 'Update'),
       (3, 4, 'Delete'),
       (4, 5, 'Create'),
       (4, 5, 'Read'),
       (4, 5, 'Update'),
       (4, 5, 'Delete'),
       (4, 6, 'Create'),
       (4, 6, 'Read'),
       (4, 6, 'Update'),
       (4, 6, 'Delete');

INSERT INTO employee (full_name, password, email, phone_number, role)
VALUES ('user1', 'pass1', 'user1@example.com', '0900000001', 1),
       ('user2', 'pass2', 'user2@example.com', '0900000002', 2),
       ('user3', 'pass3', 'user3@example.com', '0900000003', 3),
       ('user4', 'pass4', 'user4@example.com', '0900000004', 4),
       ('user5', 'pass5', 'user5@example.com', '0900000005', 1),
       ('user6', 'pass6', 'user6@example.com', '0900000006', 2),
       ('user7', 'pass7', 'user7@example.com', '0900000007', 3),
       ('user8', 'pass8', 'user8@example.com', '0900000008', 4),
       ('user9', 'pass9', 'user9@example.com', '0900000009', 1),
       ('user10', 'pass10', 'user10@example.com', '0900000010', 2),
       ('user11', 'pass11', 'user11@example.com', '0900000011', 3),
       ('user12', 'pass12', 'user12@example.com', '0900000012', 4),
       ('user13', 'pass13', 'user13@example.com', '0900000013', 1),
       ('user14', 'pass14', 'user14@example.com', '0900000014', 2),
       ('user15', 'pass15', 'user15@example.com', '0900000015', 3),
       ('user16', 'pass16', 'user16@example.com', '0900000016', 4);






