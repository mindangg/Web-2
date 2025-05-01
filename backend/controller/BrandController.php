<?php

namespace controller;

use service\BrandService;

class BrandController
{
    private BrandService $brandService;

    public function __construct()
    {
        $this->brandService = new BrandService();
    }

    public function processRequest(string $method): void
    {
        switch ($method) {
            case 'GET':
                $this->getAllBrands();
                break;
            case 'POST':
                $this->createBrand();
                break;
            default:
                http_response_code(405);
                header("Allow: GET POST PUT DELETE");
        }
    }

    private function getAllBrands(): void
    {
        $response = $this->brandService->getAllBrands();
        echo json_encode($response);
    }

    public function createBrand(): void
    {
        $data = json_decode(file_get_contents('php://input'));
        $response = $this->brandService->createBrand($data);
        echo json_encode($response);
    }
}