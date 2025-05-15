<?php
namespace repository;

use config\Database;

class WarrantyRepository {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function findAll(?string $imei = null, ?string $sku_name = null, ?string $receipt_id = null, ?string $status = null, ?string $startDate = null, ?string $endDate = null, ?int $account_id = null, int $page = 1, int $limit = 10): array {
        $offset = ($page - 1) * $limit;

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
            LEFT JOIN user_information ui ON r.user_information_id = ui.user_information_id
            WHERE 1=1
        ";

        $params = [];
        if ($imei) {
            $query .= " AND i.imei = :imei";
            $params[':imei'] = $imei;
        }
        if ($sku_name) {
            $query .= " AND s.sku_name LIKE :sku_name";
            $params[':sku_name'] = "%$sku_name%";
        }
        if ($receipt_id) {
            $query .= " AND i.receipt_detail_id = :receipt_id";
            $params[':receipt_id'] = $receipt_id;
        }
        if ($status && $status !== 'All') {
            $query .= " AND i.status = :status";
            $params[':status'] = $status;
        }
        if ($startDate) {
            $query .= " AND i.date >= :startDate";
            $params[':startDate'] = $startDate;
        }
        if ($endDate) {
            $query .= " AND i.date <= :endDate";
            $params[':endDate'] = $endDate;
        }
        if ($account_id) {
            $query .= " AND ui.account_id = :account_id";
            $params[':account_id'] = $account_id;
        }

        // Đếm tổng số bản ghi để tính tổng số trang
        $countQuery = "SELECT COUNT(*) as total FROM imei i
                       LEFT JOIN receipt_detail rd ON i.receipt_detail_id = rd.detail_id
                       LEFT JOIN sku s ON rd.sku_id = s.sku_id
                       LEFT JOIN receipt r ON rd.receipt_id = r.receipt_id
                       LEFT JOIN user_information ui ON r.user_information_id = ui.user_information_id
                       WHERE 1=1";
        if ($imei) {
            $countQuery .= " AND i.imei = :imei";
        }
        if ($sku_name) {
            $countQuery .= " AND s.sku_name LIKE :sku_name";
        }
        if ($receipt_id) {
            $countQuery .= " AND i.receipt_detail_id = :receipt_id";
        }
        if ($status && $status !== 'All') {
            $countQuery .= " AND i.status = :status";
        }
        if ($startDate) {
            $countQuery .= " AND i.date >= :startDate";
        }
        if ($endDate) {
            $countQuery .= " AND i.date <= :endDate";
        }
        if ($account_id) {
            $countQuery .= " AND ui.account_id = :account_id";
        }

        $countStmt = $this->db->prepare($countQuery);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $totalRecords = $countStmt->fetch(\PDO::FETCH_ASSOC)['total'];
        $totalPages = ceil($totalRecords / $limit);

        // Thêm phân trang vào query chính
        $query .= " LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();

        return [
            'warranties' => $stmt->fetchAll(\PDO::FETCH_ASSOC),
            'currentPage' => $page,
            'totalPage' => $totalPages
        ];
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