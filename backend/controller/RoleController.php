<?php

namespace controller;

use service\RoleService;

use middleware\AuthMiddleware;

class RoleController
{
    private RoleService $roleService;

    public function __construct()
    {
        $this->roleService = new RoleService();
    }

    public function processRequest(string $method, ?string $param): void
    {
        // AuthMiddleware::verifyToken();

        switch ($method) {
            case 'GET': 
                if (is_numeric($param))
                    $this->getRoleById((int)$param);
                
                else
                    $this->getAllRoles();
                
                break;

            case 'POST':
                $this->createRole();
                break;

            case 'DELETE':
                $this->deleteRole((int)$param);
                break;

            case 'PATCH':
                $this->updateRole((int)$param);
                break;
                
            default:
                http_response_code(405);
                header("Allow: GET POST PATCH DELETE");
        }
    }
    
    private function getAllRoles(): void
    {
        $roles = $this->roleService->getAllRoles();
        echo json_encode($roles);
    }

    private function getRoleById(int $id): void
    {
        $role = $this->roleService->getRoleById($id);
        echo json_encode($role);
    }

    private function createRole(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $role = $this->roleService->createRole($data);
        echo json_encode($role);
    }
    
    private function deleteRole(int $id): void
    {
        $role = $this->roleService->deleteRoleById($id);
        echo json_encode($role);
    }

    private function updateRole(int $id): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $role = $this->roleService->updateRoleById($id, $data);
        echo json_encode($role);
    }
}
?>