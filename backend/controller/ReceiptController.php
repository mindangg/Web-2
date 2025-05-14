<?php
namespace controller;

use service\ReceiptService;
use exception\ExceptionHandler;

class ReceiptController {
    private $receiptService;

    public function __construct() {
        $this->receiptService = new ReceiptService();
    }

    public function processRequest(string $method, ?int $receiptId = null): void {
        switch ($method) {
            case 'GET':
                if ($receiptId) {
                    $this->getReceiptById($receiptId);
                } else {
                    $this->getReceipts();
                }
                break;
            case 'POST':
                $this->createReceipt();
                break;
            case 'PATCH':
                if ($receiptId) {
                    $this->updateReceiptStatus($receiptId);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Missing receipt_id']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
                break;
        }
    }

    private function getReceipts(): void {
    $filters = [
        'account_id' => $_GET['account_id'] ?? null,
        'start_date' => $_GET['start_date'] ?? null,
        'end_date' => $_GET['end_date'] ?? null,
        'district' => $_GET['district'] ?? null,
        'city' => $_GET['city'] ?? null,
        'status' => $_GET['status'] ?? null,
        'page' => $_GET['page'] ?? 1,
        'limit' => $_GET['limit'] ?? 10,
    ];

    try {
        $result = $this->receiptService->getFilteredReceipts($filters);
        foreach ($result['receipts'] as &$receipt) {
            $receipt['details'] = $this->receiptService->getReceiptDetails($receipt['receipt_id']);
            $receipt['user_information'] = $this->receiptService->getUserInformation($receipt['user_information_id']);
        }
        http_response_code(200);
        echo json_encode([
            'receipts' => $result['receipts'],
            'currentPage' => $result['currentPage'],
            'totalPage' => $result['totalPage']
        ]);
    } catch (\Exception $e) {
        ExceptionHandler::handleException($e);
    }
}

    private function getReceiptById(int $receiptId): void {
        try {
            $receipt = $this->receiptService->getReceiptById($receiptId);
            if (!$receipt) {
                http_response_code(404);
                echo json_encode(['error' => 'Receipt not found']);
                return;
            }
            $receipt['details'] = $this->receiptService->getReceiptDetails($receiptId);
            $receipt['user_information'] = $this->receiptService->getUserInformation($receipt['user_information_id']);
            http_response_code(200);
            echo json_encode($receipt);
        } catch (\Exception $e) {
            ExceptionHandler::handleException($e);
        }
    }

    private function createReceipt(): void {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$this->validateReceiptData($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input data']);
            return;
        }

        try {
            $receipt = $this->receiptService->createReceipt($data);
            http_response_code(201);
            echo json_encode(['message' => 'Receipt created successfully', 'receipt' => $receipt]);
        } catch (\Exception $e) {
            ExceptionHandler::handleException($e);
        }
    }

    private function updateReceiptStatus(int $receiptId): void {
        $data = json_decode(file_get_contents("php://input"), true);
    
        if (!isset($data['status']) || !in_array($data['status'], ['pending', 'confirmed', 'on_deliver', 'delivered', 'cancelled'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status']);
            return;
        }
    
        try {
            $this->receiptService->updateReceiptStatus($receiptId, $data['status']);
            http_response_code(200);
            echo json_encode(['message' => 'Status updated successfully']);
        } catch (\Exception $e) {
            ExceptionHandler::handleException($e);
        }
    }

    private function validateReceiptData(array $data): bool {
        return isset($data['account_id'], $data['user_information_id'], $data['payment_method'], $data['items'])
            && is_array($data['items'])
            && !empty($data['items'])
            && in_array($data['payment_method'], ['direct_payment', 'transfer_payment']);
    }
}