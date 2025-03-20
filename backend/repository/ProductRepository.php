<?php

namespace repository;

use PDO;

class ProductRepository
{
    public string $table = 'product';
    public function __construct(private Database $database)
    {
        $this->database = $database->getConnection();
    }

    public function getAllProducts(): array
    {
        $sql = "SELECT * 
                FROM $this->table
                WHERE status = 1";
        $stmt = $this->database->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}