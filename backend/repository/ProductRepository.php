<?php

namespace repository;

use config\Database;
use PDO;

class ProductRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function findAll(?string $brand, ?string $sort, ?string $sort_dir, ?int $min_price, ?int $max_price, ?string $search): array
    {
        $sql = "SELECT * FROM product WHERE 1=1";
        if ($brand) {
            $sql = substr_replace($sql," JOIN brand ON product.brand = brand.brand_id", 21, 0);
            $sql .= " AND brand.name LIKE '%$brand%'";
        }
        if ($min_price) {
            $sql .= " AND price >= $min_price";
        }
        if ($max_price) {
            $sql .= " AND price <= $max_price";
        }
        if ($search) {
            $sql .= " AND name LIKE '%$search%'";
        }
        if ($sort && $sort_dir) {
            $sql .= " ORDER BY $sort $sort_dir";
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id)
    {
        $sql = "SELECT * 
        FROM product
        WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}