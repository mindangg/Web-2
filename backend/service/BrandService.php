<?php

namespace service;

use repository\BrandRepository;

class BrandService
{
    private BrandRepository $brandRepository;

    public function __construct() {
        $this->brandRepository = new BrandRepository();
    }

    public function getAllBrands(): array
    {
        $response = $this->brandRepository->findAll();
        if(!$response === null) {
            throw new \PDOException('No brands found', 404);
        } else {
            return $response = [
                'brands' => $response
            ];
        }
    }

    public function createBrand(object $data): array
    {
        $response = [];
        if($this->brandRepository->isExisted($data->brand_name)) {
            return $response = [
                'message' => 'Thươnng hiệu đã tồn tại',
            ];
        }

        $this->brandRepository->create($data);
        return $response = [
            'message' => 'Thương hiệu đã được tạo thành công',
        ];
    }
}