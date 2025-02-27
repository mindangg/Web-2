<?php
    $db_server = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'Web 2';
    $conn = '';

    try {
        $conn = mysqli_connect($db_server, 
                                $db_user, 
                                $db_pass, 
                                $db_name);

    }
    catch (mysqli_sql_exception) {
        echo 'Failed to connect to db';
    }

    if ($conn) 
        echo 'Connected to db';

?>