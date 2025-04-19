<?php
namespace service;
use repository\userRepository;

use Firebase\JWT\JWT;

const JWT_SECRET = 'web_2_phone_store';

class UserService
{
    private UserRepository $userRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
    }

    private function respond(int $code, array $message): void 
    {
        http_response_code($code);
        echo json_encode($message);
        exit;
    }

    public function loginUser(string $username, string $password): void
    {
        $user= $this->userRepository->loginUser($username, $password);

        if (isset($user["message"])) {
            $this->respond(400, ["message" => $user["message"]]);
        }

        $payload = [
            "id" => $user['user_account_id'],
            "exp" => time() + (3 * 24 * 60 * 60) // 3 days
        ];

        $jwt = JWT::encode($payload, JWT_SECRET, "HS256");

        http_response_code(200);
        echo json_encode([
            "message" => "Đăng nhập thành công",
            "token" => $jwt,
            "user" => $user
        ]);
        exit;
    }

    private function isStrongPassword(string $password): bool
    {
        return preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/', $password);
    }

    public function signupUser(string $username, string $email, string $password): void
    {
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->respond(400, ["message" => "Định dạng email không hợp lệ"]);
        }

        // Check if username or email exists
        if (isset($data['username']) && $this->userRepository->userExists($data['username'])) {
            $this->respond(400, ["message" => "Username đã tồn tại"]);
        }

        if (isset($data['email']) && $this->userRepository->userExists($data['email'])) {
            $this->respond(400, ["message" => "Email đã tồn tại"]);
        }

        // Check password strength
        if (!$this->isStrongPassword($password)) {
            $this->respond(400, ["message" => "Mật khẩu phải dài ít nhất 6 ký tự,
                                    bao gồm một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt"]);
        }

        $userId = $this->userRepository->signupUser($username, $email, $password);

        if (!$userId) {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi đăng ký"]);
        }

        $payload = [
            "user_id" => $userId,
            "exp" => time() + (3 * 24 * 60 * 60) // 3 days
        ];
    
        $jwt = JWT::encode($payload, JWT_SECRET, "HS256");

        http_response_code(200);
        echo json_encode([
            "message" => "Đăng ký thành công",
            "token" => $jwt,
            "user" => [
                "user_account_id" => $userId,
                "username" => $username,
                "email" => $email
            ]
        ]);
        exit;
    }

    public function createUser(array $data)
    {
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->respond(400, ["message" => "Định dạng email không hợp lệ"]);
        }

        // Validate phone number
        if (!preg_match('/^\d{10}$/', $data['phone_number'])) {
            $this->respond(400, ["message" => "Định dạng số điện thoại không hợp lệ"]);
        }

        // Validate address fields
        // $fields = ['house_number', 'street', 'ward', 'district', 'city'];
        // $patterns = [
        //     'house_number' => '/^[\w\s\-\/]+$/',
        //     'street'       => '/^[a-zA-Z\s\-\.]+$/u',
        //     'ward'         => '/^[a-zA-Z\s\-\.]+$/u',
        //     'district'     => '/^[a-zA-Z\s\-\.]+$/u',
        //     'city'         => '/^[a-zA-Z\s\-\.]+$/u'
        // ];

        // foreach ($fields as $field) {
        //     if (empty($data[$field]) || !preg_match($patterns[$field], $data[$field])) {
        //         $this->respond(400, ["message" => ucfirst(str_replace('_', ' ', $field)) . " is invalid"]);
        //     }
        // }

        // Check if username or email or phone_number exists
        if (isset($data['username']) && $this->userRepository->userExists($data['username'])) {
            $this->respond(400, ["message" => "Username đã tồn tại"]);
        }

        if (isset($data['email']) && $this->userRepository->userExists($data['email'])) {
            $this->respond(400, ["message" => "Email đã tồn tại"]);
        }

        if (isset($data['phone_number']) && $this->userRepository->userExists($data['phone_number'])) {
            $this->respond(400, ["message" => "Số điện thoại đã tồn tại"]);
        }

        // Check password strength
        if (!$this->isStrongPassword($data['password'])) {
            $this->respond(400, ["message" => "Mật khẩu phải dài ít nhất 6 ký tự,
                                    bao gồm một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt"]);
        }

        $createdUser = $this->userRepository->createUser($data);

        if (!$createdUser) {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi tạo người dùng"]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Tạo người dùng thành công",
            "user" => $createdUser
        ]);
        exit;
    }

    public function getAllUsers(): array
    {
        $full_name = $_GET['full_name'] ?? "";
        $status = $_GET['status'] ?? "";
        $limit = intval($_GET['limit'] ?? 10);
        $page = intval($_GET['page'] ?? 1);
    
        $users = $this->userRepository->findAll($full_name, $status, $limit, $page);

        if(!$users)
            throw new \PDOException('Không tìm thấy người dùng', 404);
        
        else
            return $users;
    }

    public function getUserById(int $id)
    {
        $user = $this->userRepository->findById($id);
        if(!$user)
            throw new \PDOException('Không tìm thấy người dùng', 404);
        
        else
            return $user;
    }

    public function deleteUserById(int $id)
    {
        $user = $this->userRepository->deleteById($id);

        if(!$user)
            throw new \PDOException('Không tìm thấy người dùng', 404);
        
        else
            return json_encode(["message" => "Xóa người dùng thành công"]);
    }

    public function updateUserById(int $id, array $data): void
    {
        // Validate email format
        if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->respond(400, ["message" => "Định dạng email không hợp lệ"]);
        }

        // Validate phone number
        if (isset($data['phone_number']) && !preg_match('/^\d{10}$/', $data['phone_number'])) {
            $this->respond(400, ["message" => "Định dạng số điện thoại không hợp lệ"]);
        }

        // Validate address fields
        // $fields = ['house_number', 'street', 'ward', 'district', 'city'];
        // $patterns = [
        //     'house_number' => '/^[\w\s\-\/]+$/',
        //     'street'       => '/^[a-zA-Z\s\-\.]+$/u',
        //     'ward'         => '/^[a-zA-Z\s\-\.]+$/u',
        //     'district'     => '/^[a-zA-Z\s\-\.]+$/u',
        //     'city'         => '/^[a-zA-Z\s\-\.]+$/u'
        // ];

        // foreach ($fields as $field) {
        //     if (isset($data[$field]) && (empty($data[$field]) || !preg_match($patterns[$field], $data[$field]))) {
        //         $this->respond(400, ["message" => ucfirst(str_replace('_', ' ', $field)) . " is invalid"]);
        //     }
        // }

        // Check if username or email or phone_number exists
        if (isset($data['username']) && $this->userRepository->userExists($data['username'])) {
            $this->respond(400, ["message" => "Username đã tồn tại"]);
        }

        if (isset($data['email']) && $this->userRepository->userExists($data['email'])) {
            $this->respond(400, ["message" => "Email đã tồn tại"]);
        }

        if (isset($data['phone_number']) && $this->userRepository->userExists($data['phone_number'])) {
            $this->respond(400, ["message" => "Số điện thoại đã tồn tại"]);
        }
        
        $updatedUser = $this->userRepository->updateById($id, $data);

        if (!$updatedUser) {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi cập nhật người dùng"]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Cập nhật người dùng thành công",
            "user" => $updatedUser
        ]);
        exit;
    }

    //address
    public function getUserAddresses(int $userId): array
    {
        $addresses = $this->userRepository->getUserAddresses($userId);
        if (!$addresses) {
            throw new \PDOException('No addresses found', 404);
        }
        return $addresses;
    }

    public function addUserAddress(array $data): array
    {
        // Validate account_id exists
        if (!$this->userRepository->findById($data['account_id'])) {
            $this->respond(400, ["message" => "User does not exist"]);
        }

        $address = $this->userRepository->addUserAddress($data);
        if (!$address) {
            $this->respond(500, ["message" => "Error adding address"]);
        }
        return $address;
    }
}
?>