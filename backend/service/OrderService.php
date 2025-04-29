<?php
namespace service;
use repository\OrderRepository;

class OrderService
{
    private OrderRepository $orderRepository;

    public function __construct() {
        $this->orderRepository = new OrderRepository();
    }

    private function respond(int $code, array $message): void 
    {
        http_response_code($code);
        echo json_encode($message);
        exit;
    }

    public function createOrder(array $data)
    {
        $createdOrder = $this->orderRepository->createOrder($data);

        if (!$createdOrder) {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi tạo đơn hàng"]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Tạo đơn hàng thành công",
            "user" => $createdOrder
        ]);
        exit;
    }

    public function getAllOrders(): array
    {
        $address = $_GET['address'] ?? "";
        $status = $_GET['status'] ?? "";
        $limit = intval($_GET['limit'] ?? 10);
        $page = intval($_GET['page'] ?? 1);
    
        $orders = $this->orderRepository->findAll($address, $status, $limit, $page);

        if(!$orders)
            throw new \PDOException('Không tìm thấy đơn hàng', 404);
        
        else
            return $orders;
    }

    public function getOrderById(int $id)
    {
        $order = $this->orderRepository->findById($id);
        if(!$order)
            throw new \PDOException('Không tìm thấy đơn hàng', 404);
        
        else
            return $order;
    }

    public function deleteOrderById(int $id)
    {
        $order = $this->orderRepository->deleteById($id);

        if(!$order)
            throw new \PDOException('Không tìm thấy đơn hàng', 404);
        
        else
            return json_encode(["message" => "Xóa người dùng đơn hàng"]);
    }

    public function updateOrderById(int $id, array $data): void
    {        
        $updatedOrder = $this->orderRepository->updateById($id, $data);

        if (!$updatedOrder) {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi cập nhật đơn hàng"]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Cập nhật đơn hàng thành công",
            "user" => $updatedOrder
        ]);
        exit;
    }
}
?>