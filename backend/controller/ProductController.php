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
            case 'POST':
                if ($id) {
                    $this->updateProduct($id);
                } else {
                    $this->createProduct();
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->deleteProduct($id);
                } else {
                    http_response_code(400);
                    echo json_encode(['message' => 'Product ID is required']);
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
        $response = $this->productService->getProductById($id);
        echo json_encode($response);
    }

    private function createProduct(): void
    {
        $brand = $_POST['brand'] ?? '';
        $provider = $_POST['provider'] ?? '';
        $series = $_POST['series'] ?? '';
        $name = $_POST['name'] ?? '';
        $cpu = $_POST['cpu'] ?? '';
        $screen = $_POST['screen'] ?? '';
        $battery = $_POST['battery'] ?? '';
        $front_camera = $_POST['front_camera'] ?? '';
        $back_camera = $_POST['back_camera'] ?? '';
        $description = $_POST['description'] ?? '';
        $release_date = $_POST['release_date'] ?? '';
        $warranty_period = $_POST['warranty_period'] ?? '';

        $data = [
            'brand' => $brand,
            'provider' => $provider,
            'series' => $series,
            'name' => $name,
            'cpu' => $cpu,
            'screen' => $screen,
            'battery' => $battery,
            'front_camera' => $front_camera,
            'back_camera' => $back_camera,
            'description' => $description,
            'release_date' => $release_date,
            'warranty_period' => $warranty_period,
            'image' =>  '',
        ];

        $response = $this->productService->createProduct((object)$data);

        echo json_encode($response);
    }

    private function updateProduct(int $id): void
    {
        $name = isset($_POST['name']) ? trim($_POST['name']) : null;
        $brand = isset($_POST['brand']) ? (int)$_POST['brand'] : null;
        $provider = isset($_POST['provider']) ? (int)$_POST['provider'] : null;
        $series = isset($_POST['series']) ? trim($_POST['series']) : null;
        $cpu = isset($_POST['cpu']) ? trim($_POST['cpu']) : null;
        $screen = isset($_POST['screen']) ? trim($_POST['screen']) : null;
        $battery = isset($_POST['battery']) ? trim($_POST['battery']) : null;
        $frontCamera = isset($_POST['front_camera']) ? trim($_POST['front_camera']) : null;
        $backCamera = isset($_POST['back_camera']) ? trim($_POST['back_camera']) : null;
        $description = isset($_POST['description']) ? trim($_POST['description']) : null;
        $basePrice = isset($_POST['base_price']) ? (int)$_POST['base_price'] : 0;
        $releaseDate = $_POST['release_date'] ?? null;
        $warrantyPeriod = isset($_POST['warranty_period']) ? (int)$_POST['warranty_period'] : null;
        $status = isset($_POST['status']) && (($_POST['status'] === 'true' || $_POST['status'] === '1' || $_POST['status'] === true));

        $data = [
            'name' => $name,
            'brand' => $brand,
            'provider' => $provider,
            'series' => $series,
            'cpu' => $cpu,
            'screen' => $screen,
            'battery' => $battery,
            'front_camera' => $frontCamera,
            'back_camera' => $backCamera,
            'description' => $description,
            'base_price' => $basePrice,
            'release_date' => $releaseDate,
            'warranty_period' => $warrantyPeriod,
            'status' => $status,
            'image' => '',
        ];

        $response = $this->productService->updateProduct($id, (object)$data);
        echo json_encode($response);
    }

    private function deleteProduct(int $id): void
    {
        $signal = $this->productService->deleteProduct($id);
        if($signal === -2){
            http_response_code(404);
            echo json_encode(['message' => 'Không thể xóa sản phẩm với vì đã tồn tại trong hóa đơn bất kì']);
            return;
        }
        if ($signal < 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Không thể xóa sản phẩm với id: ' . $id]);
            return;
        }
        echo json_encode(['message' => 'Xóa sản phẩm thành công']);
    }
}