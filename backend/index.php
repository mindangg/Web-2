<?php
declare(strict_types=1);

use controller\ProductController;
use controller\UserController;
use controller\EmployeeController;
use exception\ExceptionHandler;

spl_autoload_register(function ($class) {
    require_once __DIR__ . "\\$class.php";
});

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/exception/ExceptionHandler.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/repository/ProductRepository.php';
require_once __DIR__ . '/repository/UserRepository.php';
require_once __DIR__ . '/repository/EmployeeRepository.php';

set_error_handler([ExceptionHandler::class, 'handleError']);
set_exception_handler([ExceptionHandler::class, 'handleException']);

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');


// Handle preflight (OPTIONS) requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$request = parse_url(trim($_SERVER["REQUEST_URI"]), PHP_URL_PATH);
$request = explode("/", $request);

switch ($request[2]){
    case 'product':
        $productController = new ProductController();
        $productController->processRequest($_SERVER['REQUEST_METHOD'], isset($request[3]) ? (int)$request[3] : null);
        break;
        
    case 'user':
        $userController = new UserController();
        $userController->processRequest(
            $_SERVER['REQUEST_METHOD'], 
            $request[3] ?? null);
        break;
        
    case 'employee':
        $employeeController = new EmployeeController();
        $employeeController->processRequest(
            $_SERVER['REQUEST_METHOD'], 
            $request[3] ?? null);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
}


