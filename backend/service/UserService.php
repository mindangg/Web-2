<?php
namespace service;
use repository\userRepository;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

const JWT_SECRET = 'web2jsonwebtoken';

class UserService
{
    private UserRepository $userRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
    }

    public function getAllUsers(): array
    {
        $this->userRepository->findAll();

        $response = $this->userRepository->findAll();

        if(!$response === null) {
            throw new \PDOException('No products found', 404);
        } else {
            return $response;
        }
    }

    public function getUserById(int $id)
    {

    }

    // public function loginUser(string $username, string $password): void
    // {
    //     if (!$user || !password_verify($password, $user['password'])) {
    //         http_response_code(401);
    //         echo json_encode(["message" => "Invalid email or password"]);
    //         return;
    //     }

    //     $payload = [
    //         "user_id" => $user['id'],
    //         "email" => $user['email'],
    //         "exp" => time() + (60 * 60) // Token expires in 1 hour
    //     ];

    //     $jwt = JWT::encode($payload, "your_secret_key", "HS256");

    //     echo json_encode(["token" => $jwt]);
    // }

    public function signupUser(string $username, string $email, string $password): void
    {
        if ($this->userRepository->userExists($username, $email)) {
            http_response_code(400);
            echo json_encode(["message" => "Username or email already exists"]);
            return;
        }

        $userId = $this->userRepository->signupUser($username, $email, $password);

        if (!$userId) {
            http_response_code(500);
            echo json_encode(["message" => "Error signing up"]);
            return;
        }

        $payload = [
            "user_id" => $userId,
            "email" => $email,
            "exp" => time() + (3 * 24 * 60 * 60) // 3 days
        ];
    
        $jwt = JWT::encode($payload, JWT_SECRET, "HS256");

        http_response_code(200);
        echo json_encode([
            "message" => "User signed up successfully",
            "token" => $jwt
        ]);
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