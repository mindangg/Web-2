<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    include('./controllers/userController.php');
    include('./database.php');

    $requestMethod = $_SERVER['REQUEST_METHOD'];

    if ($requestMethod == 'GET') {
        $user = getAllUsers();
        echo $user;
    }
    if ($requestMethod == 'POST') {
        $input = json_decode(file_get_contents('php:/input'), true);
        echo $input;
    }
    else {
        $data = [
            'status' => 405,
            'message' => $requestMethod. ' Method Not Allowed'
        ];
        header('HTTP/1.05 405 Method Not Allowed');
        echo json_encode($data);
    }
?>
