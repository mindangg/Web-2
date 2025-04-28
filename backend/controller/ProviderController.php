<?php

namespace controller;

use service\ProviderService;

class ProviderController
{
    private ProviderService $providerService;

    public function __construct()
    {
        $this->providerService = new ProviderService();
    }

    public function processRequest(string $method, ?int $id): void
    {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $this->getProviderById($id);
                } else {
                    $this->getAllProviders();
                }
                break;
            default:
                http_response_code(405);
                header("Allow: GET POST PUT DELETE");
        }
    }

    private function getAllProviders(): void
    {
        $response = $this->providerService->getAllProviders();
        echo json_encode($response);
    }

    private function getProviderById(int $id): void
    {
        $response = $this->providerService->getProviderById($id);
        echo json_encode($response);
    }
}