<?php

namespace service;

use PDOException;
use repository\ProviderRepository;

class ProviderService
{

    private ProviderRepository $providerRepository;

    public function __construct() {
        $this->providerRepository = new ProviderRepository();
    }

    public function getAllProviders($searchBy, $search, $status): array
    {
        $response = [];
        if($searchBy === null && $search === null && $status === null) {
            $response = $this->providerRepository->findAllAvailable();
        } else {
            if($status === 'all') {
                $response = $this->providerRepository->findAll($searchBy, $search);
            }
        }

        if(!$response === null) {
            $response = [
                'status' => 404,
                'message' => 'No providers found'
            ];
        } else {
            $response = [
                'status' => 200,
                'providers' => $response
            ];
        }
        return $response;
    }

    public function getProviderById(int $id): array
    {
        $provider = $this->providerRepository->findById($id);
        if(!$provider) {
            throw new PDOException(`Provider not found with id: $id`, 404);
        }
        return $response = [
            'provider' => $provider
        ];
    }

    public function createProvider(object $data): array
    {
        $response = [];
        if($this->providerRepository->isExisted($data->provider_name)) {
            return $response = [
                'status' => 400,
                'message' => 'Tên nhà cung cấp đã tồn tại',
            ];
        }

        if ($this->providerRepository->create($data)){
            $response = [
                'status' => 201,
                'message' => 'Nhà cung cấp đã được tạo thành công',
            ];
        }
        return $response;
    }

    public function updateProvider(int $id, object $data): array
    {
        $response = [];
        if($this->providerRepository->isExistedWithAnotherProvider($data->provider_name)) {
            return $response = [
                'status' => 400,
                'message' => 'Tên nhà cung cấp đã tồn tại',
            ];
        }

        if ($this->providerRepository->update($id, $data)){
            $response = [
                'status' => 200,
                'message' => 'Nhà cung cấp đã được cập nhật thành công',
            ];
        }
        return $response;
    }

    public function deleteProvider(int $id): array
    {
        $response = [];
        if($this->providerRepository->isExistedInImport($id) || $this->providerRepository->isExistedInProduct($id)) {
            $this->providerRepository->blockById($id);
            return $response = [
                'status' => 400,
                'message' => 'Không thể xóa nhà cung cấp này vì đã tồn tại trong hóa đơn hoặc sản phẩm',
            ];
        }
        if ($this->providerRepository->delete($id)){
            $response = [
                'status' => 200,
                'message' => 'Nhà cung cấp đã được xóa thành công',
            ];
        } else {
            $response = [
                'status' => 404,
                'message' => 'Nhà cung cấp không tồn tại',
            ];
        }
        return $response;
    }
}