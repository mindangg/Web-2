<?php

namespace controller;

use service\ColorService;

class ColorController
{
    private ColorService $colorService;

    public function __construct()
    {
        $this->colorService = new ColorService();
    }

    public function processRequest(string $method, ?int $id): void
    {
        switch ($method) {
            case 'GET':
                $this->getAllColors();
                break;
            case 'POST':
                $this->createColor();
                break;
            default:
                http_response_code(405);
                header("Allow: GET");
        }
    }

    public function getAllColors(): void
    {
        $response = $this->colorService->getAllColors();
        echo json_encode($response);
    }

    public function createColor(): void
    {
        $data = json_decode(file_get_contents('php://input'));
        $response = $this->colorService->createColor($data);
        echo json_encode($response);
    }
}