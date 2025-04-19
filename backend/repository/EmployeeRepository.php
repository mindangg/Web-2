<?php

namespace repository;
use service\EmployeeService;

use config\Database;
use PDO;

class EmployeeRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function employeeExists(?string $email = null, ?string $phone_number = null): bool
    {
        $queryParts = [];
        $params = [];

        if ($email !== null) {
            $queryParts[] = "email = :email";
            $params[':email'] = $email;
        }

        if ($phone_number !== null) {
            $queryParts[] = "phone_number = :phone_number";
            $params[':phone_number'] = $phone_number;
        }

        if (empty($queryParts)) return false;

        $sql = "SELECT COUNT(*) FROM employee WHERE " . implode(" OR ", $queryParts);
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchColumn() > 0;
    }

    public function loginEmployee(string $email, string $password): ?array
    {
        $sql = "SELECT employee_id, email, password
        FROM employee
        WHERE email = :email";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $employee = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$employee) {
            return [
                "message" => "Không tìm thấy email"
            ];
        }

        // if (!password_verify($password, $employee['password'])) {
        //     return [
        //         "message" => "Sai mật khẩu"
        //     ];
        // }

        return $this->findById($employee['employee_id']);
    }

    public function createEmployee(array $data): ?array
    {
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        $sql = "INSERT INTO employee (full_name, email, password, phone_number, role) 
                VALUES (:full_name, :email, :password, :phone_number, :role)";

        $stmt = $this->pdo->prepare($sql);

        $stmt->bindValue(':full_name', $data['full_name'], PDO::PARAM_STR);
        $stmt->bindValue(':email', $data['email'], PDO::PARAM_STR);
        $stmt->bindValue(':password', $hashedPassword, PDO::PARAM_STR);
        $stmt->bindValue(':phone_number', $data['phone_number'], PDO::PARAM_STR);
        $stmt->bindValue(':role', $data['role'], PDO::PARAM_INT);
        $stmt->execute();

        return $this->findById($this->pdo->lastInsertId());
    }    

    public function findAll(?string $full_name, 
                            ?string $role,
                            ?int    $limit = 10,
                            ?int    $page = 1,
                            ?string $adminRole): array
    {
        $conditions = [];
        $params = [];

        if ($adminRole !== 'Manager') {
            $conditions[] = "r.role_name != :excludeManager";
            $params[':excludeManager'] = 'Manager';
        }           
        
        if ($full_name) {
            $conditions[] = "LOWER(e.full_name) LIKE LOWER(:full_name)";
            $params[':full_name'] = '%'.$full_name.'%';            
        }

        if ($role) {
            $conditions[] = "r.role_name = :role";
            $params[':role'] = $role;
        }

        $whereClause = "";
        if (!empty($conditions))
            $whereClause = " WHERE " . implode(" AND ", $conditions);
        
        $offset = ($page - 1) * $limit;

        $sql = "SELECT 
            e.employee_id, 
            e.full_name, 
            e.email, 
            e.phone_number, 
            e.role, 
            DATE_FORMAT(e.created_at, '%d/%m/%Y') as created_at, 
            r.role_id, 
            r.role_name
        FROM employee AS e
        INNER JOIN role AS r 
            ON e.role = r.role_id
        $whereClause
        ORDER BY FIELD(e.role, 1, 2, 3, 4), e.created_at DESC
        LIMIT :limit OFFSET :offset";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        foreach ($params as $key => $value)
            $stmt->bindValue($key, $value);
    
        $stmt->execute();
        $employees =  $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Total query (without LIMIT/OFFSET)
        $totalQuery = "SELECT COUNT(*) as total
                        FROM employee AS e
                        INNER JOIN role AS r 
                            ON e.role = r.role_id
                        $whereClause";

        $totalStmt = $this->pdo->prepare($totalQuery);
        foreach ($params as $key => $value)
            $totalStmt->bindValue($key, $value);

        $totalStmt->execute();
        $totalRow = $totalStmt->fetch(PDO::FETCH_ASSOC);
        $total = $totalRow['total'];
        $totalPages = ceil($total / $limit);

        return [
            'totalEmployees' => $employees,
            'totalPage' => $totalPages,
            'currentPage' => $page,
        ];
    }

    public function findById(int $id)
    {
        $sql = "SELECT 
            e.employee_id, 
            e.full_name, 
            e.email, 
            e.role, 
            DATE_FORMAT(e.created_at, '%d/%m/%Y') as created_at, 
            r.role_id, 
            r.role_name
        FROM employee AS e
        INNER JOIN role AS r 
            ON e.role = r.role_id
        WHERE e.employee_id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function deleteById(int $id)
    {
        // Check if the user exists
        $checkSql = "SELECT COUNT(*) FROM employee WHERE employee_id = :id";
        $checkStmt = $this->pdo->prepare($checkSql);
        $checkStmt->bindValue(':id', $id, PDO::PARAM_INT);
        $checkStmt->execute();
        $employeeExists = $checkStmt->fetchColumn();

        if (!$employeeExists)
            return false;

        $sql = "DELETE
        FROM employee
        WHERE employee_id = :id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateById(int $id, array $data)
    {
        // Check if the employee exists
        $checkSql = "SELECT COUNT(*) FROM employee WHERE employee_id = :id";
        $checkStmt = $this->pdo->prepare($checkSql);
        $checkStmt->bindValue(':id', $id, PDO::PARAM_INT);
        $checkStmt->execute();

        if (!$checkStmt->fetchColumn()) 
            return false;

        // Prepare dynamic parts
        $accountFields = ['full_name', 'email', 'phone_number', 'role'];
        $accountSet = [];
        $accountParams = [];

        foreach ($accountFields as $field) {
            if (isset($data[$field])) {
                $accountSet[] = "$field = :$field";
                $accountParams[":$field"] = $data[$field];
            }
        }

        $success = true;

        // Update employee
        if (!empty($accountSet)) {
            $updateSql = "UPDATE employee SET " . implode(', ', $accountSet) . " WHERE employee_id = :id";
            $stmt = $this->pdo->prepare($updateSql);
            $accountParams[':id'] = $id;
            $success = $stmt->execute($accountParams);
        }

        if ($success) {
            return $this->findById($id);
        } 
        else {
            return false;
        }
    }
}

?>