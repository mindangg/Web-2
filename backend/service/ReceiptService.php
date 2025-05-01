<?php
namespace service;

use Exception;
use repository\ReceiptRepository;
use repository\SkuRepository;
use repository\ProductRepository;
use PDO;

class ReceiptService {
    private $receiptRepository;
    private $skuRepository;
    private $productRepository;
    private $pdo;

    public function __construct() {
        $this->receiptRepository = new ReceiptRepository();
        $this->skuRepository = new SkuRepository();
        $this->productRepository = new ProductRepository();
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
                $detailId=$this->receiptRepository->createReceiptDetail($detailData);

                $product = $this->productRepository->findById($sku['product_id']);
                if (!$product || !isset($product['warranty_period'])) {
                    throw new Exception("Không tìm thấy sản phẩm hoặc thời gian bảo hành cho SKU {$item['sku_id']}");
                }

                $warrantyPeriod = (int)$product['warranty_period'];

                for($i=0;$i<$item['quantity'];$i++){
                    $imeiData= [
                        'receipt_detail_id' => $detailId,
                        'date' => date('Y-m-d'), // Ngày hiện tại
                        'expired_date' => date('Y-m-d', strtotime("+$warrantyPeriod months")), // Tính expired_date
                        'status' => true // Trạng thái hợp lệ
                    ];
                    $this->receiptRepository->createImei($imeiData);
                }

                // Cập nhật tồn kho
                $this->skuRepository->updateStock($item['sku_id'], $sku['stock'] - $item['quantity']);
            }

            $this->pdo->commit();
            return ['receipt_id' => $receiptId, 'total_price' => $totalPrice];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}