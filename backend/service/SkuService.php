<?php

namespace service;

use repository\ColorRepository;
use repository\InternalOptionRepository;
use repository\ProductRepository;
use repository\SkuRepository;
use utils\Helper;

class SkuService
{
    private SkuRepository $skuRepository;
    private ProductRepository $productRepository;
    private ColorRepository $colorRepository;
    private InternalOptionRepository $internalOptionRepository;

    public function __construct()
    {
        $this->skuRepository = new SkuRepository();
        $this->productRepository = new ProductRepository();
        $this->colorRepository = new ColorRepository();
        $this->internalOptionRepository = new InternalOptionRepository();
    }

    public function getAllSkuOfProduct(int $id): array
    {
        $sku = $this->skuRepository->findAll($id);
        if (!$sku) {
            throw new \PDOException('No SKU found for this product', 404);
        }
        return $sku;
    }

    public function createSku(object $data): array
    {
        $response = [];
        $uploadDir = realpath(__DIR__ . '/../../frontend/public/product') . '/';

        if ($this->skuRepository->isExistedWithProduct_IdAndColor_IdAndInternalOption_Id($data->product_id, $data->color_id, $data->internal_id)) {
            return $response = [
                'message' => 'Đã tồn tại phiên bản này',
            ];
        }

        $product = $this->productRepository->findById($data->product_id);
        $color = $this->colorRepository->findById($data->color_id);
        $internalOption = $this->internalOptionRepository->findById($data->internal_id);

        if (!$product || !$color || !$internalOption) {
            return $response = [
                'message' => 'Invalid product, color or internal option ID',
            ];
        }

        $data->sku_code = Helper::GenerateSkuCode($product['name'], $color['color'], $internalOption['ram'] . '/' . $internalOption['storage']);

        $data->sku_name = $product['name'] . ' ' . $internalOption['ram'] . '/' . $internalOption['storage'] . ' ' . $color['color'];

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['image']['tmp_name'];
            $originalName = $_FILES['image']['name'];
            $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            $allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
            if (!in_array($fileExtension, $allowedExtensions)) {
                return $response = [
                    'message' => 'Chỉ cho phép file ảnh png, jpg, jpeg, gif',
                ];
            }

            $newFileName = Helper::GenerateImageFileName($data->sku_code, $fileExtension);
            $destination = $uploadDir . $newFileName;

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $data->image = $newFileName;
            $signal = $this->skuRepository->create($data);

            if ($signal < 0) {
                return $response = [
                    'message' => 'Lỗi khi thêm sản phẩm vào database',
                ];
            }

            if (copy($fileTmpPath, $destination)) {
                $response = [
                    'message' => 'Thêm sản phẩm thành công',
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

    public function updateSku(int $id, object $data): array
    {
        $response = [];
        $uploadDir = realpath(__DIR__ . '/../../frontend/public/product') . '/';

        $sku = $this->skuRepository->findById($id);
        $product = $this->productRepository->findById($sku['product_id']);

        if ($this->skuRepository->isExistedWithAnotherSkuWithProduct_IdAndColor_IdAndInternalOption_Id($sku['product_id'], $data->color_id, $data->internal_id)) {
            return $response = [
                'message' => 'Đã tồn tại phiên bản này',
            ];
        }

        $color = $this->colorRepository->findById($data->color_id);
        $internalOption = $this->internalOptionRepository->findById($data->internal_id);

        if (!$sku || !$color || !$internalOption) {
            return $response = [
                'message' => 'Phiên bản không tồn tại hoặc màu sắc, cấu hình không hợp lệ',
            ];
        }

        $data->sku_code = Helper::GenerateSkuCode($product['name'], $color['color'], $internalOption['ram'] . '/' . $internalOption['storage']);
        $data->sku_name = $product['name'] . ' ' . $internalOption['ram'] . '/' . $internalOption['storage'] . ' ' . $color['color'];

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['image']['tmp_name'];
            $originalName = $_FILES['image']['name'];
            $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            $allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
            if (!in_array($fileExtension, $allowedExtensions)) {
                return $response = [
                    'message' => 'Chỉ cho phép file ảnh png, jpg, jpeg, gif',
                ];
            }

            $oldFileName = $sku['image'];
            $newFileName = Helper::GenerateImageFileName($data->sku_code, $fileExtension);
            $destination1 = $uploadDir . $oldFileName;
            $destination2 = $uploadDir . $newFileName;

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $data->image = $newFileName;
            $signal = $this->skuRepository->update($id, $data);

            if ($signal < 0) {
                $response = [
                    'message' => 'Lỗi khi cập nhật sku vào database',
                ];
            }

            if (file_exists($destination1)) {
                unlink($destination1);
            }

            if (copy($fileTmpPath, $destination2)) {
                $response = [
                    'message' => 'Cập nhật phiên bản thành công',
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

    public function deleteSku(int $id): int
    {
        if($this->skuRepository->skuIsExistedInReceipt($id) || $this->skuRepository->skuIsExistedInImport($id)) {
            return -2;
        }

        $sku = $this->skuRepository->findById($id);

        $signal = $this->skuRepository->delete($id);

        if ($signal >= 0) {
            $imagePath = realpath(__DIR__ . '/../../frontend/public/product') . '/' . $sku['image'];
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        return $signal;
    }
}