<?php
namespace service;

use repository\WarrantyRepository;

class WarrantyService {
    private $warrantyRepository;

    public function __construct() {
        $this->warrantyRepository = new WarrantyRepository();
    }

    public function getAllWarranties(?string $imei = null, ?string $sku_name = null, ?string $receipt_id = null, ?string $status = null, ?string $startDate = null, ?string $endDate = null, int $page = 1, int $limit = 10): array {
        return $this->warrantyRepository->findAll($imei, $sku_name, $receipt_id, $status, $startDate, $endDate, $page, $limit);
    }

    public function updateWarrantyStatus(int $imei, string $status): void {
        $this->warrantyRepository->updateStatus($imei, $status);
    }
}