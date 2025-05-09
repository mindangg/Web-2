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
    public function productIsExistedInReceipt(int $id): bool
    {
        $sql = "SELECT *
                FROM sku s
                    JOIN receipt_detail rd ON s.sku_id = rd.sku_id
                WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $stmt->fetch(PDO::FETCH_ASSOC);
        return $stmt->rowCount() > 0;
    }

    public function productIsExistedInImport(int $id): bool
    {
        $sql = "SELECT *
                FROM sku s
                    JOIN import_detail rd ON s.sku_id = rd.sku_id
                WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $stmt->fetch(PDO::FETCH_ASSOC);
        return $stmt->rowCount() > 0;
    }

    public function skuIsExistedInReceipt(int $id): bool
    {
        $sql = "SELECT *
                FROM sku s
                    JOIN receipt_detail rd ON s.sku_id = rd.sku_id
                WHERE s.sku_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $stmt->fetch(PDO::FETCH_ASSOC);
        return $stmt->rowCount() > 0;
    }

    public function skuIsExistedInImport(int $id): bool
    {
        $sql = "SELECT *
                FROM sku s
                    JOIN import_detail rd ON s.sku_id = rd.sku_id
                WHERE s.sku_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $stmt->fetch(PDO::FETCH_ASSOC);
        return $stmt->rowCount() > 0;
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

    public function isExistedWithAnotherSkuWithProduct_IdAndColor_IdAndInternalOption_Id($product_id, $color_id, $internal_option_id): bool
    {
        $sql = "SELECT *
                FROM sku
                WHERE product_id = :product_id AND color_id = :color_id AND internal_id = :internal_option_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':product_id', $product_id);
        $stmt->bindValue(':color_id', $color_id);
        $stmt->bindValue(':internal_option_id', $internal_option_id);
        $stmt->execute();
        return $stmt->rowCount() == 2;
    }

    public function update(int $skuId, object $data): int
    {
        $sql = "UPDATE sku 
                SET internal_id = :internal_id,
                    color_id = :color_id,
                    import_price = :import_price,
                    invoice_price = :invoice_price,
                    image = :image,
                    stock = :stock,
                    sku_name = :sku_name,
                    sku_code = :sku_code,
                    update_date = CURRENT_TIMESTAMP
                WHERE sku_id = :sku_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':internal_id', $data->internal_id);
        $stmt->bindValue(':color_id', $data->color_id);
        $stmt->bindValue(':import_price', $data->import_price);
        $stmt->bindValue(':invoice_price', $data->invoice_price);
        $stmt->bindValue(':image', $data->image);
        $stmt->bindValue(':stock', $data->stock);
        $stmt->bindValue(':sku_name', $data->sku_name);
        $stmt->bindValue(':sku_code', $data->sku_code);
        $stmt->bindValue(':sku_id', $skuId);
        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        } else {
            return -1;
        }
    }

    public function delete(int $id): int
    {
        $sql = "DELETE FROM sku WHERE sku_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        } else {
            return -3;
        }
    }
}