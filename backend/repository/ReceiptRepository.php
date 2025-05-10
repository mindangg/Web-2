<?php
namespace repository;

use PDO;
use config\Database;

class ReceiptRepository{
    private $pdo;
    
    public function __construct(){
        $this->pdo = (new Database())->getConnection();
    }

    public function createImei(array $data): void{
        $sql = "INSERT INTO imei (receipt_detail_id, date, expired_date, status) 
                VALUES (:receipt_detail_id, :date, :expired_date, :status)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'receipt_detail_id' => $data['receipt_detail_id'],
            'date' => $data['date'],
            'expired_date' => $data['expired_date'],
            'status' => $data['status']
        ]);
    }
    public function deleteImeiByReceiptDetailId(int $receiptDetailId): void {
        $sql = "DELETE FROM imei WHERE receipt_detail_id = :receipt_detail_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['receipt_detail_id' => $receiptDetailId]);
    }
    
    public function createReceipt(array $data):int {
        $sql = "INSERT INTO receipt (account_id, user_information_id,total_price,payment_method, status)
                VALUE (:account_id, :user_information_id, :total_price,:payment_method, :status)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'account_id' => $data['account_id'],
            'user_information_id' => $data['user_information_id'],
            'total_price' => $data['total_price'],
            'payment_method' => $data['payment_method'],
            'status' => $data['status']
        ]);
        return $this->pdo->lastInsertId();
    }

    public function createReceiptDetail(array $data): int{
        $sql = "INSERT INTO receipt_detail (receipt_id, sku_id, quantity, price) 
                VALUES (:receipt_id, :sku_id, :quantity, :price)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'receipt_id' => $data['receipt_id'],
            'sku_id' => $data['sku_id'],
            'quantity' => $data['quantity'],
            'price' => $data['price']
        ]);
        return $this->pdo->lastInsertId();
    }

    public function getReceiptsByAccountId(int $accountId): array{
        $sql= "SELECT receipt_id, created_at, total_price, status, payment_method
                FROM receipt
                WHERE account_id= :account_id
                ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['account_id' => $accountId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getReceiptDetails(int $receiptId): array {
        $sql = "SELECT rd.detail_id, rd.sku_id, rd.quantity, rd.price, s.sku_name, s.image
                FROM receipt_detail rd
                JOIN sku s ON rd.sku_id = s.sku_id
                WHERE rd.receipt_id = :receipt_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['receipt_id' => $receiptId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getFilteredReceipts(array $filters): array {
        $sql = "SELECT r.receipt_id, r.created_at, r.total_price, r.status, r.payment_method, r.user_information_id
                FROM receipt r
                JOIN user_information ui ON r.user_information_id = ui.user_information_id
                WHERE 1=1";
        $params = [];

        if ($filters['account_id'] && is_numeric($filters['account_id'])) {
            $sql .= " AND r.account_id = :account_id";
            $params['account_id'] = (int)$filters['account_id'];
        }

        if ($filters['start_date']) {
            $sql .= " AND r.created_at >= :start_date";
            $params['start_date'] = $filters['start_date'];
        }

        if ($filters['end_date']) {
            $sql .= " AND r.created_at <= :end_date";
            $params['end_date'] = $filters['end_date'];
        }

        if ($filters['district']) {
            $sql .= " AND ui.district LIKE :district";
            $params['district'] = '%' . $filters['district'] . '%';
        }

        if ($filters['status']) {
            $sql .= " AND r.status = :status";
            $params['status'] = $filters['status'];
        }

        $sql .= " ORDER BY r.created_at DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getReceiptById(int $receiptId): ?array {
        $sql = "SELECT receipt_id, created_at, total_price, status, payment_method, user_information_id
                FROM receipt
                WHERE receipt_id = :receipt_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['receipt_id' => $receiptId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updateReceiptStatus(int $receiptId, string $status): void {
        $sql = "UPDATE receipt SET status = :status WHERE receipt_id = :receipt_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'status' => $status,
            'receipt_id' => $receiptId
        ]);
    }
}