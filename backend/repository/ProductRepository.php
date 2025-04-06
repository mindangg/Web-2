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

    public function findAll(?string $brand,
                            ?string $sort,
                            ?string $sort_dir,
                            ?int    $max_price,
                            ?int    $min_price,
                            ?string $search,
                            ?int    $limit,
                            ?int    $page): array
    {
        $sql = "";
        $additional = "";
        $totalQuery = "";

        if ($brand) {
            $sql .= "SELECT *
                    FROM product
                    JOIN brand ON product.brand = brand.brand_id
                    WHERE 1=1";
            $totalQuery = "SELECT COUNT(*)
                    FROM product
                    JOIN brand ON product.brand = brand.brand_id
                    WHERE 1=1";
            $additional .= " AND brand.brand_name LIKE '%$brand%'";
        } else {
            $sql .= "SELECT *
                    FROM product
                    WHERE 1=1";
            $totalQuery = "SELECT COUNT(*)
                    FROM product
                    WHERE 1=1";
        }
        if ($min_price) {
            $additional .= " AND base_price >= $min_price";
        }
        if ($max_price) {
            $additional .= " AND base_price <= $max_price";
        }
        if ($search) {
            $additional .= " AND name LIKE '%$search%'";
        }
        if ($sort) {
            $additional .= " ORDER BY $sort $sort_dir";
        }

        $total = $this->pdo->query($totalQuery . $additional)->fetchColumn();

        $offset = ($page - 1) * $limit;
        $additional .= " LIMIT $limit OFFSET $offset";

        $stmt = $this->pdo->prepare($sql . $additional);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response = [
            'totalProduct' => $total,
            'totalPage' => ceil($total / $limit),
            'currentPage' => $page,
            'products' => $products
        ];

        return $response;
    }

    public function findById(int $id)
    {
        $sql = "SELECT * 
        FROM product
        WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}