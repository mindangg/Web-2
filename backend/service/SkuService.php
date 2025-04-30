<?php

namespace service;

use repository\SkuRepository;

class SkuService
{
    private SkuRepository $skuRepository;

    public function __construct() {
        $this->skuRepository = new SkuRepository();
    }

    public function getAllSkuOfProduct(int $id): array
    {
        $sku = $this->skuRepository->findAll($id);
        if(!$sku) {
            throw new \PDOException('No SKU found for this product', 404);
        }
        return $sku;
    }
}