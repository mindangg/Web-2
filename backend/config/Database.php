<?php

namespace config;
use PDO;
use PDOException;
//mysql:host=localhost;dbname=mobile_store
class Database
{
    private string $host = 'localhost';
    private string $dbname = 'mobile_store';
    private string $username = 'root';
    private string $password = '100205';
    private ?PDO $pdo = null;

    public function getConnection(): PDO
    {
        if ($this->pdo === null) {
            try {
                $this->pdo = new PDO("mysql:host=$this->host;dbname=$this->dbname", $this->username, $this->password);
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Connect failed\n" . $e->getMessage());
            }
        }
        return $this->pdo;
    }

    public function closeConnection(): void
    {
        $this->pdo = null;
    }
}