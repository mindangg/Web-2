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

    public function processRequest(string $method, ?string $param, ?string $subRoute = null): void
    {
        switch ($method) {
            // AuthMiddleware::verifyToken();
            case 'GET':
                if ($param === 'addresses' && is_numeric($subRoute)) {
                    $this->getUserAddresses((int)$subRoute);
                } elseif (is_numeric($param)) {
                    $this->getUserById((int)$param);
                } else {
                    $this->getAllUsers();
                }
                break;

            case 'POST':
                if ($param === 'signup')
                    $this->signupUser();

                else if ($param === 'login')
                    $this->loginUser();

                else if ($param === 'create')
                    $this->createUser();
                else if($param==='addresses'){
                    $this->addUserAddress();
                }
                
                else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid POST request']);
                }
                break;

            case 'DELETE':
                $this->deleteUser((int)$param);
                break;

            case 'PATCH':
                $this->updateUser((int)$param);
                break;
                
            default:
                http_response_code(405);
                header("Allow: GET POST PATCH DELETE");
        }
    }

    // private function validateRequiredFields(array $data, array $fields): ?string
    // {
    //     foreach ($fields as $field) {
    //         if (empty($data[$field]))
    //             return "Please fill in your $field";
    //     }
    //     return null;
    // }

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

    private function createUser(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
    
        // Validate input
        $validationError = $this->validateRequiredFields($data, ["username", "email", "password", "full_name", 
                                            "phone_number", "house_number", "street", "ward", "district", "city"]);

        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
        }
        
        else
            $user = $this->userService->createUser($data);
    
        echo json_encode($user);
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
    
    private function deleteUser(int $id): void
    {
        $user = $this->userService->deleteUserById($id);
        echo json_encode($user);
    }

    private function updateUser(int $id): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $user = $this->userService->updateUserById($id, $data);
        echo json_encode($user);
    }
     //address cart
     private function getUserAddresses(int $userId): void
     {
        $addresses = $this->userService->getUserAddresses($userId);
        echo json_encode($addresses);
     }

     private function addUserAddress(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $validationError = $this->validateRequiredFields($data, [
            "account_id", "full_name", "phone_number", "house_number", "street", "ward", "district", "city"
        ]);

        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
            return;
        }

        $address = $this->userService->addUserAddress($data);
        echo json_encode([
            "message" => "Address added successfully",
            "address" => $address
        ]);
    }
}
?>