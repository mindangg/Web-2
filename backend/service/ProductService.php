<?php

namespace service;
use repository\ProductRepository;

class ProductService
{
    private ProductRepository $productRepository;

    public function __construct() {
        $this->productRepository = new ProductRepository();
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

    public function getProductById(int $id)
    {
        $product = $this->productRepository->findById($id);
        if(!$product) {
            throw new \PDOException('Product not found', 404);
        } else {
            return $product;
        }
    }
}