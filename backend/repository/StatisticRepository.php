<?php

namespace repository;
use service\statisticService;

use config\Database;
use PDO;

class StatisticRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function orderStatistics(array $data): array {
        $sql = "SELECT 
                    r.created_at AS date,
                    SUM(rd.quantity) AS total_products_sold,
                    SUM(rd.quantity * rd.price) AS total_revenue,
                    SUM(rd.quantity * (rd.price - s.import_price)) AS total_profit
                FROM 
                    receipt r
                JOIN 
                    receipt_detail rd ON r.receipt_id = rd.receipt_id
                JOIN 
                    sku s ON s.sku_id = rd.sku_id
                WHERE 
                    r.status IN ('delivered', 'on deliver')";
    
        $params = [];
    
        if (isset($data['startDate']) && !empty($data['startDate'])) {
            $sql .= " AND r.created_at >= :startDate";
            $params['startDate'] = $data['startDate'];
        }
    
        if (isset($data['endDate']) && !empty($data['endDate'])) {
            $sql .= " AND r.created_at <= :endDate";
            $params['endDate'] = $data['endDate'];
        }
    
        $sql .= " GROUP BY DATE(r.created_at) ORDER BY DATE(r.created_at) ASC";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // public function findTop5User(?string $startDate, ?string $endDate, string $sortOrder): array {
    //     $sortOrder = strtoupper($sortOrder) === 'ASC' ? 'ASC' : 'DESC';
    
    //     $sql = "
    //         SELECT 
    //             ua.user_account_id,
    //             ua.username,
    //             ui.full_name,
    //             ui.phone,
    //             ui.address,
    //             SUM(r.total_price) AS total_spent
    //         FROM receipt r
    //         JOIN user_account ua ON r.account_id = ua.user_account_id
    //         JOIN user_information ui ON r.user_information_id = ui.user_information_id
    //         WHERE (:startDate IS NULL OR r.created_at >= :startDate)
    //           AND (:endDate IS NULL OR r.created_at <= :endDate)
    //         GROUP BY ua.user_account_id, ua.username, ui.full_name, ui.phone, ui.address
    //         ORDER BY total_spent $sortOrder
    //         LIMIT 5
    //     ";
    
    //     $stmt = $this->pdo->prepare($sql);
    //     $stmt->execute([
    //         'startDate' => $startDate,
    //         'endDate' => $endDate
    //     ]);
    //     return $stmt->fetchAll(PDO::FETCH_ASSOC);
    // }

    public function getTopBuyers(?string $startDate = null, ?string $endDate = null, string $sortOrder = 'DESC'): array {
        $query = "
            SELECT ua.user_account_id, ua.username, ua.email, 
                   SUM(r.total_price) AS total_spent
            FROM receipt r
            JOIN user_account ua ON r.account_id = ua.user_account_id
            WHERE 1=1
        ";
    
        $params = [];
    
        if ($startDate) {
            $query .= " AND r.created_at >= :startDate";
            $params['startDate'] = $startDate . ' 00:00:00';
        }
    
        if ($endDate) {
            $query .= " AND r.created_at <= :endDate";
            $params['endDate'] = $endDate . ' 23:59:59';
        }
    
        $query .= "
            GROUP BY ua.user_account_id
            ORDER BY total_spent $sortOrder
            LIMIT 5
        ";
    
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        $topBuyers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Fetch all receipts + details for each buyer
        foreach ($topBuyers as &$buyer) {
            $buyer['receipts'] = $this->getReceiptsByUser($buyer['user_account_id'], $startDate, $endDate);
        }
    
        return $topBuyers;
    }
    
    private function getReceiptsByUser(int $userId, ?string $startDate, ?string $endDate): array {
        $query = "
            SELECT r.*, rd.detail_id, rd.sku_id, rd.quantity, rd.price
            FROM receipt r
            JOIN receipt_detail rd ON r.receipt_id = rd.receipt_id
            WHERE r.account_id = :userId
        ";
    
        $params = ['userId' => $userId];
    
        if ($startDate) {
            $query .= " AND r.created_at >= :startDate";
            $params['startDate'] = $startDate . ' 00:00:00';
        }
    
        if ($endDate) {
            $query .= " AND r.created_at <= :endDate";
            $params['endDate'] = $endDate . ' 23:59:59';
        }
    
        $query .= " ORDER BY r.created_at DESC";
    
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
    
        $receipts = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $receiptId = $row['receipt_id'];
            if (!isset($receipts[$receiptId])) {
                $receipts[$receiptId] = [
                    'receipt_id' => $receiptId,
                    'created_at' => $row['created_at'],
                    'total_price' => $row['total_price'],
                    'status' => $row['status'],
                    'payment_method' => $row['payment_method'],
                    'details' => []
                ];
            }
    
            $receipts[$receiptId]['details'][] = [
                'detail_id' => $row['detail_id'],
                'sku_id' => $row['sku_id'],
                'quantity' => $row['quantity'],
                'price' => $row['price']
            ];
        }
    
        return array_values($receipts); // remove associative index
    }

    public function getReceiptsWithDetailsByUser(int $userId): array {
        $sql = "
            SELECT 
                r.receipt_id,
                r.total_price,
                r.status,
                r.payment_method,
                r.created_at,
                rd.detail_id,
                rd.sku_id,
                rd.quantity,
                rd.price,
                s.sku_code,
                s.sku_name,
                p.name AS product_name
            FROM receipt r
            JOIN receipt_detail rd ON r.receipt_id = rd.receipt_id
            JOIN sku s ON rd.sku_id = s.sku_id
            JOIN product p ON s.product_id = p.product_id
            WHERE r.account_id = :user_id
            ORDER BY r.created_at DESC
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    
}

?>