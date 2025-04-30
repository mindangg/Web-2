<?php

namespace controller;

use service\SkuService;

class SkuController
{
    private SkuService $skuService;

    public function __construct()
    {
        $this->skuService = new SkuService();
    }

    public function processRequest(string $method, ?int $id): void
    {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $this->getAllSkuOfProduct($id);
                } else {
                    http_response_code(400);
                    echo json_encode(['message' => 'Product ID is required']);
                }
                break;
            default:
                http_response_code(405);
                header("Allow: GET");
        }
    }

    private function getAllSkuOfProduct(int $id): void
    {
        $response = $this->skuService->getAllSkuOfProduct($id);
        echo json_encode($response);
    }
}