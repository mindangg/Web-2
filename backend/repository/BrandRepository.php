<?php

namespace repository;

use config\Database;
use PDO;

class BrandRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function findAll(): array
    {
        $sql = "SELECT * FROM brand";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function isExisted(string $name): bool
    {
        $sql = "SELECT * FROM brand WHERE brand_name = :name";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function create(object $data): void
    {
        $sql = "INSERT INTO brand (brand_name) VALUES (:brand_name)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':brand_name', $data->brand_name);
        $stmt->execute();
    }
}