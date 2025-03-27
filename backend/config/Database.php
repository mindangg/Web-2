<?php

namespace config;
use PDO;
use PDOException;

class Database
{
    private string $host = 'localhost';
    private string $dbname = 'mobile_store';
    private string $username = 'root';
    private string $password = '';
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