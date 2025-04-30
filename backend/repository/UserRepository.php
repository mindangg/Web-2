<?php

namespace repository;
use service\UserService;

use config\Database;
use PDO;

class UserRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function userExists(?string $username = null, ?string $email = null, ?string $phone_number = null): bool
    {
        $queryParts = [];
        $params = [];

        if ($username !== null) {
            $queryParts[] = "username = :username";
            $params[':username'] = $username;
        }

        if ($email !== null) {
            $queryParts[] = "email = :email";
            $params[':email'] = $email;
        }

        if ($phone_number !== null) {
            $queryParts[] = "phone_number = :phone_number";
            $params[':phone_number'] = $phone_number;
        }

        if (empty($queryParts)) return false;

        $sql = "SELECT COUNT(*) FROM user_account WHERE " . implode(" OR ", $queryParts);
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchColumn() > 0;
    }

    public function loginUser(string $username, string $password)
    {
        $sql = "SELECT user_account_id, username, email, password, status, is_delete 
        FROM user_account 
        WHERE username = :username";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return [
                "message" => "Không tìm thấy username"
            ];
        }

        if ($user['status'] == 'Bị khóa') {
            return [
                "message" => "Tài khoản này đã bị khóa"
            ];
        }

        if ($user['is_delete']) {
            return [
                "message" => "Tài khoản này đã bị xóa"
            ];
        }

        // if (!password_verify($password, $user['password'])) {
        //     return [
        //         "message" => "Sai mật khẩu"
        //     ];
        // }

        return $this->findById($user['user_account_id']);
    }

    public function signupUser(string $username, string $email, string $password): ?int
    {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $sql = "INSERT INTO user_account (username, email, password) VALUES (:username, :email, :password)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':password', $hashedPassword, PDO::PARAM_STR);
        $stmt->execute();

        return $this->pdo->lastInsertId();
    }

    public function createUser(array $data): ?array
    {
        // Transaction ensure both success or failed
        $this->pdo->beginTransaction();
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        $sql = "INSERT INTO user_account (username, email, password) 
                VALUES (:username, :email, :password)";
        $stmt = $this->pdo->prepare($sql);

        $stmt->bindValue(':username', $data['username'], PDO::PARAM_STR);
        $stmt->bindValue(':email', $data['email'], PDO::PARAM_STR);
        $stmt->bindValue(':password', $hashedPassword, PDO::PARAM_STR);
        $stmt->execute();

        // Get the last inserted user_account_id
        $userAccountId = $this->pdo->lastInsertId();

        $sql = "INSERT INTO user_information (account_id, full_name, phone_number, house_number, street, ward, district, city) 
                VALUES (:account_id, :full_name, :phone_number, :house_number, :street, :ward, :district, :city)";

        $stmt = $this->pdo->prepare($sql);

        $stmt->bindValue(':account_id', $userAccountId, PDO::PARAM_INT);
        $stmt->bindValue(':full_name', $data['full_name'], PDO::PARAM_STR);
        $stmt->bindValue(':phone_number', $data['phone_number'], PDO::PARAM_STR);
        $stmt->bindValue(':house_number', $data['house_number'], PDO::PARAM_STR);
        $stmt->bindValue(':street', $data['street'], PDO::PARAM_STR);
        $stmt->bindValue(':ward', $data['ward'], PDO::PARAM_STR);
        $stmt->bindValue(':district', $data['district'], PDO::PARAM_STR);
        $stmt->bindValue(':city', $data['city'], PDO::PARAM_STR);
        $stmt->execute();

        // Commit the transaction to make sure both success or fail
        $this->pdo->commit();

        return $this->findById($userAccountId);
    }    

    public function findAll(?string $full_name, 
                            ?string $status,
                            ?int    $limit = 10,
                            ?int    $page = 1,                        
                            bool    $includeDeleted = false): array
    {
        $conditions = [];
        $params = [];

        if (!$includeDeleted)
            $conditions[] = "ua.is_delete = FALSE";
        
        if ($full_name) {
            $conditions[] = "LOWER(ui.full_name) LIKE LOWER(:full_name)";
            $params[':full_name'] = '%'.$full_name.'%';            
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
        ORDER BY ua.user_account_id ASC
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
        // Check if the user exists
        $checkSql = "SELECT COUNT(*) FROM user_account WHERE user_account_id = :id";
        $checkStmt = $this->pdo->prepare($checkSql);
        $checkStmt->bindValue(':id', $id, PDO::PARAM_INT);
        $checkStmt->execute();
        $userExists = $checkStmt->fetchColumn();

        if (!$userExists)
            return false;

        // function to check if the account has order
        // if (true)
        // $sql = "UPDATE user_account
        //         SET is_delete = TRUE
        //         WHERE user_account_id = :id;"

        $sql = "DELETE
                FROM user_account
                WHERE user_account_id = :id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateById(int $id, array $data)
    {
        // Check if the user exists
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

    //address
    public function getUserAddresses(int $userId): array
    {
        $sql = "SELECT user_information_id, full_name, phone_number, house_number, street, ward, district, city, is_default
                FROM user_information
                WHERE account_id = :user_id
                ORDER BY is_default DESC, user_information_id ASC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addUserAddress(array $data): array
    {
        // Check if this is the first address to set as default
        $sqlCheck = "SELECT COUNT(*) FROM user_information WHERE account_id = :account_id";
        $stmtCheck = $this->pdo->prepare($sqlCheck);
        $stmtCheck->bindValue(':account_id', $data['account_id'], PDO::PARAM_INT);
        $stmtCheck->execute();
        $isFirstAddress = $stmtCheck->fetchColumn() == 0;

        $sql = "INSERT INTO user_information (
                    account_id, full_name, phone_number, house_number, street, ward, district, city, is_default
                ) VALUES (
                    :account_id, :full_name, :phone_number, :house_number, :street, :ward, :district, :city, :is_default
                )";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':account_id', $data['account_id'], PDO::PARAM_INT);
        $stmt->bindValue(':full_name', $data['full_name'], PDO::PARAM_STR);
        $stmt->bindValue(':phone_number', $data['phone_number'], PDO::PARAM_STR);
        $stmt->bindValue(':house_number', $data['house_number'], PDO::PARAM_STR);
        $stmt->bindValue(':street', $data['street'], PDO::PARAM_STR);
        $stmt->bindValue(':ward', $data['ward'], PDO::PARAM_STR);
        $stmt->bindValue(':district', $data['district'], PDO::PARAM_STR);
        $stmt->bindValue(':city', $data['city'], PDO::PARAM_STR);
        $stmt->bindValue(':is_default', $isFirstAddress ? 1 : 0, PDO::PARAM_BOOL);
        $stmt->execute();

        $addressId = $this->pdo->lastInsertId();

        $sqlSelect = "SELECT user_information_id, full_name, phone_number, house_number, street, ward, district, city, is_default
                      FROM user_information WHERE user_information_id = :address_id";
        $stmtSelect = $this->pdo->prepare($sqlSelect);
        $stmtSelect->bindValue(':address_id', $addressId, PDO::PARAM_INT);
        $stmtSelect->execute();
        return $stmtSelect->fetch(PDO::FETCH_ASSOC);
    }
}

?>