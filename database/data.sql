use
    mobile_store;

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

INSERT INTO provider (provider_name, phone, address, email)
VALUES ('FPT Trading', '02473002222', 'Tầng 2-3, Tòa nhà Zodiac, Duy Tân, Cầu Giấy, Hà Nội', 'contact@fpt.com.vn'),
       ('DGW (Digiworld)', '02873005588', 'Số 6 Tân Trào, Phường Tân Phú, Quận 7, TP. HCM', 'info@digiworld.com.vn'),
       ('Petrosetco Distribution', '02838220220', 'Tòa nhà Petrosetco, 1-5 Lê Duẩn, Quận 1, TP. HCM',
        'sales@petrosetco.com.vn'),
       ('Viettel Distribution', '18008098', 'Tòa nhà Viettel, 1 Giang Văn Minh, Ba Đình, Hà Nội',
        'support@viettel.com.vn'),
       ('Synnex FPT', '02473002266', '17 Duy Tân, Cầu Giấy, Hà Nội', 'synnex@fpt.com.vn'),
       ('CMC Distribution', '02836225222', 'Tòa nhà CMC, Tân Thuận Đông, Quận 7, TP. HCM', 'info@cmcdistribution.vn'),
       ('TNC Distribution', '02873007007', '237-239 Trần Quang Khải, Quận 1, TP. HCM', 'sales@tnc.com.vn'),
       ('An Khang Distribution', '02838441414', '94 Lũy Bán Bích, Tân Phú, TP. HCM', 'contact@ankhang.vn'),
       ('Minh Tuấn Mobile', '02839393939', '121 Hoàng Hoa Thám, Tân Bình, TP. HCM', 'info@minhtuanmobile.com'),
       ('Hoàng Hà Mobile', '19002091', '121 Thái Hà, Đống Đa, Hà Nội', 'lienhe@hoanghamobile.com');

INSERT INTO product (brand, provider, series, name, image, cpu, screen, battery, front_camera,
                     back_camera, description, base_price, release_date, warranty_period, status)
VALUES (1, 1, 'iPhone 14 Series', 'iPhone 14 Pro Max', 'iphone14promax.jpg', 'A16 Bionic', '6.7 inch', '4323 mAh',
        '12 MP',
        '48 MP', 'iPhone 14 Pro Max with new design', 34500000, '2022-09-14', 12, 1),
       (1, 1, 'iPhone 13 Series', 'iPhone 13 Pro', 'iphone13pro.jpg', 'A15 Bionic', '6.1 inch', '3095 mAh', '12 MP',
        '12 MP', 'iPhone 13 Pro with super retina display', 29900000, '2021-09-14', 12, 1),
       (1, 1, 'iPhone 15 Series', 'iPhone 15 Pro Max', 'iphone15promax.jpg', 'A17 Pro', '6.7 inch', '4422 mAh', '12 MP',
        '48 MP', 'iPhone 15 Pro Max with titanium frame', 36800000, '2023-09-12', 12, 1),
       (2, 2, 'Samsung Galaxy S23 Series', 'Samsung Galaxy S23 Ultra', 'samsunggalaxys23ultra.jpg',
        'Snapdragon 8 Gen 2', '6.8 inch', '5000 mAh', '12 MP',
        '200 MP', 'Samsung Galaxy S23 Ultra with 100x zoom', 32200000, '2023-02-17', 12, 1),
       (2, 2, 'Samsung Galaxy S22 Series', 'Samsung Galaxy S22 Plus', 'samsunggalaxys22plus.jpg', 'Snapdragon 8 Gen 1',
        '6.6 inch', '4500 mAh', '10 MP',
        '50 MP', 'Samsung Galaxy S22 Plus with 120Hz display', 25300000, '2022-02-25', 12, 1),
       (2, 2, 'Samsung Galaxy Z Fold 5', 'Samsung Galaxy Z Fold 5', 'samsunggalaxyzfold5.jpg', 'Snapdragon 8 Gen 2',
        '7.6 inch', '4400 mAh', '10 MP',
        '50 MP', 'Samsung Galaxy Z Fold 5 with foldable design', 41400000, '2023-08-11', 12, 1),
       (3, 3, 'Xiaomi 12 Series', 'Xiaomi 12 Pro', 'xiaomi12pro.jpg', 'Snapdragon 8 Gen 1', '6.73 inch', '4600 mAh',
        '32 MP',
        '50 MP', 'Xiaomi 12 Pro with WQHD+ display', 23000000, '2022-03-28', 12, 1),
       (3, 3, 'Xiaomi 11 Series', 'Xiaomi 11 Ultra', 'xiaomi11ultra.jpg', 'Snapdragon 888', '6.81 inch', '5000 mAh',
        '20 MP',
        '50 MP', 'Xiaomi 11 Ultra with ceramic design', 27600000, '2021-03-29', 12, 1),
       (3, 3, 'Redmi Note 12 Series', 'Redmi Note 12 Pro', 'redminote12pro.jpg', 'Snapdragon 732G', '6.67 inch',
        '5000 mAh',
        '16 MP', '108 MP', 'Redmi Note 12 Pro with 120Hz display', 9200000, '2023-01-01', 12, 1),
       (4, 4, 'Oppo Find X5 Series', 'Oppo Find X5 Pro', 'oppofindx5pro.jpg', 'Snapdragon 8 Gen 1', '6.7 inch',
        '5000 mAh', '32 MP',
        '50 MP', 'Find X5 Pro with Hasselblad camera', 29900000, '2022-02-24', 12, 1),
       (4, 4, 'Oppo Reno 8 Series', 'Oppo Reno 8 Pro', 'opporeno8pro.jpg', 'Dimensity 8100', '6.7 inch', '4500 mAh',
        '32 MP',
        '50 MP', 'Reno 8 Pro with AMOLED display', 18400000, '2022-07-21', 12, 1),
       (4, 4, 'Oppo Reno 10 Series', 'Oppo Reno 10 Pro+', 'opporeno10pro+.jpg', 'Snapdragon 8 Gen 2', '6.7 inch',
        '4500 mAh', '32 MP',
        '50 MP', 'Reno 10 Pro+ with periscope zoom', 20700000, '2023-06-06', 12, 1),
       (5, 5, 'Vivo X80 Series', 'Vivo X80 Pro', 'vivox80pro.jpg', 'Snapdragon 8 Gen 1', '6.78 inch', '4700 mAh',
        '32 MP',
        '50 MP', 'Vivo X80 Pro with Zeiss optics', 25300000, '2022-04-29', 12, 1),
       (5, 5, 'Vivo V23 Series', 'Vivo V23', 'vivov23.jpg', 'Dimensity 920', '6.44 inch', '4200 mAh', '50 MP', '64 MP',
        'Vivo V23 with color-changing design', 13800000, '2022-01-05', 12, 1),
       (5, 5, 'Vivo Y100 Series', 'Vivo Y100', 'vivoy100.jpg', 'Dimensity 810', '6.38 inch', '4500 mAh', '16 MP',
        '64 MP',
        'Vivo Y100 with AMOLED display', 8050000, '2023-02-16', 12, 1),
       (3, 1, 'Xiaomi 15 Series', 'Xiaomi 15 Ultra', 'xiaomi15ultra.jpg', 'Snapdragon 8 Elite', 'AMOLED', '5410 mAh',
        '32 MP', '50 MP',
        'Xiaomi 15 Ultra trang bị chip Snapdragon® 8 Elite mạnh mẽ và RAM lên đến 16GB, người dùng sẽ có trải nghiệm mượt mà và dung lượng lưu trữ 512GB. Thiết bị này được nâng cấp nhờ trang bị ống kính tele có độ phân giải cao đến 200 megapixel. Viên pin lớn 5410 mAh, sẽ giúp nâng cao thời gian dùng điện thoại của người dùng. Đồng thời, Mi 15 Ultra trang bị tấm nền AMOLED, sẽ đem lại chất lượng hiển thị nổi bật và chi tiết về màu sắc.',
        32990000, '2025-03-10', 12, 1);

INSERT INTO sku(product_id, internal_id, color_id, sku_code, sku_name, image, import_price, invoice_price, sold, stock)
VALUES (1, 1, 1, 'IPHONE14PROMAX-BLACK-4GB/128GB', 'iPhone 14 Pro Max 4GB/128GB Black', 'iphone14promaxwhite4gb128gb.jpg',
        32200000, 34500000, 0, 10),
       (1, 7, 2, 'IPHONE14PROMAX-WHITE-6GB/256GB', 'iPhone 14 Pro Max 6GB/256GB White', 'iphone14promaxwhite6gb256gb.jpg',
        33350000, 35650000, 0, 8),
       (1, 13, 7, 'IPHONE14PROMAX-PURPLE-8GB/512GB', 'iPhone 14 Pro Max 8GB/512GB Purple', 'iphone14promaxpurple8gb512gb.jpg',
        34500000, 36800000, 0, 5),
       (2, 1, 2, 'IPHONE13PRO-WHITE-4GB/128GB', 'iPhone 13 Pro 6GB/256GB White', 'iphone13prowhite.jpg', 27600000,
        29900000, 10, 15),
       (2, 13, 3, 'IPHONE13PRO-BLUE-8GB/512GB', 'iPhone 13 Pro 8GB/512GB Blue', 'iphone13problue.jpg', 28750000,
        31050000, 5, 10),
       (2, 25, 5, 'IPHONE13PRO-GREEN-12GB/1TB', 'iPhone 13 Pro 12GB/1TB Green', 'iphone13progreen.jpg', 29900000,
        32200000, 2, 7),
       (3, 13, 1, 'SAMSUNGGALAXYS23ULTRA-BLACK-8GB/512GB', 'Samsung Galaxy S23 Ultra 8GB/512GB Black',
        'samsunggalaxys23ultrablack.jpg', 29900000, 32200000, 4, 12),
       (3, 24, 2, 'SAMSUNGGALAXYS23ULTRA-WHITE-12GB/1TB', 'Samsung Galaxy S23 Ultra 12GB/1TB White',
        'samsunggalaxys23ultrawhite.jpg', 31050000, 33350000, 3, 9),
       (3, 30, 7, 'SAMSUNGGALAXYS23ULTRA-PURPLE-16GB/2TB', 'Samsung Galaxy S23 Ultra 16GB/2TB Purple',
        'samsunggalaxys23ultrapurple.jpg', 32200000, 34500000, 1, 6),
       (1, 1, 2, 'IPHONE14PROMAX-WHITE-4GB/128GB', 'iPhone 14 Pro Max 4GB/128GB White', 'iphone14promaxwhite4gb128gb.jpg',
        32200000, 34500000, 0, 10),
       (1, 13, 2, 'IPHONE14PROMAX-WHITE-8GB/512GB', 'iPhone 14 Pro Max 8GB/512GB White', 'iphone14promaxwhite8gb512gb.jpg',
        34500000, 36800000, 0, 0),
       (16, 28, 1, 'XIAOMI15ULTRA-BLACK-16GB/512GB', 'Xiaomi 15 Ultra 16GB/512GB Black',
        'xiaomi15ultrablack16gb512gb.jpg', 22000000, 32990000, 0, 15),
       (16, 29, 1, 'XIAOMI15ULTRA-BLACK-16GB/1TB', 'Xiaomi 15 Ultra 16GB/1TB Black', 'xiaomi15ultrablack16gb1tb.jpg',
        23000000, 33990000, 0, 20),
       (16, 28, 9, 'XIAOMI15ULTRA-SILVER-16GB/512GB', 'Xiaomi 15 Ultra 16GB/512GB Silver',
        'xiaomi15ultrasilver16gb512gb.jpg', 22000000, 32990000, 0, 50),
       (16, 29, 9, 'XIAOMI15ULTRA-SILVER-16GB/1TB', 'Xiaomi 15 Ultra 16GB/1TB Silver', 'xiaomi15ultrasilver16gb1tb.jpg',
        23000000, 33990000, 0, 50);

INSERT INTO user_account (username, password, email)
VALUES ('user1', 'user1', 'user1@example.com'),
       ('user2', 'user2', 'user2@example.com'),
       ('user3', 'user3', 'user3@example.com'),
       ('user4', 'user4', 'user4@example.com'),
       ('user5', 'user5', 'user5@example.com'),
       ('user6', 'user6', 'user6@example.com'),
       ('user7', 'user7', 'user7@example.com'),
       ('user8', 'user8', 'user8@example.com'),
       ('user9', 'user9', 'user9@example.com'),
       ('user10', 'user10', 'user10@example.com'),
       ('user11', 'user11', 'user11@example.com'),
       ('user12', 'user12', 'user12@example.com'),
       ('user13', 'user13', 'user13@example.com'),
       ('user14', 'user14', 'user14@example.com'),
       ('user15', 'user15', 'user15@example.com');

-- INSERT INTO user_information (account_id, full_name, phone_number, house_number, street, ward, district, city)
-- VALUES (1, 'Alice Nguyen', '0909123456', '12', 'Nguyen Trai', 'Ward 1', 'District 1', 'Ho Chi Minh City'),
--        (2, 'Bao Tran', '0909876543', '45', 'Le Loi', 'Ward 5', 'District 3', 'Ho Chi Minh City'),
--        (3, 'Chi Le', '0912345678', '89', 'Tran Hung Dao', 'Ward 3', 'District 5', 'Ho Chi Minh City'),
--        (4, 'Duy Vo', '0934567890', '7', 'Pham Ngu Lao', 'Ward 2', 'District 1', 'Ho Chi Minh City'),
--        (5, 'Emi Pham', '0908765432', '101', 'Ly Thuong Kiet', 'Ward 10', 'District 10', 'Ho Chi Minh City'),
--        (6, 'Phuc Tran', '0911122334', '33', 'Nguyen Hue', 'Ward 7', 'District 4', 'Ho Chi Minh City'),
--        (7, 'Giang Dang', '0933445566', '55', 'Le Van Sy', 'Ward 8', 'District 3', 'Ho Chi Minh City'),
--        (8, 'Hoa Nguyen', '0922334455', '77', 'CMT8', 'Ward 6', 'District 10', 'Ho Chi Minh City'),
--        (9, 'Huy Hoang', '0909988776', '90', 'Hoang Sa', 'Ward 11', 'District 3', 'Ho Chi Minh City'),
--        (10, 'Khanh Do', '0944556677', '22', 'Bach Dang', 'Ward 9', 'District Binh Thanh', 'Ho Chi Minh City'),
--        (11, 'Lan Truong', '0933667788', '100', 'To Hien Thanh', 'Ward 13', 'District 10', 'Ho Chi Minh City'),
--        (12, 'Minh Chau', '0911999888', '68', 'Vo Thi Sau', 'Ward 5', 'District 1', 'Ho Chi Minh City'),
--        (13, 'Nam Pham', '0922446688', '29', 'Dien Bien Phu', 'Ward 15', 'District Binh Thanh', 'Ho Chi Minh City'),
--        (14, 'Oanh Le', '0933778899', '44', 'Tran Quang Khai', 'Ward 12', 'District 1', 'Ho Chi Minh City'),
--        (15, 'Phuong Mai', '0909333222', '37', 'Pasteur', 'Ward 14', 'District 3', 'Ho Chi Minh City'); 

INSERT INTO user_information (account_id, full_name, phone_number, house_number, street, ward, district, city,
                              is_default)
VALUES (1, 'Trần Văn A', '0901234561', '123', 'Lê Lợi', 'Phường Bến Thành', 'Quận 1', 'TP.HCM', TRUE),
       (2, 'Nguyễn Văn A', '0901234567', '456', 'Nguyễn Huệ', 'Phường Bến Nghé', 'Quận 1', 'TP.HCM', FALSE),
       (3, 'Trần Thị B', '0912345678', '78A', 'Trần Hưng Đạo', 'Phường Cầu Kho', 'Quận 1', 'TP.HCM', TRUE),
       (4, 'Lê Văn C', '0923456789', '35', 'Phạm Văn Đồng', 'Phường Hiệp Bình Chánh', 'TP.Thủ Đức', 'TP.HCM', TRUE),
       (5, 'Phạm Thị D', '0934567890', '99', 'Cách Mạng Tháng 8', 'Phường 15', 'Quận 10', 'TP.HCM', TRUE),
       (6, 'Hoàng Văn E', '0945678901', '12', 'Quang Trung', 'Phường 11', 'Quận Gò Vấp', 'TP.HCM', TRUE),
       (7, 'Đinh Thị F', '0956789012', '88', 'Nguyễn Thái Học', 'Phường Cầu Ông Lãnh', 'Quận 1', 'TP.HCM', TRUE),
       (8, 'Võ Văn G', '0967890123', '21', 'Lý Thường Kiệt', 'Phường 7', 'Quận Tân Bình', 'TP.HCM', TRUE),
       (9, 'Ngô Thị H', '0978901234', '47', '3/2', 'Phường 14', 'Quận 10', 'TP.HCM', TRUE),
       (10, 'Bùi Văn I', '0989012345', '05', 'Nguyễn Trãi', 'Phường Nguyễn Cư Trinh', 'Quận 1', 'TP.HCM', TRUE),
       (11, 'Đỗ Thị K', '0990123456', '66', 'Hòa Bình', 'Phường Hiệp Tân', 'Quận Tân Phú', 'TP.HCM', TRUE),
       (12, 'Lê Văn C', '0923456789', '198', 'Kha Vạn Cân', 'Phường Linh Tây', 'TP.Thủ Đức', 'TP.HCM', FALSE),
       (13, 'Hoàng Văn E', '0945678901', '201', 'Lê Đức Thọ', 'Phường 6', 'Quận Gò Vấp', 'TP.HCM', FALSE),
       (14, 'Trần Thị B', '0912345678', '789', 'Đinh Tiên Hoàng', 'Phường Đa Kao', 'Quận 1', 'TP.HCM', FALSE),
       (15, 'Đinh Thị F', '0956789012', '301', 'Nguyễn Văn Cừ', 'Phường 4', 'Quận 5', 'TP.HCM', FALSE);

INSERT INTO role (role_name)
VALUES ('Điều hành'),
       ('Admin'),
       ('Quản lí kho'),
       ('Bán hàng');

INSERT INTO functional (function_name)
VALUES ('Người dùng'),
       ('Nhân viên'),
       ('Sản phẩm'),
       ('Kho hàng'),
       ('Đơn hàng'),
       ('Thống kê'),
       ('Bảo hành');

INSERT INTO role_function (role_id, function_id, action)
VALUES (1, 1, 'Xem'),
       (1, 1, 'Thêm'),
       (1, 1, 'Sửa'),
       (1, 1, 'Xóa'),
       (1, 2, 'Xem'),
       (1, 2, 'Thêm'),
       (1, 2, 'Sửa'),
       (1, 2, 'Xóa'),
       (1, 3, 'Xem'),
       (1, 3, 'Thêm'),
       (1, 3, 'Sửa'),
       (1, 3, 'Xóa'),
       (1, 4, 'Xem'),
       (1, 4, 'Thêm'),
       (1, 4, 'Sửa'),
       (1, 4, 'Xóa'),
       (1, 5, 'Xem'),
       (1, 5, 'Thêm'),
       (1, 5, 'Sửa'),
       (1, 5, 'Xóa'),
       (1, 6, 'Xem'),
       (1, 6, 'Thêm'),
       (1, 6, 'Sửa'),
       (1, 6, 'Xóa'),
       (1,7,'Xem'),
       (1,7,'Thêm'),
       (1,7,'Sửa'),
       (1,7,'Xóa'),

       (2, 1, 'Xem'),
       (2, 1, 'Thêm'),
       (2, 1, 'Sửa'),
       (2, 1, 'Xóa'),
       (2, 2, 'Xem'),
       (2, 2, 'Thêm'),
       (2, 2, 'Sửa'),
       (2, 2, 'Xóa'),
       (2,7,'Xem'),
       (2,7,'Thêm'),
       (2,7,'Sửa'),
       (2,7,'Xóa'),

       (3, 3, 'Xem'),
       (3, 3, 'Thêm'),
       (3, 3, 'Sửa'),
       (3, 3, 'Xóa'),
       (3, 4, 'Xem'),
       (3, 4, 'Thêm'),
       (3, 4, 'Sửa'),
       (3, 4, 'Xóa'),

       (4, 5, 'Xem'),
       (4, 5, 'Thêm'),
       (4, 5, 'Sửa'),
       (4, 5, 'Xóa'),
       (4, 6, 'Xem'),
       (4, 6, 'Thêm'),
       (4, 6, 'Sửa'),
       (4, 6, 'Xóa');

INSERT INTO employee (full_name, password, email, phone_number, role)
VALUES ('Trần Minh Đăng', 'employee1', 'employee1@gmail.com', '0900000001', 1),
       ('Trần Đặng Minh', 'employee2', 'employee2@gmail.com', '0900000002', 2),
       ('Lê Thị Hồng', 'employee3', 'employee3@gmail.com', '0900000003', 3),
       ('Phạm Anh Tuấn', 'employee4', 'employee4@gmail.com', '0900000004', 4),
       ('Võ Hoàng Nam', 'employee5', 'employee5@gmail.com', '0900000005', 1),
       ('Đặng Thùy Linh', 'employee6', 'employee6@gmail.com', '0900000006', 2),
       ('Bùi Quốc Huy', 'employee7', 'employee7@gmail.com', '0900000007', NULL),
       ('Ngô Thanh Mai', 'employee8', 'employee8@gmail.com', '0900000008', NULL),
       ('Huỳnh Khánh Vy', 'employee9', 'employee9@gmail.com', '0900000009', NULL),
       ('Đỗ Duy Phúc', 'employee10', 'employee10@gmail.com', '0900000010', NULL),
       ('Tăng Ngọc Hà', 'employee11', 'employee11@gmail.com', '0900000011', NULL),
       ('Phan Thanh Tùng', 'employee12', 'employee12@gmail.com', '0900000012', NULL),
       ('Lý Trúc Anh', 'employee13', 'employee13@gmail.com', '0900000013', NULL),
       ('Châu Thiên Long', 'employee14', 'employee14@gmail.com', '0900000014', NULL),
       ('Tô Hải My', 'employee15', 'employee15@gmail.com', '0900000015', NULL),
       ('Vương Bảo Khánh', 'employee16', 'employee16@gmail.com', '0900000016', NULL);


-- Insert 20 receipts
INSERT INTO receipt (account_id, user_information_id, created_at, total_price, status, payment_method)
VALUES
(1, 1, '2024-06-15 10:30:00', 34500000, 'delivered', 'direct_payment'),
(2, 2, '2024-07-01 14:20:00', 64400000, 'confirmed', 'transfer_payment'),
(3, 3, '2024-08-10 09:15:00', 36800000, 'on_deliver', 'direct_payment'),
(4, 4, '2024-09-05 16:45:00', 29900000, 'pending', 'transfer_payment'),
(5, 5, '2024-10-20 11:00:00', 66700000, 'delivered', 'direct_payment'),
(6, 6, '2024-11-12 13:30:00', 32200000, 'cancelled', 'transfer_payment'),
(7, 7, '2024-12-01 15:10:00', 35650000, 'confirmed', 'direct_payment'),
(8, 8, '2025-01-15 08:50:00', 62100000, 'delivered', 'transfer_payment'),
(9, 9, '2025-02-03 12:25:00', 32990000, 'on_deliver', 'direct_payment'),
(10, 10, '2025-02-20 17:00:00', 69000000, 'pending', 'transfer_payment'),
(11, 11, '2025-03-01 09:40:00', 31050000, 'delivered', 'direct_payment'),
(12, 12, '2025-03-15 14:15:00', 36800000, 'confirmed', 'transfer_payment'),
(13, 13, '2025-04-02 11:20:00', 65980000, 'on_deliver', 'direct_payment'),
(14, 14, '2025-04-10 16:30:00', 32200000, 'cancelled', 'transfer_payment'),
(15, 15, '2025-04-25 10:00:00', 34500000, 'delivered', 'direct_payment'),
(1, 1, '2025-05-01 12:45:00', 33350000, 'pending', 'direct_payment'),
(2, 2, '2025-05-05 15:20:00', 36800000, 'confirmed', 'transfer_payment'),
(3, 3, '2025-05-08 09:30:00', 64400000, 'delivered', 'direct_payment'),
(4, 4, '2025-05-10 11:50:00', 32990000, 'on_deliver', 'transfer_payment'),
(5, 5, '2025-05-12 14:00:00', 69000000, 'pending', 'direct_payment');

-- Insert receipt details (25 details, all receipt_id from 1 to 20)
INSERT INTO receipt_detail (receipt_id, sku_id, quantity, price)
VALUES
(1, 1, 1, 34500000), -- iPhone 14 Pro Max 4GB/128GB Black
(2, 7, 2, 32200000), -- Samsung Galaxy S23 Ultra 8GB/512GB Black
(3, 3, 1, 36800000), -- iPhone 14 Pro Max 8GB/512GB Purple
(4, 4, 1, 29900000), -- iPhone 13 Pro 6GB/256GB White
(5, 10, 1, 34500000), -- iPhone 14 Pro Max 4GB/128GB White
(5, 11, 1, 32200000), -- iPhone 14 Pro Max 8GB/512GB White
(6, 7, 1, 32200000), -- Samsung Galaxy S23 Ultra 8GB/512GB Black
(7, 2, 1, 35650000), -- iPhone 14 Pro Max 6GB/256GB White
(8, 4, 1, 29900000), -- iPhone 13 Pro 6GB/256GB White
(8, 7, 1, 32200000), -- Samsung Galaxy S23 Ultra 8GB/512GB Black
(9, 12, 1, 32990000), -- Xiaomi 15 Ultra 16GB/512GB Black
(10, 1, 2, 34500000), -- iPhone 14 Pro Max 4GB/128GB Black
(11, 5, 1, 31050000), -- iPhone 13 Pro 8GB/512GB Blue
(12, 11, 1, 36800000), -- iPhone 14 Pro Max 8GB/512GB White
(13, 12, 2, 32990000), -- Xiaomi 15 Ultra 16GB/512GB Black
(14, 7, 1, 32200000), -- Samsung Galaxy S23 Ultra 8GB/512GB Black
(15, 1, 1, 34500000), -- iPhone 14 Pro Max 4GB/128GB Black
(16, 8, 1, 33350000), -- Samsung Galaxy S23 Ultra 12GB/1TB White
(17, 3, 1, 36800000), -- iPhone 14 Pro Max 8GB/512GB Purple
(18, 7, 2, 32200000), -- Samsung Galaxy S23 Ultra 8GB/512GB Black
(19, 14, 1, 32990000), -- Xiaomi 15 Ultra 16GB/512GB Silver
(20, 1, 1, 34500000), -- iPhone 14 Pro Max 4GB/128GB Black
(20, 10, 1, 34500000), -- iPhone 14 Pro Max 4GB/128GB White
(18, 12, 1, 32990000), -- Xiaomi 15 Ultra 16GB/512GB Black
(19, 15, 1, 33990000); -- Xiaomi 15 Ultra 16GB/1TB Silver

-- Insert IMEI records (30 IMEIs, one per unit sold)
INSERT INTO imei (receipt_detail_id, date, expired_date, status)
VALUES
(1, '2024-06-15 10:30:00', '2025-06-15', 'Hoạt động'),
(2, '2024-07-01 14:20:00', '2025-07-01', 'Hoạt động'),
(2, '2024-07-01 14:20:00', '2025-07-01', 'Hoạt động'),
(3, '2024-08-10 09:15:00', '2025-08-10', 'Hoạt động'),
(4, '2024-09-05 16:45:00', '2025-09-05', 'Hoạt động'),
(5, '2024-10-20 11:00:00', '2025-10-20', 'Hoạt động'),
(6, '2024-10-20 11:00:00', '2025-10-20', 'Hoạt động'),
(7, '2024-11-12 13:30:00', '2025-11-12', 'Hoạt động'),
(8, '2024-12-01 15:10:00', '2025-12-01', 'Hoạt động'),
(9, '2025-01-15 08:50:00', '2026-01-15', 'Hoạt động'),
(10, '2025-01-15 08:50:00', '2026-01-15', 'Hoạt động'),
(11, '2025-02-03 12:25:00', '2026-02-03', 'Hoạt động'),
(12, '2025-02-20 17:00:00', '2026-02-20', 'Hoạt động'),
(12, '2025-02-20 17:00:00', '2026-02-20', 'Hoạt động'),
(13, '2025-03-01 09:40:00', '2026-03-01', 'Hoạt động'),
(14, '2025-03-15 14:15:00', '2026-03-15', 'Hoạt động'),
(15, '2025-04-02 11:20:00', '2026-04-02', 'Hoạt động'),
(15, '2025-04-02 11:20:00', '2026-04-02', 'Hoạt động'),
(16, '2025-04-10 16:30:00', '2026-04-10', 'Hoạt động'),
(17, '2025-04-25 10:00:00', '2026-04-25', 'Hoạt động'),
(18, '2025-05-01 12:45:00', '2026-05-01', 'Hoạt động'),
(19, '2025-05-05 15:20:00', '2026-05-05', 'Hoạt động'),
(20, '2025-05-08 09:30:00', '2026-05-08', 'Hoạt động'),
(20, '2025-05-08 09:30:00', '2026-05-08', 'Hoạt động'),
(21, '2025-05-10 11:50:00', '2026-05-10', 'Hoạt động'),
(22, '2025-05-12 14:00:00', '2026-05-12', 'Hoạt động'),
(23, '2025-05-12 14:00:00', '2026-05-12', 'Hoạt động'),
(24, '2025-05-08 09:30:00', '2026-05-08', 'Hoạt động'),
(25, '2025-05-10 11:50:00', '2026-05-10', 'Hoạt động'),
(25, '2025-05-10 11:50:00', '2026-05-10', 'Hoạt động');







