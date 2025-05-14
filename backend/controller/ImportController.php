<?php

namespace controller;

use service\ImportService;

class ImportController
{
    private ImportService $importService;

    public function __construct()
    {
        $this->importService = new ImportService();
    }

    public function processRequest(string $method, array $param): void
    {
        if ($param['subroute'] !== null) {
            switch ($param['subroute']) {
                case 'provider':
                    switch ($method) {
                        case 'GET':
                            if ($param['id'] !== null) {
                                $this->getProviderProduct($param['id']);
                            } else {
                                http_response_code(400);
                                echo json_encode(['message' => 'Provider ID is required']);
                            }
                            break;
                        case 'POST':
                            if ($param['id'] !== null) {
                                $this->createImport($param['id']);
                            } else {
                                http_response_code(400);
                                echo json_encode(['message' => 'Provider ID is required']);
                            }
                            break;
                        default:
                            http_response_code(405);
                            header("Allow: GET POST");
                    }
            }
        } else {
            switch ($method) {
                case 'GET':
                    if ($param['id'] !== null) {
                        $this->getImportDetail($param['id']);
                    } else {
                        $this->getAllImport();
                    }
                    break;
                case 'PATCH':
                    if ($param['id'] !== null) {
                        $this->updateImportStatus($param['id']);
                    } else {
                        http_response_code(400);
                        echo json_encode(['message' => 'Import ID is required']);
                    }
                    break;
                default:
                    http_response_code(405);
                    header("Allow: GET POST PUT DELETE");
            }
        }
    }

    private function getProviderProduct(int $id): void
    {
        $response = $this->importService->getProviderProduct($id);
        if ($response['status'] === 404) {
            http_response_code(404);
            echo json_encode($response);
        } else {
            http_response_code(200);
            echo json_encode($response);
        }
    }

    private function createImport(int $id): void
    {
        $data = json_decode(file_get_contents('php://input'));
        if ($data === null) {
            http_response_code(400);
            echo json_encode(['message' => 'Dữ liệu không hợp lệ']);
            return;
        }
        $response = $this->importService->createImport($id, $data);
        if ($response['status'] === 404) {
            http_response_code(404);
            echo json_encode($response);
        } elseif ($response['status'] === 400) {
            http_response_code(400);
            echo json_encode($response);
        } else {
            http_response_code(200);
            echo json_encode($response);
        }
    }

    private function getAllImport(): void
    {
        $fromDate = $_GET['from'] ?? null;
        $toDate = $_GET['to'] ?? null;
        $searchBy = $_GET['searchBy'] ?? null;
        $search = $_GET['search'] ?? null;
        $limit = $_GET['limit'] ?? null;
        $page = $_GET['page'] ?? null;

        $response = $this->importService->getAllImport($fromDate, $toDate, $searchBy, $search, $limit, $page);
        if ($response['status'] === 404) {
            http_response_code(404);
            echo json_encode($response);
        } else {
            http_response_code(200);
            echo json_encode($response);
        }
    }

    private function updateImportStatus(int $id): void
    {
        $data = json_decode(file_get_contents('php://input'));
        if ($data === null) {
            http_response_code(400);
            echo json_encode(['message' => 'Dữ liệu không hợp lệ']);
            return;
        }
        $response = $this->importService->updateImportStatus($id, $data);
        if ($response['status'] === 404) {
            http_response_code(404);
            echo json_encode($response);
        } elseif ($response['status'] === 400) {
            http_response_code(400);
            echo json_encode($response);
        } else {
            http_response_code(200);
            echo json_encode($response);
        }
    }

    private function getImportDetail(int $id): void
    {
        $response = $this->importService->getAllImportDetailByImportId($id);
        if ($response['status'] === 404) {
            http_response_code(404);
            echo json_encode($response);
        } else {
            http_response_code(200);
            echo json_encode($response);
        }
    }
}