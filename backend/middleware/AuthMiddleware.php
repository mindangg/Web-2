<?php

namespace middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthMiddleware
{
    private static string $secretKey = "web_2_phone_store";

    public static function verifyToken(): ?array
    {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(["message" => "Access denied. No token provided."]);
            exit;
        }

        $token = str_replace("Bearer ", "", $headers['Authorization']);
        print($token);

        try {
            $decoded = JWT::decode($token, new Key(self::$secretKey, 'HS256'));
            return (array) $decoded;
        } 
        catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["message" => "Invalid token", "error" => $e->getMessage()]);
            exit;
        }
    }
}
?>
