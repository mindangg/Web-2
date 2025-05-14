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
                    ':function_id' => $function['functional_id'],
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
        $this->pdo->beginTransaction();

        $sql = "UPDATE role 
                SET role_name = :role_name 
                WHERE role_id = :role_id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':role_id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':role_name', $data['role_name'], PDO::PARAM_STR);
        $stmt->execute();

        // Delete exist rf
        $sql = "DELETE 
                FROM role_function 
                WHERE role_id = :role_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':role_id', $id, PDO::PARAM_INT);
        $stmt->execute();

        // Insert new rf
        $sql = "INSERT INTO role_function (role_id, function_id, action)
                VALUES (:role_id, :function_id, :action)";
        $stmt = $this->pdo->prepare($sql);

        foreach ($data['functions'] as $function) {
            foreach ($function['actions'] as $action) {
                $stmt->execute([
                    ':role_id' => $id,
                    ':function_id' => $function['functional_id'],
                    ':action' => $action
                ]);
            }
        }

        $this->pdo->commit();

        return $this->findById($id);
    }
}

?>