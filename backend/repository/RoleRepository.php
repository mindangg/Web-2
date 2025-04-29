<?php

namespace repository;
use service\roleService;

use config\Database;
use PDO;

class RoleRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function findAll(): array
    {
        $sql = "SELECT
                    r.role_id, 
                    r.role_name, 
                    f.functional_id, 
                    f.function_name, 
                    rf.action
                FROM role AS r
                LEFT JOIN role_function rf ON r.role_id = rf.role_id
                LEFT JOIN functional f ON rf.function_id = f.functional_id
                ORDER BY r.role_id ASC";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $rows =  $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Change to array
        $roles = [];

        foreach ($rows as $row) {
            $roleId = $row['role_id'];
            $funcId = $row['functional_id'];
        
            if (!isset($roles[$roleId])) {
                $roles[$roleId] = [
                    'role_id' => $roleId,
                    'role_name' => $row['role_name'],
                    'functions' => []
                ];
            }
        
            if ($funcId === null) 
                continue;
        
            if (!isset($roles[$roleId]['functions'][$funcId])) {
                $roles[$roleId]['functions'][$funcId] = [
                    'functional_id' => $funcId,
                    'function_name' => $row['function_name'],
                    'actions' => []
                ];
            }
        
            $roles[$roleId]['functions'][$funcId]['actions'][] = $row['action'];
        }

        foreach ($roles as &$role)
            $role['functions'] = array_values($role['functions']);
        
        return array_values($roles);
    }    

    public function findById(int $id)
    {
        $sql = "SELECT
                    r.role_id, 
                    r.role_name, 
                    f.functional_id, 
                    f.function_name, 
                    rf.action
                FROM role AS r
                LEFT JOIN role_function rf ON r.role_id = rf.role_id
                LEFT JOIN functional f ON rf.function_id = f.functional_id
                WHERE r.role_id = $id
                ORDER BY r.role_id ASC";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $rows =  $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Change to array
        $roles = [];

        foreach ($rows as $row) {
            $roleId = $row['role_id'];
            $funcId = $row['functional_id'];
        
            if (!isset($roles[$roleId])) {
                $roles[$roleId] = [
                    'role_id' => $roleId,
                    'role_name' => $row['role_name'],
                    'functions' => []
                ];
            }
        
            if ($funcId === null) 
                continue;
        
            if (!isset($roles[$roleId]['functions'][$funcId])) {
                $roles[$roleId]['functions'][$funcId] = [
                    'functional_id' => $funcId,
                    'function_name' => $row['function_name'],
                    'actions' => []
                ];
            }
        
            $roles[$roleId]['functions'][$funcId]['actions'][] = $row['action'];
        }

        foreach ($roles as &$role)
            $role['functions'] = array_values($role['functions']);
        
        return array_values($roles);
    }
    
    // public function createRole(array $data): ?array
    // {
    //     $this->pdo->beginTransaction();

    //     $sql = "INSERT INTO role (role_name) 
    //             VALUES (:role_name)";
    //     $stmt = $this->pdo->prepare($sql);
    //     $stmt->bindValue(':role_name', $data['role_name']);
    //     $stmt->execute();
    
    //     $roleId = $this->pdo->lastInsertId();

    //     $insertFunctional = $this->pdo->prepare(
    //         "INSERT INTO functional (function_name) VALUES (:function_name)"
    //     );

    //     $insertRoleFunction = $this->pdo->prepare(
    //         "INSERT INTO role_function (role_id, function_id, action) 
    //          VALUES (:role_id, :function_id, :action)"
    //     );

    //     foreach ($data['functions'] as $function) {
    //         $functionId = $function['function_id'] ?? null;

    //         if (!$functionId && isset($function['function_name'])) {
    //             $insertFunctional->execute([
    //                 ':function_name' => $function['function_name']
    //             ]);
    //             $functionId = $this->pdo->lastInsertId();
    //         }

    //         foreach ($function['actions'] as $action) {
    //             $insertRoleFunction->execute([
    //                 ':role_id' => $roleId,
    //                 ':function_id' => $functionId,
    //                 ':action' => $action
    //             ]);
    //         }
    //     }

    //     $this->pdo->commit();

    //     return $this->findById($roleId);
    // }   
    
    public function createRole(array $data): ?array
    {

        $this->pdo->beginTransaction();

        $sql = "INSERT INTO role (role_name) 
                VALUES (:role_name)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':role_name', $data['role_name']);
        $stmt->execute();
    
        $roleId = $this->pdo->lastInsertId();

        $sql = "INSERT INTO role_function (role_id, function_id, action) 
                VALUES (:role_id, :function_id, :action)";
        $stmt = $this->pdo->prepare($sql);

        foreach ($data['functions'] as $function) {
            foreach ($function['actions'] as $action) {
                $stmt->execute([
                    ':role_id' => $roleId,
                    ':function_id' => $function['function_id'],
                    ':action' => $action
                ]);
            }
        }

        $this->pdo->commit();

        return $this->findById($roleId);
    }


    public function deleteById(int $id)
    {
        $sql = "DELETE
                FROM role
                WHERE role_id = :id";

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