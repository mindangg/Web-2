<?php

namespace controller;

use service\EmployeeService;

use middleware\AuthMiddleware;

class EmployeeController
{
    private EmployeeService $employeeService;

    public function __construct()
    {
        $this->employeeService = new EmployeeService();
    }

    public function processRequest(string $method, ?string $param): void
    {
        switch ($method) {
            // AuthMiddleware::verifyToken();
            case "GET":
                if (is_numeric($param))
                    $this->getEmployeeById((int)$param);
                
                else
                    $this->getAllEmployees();
        
                break;

            case "POST":
                if ($param === "login")
                    $this->loginEmployee();

                else if ($param === "create")
                    $this->createEmployee();
                
                else {
                    http_response_code(400);
                    echo json_encode(["error" => "Invalid POST request"]);
                }
                break;

            case "DELETE":
                $this->deleteEmployee((int)$param);
                break;

            case "PATCH":
                $this->updateEmployee((int)$param);
                break;
                
            default:
                http_response_code(405);
                header("Allow: GET POST PATCH DELETE");
        }
    }

    private function validateRequiredFields(array $data, array $fields): ?string
    {
        foreach ($fields as $field) {
            if (empty($data[$field]))
                return "Please fill in your $field";
        }
        return null;
    }

    private function loginEmployee(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validationError = $this->validateRequiredFields($data, ["email", "password"]);
        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
        }

        else
            $employee = $this->employeeService->loginEmployee($data["email"], $data["password"]);

        echo json_encode($employee);
    }

    private function createEmployee(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
    
        // Validate input
        $validationError = $this->validateRequiredFields($data, ["full_name", "email", "password", "phone_number", "role"]);

        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
        }
        
        else
            $employee = $this->employeeService->createEmployee($data);
    
        echo json_encode($employee);
    }

    private function getAllEmployees(): void
    {
        $response = $this->employeeService->getAllEmployees();
        echo json_encode($response);
    }

    private function getEmployeeById(int $id): void
    {
        $employee = $this->employeeService->getEmployeeById($id);
        echo json_encode($employee);
    }
    
    private function deleteEmployee(int $id): void
    {
        $employee = $this->employeeService->deleteEmployeeById($id);
        echo json_encode($employee);
    }

    private function updateEmployee(int $id): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $employee = $this->employeeService->updateEmployeeById($id, $data);
        echo json_encode($employee);
    }
}
?>