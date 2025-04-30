<?php
namespace service;
use repository\RoleRepository;

class RoleService
{
    private RoleRepository $roleRepository;

    public function __construct() {
        $this->roleRepository = new RoleRepository();
    }

    private function respond(int $code, array $message): void 
    {
        http_response_code($code);
        echo json_encode($message);
        exit;
    }
    
    public function getAllRoles(): array
    {
        $roles = $this->roleRepository->findAll();

        if(!$roles)
            throw new \PDOException('Không tìm thấy vai trò', 404);
        
        else
            return $roles;
    }

    public function getRoleById(int $id)
    {
        $role = $this->roleRepository->findById($id);

        if(!$role)
            throw new \PDOException('Không tìm thấy vai trò', 404);
        
        else
            return $role;
    }

    public function createRole(array $data)
    {
        $createdRole = $this->roleRepository->createRole($data);

        if (!$createdRole)
            $this->respond(400, ["message" => "Lỗi khi tạo vai trò"]);

        http_response_code(200);
        echo json_encode([
            "message" => "Tạo vai trò thành công",
            "role" => $createdRole
        ]);
        exit;
    }

    public function deleteRoleById(int $id)
    {
        $role = $this->roleRepository->deleteById($id);

        if(!$role)
            throw new \PDOException('Không tìm thấy vai trò', 404);
        
        else
            return json_encode(["message" => "Xóa vai trò thành công"]);
    }

    public function updateRoleById(int $id, array $data): void
    {        
        $updatedRole = $this->roleRepository->updateById($id, $data);

        if (!$updatedRole)
            $this->respond(400, ["message" => "Lỗi khi cập nhật vai trò"]);

        http_response_code(200);
        echo json_encode([
            "message" => "Cập nhật vai trò thành công",
            "user" => $updatedRole
        ]);
        exit;
    }
}
?>