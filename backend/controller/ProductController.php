<?php

namespace controller;

use service\ProductService;

class ProductController
{
    private ProductService $productService;

    public function __construct()
    {
        $this->productService = new ProductService();
    }

    public function processRequest(string $method, ?int $id): void
    {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $this->getProductById($id);
                } else {
                    $this->getAllProducts();
                }
                break;
            default:
                http_response_code(405);
                header("Allow: GET POST PUT DELETE");
        }
    }

    private function getAllProducts(): void
    {
        $response = $this->productService->getAllProducts();
        echo json_encode($response);
    }

    private function getProductById(int $id): void
    {
        $product = $this->productService->getProductById($id);
        echo json_encode($product);
    }
}