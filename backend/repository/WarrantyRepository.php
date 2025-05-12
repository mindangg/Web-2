<?php
namespace repository;

use config\Database;

class WarrantyRepository {
    private $db;

    public function __construct() {
    $this->db = (new Database())->getConnection();
}

    public function findAll(): array {
    $query = "
        SELECT 
            i.imei, 
            i.receipt_detail_id, 
            i.date, 
            i.expired_date, 
            CASE 
                WHEN i.expired_date < CURDATE() THEN 'Hết hạn'
                ELSE i.status
            END AS status, 
            s.sku_name,
            r.user_information_id
        FROM imei i
        LEFT JOIN receipt_detail rd ON i.receipt_detail_id = rd.detail_id
        LEFT JOIN sku s ON rd.sku_id = s.sku_id
        LEFT JOIN receipt r ON rd.receipt_id = r.receipt_id
    ";
    $stmt = $this->db->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
}

public function updateStatus(int $imei, string $status): void {
    $query = "SELECT expired_date FROM imei WHERE imei = :imei";
    $stmt = $this->db->prepare($query);
    $stmt->bindValue(':imei', $imei, \PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(\PDO::FETCH_ASSOC);
    
    if (!$result || strtotime($result['expired_date']) < time()) {
        throw new \Exception("Không thể cập nhật trạng thái: Sản phẩm đã hết hạn bảo hành");
    }

    $query = "UPDATE imei SET status = :status WHERE imei = :imei";
    $stmt = $this->db->prepare($query);
    $stmt->bindValue(':status', $status, \PDO::PARAM_STR);
    $stmt->bindValue(':imei', $imei, \PDO::PARAM_INT);
    $stmt->execute();
}
}
?>