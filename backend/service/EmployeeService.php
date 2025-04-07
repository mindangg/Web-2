<?php
namespace service;
use repository\EmployeeRepository;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

const JWT_SECRET = 'web2jsonwebtoken';

class EmployeeService
{
    private EmployeeRepository $employeeRepository;

    public function __construct() {
        $this->employeeRepository = new EmployeeRepository();
    }

    private function respond(int $code, array $message): void 
    {
        http_response_code($code);
        echo json_encode($message);
        exit;
    }

    public function loginEmployee(string $email, string $password): void
    {
        $employee= $this->employeeRepository->loginEmployee($email, $password);

        if (!isset($employee)) {
            $this->respond(400, ["message" => $employee["message"]]);
        }

        $payload = [
            "id" => $employee['employee_id'],
            "exp" => time() + (3 * 24 * 60 * 60) // 3 days
        ];

        $jwt = JWT::encode($payload, JWT_SECRET, "HS256");

        http_response_code(200);
        echo json_encode([
            "message" => "Employee login successfully",
            "token" => $jwt,
            "employee" => $employee
        ]);
        exit;
    }

    private function isStrongPassword(string $password): bool
    {
        return preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/', $password);
    }

    public function createEmployee(array $data): void
    {
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->respond(400, ["message" => "Invalid email format"]);
        }

        // Validate phone number
        if (!preg_match('/^\d{10}$/', $data['phone_number'])) {
            $this->respond(400, ["message" => "Invalid phone number format"]);
        }

        // Check if email or phone_number exists

        if (isset($data['email']) && $this->employeeRepository->employeeExists($data['email'])) {
            $this->respond(400, ["message" => "Email already exists"]);
        }

        if (isset($data['phone_number']) && $this->employeeRepository->employeeExists($data['phone_number'])) {
            $this->respond(400, ["message" => "Phone_number already exists"]);
        }

        // Check password strength
        if (!$this->isStrongPassword($data['password'])) {
            $this->respond(400, ["message" => "Password must be at least 6 characters long, 
                                include an uppercase letter, a lowercase letter, a number, and a special character"]);
        }

        $createdEmployee = $this->employeeRepository->createEmployee($data);

        if (!$createdEmployee) {
            http_response_code(500);
            echo json_encode(["message" => "Error creating employee"]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Created employee successfully",
            "employee" => $createdEmployee
        ]);
        exit;
    }

    public function getAllEmployees(): array
    {
        $employees = $this->employeeRepository->findAll();

        if(!$employees)
            throw new \PDOException('No employees found', 404);
        
        else
            return $employees;
    }

    public function getEmployeeById(int $id)
    {
        $employee = $this->employeeRepository->findById($id);
        if(!$employee)
            throw new \PDOException('Employee not found', 404);
        
        else
            return $employee;
    }

    public function deleteEmployeeById(int $id)
    {
        $employee = $this->employeeRepository->deleteById($id);

        if(!$employee)
            throw new \PDOException('Employee not found', 404);
        
        else
            return json_encode(["message" => "Delete employee successfully"]);
    }

    public function updateEmployeeById(int $id, array $data): void
    {
        // Validate email format
        if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->respond(400, ["message" => "Invalid email format"]);
        }

        // Validate phone number
        if (isset($data['phone_number']) && !preg_match('/^\d{10}$/', $data['phone_number'])) {
            $this->respond(400, ["message" => "Invalid phone number format"]);
        }

        // Check if email or phone_number exists

        if (isset($data['email']) && $this->employeeRepository->employeeExists($data['email'])) {
            $this->respond(400, ["message" => "Email already exists"]);
        }

        if (isset($data['phone_number']) && $this->employeeRepository->employeeExists($data['phone_number'])) {
            $this->respond(400, ["message" => "Phone_number already exists"]);
        }
        
        $updatedEmployee = $this->employeeRepository->updateById($id, $data);

        if (!$updatedEmployee) {
            http_response_code(500);
            echo json_encode(["message" => "Error updating employee"]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Updated employee successfully",
            "user" => $updatedEmployee
        ]);
        exit;
    }
}
?>