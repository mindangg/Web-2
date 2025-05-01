<?php
namespace controller;

use service\ReceiptService;
use exception\ExceptionHandler;

class ReceiptController {
    private $receiptService;

    public function __construct() {
        $this->receiptService = new ReceiptService();
    }

    public function processRequest(string $method): void {
        switch ($method) {
            case 'POST':
                $this->createReceipt();
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
                break;
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

    private function validateReceiptData(array $data): bool {
        return isset($data['account_id'], $data['user_information_id'], $data['payment_method'], $data['items'])
            && is_array($data['items'])
            && !empty($data['items'])
            && in_array($data['payment_method'], ['direct_payment', 'transfer_payment']);
    }
}