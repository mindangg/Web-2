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

    public function create(object $data): int
    {
        $sql = "INSERT INTO sku (product_id, internal_id, color_id, sku_name, import_price, invoice_price, image, sku_code)
                VALUES (:product_id, :internal_id, :color_id, :sku_name, :import_price, :invoice_price, :image, :sku_code)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':product_id', $data->product_id);
        $stmt->bindValue(':internal_id', $data->internal_id);
        $stmt->bindValue(':color_id', $data->color_id);
        $stmt->bindValue(':sku_name', $data->sku_name);
        $stmt->bindValue(':import_price', $data->import_price);
        $stmt->bindValue(':invoice_price', $data->invoice_price);
        $stmt->bindValue(':image', $data->image);
        $stmt->bindValue(':sku_code', $data->sku_code);
        return $stmt->execute() ? $this->pdo->lastInsertId() : -1;
    }

    public function isExistedWithProduct_IdAndColor_IdAndInternalOption_Id($product_id, $color_id, $internal_option_id): bool
    {
        $sql = "SELECT *
                FROM sku
                WHERE product_id = :product_id AND color_id = :color_id AND internal_id = :internal_option_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':product_id', $product_id);
        $stmt->bindValue(':color_id', $color_id);
        $stmt->bindValue(':internal_option_id', $internal_option_id);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }
}