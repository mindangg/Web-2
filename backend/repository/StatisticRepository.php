<?php

namespace repository;

use Cassandra\Date;
use config\Database;
use DateTime;
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
                    DATE(r.created_at) AS date,
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
                    r.status = 'delivered'";
    
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

    public function getTopBuyers(?string $startDate = null, ?string $endDate = null, string $sortOrder): array {
        $sql = "
            SELECT 
                ua.user_account_id, 
                ua.username, 
                ua.email, 
                ua.status,
                ua.is_delete,
                DATE_FORMAT(ua.created_at, '%d/%m/%Y') as created_at, 
                ui.full_name, 
                ui.phone_number, 
                ui.house_number, 
                ui.street, 
                ui.ward, 
                ui.district, 
                ui.city,
                SUM(r.total_price) AS total_spent
            FROM receipt r
            JOIN user_account ua ON r.account_id = ua.user_account_id
            LEFT JOIN user_information ui ON ua.user_account_id = ui.account_id
            WHERE r.status = 'delivered'
        ";
    
        $params = [];
    
        if ($startDate) {
            $sql .= " AND r.created_at >= :startDate";
            $params['startDate'] = $startDate;
        }
    
        if ($endDate) {
            $sql .= " AND r.created_at <= :endDate";
            $params['endDate'] = $endDate;
        }
    
        $sql .= "
            GROUP BY ua.user_account_id
            ORDER BY total_spent $sortOrder
            LIMIT 5
        ";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $topBuyers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Fetch all receipts + details for each buyer
        foreach ($topBuyers as &$buyer) {
            $buyer['receipts'] = $this->getReceiptsByUser($buyer['user_account_id'], $startDate, $endDate);
        }
    
        return $topBuyers;
    }    
    
    private function getReceiptsByUser(int $userId, ?string $startDate, ?string $endDate): array {
        $sql = "
            SELECT r.*,
            rd.detail_id, 
            rd.sku_id, 
            rd.quantity, 
            rd.price,
            s.sku_name,
            s.image AS sku_image,
            c.color,
            io.ram AS ram,
            io.storage AS storage
            FROM receipt r
            JOIN receipt_detail rd ON r.receipt_id = rd.receipt_id
            JOIN sku s ON rd.sku_id = s.sku_id
            JOIN product p ON s.product_id = p.product_id
            JOIN color c ON s.color_id = c.color_id
            JOIN internal_option io ON s.internal_id = io.internal_option_id
            WHERE r.account_id = :userId
        ";
    
        $params = ['userId' => $userId];
    
        if ($startDate) {
            $sql .= " AND r.created_at >= :startDate";
            $params['startDate'] = $startDate;
        }
    
        if ($endDate) {
            $sql .= " AND r.created_at <= :endDate";
            $params['endDate'] = $endDate;
        }
    
        $sql .= " ORDER BY r.created_at DESC";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
    
        $receipts = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $receiptId = $row['receipt_id'];
            if (!isset($receipts[$receiptId])) {
                $receipts[$receiptId] = [
                    'receipt_id' => $receiptId,
                    'created_at' => $row['created_at'],'created_at' => date('d-m-Y', strtotime($row['created_at'])),
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
                'price' => $row['price'],
                'sku_name' => $row['sku_name'],
                'sku_image' => $row['sku_image'],
                'color' => $row['color'],
                'ram' => $row['ram'],
                'storage' => $row['storage'],
            ];
        }
    
        return array_values($receipts);
    }

    public function getMinReceiptDate()
    {
        $sql = "
        SELECT MIN(DATE(created_at)) AS created_at
        FROM receipt
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $minReceiptDate = $stmt->fetch(PDO::FETCH_ASSOC);
        return $minReceiptDate;
    }

    public function getRevenueByDate($startDate, $endDate): array {
        $sql = "
        SELECT
            DATE(r.created_at) AS date,
            SUM(rd.quantity * rd.price) AS total_revenue,
            SUM(rd.quantity * s.import_price) AS total_cost,
            SUM(rd.quantity * rd.price) - SUM(rd.quantity * s.import_price) AS profit
        FROM
            receipt r
        JOIN
            receipt_detail rd ON r.receipt_id = rd.receipt_id
        JOIN
            sku s ON rd.sku_id = s.sku_id
        WHERE
            r.status IN ('delivered') AND
            DATE(r.created_at) BETWEEN :startDate AND :endDate
        GROUP BY
            DATE(r.created_at)
        ORDER BY
            DATE(r.created_at);
    ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':startDate' => $startDate,
            ':endDate' => $endDate
        ]);

        $revenue = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $revenue[$row['date']] = [
                'total_revenue' => $row['total_revenue'],
                'total_cost' => $row['total_cost'],
                'profit' => $row['profit']
            ];
        }
        return $revenue;
    }
}

?>