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
}