<?php

namespace service;
use repository\ProductRepository;
use repository\SkuRepository;

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
        $search = $_GET['search'] ?? "";
        $limit = intval($_GET['limit'] ?? 10);
        $page = intval($_GET['page'] ?? 1);

        $response = $this->productRepository->findAll($brand, $sort, $sort_dir, $max_price, $min_price, $search, $limit, $page);

        if(!$response === null) {
            throw new \PDOException('No products found', 404);
        } else {
            return $response;
        }
    }

    public function getProductById(int $id):array
    {
        $product = $this->productRepository->findById($id);
        if(!$product) {
            throw new \PDOException(`Product not found with id: $id`, 404);
        }
        $sku = $this->skuRepository->findAll($id);

        return $response = [
            'product' => $product,
            'sku' => $sku
        ];
    }
}