<?php

namespace repository;
use service\UserService;

use config\Database;
use PDO;

class UserRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function findAll()
    {
        $sql = "SELECT * 
        FROM user_account";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findById(int $id)
    {
        $sql = "SELECT * 
        FROM user_account;
        WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function userExists(string $username, string $email): bool
    {
        $sql = "SELECT COUNT(*) as count 
        FROM user_account 
        WHERE username = :username OR email = :email";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result['count'] > 0;
    }

    public function loginUser(string $username, string $password): ?array
    {
        $sql = "SELECT user_account_id, username, email, password 
        FROM user_account 
        WHERE username = :username";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return [
                "message" => "Username not found"
            ];
        }

        // var_dump($user['password']);
        // $plainPassword = "mindang";
        // $storedHashedPassword = $user['password']; // Example

        // if (password_verify($plainPassword, $storedHashedPassword)) {
        //     echo "Password matches!";
        // } else {
        //     echo "Invalid password!";
        // }
        // die();

        if (!password_verify($password, $user['password'])) {
            return [
                "message" => "Incorrect password"
            ];
        }

        return [
            "user" => [
                "id" => $user['user_account_id'],
                "username" => $user['username'],
                "email" => $user['email']
            ]
        ];

        return null;
    }

    public function signupUser(string $username, string $email, string $password): ?int
    {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $sql = "INSERT INTO user_account (username, email, password) VALUES (:username, :email, :password)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':password', $hashedPassword, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        }
        return null;
    }
}

?>