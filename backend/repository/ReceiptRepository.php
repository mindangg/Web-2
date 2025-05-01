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
}