<?php
namespace service;

use Exception;
use repository\ReceiptRepository;
use repository\SkuRepository;
use repository\ProductRepository;
use repository\UserInformationRepository;
use PDO;

class ReceiptService {
    private $receiptRepository;
    private $skuRepository;
    private $productRepository;
    private $userInformationRepository;
    private $pdo;

    public function __construct() {
        $this->receiptRepository = new ReceiptRepository();
        $this->skuRepository = new SkuRepository();
        $this->productRepository = new ProductRepository();
        $this->userInformationRepository = new UserInformationRepository();
        $this->pdo = (new \config\Database())->getConnection();
    }

    public function createReceipt(array $data): array {
        try {
            $this->pdo->beginTransaction();
    
            // Tính tổng giá
            $totalPrice = array_sum(array_map(function($item) {
                return $item['price'] * $item['quantity'];
            }, $data['items']));
    
            // Tạo receipt
            $receiptData = [
                'account_id' => $data['account_id'],
                'user_information_id' => $data['user_information_id'],
                'total_price' => $totalPrice,
                'payment_method' => $data['payment_method'],
                'status' => 'pending'
            ];
    
            $receiptId = $this->receiptRepository->createReceipt($receiptData);
    
            // Tạo receipt_detail và cập nhật kho
            foreach ($data['items'] as $item) {
                // Kiểm tra tồn kho
                $sku = $this->skuRepository->findById($item['sku_id']);
                if (!$sku || $sku['stock'] < $item['quantity']) {
                    throw new \Exception("Sản phẩm SKU {$item['sku_id']} không đủ tồn kho");
                }
    
                // Tạo receipt detail
                $detailData = [
                    'receipt_id' => $receiptId,
                    'sku_id' => $item['sku_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ];
                $detailId = $this->receiptRepository->createReceiptDetail($detailData);
    
                $product = $this->productRepository->findById($sku['product_id']);
                if (!$product || !isset($product['warranty_period'])) {
                    throw new Exception("Không tìm thấy sản phẩm hoặc thời gian bảo hành cho SKU {$item['sku_id']}");
                }
    
                $warrantyPeriod = (int)$product['warranty_period'];
    
                for ($i = 0; $i < $item['quantity']; $i++) {
                    $imeiData = [
                        'receipt_detail_id' => $detailId,
                        'date' => date('Y-m-d'),
                        'expired_date' => date('Y-m-d', strtotime("+$warrantyPeriod months")),
                        'status' => 'Hoạt động' // Sử dụng giá trị ENUM thay vì boolean
                    ];
                    $this->receiptRepository->createImei($imeiData);
                }
    
                // Cập nhật stock và sold
                $this->skuRepository->updateStock($item['sku_id'], $sku['stock'] - $item['quantity']);
                $this->skuRepository->updateSold($item['sku_id'], $sku['sold'] + $item['quantity']);
            }
    
            $this->pdo->commit();
            return ['receipt_id' => $receiptId, 'total_price' => $totalPrice];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function getReceiptsByAccountId(int $accountId): array {
        return $this->receiptRepository->getReceiptsByAccountId($accountId);
    }

    public function getReceiptDetails(int $receiptId): array {
        return $this->receiptRepository->getReceiptDetails($receiptId);
    }

    public function getFilteredReceipts(array $filters): array {
        return $this->receiptRepository->getFilteredReceipts($filters);
    }

    public function getReceiptById(int $receiptId): ?array {
        return $this->receiptRepository->getReceiptById($receiptId);
    }

    public function getUserInformation(int $userInformationId): ?array {
        return $this->userInformationRepository->findById($userInformationId);
    }

    public function updateReceiptStatus(int $receiptId, string $newStatus): void {
        $receipt = $this->receiptRepository->getReceiptById($receiptId);
        if (!$receipt) {
            throw new Exception('Receipt not found');
        }
    
        $validStatuses = ['pending', 'confirmed', 'on_deliver', 'delivered', 'cancelled'];
        if (!in_array($newStatus, $validStatuses)) {
            throw new Exception('Invalid status');
        }
    
        $statusOrder = ['pending', 'confirmed', 'on_deliver', 'delivered', 'cancelled'];
        $currentIndex = array_search($receipt['status'], $statusOrder);
        $newIndex = array_search($newStatus, $statusOrder);
    
        if ($newIndex < $currentIndex && $newStatus !== 'cancelled') {
            throw new Exception('Cannot update status backwards');
        }
    
        if ($newStatus === 'cancelled' && !in_array($receipt['status'], ['pending', 'confirmed'])) {
            throw new Exception('Can only cancel pending or confirmed receipts');
        }
    
        try {
            $this->pdo->beginTransaction();
    
            if ($newStatus === 'cancelled') {
                // Lấy chi tiết đơn hàng
                $details = $this->receiptRepository->getReceiptDetails($receiptId);
                foreach ($details as $detail) {
                    // Cập nhật stock và sold trong sku
                    $sku = $this->skuRepository->findById($detail['sku_id']);
                    if ($sku) {
                        $newStock = $sku['stock'] + $detail['quantity'];
                        $newSold = max(0, $sku['sold'] - $detail['quantity']); // Đảm bảo sold không âm
                        $this->skuRepository->updateStock($detail['sku_id'], $newStock);
                        $this->skuRepository->updateSold($detail['sku_id'], $newSold);
                    }
    
                    // Xóa các bản ghi imei liên quan đến receipt_detail
                    $this->receiptRepository->deleteImeiByReceiptDetailId($detail['detail_id']);
                }
            }
    
            // Cập nhật trạng thái đơn hàng
            $this->receiptRepository->updateReceiptStatus($receiptId, $newStatus);
    
            $this->pdo->commit();
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}