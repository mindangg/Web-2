<?php

namespace controller;

use service\UserService;

use middleware\AuthMiddleware;

class UserController
{
    private UserService $userService;

    public function __construct()
    {
        $this->userService = new UserService();
    }

    public function processRequest(string $method, ?string $param): void
    {
        switch ($method) {
            case 'GET':
                AuthMiddleware::verifyToken();
                if (is_numeric($param))
                    $this->getUserById((int)$param);
                
                else
                    $this->getAllUsers();
        
                break;

            case 'POST':
                if ($param === 'signup')
                    $this->signupUser();

                elseif ($param === 'login')
                    $this->loginUser();
                
                else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid POST request']);
                }
                break;

            case 'DELETE':
                AuthMiddleware::verifyToken();
                $this->deleteUser();
                break;

            case 'PUT':
                AuthMiddleware::verifyToken();
                $this->updateUser();
                break;
            default:
                http_response_code(405);
                header("Allow: GET POST PATCH DELETE");
        }
    }

    private function getAllUsers(): void
    {
        $response = $this->userService->getAllUsers();
        echo json_encode($response);
    }

    private function getUserById(int $id): void
    {
        $user = $this->userService->getUserById($id);
        echo json_encode($user);
    }

    private function validateRequiredFields(array $data, array $fields): ?string
    {
        foreach ($fields as $field) {
            if (empty($data[$field])) {
                return "Please fill in your $field";
            }
        }
        return null;
    }

    private function loginUser(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validationError = $this->validateRequiredFields($data, ["username", "password"]);
        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
        }

        else
            $user = $this->userService->loginUser($data['username'], $data['password']);

        echo json_encode($user);
    }

    private function signupUser(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
    
        // Validate input
        $validationError = $this->validateRequiredFields($data, ["username", "email", "password"]);
        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
        }

        else
            $user = $this->userService->signupUser($data['username'], $data['email'], $data['password']);
    
        echo json_encode($user);
    }
    
    private function deleteUser(): void
    {
        // $user = $this->userService->deleteUser();
        // echo json_encode($user);
    }

    private function updateUser(): void
    {
        // $user = $this->userService->updateUser();
        // echo json_encode($user);
    }
 
}
?>