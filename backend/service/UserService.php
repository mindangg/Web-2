<?php
namespace service;
use repository\userRepository;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UserService
{
    private UserRepository $userRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
    }

    public function getAllUsers(): array
    {
        
    }

    public function getUserById(int $id)
    {

    }

    public function loginUser(string $username, string $password): void
    {
        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(["message" => "Invalid email or password"]);
            return;
        }

        $payload = [
            "user_id" => $user['id'],
            "email" => $user['email'],
            "exp" => time() + (60 * 60) // Token expires in 1 hour
        ];

        $jwt = JWT::encode($payload, "your_secret_key", "HS256");

        echo json_encode(["token" => $jwt]);
    }
    public function signupUser(string $username, string $email, string $password): void
    {
        if ($this->userService->getUserByEmail($email)) {
            http_response_code(400);
            echo json_encode(["message" => "Email already exists"]);
            return;
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $this->userService->createUser($username, $email, $hashedPassword);

        http_response_code(201);
        echo json_encode(["message" => "User signup successfully"]);
    }

    public function deleteUser(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["message" => "User ID is required"]);
            return;
        }

        if ($deleted) {
            echo json_encode(["message" => "User deleted successfully"]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Failed to delete user"]);
        }
    }

    public function updateUser(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id']) || !isset($data['email'])) {
            http_response_code(400);
            echo json_encode(["message" => "Missing user ID or email"]);
            return;
        }

        
        if ($updated) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Failed to update user"]);
        }
    }
}
?>