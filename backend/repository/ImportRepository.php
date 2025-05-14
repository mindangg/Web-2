<?php

namespace repository;

use config\Database;
use PDO;

class ImportRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function findByProviderId(int $id): ?array
    {
        $sql = "SELECT s.*, c.color, i.ram, i.storage
                FROM product p
                 JOIN sku s on s.product_id = p.product_id
                 JOIN color c on c.color_id = s.color_id
                 JOIN internal_option i on i.internal_option_id = s.internal_id
                WHERE p.provider = :id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: null;
    }

    public function createImport(array $data): int
    {
        $sql = "INSERT INTO import (employee_id, provider_id, total) VALUES (:employeeId, :providerId, :total)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':employeeId', $data['employee_id']);
        $stmt->bindParam(':providerId', $data['provider_id']);
        $stmt->bindParam(':total', $data['total']);
        $stmt->execute();
        return (int)$this->pdo->lastInsertId();
    }

    public function createImportDetail(array $data): bool
    {
        $sql = "INSERT INTO import_detail (import_id, sku_id, quantity, price) VALUES (:importId, :skuId, :quantity, :price)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':importId', $data['import_id']);
        $stmt->bindParam(':skuId', $data['sku_id']);
        $stmt->bindParam(':quantity', $data['quantity']);
        $stmt->bindParam(':price', $data['price']);
        return $stmt->execute();
    }

    public function updateStockAndImportPrice(int $skuId, int $quantity, int $price): bool
    {
        $sql = "UPDATE sku SET stock = stock + :quantity, import_price = :price WHERE sku_id = :skuId";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':skuId', $skuId);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':price', $price);
        return $stmt->execute();
    }

    public function getMinImportDate(): string
    {
        $sql = "SELECT MIN(date) AS min_date FROM import";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchColumn() ?: date('Y-m-d');
    }

    public function findAll($fromDate, $toDate, $seacrhBy, $search, $limit, $page):array
    {
        $offset = ($page - 1) * $limit;

        $sql = "
            SELECT *
            FROM import i
                JOIN provider p ON i.provider_id = p.provider_id
                JOIN employee e ON i.employee_id = e.employee_id
            WHERE DATE(i.date) BETWEEN :fromDate AND :toDate
        ";

        if ($seacrhBy !== null && $search !== null) {
            switch ($seacrhBy) {
                case 'provider_id':
                    $sql .= " AND i.provider_id = :search";
                    break;
                case 'status':
                    $sql .= " AND i.status = :search";
                    break;
            }
        }

        $sql .= " ORDER BY i.date DESC LIMIT :offset, :limit";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':fromDate', $fromDate);
        $stmt->bindParam(':toDate', $toDate);
        if ($seacrhBy !== null && $search !== null) {
            $stmt->bindValue(':search', $search);
        }
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $total = $this->getTotalImport($fromDate, $toDate, $seacrhBy, $search);
        return [
            'data' => $data,
            'total' => $total,
            'page' => $page,
            'totalPage' => ceil($total / $limit)
        ];
    }

    public function getTotalImport($fromDate, $toDate, $seacrhBy, $search): int
    {
        $sql = "
            SELECT COUNT(*) AS total
            FROM import i
                JOIN provider p ON i.provider_id = p.provider_id
                JOIN employee e ON i.employee_id = e.employee_id
            WHERE DATE(i.date) BETWEEN :fromDate AND :toDate
        ";

        if ($seacrhBy !== null && $search !== null) {
            switch ($seacrhBy) {
                case 'provider_id':
                    $sql .= " AND i.provider_id = :search";
                    break;
                case 'status':
                    $sql .= " AND i.status = :search";
                    break;
            }
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':fromDate', $fromDate);
        $stmt->bindParam(':toDate', $toDate);
        if ($seacrhBy !== null && $search !== null) {
            $stmt->bindValue(':search', $search);
        }
        $stmt->execute();
        return (int)$stmt->fetchColumn();
    }

    public function updateImportStatus(int $id, string $status): bool
    {
        $sql = "UPDATE import SET status = :status WHERE import_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getAllImportDetailByImportId(int $id): ?array
    {
        $sql = "SELECT * FROM import_detail WHERE import_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: null;
    }

    public function getAllImportDetail(int $id): array
    {
        $sql = "SELECT *
                FROM import_detail id
                    JOIN sku s ON s.sku_id = id.sku_id
                WHERE id.import_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function findImportById(int $id): ?array
    {
        $sql = "SELECT * FROM import WHERE import_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}