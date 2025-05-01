<?php

namespace repository;

use config\Database;
use PDO;

class ProviderRepository
{

    private PDO $pdo;
    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function findAll(): array
    {
        $sql = "SELECT * FROM provider";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id): array
    {
        $sql = "SELECT * FROM provider WHERE provider_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function isExisted(string $name): bool
    {
        $sql = "SELECT * FROM provider WHERE provider_name = :name";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function create(object $data): void
    {
        $sql = "INSERT INTO provider (provider_name, phone, address, email) VALUES (:provider_name, :phone, :address, :email)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':provider_name', $data->provider_name);
        $stmt->bindParam(':phone', $data->phone);
        $stmt->bindParam(':address', $data->address);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();
    }
}