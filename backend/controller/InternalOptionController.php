<?php

namespace controller;

use service\InternalOptionService;

class InternalOptionController
{
    private InternalOptionService $internalOptionService;

    public function __construct()
    {
        $this->internalOptionService = new InternalOptionService();
    }

    public function processRequest(string $method): void
    {
        switch ($method) {
            case 'GET':
                $this->getAllOptions();
                break;
            default:
                http_response_code(405);
                header("Allow: GET");
        }
    }

    private function getAllOptions(): void
    {
        $response = $this->internalOptionService->getAllOptions();
        echo json_encode($response);
    }
}