<?php

namespace repository;
use service\OrderService;

use config\Database;
use PDO;

class OrderRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function createOrder(array $data): ?array
    {
        $this->pdo->beginTransaction();
    
        // Step 1: Insert new shipping info
        $sql = "INSERT INTO user_information (account_id, full_name, phone_number, house_number, street, ward, district, city) 
                VALUES (:account_id, :full_name, :phone_number, :house_number, :street, :ward, :district, :city)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':account_id', $data['account_id'], PDO::PARAM_INT);
        $stmt->bindValue(':full_name', $data['full_name']);
        $stmt->bindValue(':phone_number', $data['phone_number']);
        $stmt->bindValue(':house_number', $data['house_number']);
        $stmt->bindValue(':street', $data['street']);
        $stmt->bindValue(':ward', $data['ward']);
        $stmt->bindValue(':district', $data['district']);
        $stmt->bindValue(':city', $data['city']);
        $stmt->execute();
    
        $userInfoId = $this->pdo->lastInsertId();
    
        // Step 2: Insert into receipt
        $sql = "INSERT INTO receipt (account_id, user_information_id, total_price) 
                VALUES (:account_id, :user_information_id, :total_price)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':account_id', $data['account_id'], PDO::PARAM_INT);
        $stmt->bindValue(':user_information_id', $userInfoId, PDO::PARAM_INT);
        $stmt->bindValue(':total_price', $data['total_price'], PDO::PARAM_INT);
        $stmt->execute();
    
        $orderId = $this->pdo->lastInsertId();
    
        // Step 3: Insert order items
        $sql = "INSERT INTO receipt_detail (receipt_id, sku_id, quantity, price) 
                VALUES (:receipt_id, :sku_id, :quantity, :price)";
        $stmt = $this->pdo->prepare($sql);
    
        foreach ($data['items'] as $item) {
            $stmt->execute([
                ':receipt_id' => $orderId,
                ':sku_id' => $item['sku_id'],
                ':quantity' => $item['quantity'],
                ':price' => $item['price']
            ]);
        }
    
        $this->pdo->commit();
    
        return $this->findById($orderId);
    }    

    public function findAll(?string $address, 
                            ?string $status,
                            ?int    $limit = 10,
                            ?int    $page = 1,                        
                            bool    $includeDeleted = false): array
    {
        $conditions = [];
        $params = [];

        if (!$includeDeleted)
            $conditions[] = "ua.is_delete = FALSE";
        
        if ($address) {
            $conditions[] = "LOWER(ui.full_name) LIKE LOWER(:full_name)";
            $params[':full_name'] = '%'.$address.'%';            
        }

        if ($status) {
            $conditions[] = "ua.status = :status";
            $params[':status'] = $status;
        }

        $whereClause = "";
        if (!empty($conditions))
            $whereClause = " WHERE " . implode(" AND ", $conditions);
        
        $offset = ($page - 1) * $limit;

        $sql = "SELECT
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
            ui.city
        FROM user_account AS ua
        LEFT JOIN user_information AS ui 
            ON ua.user_account_id = ui.account_id
        $whereClause
        ORDER BY ua.created_at DESC
        LIMIT :limit OFFSET :offset";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        foreach ($params as $key => $value)
            $stmt->bindValue($key, $value);
    
        $stmt->execute();
        $users =  $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Total query (without LIMIT/OFFSET)
        $totalQuery = "SELECT COUNT(*) as total
                       FROM user_account AS ua
                       LEFT JOIN user_information AS ui 
                            ON ua.user_account_id = ui.account_id
                       $whereClause";

        $totalStmt = $this->pdo->prepare($totalQuery);
        foreach ($params as $key => $value)
            $totalStmt->bindValue($key, $value);

        $totalStmt->execute();
        $totalRow = $totalStmt->fetch(PDO::FETCH_ASSOC);
        $total = $totalRow['total'];
        $totalPages = ceil($total / $limit);

        return [
            'totalUsers' => $users,
            'totalPage' => $totalPages,
            'currentPage' => $page,
        ];
    }

    public function findById(int $id)
    {
            $sql = "SELECT 
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
                ui.city
            FROM user_account AS ua
            LEFT JOIN user_information AS ui 
                ON ua.user_account_id = ui.account_id
            WHERE ua.user_account_id = :id
            AND ua.is_delete = FALSE";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function deleteById(int $id)
    {
        $sql = "DELETE
                FROM user_account
                WHERE user_account_id = :id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateById(int $id, array $data)
    {
        // Check if the order exists
        $checkSql = "SELECT COUNT(*) FROM user_account WHERE user_account_id = :id";
        $checkStmt = $this->pdo->prepare($checkSql);
        $checkStmt->bindValue(':id', $id, PDO::PARAM_INT);
        $checkStmt->execute();

        if (!$checkStmt->fetchColumn()) 
            return false;

        $this->pdo->beginTransaction();

        // Prepare dynamic parts
        $accountFields = ['username', 'email', 'status'];
        $infoFields = ['full_name', 'phone_number', 'house_number', 'street', 'ward', 'district', 'city'];

        $accountSet = [];
        $accountParams = [':id' => $id];

        foreach ($accountFields as $field) {
            if (isset($data[$field])) {
                $accountSet[] = "$field = :$field";
                $accountParams[":$field"] = $data[$field];
            }
        }

        $infoSet = [];
        $infoParams = [':id' => $id];

        foreach ($infoFields as $field) {
            if (isset($data[$field])) {
                $infoSet[] = "$field = :$field";
                $infoParams[":$field"] = $data[$field];
            }
        }

        $success = true;

        // Update user_account
        if (!empty($accountSet)) {
            $updateSql = "UPDATE user_account SET " . implode(', ', $accountSet) . " WHERE user_account_id = :id";
            $stmt = $this->pdo->prepare($updateSql);
            $success = $stmt->execute($accountParams);
        }

        // Update user_information
        if ($success && !empty($infoSet)) {
            $updateInfoSql = "UPDATE user_information SET " . implode(', ', $infoSet) . " WHERE account_id = :id";
            $stmt = $this->pdo->prepare($updateInfoSql);
            $success = $stmt->execute($infoParams);
        }

        if ($success) {
            $this->pdo->commit();
            // return true;

            return $this->findById($id);
        } 
        else {
            $this->pdo->rollBack();
            return false;
        }
    }
}

?>