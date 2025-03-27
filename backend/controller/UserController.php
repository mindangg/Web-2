<?php

namespace controller;

use service\UserService;

use middleware\AuthMiddleware;

const JWT_SECRET = 'web2jsonwebtoken';

class UserController
{
    private UserService $userService;

    public function __construct()
    {
        $this->userService = new UserService();
    }

    public function processRequest(string $method, ?int $id): void
    {
        switch ($method) {
            case 'GET':
                AuthMiddleware::verifyToken();
                if ($id) {
                    $this->getUserById($id);
                } else {
                    $this->getAllUsers();
                }
                break;

            case 'POST':
                $this->handlePostRequest();
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

    // private function handlePostRequest(): void
    // {
    //     $data = json_decode(file_get_contents("php://input"), true);

    //     if (isset($data['email']) && isset($data['password'])) {
    //         $this->loginUser($data['email'], $data['password']);
    //     } elseif (isset($data['name']) && isset($data['email']) && isset($data['password'])) {
    //         $this->signupUser($data['name'], $data['email'], $data['password']);
    //     } else {
    //         http_response_code(400);
    //         echo json_encode(["message" => "Invalid request"]);
    //     }
    // }

    private function loginUser(string $username, string $password): void
    {
        $user = $this->userService->loginUser($username, $password);
        echo json_encode($user);
    }
    private function signupUser(string $username, string $email, string $password): void
    {
        $user = $this->userService->signupUser($username, $password);
        echo json_encode($user);
    }

    private function deleteUser(): void
    {
        $user = $this->userService->deleteUser();
        echo json_encode($user);
    }
    private function updateUser(): void
    {
        $user = $this->userService->updateUser();
        echo json_encode($user);
    }



}
?>