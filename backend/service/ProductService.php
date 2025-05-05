<?php

namespace service;
use PDOException;
use repository\ProductRepository;
use repository\SkuRepository;
use utils\Helper;

class ProductService
{
    private ProductRepository $productRepository;
    private SkuRepository $skuRepository;

    public function __construct() {
        $this->productRepository = new ProductRepository();
        $this->skuRepository = new SkuRepository();
    }

    public function getAllProducts(): array
    {
        $brand = $_GET['brand'] ?? "";
        $sort = $_GET['sort'] ?? "";
        $sort_dir = $_GET['sort_dir'] ?? "asc";
        $max_price = intval($_GET['max_price'] ?? 0);
        $min_price = intval($_GET['min_price'] ?? 0);
        $searchBy = $_GET['searchBy'] ?? "";
        $search = $_GET['search'] ?? "";
        $limit = intval($_GET['limit'] ?? 10);
        $page = intval($_GET['page'] ?? 1);
        $status = boolval($_GET['status'] ?? "");

        $response = $this->productRepository->findAll($brand, $sort, $sort_dir, $max_price, $min_price, $searchBy, $search, $limit, $page, $status);

        if(!$response === null) {
            throw new PDOException('No products found', 404);
        } else {
            return $response;
        }
    }

    public function getProductById(int $id):array
    {
        $product = $this->productRepository->findById($id);
        if(!$product) {
            throw new PDOException(`Product not found with id: $id`, 404);
        }
        $sku = $this->skuRepository->findAll($id);

        return $response = [
            'product' => $product,
            'sku' => $sku
        ];
    }

    public function createProduct(object $data): array
    {
        $response = [];
        $uploadDir = realpath(__DIR__ . '/../../frontend/public/product') . '/';

        if ($this->productRepository->isExistedWithName($data->name)) {
            return $response = [
                'message' => 'Tên sản phẩm đã tồn tại',
            ];
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['image']['tmp_name'];
            $originalName = $_FILES['image']['name'];
            $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            $allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
            if (!in_array($fileExtension, $allowedExtensions)) {
                echo json_encode([
                    'message' => 'Chỉ cho phép file ảnh png, jpg, jpeg, gif',
                ]);
                exit;
            }

            $newFileName = Helper::GenerateImageFileName($data->name, $fileExtension);
            $destination = $uploadDir . $newFileName;

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $data->image = $newFileName;
            $signal = $this->productRepository->create($data);

            if ($signal < 0) {
                $response = [
                    'message' => 'Lỗi khi thêm sản phẩm vào database',
                ];
            }

            if (copy($fileTmpPath, $destination)) {
                $response = [
                    'message' => 'Thêm sản phẩm thành công, id: ' . $signal,
                ];
            } else {
                $response = [
                    'message' => 'Lỗi khi upload file ảnh',
                ];
            }
        } else {
            $response = [
                'message' => 'Không có file ảnh nào được upload',
            ];
        }
        return $response;
    }

    public function updateProduct(int $id, object $data): array
    {
        $response = [];
        $uploadDir = realpath(__DIR__ . '/../../frontend/public/product') . '/';

        $product = $this->productRepository->findById($id);

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['image']['tmp_name'];
            $originalName = $_FILES['image']['name'];
            $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            $allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
            if (!in_array($fileExtension, $allowedExtensions)) {
                echo json_encode([
                    'message' => 'Chỉ cho phép file ảnh png, jpg, jpeg, gif',
                ]);
                exit;
            }

            $oldFileName = $product['image'];
            $newFileName = Helper::GenerateImageFileName($data->name, $fileExtension);
            $destination1 = $uploadDir . $oldFileName;
            $destination2 = $uploadDir . $newFileName;

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $data->image = $newFileName;
            $signal = $this->productRepository->update($id, $data);

            if ($signal < 0) {
                $response = [
                    'message' => 'Lỗi khi cập nhật sản phẩm vào database',
                ];
            }

            if (file_exists($destination1)) {
                unlink($destination1);
            }

            if (copy($fileTmpPath, $destination2)) {
                $response = [
                    'message' => 'Cập nhật sản phẩm thành công',
                ];
            } else {
                $response = [
                    'message' => 'Lỗi khi upload file ảnh',
                ];
            }
        } else {
            $response = [
                'message' => 'Không có file ảnh nào được upload',
            ];
        }
        return $response;
    }

    public function deleteProduct(int $id): int
    {
        if($this->skuRepository->productIsExistedInReceipt($id) || $this->skuRepository->productIsExistedInImport($id)) {
            $this->productRepository->lockById($id);
            return -2;
        }
        $product = $this->productRepository->findById($id);
        if (!$product) {
            return -1;
        }
        $signal = $this->productRepository->delete($id);
        $this->skuRepository->deleteAllByProductId($id);
        if ($signal >= 0) {
            $imagePath = realpath(__DIR__ . '/../../frontend/public/product') . '/' . $product['image'];
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        return $signal;
    }
}