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
        ?int $limit = 10,
        ?int $page = 1,
        ?string $adminRole): array
    {
        $conditions = [];
        $params = [];

        if ($full_name) {
            $conditions[] = "LOWER(e.full_name) LIKE LOWER(:full_name)";
            $params[':full_name'] = '%' . $full_name . '%';
        }

        if ($role) {
            $conditions[] = "r.role_id = :role";
            $params[':role'] = $role;
        }

        $whereClause = !empty($conditions)
        ? " WHERE " . implode(" AND ", $conditions)
        : "";

        $offset = ($page - 1) * $limit;

        // Step 1: Get paginated employee IDs
        $idQuery = "SELECT DISTINCT e.employee_id
        FROM employee AS e
        LEFT JOIN role AS r ON e.role = r.role_id
        $whereClause
        ORDER BY e.employee_id ASC
        LIMIT :limit OFFSET :offset";

        $idStmt = $this->pdo->prepare($idQuery);
        $idStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $idStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        foreach ($params as $key => $value) {
            $idStmt->bindValue($key, $value);
        }
        $idStmt->execute();
        $employeeIds = $idStmt->fetchAll(PDO::FETCH_COLUMN);

        if (empty($employeeIds)) {
        return [
            'totalEmployees' => [],
            'totalPage' => 0,
            'currentPage' => $page,
            ];
        }

        // Step 2: Query full data for those employees
        $placeholders = implode(',', array_fill(0, count($employeeIds), '?'));

        $sql = "SELECT 
                    e.employee_id, 
                    e.full_name, 
                    e.email, 
                    e.phone_number, 
                    e.role AS role_ref, 
                    DATE_FORMAT(e.created_at, '%d/%m/%Y') as created_at, 
                    r.role_id, 
                    r.role_name, 
                    f.functional_id, 
                    f.function_name, 
                    rf.action
                    FROM employee AS e
                    LEFT JOIN role AS r 
                        ON e.role = r.role_id
                    LEFT JOIN role_function rf 
                        ON r.role_id = rf.role_id
                    LEFT JOIN functional f 
                        ON rf.function_id = f.functional_id
                    WHERE e.employee_id IN ($placeholders)
                    ORDER BY e.employee_id ASC";

        $stmt = $this->pdo->prepare($sql);
        foreach ($employeeIds as $i => $id) {
            $stmt->bindValue($i + 1, $id, PDO::PARAM_INT);
        }

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Step 3: Format result
        $employees = [];
        foreach ($rows as $row) {
            $empId = $row['employee_id'];
            $funcId = $row['functional_id'];

            if (!isset($employees[$empId])) {
                $employees[$empId] = [
                        'employee_id' => $empId,
                        'full_name' => $row['full_name'],
                        'email' => $row['email'],
                        'phone_number' => $row['phone_number'],
                        'created_at' => $row['created_at'],
                        'role' => [
                        'role_id' => $row['role_id'],
                        'role_name' => $row['role_name'],
                        'functions' => []
                    ]   
                ];
            }

        if ($funcId !== null) {
            if (!isset($employees[$empId]['role']['functions'][$funcId])) {
                $employees[$empId]['role']['functions'][$funcId] = [
                'functional_id' => $funcId,
                'function_name' => $row['function_name'],
                'actions' => []
            ];
        }

        $employees[$empId]['role']['functions'][$funcId]['actions'][] = $row['action'];
        }
        }

        foreach ($employees as &$emp) {
            $emp['role']['functions'] = array_values($emp['role']['functions']);
        }

        // Step 4: Count total employees (without LIMIT)
        $totalQuery = "SELECT COUNT(DISTINCT e.employee_id) as total
                        FROM employee AS e
                        LEFT JOIN role AS r 
                        ON e.role = r.role_id
                        $whereClause";

        $totalStmt = $this->pdo->prepare($totalQuery);
        foreach ($params as $key => $value) {
            $totalStmt->bindValue($key, $value);
        }
        $totalStmt->execute();
        $totalRow = $totalStmt->fetch(PDO::FETCH_ASSOC);
        $total = (int) $totalRow['total'];
        $totalPages = ceil($total / $limit);

        return [
            'totalEmployees' => array_values($employees),
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
            e.phone_number, 
            e.role AS role_ref, 
            DATE_FORMAT(e.created_at, '%d/%m/%Y') as created_at, 
            r.role_id, 
            r.role_name, 
            f.functional_id, 
            f.function_name, 
            rf.action
            FROM employee AS e
            LEFT JOIN role AS r 
                ON e.role = r.role_id
            LEFT JOIN role_function rf 
                ON r.role_id = rf.role_id
            LEFT JOIN functional f 
                ON rf.function_id = f.functional_id
            WHERE e.employee_id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $employees = [];
        foreach ($rows as $row) {
            $empId = $row['employee_id'];
            $funcId = $row['functional_id'];

            if (!isset($employees[$empId])) {
                $employees[$empId] = [
                        'employee_id' => $empId,
                        'full_name' => $row['full_name'],
                        'email' => $row['email'],
                        'phone_number' => $row['phone_number'],
                        'created_at' => $row['created_at'],
                        'role' => [
                        'role_id' => $row['role_id'],
                        'role_name' => $row['role_name'],
                        'functions' => []
                    ]   
                ];
            }

        if ($funcId !== null) {
            if (!isset($employees[$empId]['role']['functions'][$funcId])) {
                $employees[$empId]['role']['functions'][$funcId] = [
                'functional_id' => $funcId,
                'function_name' => $row['function_name'],
                'actions' => []
            ];
        }

        $employees[$empId]['role']['functions'][$funcId]['actions'][] = $row['action'];
        }
        }

        foreach ($employees as &$emp) {
            $emp['role']['functions'] = array_values($emp['role']['functions']);
        }

        return array_values($employees);
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