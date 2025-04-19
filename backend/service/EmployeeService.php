<?php
namespace service;
use repository\EmployeeRepository;

use Firebase\JWT\JWT;

const JWT_SECRET = 'web_2_phone_store';

use middleware\AuthMiddleware;

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
            "message" => "Đăng nhập thành công",
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
            $this->respond(400, ["message" => "Định dạng email không hợp lệ"]);
        }

        // Validate phone number
        if (!preg_match('/^\d{10}$/', $data['phone_number'])) {
            $this->respond(400, ["message" => "Định dạng số điện thoại không hợp lệ"]);
        }

        // Check if email or phone_number exists

        if (isset($data['email']) && $this->employeeRepository->employeeExists($data['email'])) {
            $this->respond(400, ["message" => "Email đã tồn tại"]);
        }

        if (isset($data['phone_number']) && $this->employeeRepository->employeeExists($data['phone_number'])) {
            $this->respond(400, ["message" => "Số điện thoại đã tồn tại"]);
        }

        // Check password strength
        if (!$this->isStrongPassword($data['password'])) {
            $this->respond(400, ["message" => "Mật khẩu phải dài ít nhất 6 ký tự,
                                    bao gồm một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt"]);
        }

        $createdEmployee = $this->employeeRepository->createEmployee($data);

        if (!$createdEmployee) {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi tạo nhân viên"]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Tạo nhân viên thành công",
            "employee" => $createdEmployee
        ]);
        exit;
    }

    public function getAllEmployees(): array
    {   
        $admin = AuthMiddleware::verifyToken();
        $adminRole = $admin['role_name'] ?? null;

        $full_name = $_GET['full_name'] ?? "";
        $role = $_GET['role'] ?? "";
        $limit = intval($_GET['limit'] ?? 10);
        $page = intval($_GET['page'] ?? 1);

        $employees = $this->employeeRepository->findAll($full_name, $role, $limit, $page, $adminRole);

        if(!$employees)
            throw new \PDOException('Không tìm thấy nhân viên', 404);
        
        else
            return $employees;
    }

    public function getEmployeeById(int $id)
    {
        $employee = $this->employeeRepository->findById($id);
        if(!$employee)
            throw new \PDOException('Không tìm thấy nhân viên', 404);
        
        else
            return $employee;
    }

    public function deleteEmployeeById(int $id)
    {
        $employee = $this->employeeRepository->deleteById($id);

        if(!$employee)
            throw new \PDOException('Không tìm thấy nhân viên', 404);
        
        else
            return json_encode(["message" => "Xóa nhân viên thành công"]);
    }

    public function updateEmployeeById(int $id, array $data): void
    {
        // Validate email format
        if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->respond(400, ["message" => "Định dạng email không hợp lệ"]);
        }

        // Validate phone number
        if (isset($data['phone_number']) && !preg_match('/^\d{10}$/', $data['phone_number'])) {
            $this->respond(400, ["message" => "Định dạng số điện thoại không hợp lệ"]);
        }

        // Check if email or phone_number exists

        if (isset($data['email']) && $this->employeeRepository->employeeExists($data['email'])) {
            $this->respond(400, ["message" => "Email đã tồn tại"]);
        }

        if (isset($data['phone_number']) && $this->employeeRepository->employeeExists($data['phone_number'])) {
            $this->respond(400, ["message" => "Số điện thoại đã tồn tại"]);
        }
        
        $updatedEmployee = $this->employeeRepository->updateById($id, $data);

        if (!$updatedEmployee) {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi cập nhật nhân viên"]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Cập nhật nhân viên thành côngy",
            "user" => $updatedEmployee
        ]);
        exit;
    }
}
?>