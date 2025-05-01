<?php

namespace repository;
use config\Database;
use PDO;

class SkuRepository
{
    private PDO $pdo;
    public function __construct(){
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function findAll($id): array
    {
        $sql = "SELECT *
                FROM sku
                    JOIN color on sku.color_id = color.color_id
                    JOIN internal_option on sku.internal_id = internal_option.internal_option_id
                WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $skuId): ?array {
        $sql = "SELECT * FROM sku WHERE sku_id = :sku_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['sku_id' => $skuId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updateStock(int $skuId, int $stock): void {
        $sql = "UPDATE sku SET stock = :stock, update_date = CURRENT_TIMESTAMP WHERE sku_id = :sku_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'stock' => $stock,
            'sku_id' => $skuId
        ]);
    }
}