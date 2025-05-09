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
            GROUP BY ua.user_account_id,  ui.full_name, ui.phone_number, 
                ui.house_number, ui.street, ui.ward, ui.district, ui.city
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
        $sql = "SELECT MIN(created_at) AS min_date FROM receipt";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    public function productStatistic($fromDate, $toDate, $sort, $sortOder, $limit, $page):array
    {
        $offset = ($page - 1) * $limit;

        $baseSQL = "
        SELECT s.product_id                                          AS product_id,
               s.sku_id                                              AS sku_id,
               s.sku_name                                            AS sku_name,
               s.image                                               AS image,
               s.import_price                                        AS import_price,
               IFNULL(sales.price, s.invoice_price)                  AS invoice_price,
               s.stock                                               AS stock,
               IFNULL(sales.total_quantity_sold, 0)                  AS total_quantity_sold,
               IFNULL(s.import_price * sales.total_quantity_sold, 0) AS total_cost,
               IFNULL(sales.price * sales.total_quantity_sold, 0)    AS total_revenue
        FROM (
            SELECT rd.sku_id,
                     rd.price,
                     SUM(rd.quantity) AS total_quantity_sold
            FROM 
                receipt r
                JOIN receipt_detail rd ON r.receipt_id = rd.receipt_id
            WHERE 
                r.status = 'delivered'
                AND DATE(r.created_at) BETWEEN :fromDate AND :toDate
            GROUP BY 
                rd.sku_id, 
                rd.price
            ) AS sales
                RIGHT JOIN sku s ON s.sku_id = sales.sku_id";

        $sql = $baseSQL . " ORDER BY $sort $sortOder LIMIT $limit OFFSET $offset;";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'fromDate' => $fromDate,
            'toDate' => $toDate
        ]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $totalSql = $baseSQL;
        $totalStmt = $this->pdo->prepare($totalSql);
        $totalStmt->execute([
            'fromDate' => $fromDate,
            'toDate' => $toDate
        ]);
        $total = $totalStmt->fetchAll(PDO::FETCH_ASSOC);
        $total = count($total);

        $response = [
            'data' => $data,
            'total' => $total,
            'totalPage' => ceil($total / $limit),
            'currentPage' => $page,
        ];
        return $response;
    }
}

?>