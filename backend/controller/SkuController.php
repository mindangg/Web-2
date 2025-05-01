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
            case 'POST':
                $this->createSku();
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

    private function createSku(): void
    {
        $product_id = $_POST['product_id'] ?? null;
        $internal_id = $_POST['internal_id'] ?? null;
        $color_id = $_POST['color_id'] ?? null;
        $import_price = $_POST['import_price'] ?? null;
        $invoice_price = $_POST['invoice_price'] ?? null;

        $data = [
            'product_id' => $product_id,
            'internal_id' => $internal_id,
            'color_id' => $color_id,
            'import_price' => $import_price,
            'invoice_price' => $invoice_price,
            'image' => '',
            'sku_code' => '',
            'sku_name' => '',
        ];

        $response = $this->skuService->createSku((object)$data);

        echo json_encode($response);
    }
}