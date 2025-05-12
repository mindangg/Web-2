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
            case 'POST':
                if($id) {
                    $this->updateProvider($id);
                } else {
                    $this->createProvider();
                }
                break;
            case 'DELETE':
                if ($id) {
                    $this->deleteProvider($id);
                }
                break;
            default:
                http_response_code(405);
                header("Allow: GET POST PUT DELETE");
        }
    }

    private function getAllProviders(): void
    {
        $searchBy = $_GET['searchBy'] ?? null;
        $search = $_GET['search'] ?? null;
        $status = $_GET['provider_status'] ?? null;

        $response = $this->providerService->getAllProviders($searchBy, $search, $status);
        if ($response['status'] === 404) {
            http_response_code(404);
        } else {
            http_response_code(200);
        }
        echo json_encode($response);
    }

    private function getProviderById(int $id): void
    {
        $response = $this->providerService->getProviderById($id);
        echo json_encode($response);
    }

    public function createProvider(): void
    {
        $data = json_decode(file_get_contents('php://input'));
        $response = $this->providerService->createProvider($data);
        if ($response['status'] === 201) {
            http_response_code(201);
        } else {
            http_response_code(400);
        }
        echo json_encode($response);
    }

    public function updateProvider(int $id): void
    {
        $data = json_decode(file_get_contents('php://input'));
        $response = $this->providerService->updateProvider($id, $data);
        if ($response['status'] === 200) {
            http_response_code(200);
        } else {
            http_response_code(400);
        }
        echo json_encode($response);
    }

    public function deleteProvider(int $id): void
    {

        $response = $this->providerService->deleteProvider($id);
        switch ($response['status']) {
            case 200:
                http_response_code(200);
                break;
            case 404:
                http_response_code(404);
                break;
            case 400:
                http_response_code(400);
                break;
        }

        echo json_encode($response);
    }
}