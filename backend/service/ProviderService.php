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

    public function getAllProviders(): array
    {
        $response = $this->providerRepository->findAll();
        if(!$response === null) {
            throw new PDOException('No providers found', 404);
        } else {
            return $response = [
                'providers' => $response
            ];
        }
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
                'message' => 'Nhà cung cấp đã tồn tại',
            ];
        }

        $this->providerRepository->create($data);
        return $response = [
            'message' => 'Nhà cung cấp đã được tạo thành công',
        ];
    }
}