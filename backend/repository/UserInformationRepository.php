<?php
namespace repository;

use PDO;
use config\Database;

class UserInformationRepository{
    private $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->getConnection();
    }

    public function findById(int $userInformationId): ?array {
        $sql = "SELECT full_name, district, city
                FROM user_information
                WHERE user_information_id = :user_information_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['user_information_id' => $userInformationId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}