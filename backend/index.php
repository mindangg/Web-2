<?php
declare(strict_types=1);

use controller\BrandController;
use controller\ColorController;
use controller\EmployeeController;
use controller\ImportController;
use controller\InternalOptionController;
use controller\ProductController;
use controller\ProviderController;
use controller\ReceiptController;
use controller\RoleController;
use controller\SkuController;
use controller\StatisticController;
use controller\UserController;
use controller\WarrantyController;
use exception\ExceptionHandler;

spl_autoload_register(function ($class) {
    require_once __DIR__ . "\\$class.php";
});
date_default_timezone_set('Asia/Ho_Chi_Minh');
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/exception/ExceptionHandler.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/repository/ProductRepository.php';
require_once __DIR__ . '/repository/UserRepository.php';
require_once __DIR__ . '/repository/EmployeeRepository.php';
require_once __DIR__ . '/repository/OrderRepository.php';
require_once __DIR__ . '/repository/RoleRepository.php';
require_once __DIR__ . '/repository/ReceiptRepository.php';
require_once __DIR__ . '/repository/StatisticRepository.php';
require_once __DIR__ . '/repository/UserInformationRepository.php';

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

switch ($request[2]) {
    case 'product':
        $productController = new ProductController();
        $productController->processRequest($_SERVER['REQUEST_METHOD'], isset($request[3]) ? (int)$request[3] : null);
        break;

    case 'sku':
        $skuController = new SkuController();
        $skuController->processRequest($_SERVER['REQUEST_METHOD'], isset($request[3]) ? (int)$request[3] : null);
        break;

    case 'brand':
        $brandController = new BrandController();
        $brandController->processRequest($_SERVER['REQUEST_METHOD']);
        break;

    case 'user':
        $userController = new UserController();
        $userController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            $request[3] ?? null,
            //address
            $request[4] ?? null);
        break;

    case 'employee':
        $employeeController = new EmployeeController();
        $employeeController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            $request[3] ?? null);
        break;

    case 'role':
        $roleController = new RoleController();
        $roleController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            $request[3] ?? null);
        break;

    case 'provider':
        $providerController = new ProviderController();
        $providerController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            intval($request[3] ?? null));
        break;

    case 'color':
        $colorController = new ColorController();
        $colorController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            $request[3] ?? null);
        break;

    case 'internal_option':
        $internalOptionController = new InternalOptionController();
        $internalOptionController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            $request[3] ?? null);
        break;

    case 'receipt':
        $receiptController = new ReceiptController();
        $receiptController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            isset($request[3]) ? (int)$request[3] : null
        );
        break;

    case 'statistic':
        $statisticController = new StatisticController();
        $statisticController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            $request[3] ?? null);
        break;

    case 'warranty':
        $warrantyController = new WarrantyController();
        $warrantyController->processRequest(
            $_SERVER['REQUEST_METHOD'],
            isset($request[3]) ? (int)$request[3] : null
        );
        break;

    case 'import':;
        $importController = new ImportController();
        if(count($request) === 4){
            $param = [
                'subroute' => null,
                'id' => isset($request[3]) ? (int)$request[3] : null
            ];
        } else {
            $param = [
                'subroute' => $request[3] ?? null,
                'id' => isset($request[4]) ? (int)$request[4] : null
            ];
        }
        $importController->processRequest(
            $_SERVER['REQUEST_METHOD'], $param
        );
        break;


    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
}


