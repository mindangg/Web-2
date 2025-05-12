<?php
namespace service;

use repository\WarrantyRepository;

class WarrantyService {
    private $warrantyRepository;

    public function __construct() {
        $this->warrantyRepository = new WarrantyRepository();
    }

    public function getAllWarranties(): array {
        return $this->warrantyRepository->findAll();
    }

    public function updateWarrantyStatus(int $imei, string $status): void {
        $this->warrantyRepository->updateStatus($imei, $status);
    }
}
?>