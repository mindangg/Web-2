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

    public function findAll(int $id): array
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

    public function isExistedInReceipt(int $id): bool
    {
        $sql = "SELECT *
                FROM sku s
                    JOIN receipt_detail rd
                WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function isExistedInImport(int $id): bool
    {
        $sql = "SELECT *
                FROM sku s
                    JOIN import_detail rd
                WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function deleteAllByProductId(int $id): bool
    {
        $sql = "DELETE FROM sku WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }
}