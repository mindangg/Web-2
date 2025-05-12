<?php
namespace controller;

use service\WarrantyService;

class WarrantyController {
    private $warrantyService;

    public function __construct() {
        $this->warrantyService = new WarrantyService();
    }

    public function processRequest(string $method, ?int $imei = null): void {
    switch ($method) {
        case 'GET':
            $this->getWarranties();
            break;
        case 'PUT':
            if ($imei) {
                $this->updateWarranty($imei);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'IMEI is required']);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

private function getWarranties(): void {
    try {
        $warranties = $this->warrantyService->getAllWarranties();
        $userInfoRepo = new \repository\UserInformationRepository();
        foreach ($warranties as &$warranty) {
            if (isset($warranty['user_information_id'])) {
                $userInfo = $userInfoRepo->findById($warranty['user_information_id']);
                $warranty['user_info'] = $userInfo ?: null;
            } else {
                $warranty['user_info'] = null;
            }
        }
        unset($warranty);
        http_response_code(200);
        echo json_encode(['warranties' => $warranties]);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

private function updateWarranty(int $imei): void {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['status']) || !in_array($data['status'], ['Hoạt động', 'Đang bảo hành', 'Hết hạn'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Trạng thái không hợp lệ']);
            return;
        }
        $this->warrantyService->updateWarrantyStatus($imei, $data['status']);
        http_response_code(200);
        echo json_encode(['message' => 'Warranty status updated']);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
}
?>