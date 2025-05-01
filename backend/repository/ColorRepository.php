<?php

namespace repository;

use config\Database;
use PDO;

class ColorRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function findAll(): array
    {
        $sql = "SELECT * FROM color";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id): array
    {
        $sql = "SELECT * FROM color WHERE color_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function isExisted(string $color): bool
    {
        $sql = "SELECT * FROM color WHERE color = :color";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':color', $color);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function create(object $data): int
    {
        $sql = "INSERT INTO color (color) VALUES (:color)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':color', $data->color);
        $stmt->execute();
        return $this->pdo->lastInsertId();
    }
}