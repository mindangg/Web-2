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
}