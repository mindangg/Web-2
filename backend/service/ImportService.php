<?php

namespace service;

use Cassandra\Map;
use config\Database;
use PDOException;
use repository\ImportRepository;
use repository\ProviderRepository;

class ImportService
{
    private ImportRepository $importRepository;
    private ProviderRepository $providerRepository;
    private $pdo;

    public function __construct()
    {
        $this->importRepository = new ImportRepository();
        $this->providerRepository = new ProviderRepository();
        $this->pdo = (new Database())->getConnection();
    }

    public function getProviderProduct(int $id): array
    {
        $response = [];
        $products = $this->importRepository->findByProviderId($id);
        if ($products === null) {
            return $response = [
                'status' => 404,
                'message' => 'Không tìm thấy sản phẩm nào'
            ];
        } else {
            foreach ($products as &$product) {
                $product['internal'] = $product['ram'] . '/' . $product['storage'];
            }
            return $response = [
                'status' => 200,
                'products' => $products
            ];
        }
    }

    public function createImport(int $id, object $data): array
    {
        $response = [];
        try{
            $this->pdo->beginTransaction();
            $employeeId = intval($data->employeeId);
            $providerId = intval($data->providerId);
            $total = $data->total;
            $details = $data->details;

            $provider = $this->providerRepository->findById($id);
            if ($provider === []) {
                return $response = [
                    'status' => 404,
                    'message' => 'Nhà cung cấp không tồn tại'
                ];
            } else {
                if($provider['provider_id'] !== $providerId) {
                    return $response = [
                        'status' => 400,
                        'message' => 'Nhà cung cấp không hợp lệ'
                    ];
                }
            }
            $importData = [
                'provider_id' => $providerId,
                'employee_id' => $employeeId,
                'total' => $total
            ];
            $importId = $this->importRepository->createImport($importData);
            foreach ($details as $detail) {
                $detailData = [
                    'import_id' => $importId,
                    'sku_id' => $detail->skuId,
                    'quantity' => $detail->quantity,
                    'price' => $detail->price
                ];
                $this->importRepository->createImportDetail($detailData);
            }

            $this->pdo->commit();
            return $response = [
                'status' => 200,
                'message' => 'Tạo phiếu nhập kho thành công',
                'import_id' => $importId
            ];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return $response = [
                'status' => 400,
                'message' => 'Tạo phiếu nhập kho thất bại: ' . $e->getMessage()
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return $response = [
                'status' => 500,
                'message' => 'Lỗi không xác định: ' . $e->getMessage()
            ];
        }
    }

    public function getAllImport($fromDate, $toDate, $seacrhBy, $search, $limit, $page): array
    {
        if($fromDate === null){
            $fromDate = $this->importRepository->getMinImportDate();
            $fromDate = date('Y-m-d', strtotime($fromDate));
        }
        if($toDate === null){
            $toDate = date('Y-m-d');
        }
        if($limit === null){
            $limit = 10;
        }
        if($page === null){
            $page = 1;
        }

        $imports = $this->importRepository->findAll($fromDate, $toDate, $seacrhBy, $search, $limit, $page);
        if ($imports === []) {
            return $response = [
                'status' => 404,
                'message' => 'Không tìm thấy phiếu nhập kho nào'
            ];
        } else {
            return $response = [
                'status' => 200,
                'imports' => $imports
            ];
        }
    }

    public function updateImportStatus(int $id, object $data): array
    {
        $response = [];
        $statusAllowedMap = [
            'pending' => ['confirmed', 'cancelled', 'on_deliver', 'delivered'],
            'confirmed' => ['on_deliver', 'delivered', 'cancelled'],
            'cancelled' => [],
            'on_deliver' => ['delivered', 'cancelled'],
            'delivered' => [],
        ];

        $valueMap = [
            'pending' => 'Đang xử lý',
            'confirmed' => 'Đã xác nhận',
            'cancelled' => 'Đã hủy',
            'on_deliver' => 'Đang giao hàng',
            'delivered' => 'Đã giao hàng'
        ];


        $oldStatus = $data->oldStatus;
        $newStatus = $data->newStatus;

        if (!array_key_exists($oldStatus, $statusAllowedMap)) {
            return $response = [
                'status' => 400,
                'message' => 'Trạng thái không hợp lệ'
            ];
        }
        if (!array_key_exists($newStatus, $statusAllowedMap)) {
            return $response = [
                'status' => 400,
                'message' => 'Trạng thái không hợp lệ'
            ];
        }
        if ($oldStatus === $newStatus) {
            return $response = [
                'status' => 400,
                'message' => 'Trạng thái không thay đổi'
            ];
        }
        if (!in_array($newStatus, $statusAllowedMap[$oldStatus])) {
            return $response = [
                'status' => 400,
                'message' => 'Không thể cập nhật trạng thái từ ' . $valueMap[$oldStatus] . ' sang ' . $valueMap[$newStatus]
            ];
        }

        try {
            $this->pdo->beginTransaction();
            $import = $this->importRepository->findImportById($id);
            if ($import === null) {
                return $response = [
                    'status' => 404,
                    'message' => 'Không tìm thấy phiếu nhập kho nào'
                ];
            }
            if ($import['status'] !== $oldStatus) {
                return $response = [
                    'status' => 400,
                    'message' => 'Trạng thái phiếu nhập kho không hợp lệ'
                ];
            }
            if($this->importRepository->updateImportStatus($id, $newStatus)){
                if($newStatus === 'delivered'){
                    $importDetails = $this->importRepository->getAllImportDetailByImportId($id);
                    if($importDetails !== null){
                        foreach ($importDetails as $detail) {
                            $this->importRepository->updateStockAndImportPrice(
                                $detail['sku_id'],
                                $detail['quantity'],
                                $detail['price']
                            );
                        }
                    }
                }
            }
            $this->pdo->commit();
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return $response = [
                'status' => 400,
                'message' => 'Cập nhật trạng thái thất bại: ' . $e->getMessage()
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return $response = [
                'status' => 500,
                'message' => 'Lỗi không xác định: ' . $e->getMessage()
            ];
        }
        return $response = [
            'status' => 200,
            'message' => 'Cập nhật trạng thái thành công',
            'import_id' => $id,
        ];
    }

    public function getAllImportDetailByImportId(int $id): array
    {
        $response = [];
        $importDetails = $this->importRepository->getAllImportDetail($id);
        if ($importDetails === null) {
            return $response = [
                'status' => 404,
                'message' => 'Không tìm thấy chi tiết phiếu nhập kho nào'
            ];
        } else {
            return $response = [
                'status' => 200,
                'import_details' => $importDetails
            ];
        }
    }
}