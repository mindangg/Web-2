<?php
require ('utils/database_properties.php');
class Database
{
    public function __construct(private string $host,
                                private string $dbname,
                                private string $username,
                                private string $password)
    {
    }

    public function getConnection(): PDO
    {
        try{
            $pdo = new PDO("mysql:host=$this->host;dbname=$this->dbname", $this->username, $this->password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "Connect successfully\n";
        } catch (PDOException $e) {
            die("Connect failed\n" . $e->getMessage());
        }
        return $pdo;
    }
}