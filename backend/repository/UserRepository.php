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

    // public function userExists(string $username, string $email, string $phone_number): bool
    // {
    //     $sql = "SELECT COUNT(*) as count 
    //     FROM user_account 
    //     WHERE username = :username OR email = :email OR phone_number = :phone_number";

    //     $stmt = $this->pdo->prepare($sql);
    //     $stmt->bindValue(':username', $username, PDO::PARAM_STR);
    //     $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    //     $stmt->bindValue(':phone_number', $phone_number, PDO::PARAM_STR);
    //     $stmt->execute();

    //     return $stmt->fetchColumn() > 0;
    // }

    public function loginUser(string $username, string $password): ?array
    {
        $sql = "SELECT user_account_id, username, email, password 
        FROM user_account 
        WHERE username = :username";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return [
                "message" => "Username not found"
            ];
        }

        if (!password_verify($password, $user['password'])) {
            return [
                "message" => "Incorrect password"
            ];
        }

        return [
            "user" => [
                "id" => $user['user_account_id'],
                "username" => $user['username'],
                "email" => $user['email']
            ]
        ];

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

    public function createUser(array $data): ?int
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

        return $userAccountId;
    }    

    public function findAll(): array
    {
        $sql = "SELECT 
            ua.user_account_id, 
            ua.username, 
            ua.email, 
            ua.status, 
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
        ORDER BY ua.created_at desc";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id)
    {
        $sql = "SELECT 
            ua.user_account_id, 
            ua.username, 
            ua.email, 
            ua.status, 
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
        WHERE ua.user_account_id = :id";
        
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

        if (!$checkStmt->fetchColumn()) return false;

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
            return true;
        } 
        else {
            $this->pdo->rollBack();
            return false;
        }
    }


    // public function updateById(int $id, array $data)
    // {
    //     // Check if the user exists
    //     $checkSql = "SELECT COUNT(*) FROM user_account WHERE user_account_id = :id";
    //     $checkStmt = $this->pdo->prepare($checkSql);
    //     $checkStmt->bindValue(':id', $id, PDO::PARAM_INT);
    //     $checkStmt->execute();
    //     $userExists = $checkStmt->fetchColumn();

    //     if (!$userExists)
    //         return false;

    //     // Begin transaction
    //     $this->pdo->beginTransaction();

    //     // Update the user_account
    //     $updateSql = "UPDATE user_account SET 
    //                     username = :username, 
    //                     email = :email, 
    //                     status = :status 
    //                     WHERE user_account_id = :id";

    //     $updateStmt = $this->pdo->prepare($updateSql);
    //     $updateStmt->bindValue(':id', $id, PDO::PARAM_INT);
    //     $updateStmt->bindValue(':username', $data['username'], PDO::PARAM_STR);
    //     $updateStmt->bindValue(':email', $data['email'], PDO::PARAM_STR);
    //     $updateStmt->bindValue(':status', $data['status'], PDO::PARAM_STR);
    //     $updateStmt->execute();
        
    //     // Update the user_information
    //     $updateInfoSql = "UPDATE user_information SET 
    //                         full_name = :full_name, 
    //                         phone_number = :phone_number, 
    //                         house_number = :house_number, 
    //                         street = :street, 
    //                         ward = :ward, 
    //                         district = :district, 
    //                         city = :city 
    //                         WHERE account_id = :id";
            
    //     $updateInfoStmt = $this->pdo->prepare($updateInfoSql);
    //     $updateInfoStmt->bindValue(':id', $id, PDO::PARAM_INT);
    //     $updateInfoStmt->bindValue(':full_name', $data['full_name'], PDO::PARAM_STR);
    //     $updateInfoStmt->bindValue(':phone_number', $data['phone_number'], PDO::PARAM_STR);
    //     $updateInfoStmt->bindValue(':house_number', $data['house_number'], PDO::PARAM_STR);
    //     $updateInfoStmt->bindValue(':street', $data['street'], PDO::PARAM_STR);
    //     $updateInfoStmt->bindValue(':ward', $data['ward'], PDO::PARAM_STR);
    //     $updateInfoStmt->bindValue(':district', $data['district'], PDO::PARAM_STR);
    //     $updateInfoStmt->bindValue(':city', $data['city'], PDO::PARAM_STR);

    //     // $this->pdo->commit();

    //     // return $updateInfoStmt->execute();

    //     // Execute the update for user_information
    //     $updateInfoSuccess = $updateInfoStmt->execute();

    //     // If both updates succeed, commit the transaction
    //     if ($updateStmt->rowCount() > 0 && $updateInfoSuccess) {
    //         $this->pdo->commit();
    //         return $updateInfoSuccess;
    //     } else {
    //         // If any update fails, roll back the transaction
    //         $this->pdo->rollBack();
    //         return false;
    //     }
    // }
}

?>