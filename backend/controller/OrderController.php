<?php

namespace controller;

use service\OrderService;

use middleware\AuthMiddleware;

class OrderController
{
    private OrderService $orderService;

    public function __construct()
    {
        $this->orderService = new OrderService();
    }

    public function processRequest(string $method, ?string $param): void
    {
        AuthMiddleware::verifyToken();

        switch ($method) {
            case 'GET': 
                if (is_numeric($param))
                    $this->getOrderById((int)$param);
                
                else
                    $this->getAllOrders();
                
                break;

            case 'POST':
                if ($param === 'create')
                    $this->createOrder();

                else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid POST request']);
                }
                break;

            case 'DELETE':
                $this->deleteOrder((int)$param);
                break;

            case 'PATCH':
                $this->updateOrder((int)$param);
                break;
                
            default:
                http_response_code(405);
                header("Allow: GET POST PATCH DELETE");
        }
    }

    private function respond(int $code, array $message): void 
    {
        http_response_code($code);
        echo json_encode($message);
        exit;
    }

    // private function respond(int $code, string $message): void 
    // {
    //     http_response_code($code);
    //     echo json_encode([
    //         'success' => false,
    //         'message' => $message
    //     ]);
    //     exit;
    // }


    private function validateRequiredFields(array $data, array $fields): ?string
    {
        foreach ($fields as $field) {
            if (empty($data[$field])) {
                return "Vui lòng điền vô $field";
            }
        }
        return null;
    }

    private function createOrder(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
    
        // Validate input
        $validationError = $this->validateRequiredFields($data, ["username", "email", "password", "full_name", 
                                            "phone_number", "house_number", "street", "ward", "district", "city"]);

        if ($validationError)
            $this->respond(400, ["message" => $validationError]);
        
        else
            $order = $this->orderService->createOrder($data);
    
        echo json_encode($order);
    }

    private function getAllOrders(): void
    {
        $orders = $this->orderService->getAllOrders();
        echo json_encode($orders);
    }

    private function getOrderById(int $id): void
    {
        $order = $this->orderService->getOrderById($id);
        echo json_encode($order);
    }
    
    private function deleteOrder(int $id): void
    {
        $order = $this->orderService->deleteOrderById($id);
        echo json_encode($order);
    }

    private function updateOrder(int $id): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $order = $this->orderService->updateOrderById($id, $data);
        echo json_encode($order);
    }
}
?>