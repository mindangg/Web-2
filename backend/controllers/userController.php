<?php
    include('../database.php');

    // Get all users
    function getAllUsers() {
        $sql = "SELECT * FROM users";

        $sql_run = mysqli_query($conn, $sql);

        if ($sql_run) {
            if (!empty(mysqli_num_rows($sql_run))) {
                $res = mysqli_fetch_all($sql_run, MYSQLI_ASSOC);

                $data = [
                    'status' => 200,
                    'message' => 'Successfully fetched users',
                    'data' => $res
                ];
                header('HTTP/1.0 200 Successfully fetched users');
                return json_encode($data);
            }
            else {
                $data = [
                    'status' => 404,
                    'message' => 'No users found'
                ];
                header('HTTP/1.0 404 No users found');
                return json_encode($data);
            }
        }
        else {
            $data = [
                'status' => 500,
                'message' => 'Internal Server Error'
            ];
            header('HTTP/1.0 500 Internal Server Error');
            return json_encode($data);
        }

    }

    // Get a single user
    function getUser() {

    }

    // Create a user
    function createUser() {
        $sql = "INSERT INTO users (fullname, email, phoneNumber, username, address, password)
                VALUES ('Minh Dang', 'mindang@gmail.com', '0901234567', 'mindang', '123 An Duong Vuong', 'mindang')";
        
        $sql_run = mysqli_query($conn, $sql);
    }

    // Delete a user
    function deletedUser() {

    }

    // Update a user
    function updateUser() {

    }



?>