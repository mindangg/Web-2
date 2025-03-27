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
        $users = $this->userRepository->findAll();

        if(!$users) {
            throw new \PDOException('No users found', 404);
        } else {
            return $users;
        }
    }

    public function getUserById(int $id)
    {
        $user = $this->userRepository->findById($id);
        if(!$user) {
            throw new \PDOException('User not found', 404);
        } else {
            return $user;
        }
    }

    public function loginUser(string $username, string $password): void
    {
        $user= $this->userRepository->loginUser($username, $password);

        if (!isset($user['user'])) {
            http_response_code(400);
            echo json_encode([
                "message" => $user["message"]
            ]);
            return;
        }

        $payload = [
            "id" => $user['user']['id'],
            "exp" => time() + (3 * 24 * 60 * 60) // 3 days
        ];

        $jwt = JWT::encode($payload, JWT_SECRET, "HS256");

        http_response_code(200);
        echo json_encode([
            "message" => "User login successfully",
            "token" => $jwt,
            "user" => [
                "id" => $user['user']["id"],
                "username" => $user['user']["username"],
                "email" => $user['user']["email"]
            ]
        ]);
    }

    private function isStrongPassword(string $password): bool
    {
        return preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/', $password);
    }

    public function signupUser(string $username, string $email, string $password): void
    {
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid email format"]);
            return;
        }

        // Check if username or email exists
        if ($this->userRepository->userExists($username, $email)) {
            http_response_code(400);
            echo json_encode(["message" => "Username or email already exists"]);
            return;
        }

         // Check password strength
        if (!$this->isStrongPassword($password)) {
            http_response_code(400);
            echo json_encode(["message" => "Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"]);
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
            "exp" => time() + (3 * 24 * 60 * 60) // 3 days
        ];
    
        $jwt = JWT::encode($payload, JWT_SECRET, "HS256");

        http_response_code(200);
        echo json_encode([
            "message" => "User signed up successfully",
            "token" => $jwt,
            "user" => [
                "id" => $userId,
                "username" => $username,
                "email" => $email
            ]
        ]);
    }

    // public function deleteUser(): void
    // {
    //     $data = json_decode(file_get_contents("php://input"), true);

    //     if (!isset($data['id'])) {
    //         http_response_code(400);
    //         echo json_encode(["message" => "User ID is required"]);
    //         return;
    //     }

    //     if ($deleted) {
    //         echo json_encode(["message" => "User deleted successfully"]);
    //     } else {
    //         http_response_code(400);
    //         echo json_encode(["message" => "Failed to delete user"]);
    //     }
    // }

    // public function updateUser(): void
    // {
    //     $data = json_decode(file_get_contents("php://input"), true);
        
    //     if (!isset($data['id']) || !isset($data['email'])) {
    //         http_response_code(400);
    //         echo json_encode(["message" => "Missing user ID or email"]);
    //         return;
    //     }

        
    //     if ($updated) {
    //         echo json_encode(["message" => "User updated successfully"]);
    //     } else {
    //         http_response_code(400);
    //         echo json_encode(["message" => "Failed to update user"]);
    //     }
    // }
}
?>