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

    public function findAllAvailable(): array
    {
        $sql = "SELECT * FROM provider WHERE provider_status = 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findAll($searchBy, $search): array
    {
        $sql = "SELECT * FROM provider WHERE 1 = 1";
        if($searchBy !== null && $search !== null) {
            if ($searchBy === 'provider_status') {
                $search = intval($search === 'true' ? 1 : 0);
                $sql .= " AND provider_status = :search";
            } else {
                $search = "%$search%";
                $sql .= " AND $searchBy LIKE :search";
            }
        }
        $stmt = $this->pdo->prepare($sql);
        if($searchBy !== null && $search !== null) {
            $stmt->bindParam(':search', $search);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(int $id): array
    {
        $sql = "SELECT * FROM provider WHERE provider_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
    }

    public function isExisted(string $name): bool
    {
        $sql = "SELECT * FROM provider WHERE provider_name = :name";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function isExistedWithAnotherProvider(string $name): bool
    {
        $sql = "SELECT * FROM provider WHERE provider_name = :name";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->rowCount() > 1;
    }

    public function create(object $data): bool
    {
        $sql = "INSERT INTO provider (provider_name, phone, address, email) VALUES (:provider_name, :phone, :address, :email)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':provider_name', $data->provider_name);
        $stmt->bindParam(':phone', $data->phone);
        $stmt->bindParam(':address', $data->address);
        $stmt->bindParam(':email', $data->email);
        return $stmt->execute();
    }

    public function update(int $id, object $data): bool
    {

        $sql = "UPDATE provider SET provider_name = :provider_name, phone = :phone, address = :address, email = :email, provider_status = :status WHERE provider_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $data->provider_status = intval($data->provider_status === true ? 1 : 0);
        $stmt->bindParam(':provider_name', $data->provider_name);
        $stmt->bindParam(':phone', $data->phone);
        $stmt->bindParam(':address', $data->address);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':status', $data->provider_status);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function isExistedInImport($id): bool
    {
        $sql = "SELECT * FROM import WHERE provider_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $stmt->fetch(PDO::FETCH_ASSOC);
        return $stmt->rowCount() > 0;
    }

    public function isExistedInProduct($id): bool
    {
        $sql = "SELECT * FROM product WHERE provider = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $stmt->fetch(PDO::FETCH_ASSOC);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $sql = "DELETE FROM provider WHERE provider_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function blockById($id): bool
    {
        $sql = "UPDATE provider SET provider_status = 0 WHERE provider_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}