<?php
declare(strict_types=1);
spl_autoload_register(function ($class) {
    require __DIR__ . "/src/controller/$class.php";
});
set_error_handler("ExceptionHandler::handleError");
set_exception_handler("ExceptionHandler::handleException");
header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include('./database.php');

$request = explode("/", $_SERVER["REQUEST_URI"]);


if ($request == 'POST') {
    $data = (array) json_decode(file_get_contents("php://input"), true);
}

