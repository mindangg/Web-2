<?php

namespace controller;

use service\StatisticService;

use middleware\AuthMiddleware;

class StatisticController
{
    private StatisticService $statisticService;

    public function __construct()
    {
        $this->statisticService = new StatisticService();
    }

    public function processRequest(string $method, ?string $param): void
    {
//        AuthMiddleware::verifyToken();

        switch ($method) {
            case 'GET':

                if ($param === 'user')
                    $this->getTop5Users();

                else if ($param === 'receipt')
                    $this->getReceipts();

                else if ($param === 'order')
                    $this->getOrderStatistic();

                else if ($param === 'product')
                    $this->getProductStatistic();

                else if ($param === 'product-overview')
                    $this->getProductStatisticOverView();

                else if ($param === 'import')
                    $this->getImportStatistic();

                else
                    http_response_code(404);

                break;
                
            default:
                http_response_code(405);
                header("Allow: GET POST PATCH DELETE");
        }
    }

    private function getTop5Users(): void
    {
        $startDate = $_GET['startDate'] ?? null;
        $endDate = $_GET['endDate'] ?? null;
        $sortOrder = $_GET['sortOrder'] ?? 'DESC';        

        $users = $this->statisticService->getTop5Users($startDate, $endDate, $sortOrder);
        echo json_encode($users);
    }

    private function getReceipts(): void
    {
        $statistic = $this->statisticService->getUserStatistic();
        echo json_encode($statistic);
    }

    private function getOrderStatistic(): void
    {
        $data = $_GET ?? [];
        // var_dump($data);die();

        $statistic = $this->statisticService->getOrderStatistic($data);
        echo json_encode($statistic);
    }

    private function getProductStatistic(): void
    {
        $fromDate = $_GET['from'] ?? null;
        $toDate = $_GET['to'] ?? null;
        $sort = $_GET['sort'] ?? "product_id";
        $sortOrder = $_GET['dir'] ?? "ASC";
        $searchBy = $_GET['searchBy'] ?? null;
        $search = $_GET['search'] ?? null;
        $limit = intval($_GET['limit'] ?? 7);
        $page = intval($_GET['page'] ?? 1);

        $statistic = $this->statisticService->getProductStatistic($fromDate, $toDate, $sort, $sortOrder, $searchBy, $search, $limit, $page);
        echo json_encode($statistic);
    }

    private function getImportStatistic(): void
    {
        $startDate = $_GET['startDate'] ?? null;
        $endDate = $_GET['endDate'] ?? null;
        $sortPrice = $_GET['sortPrice'] ?? 'DESC';

        // $fromDate = $_GET['from'] ?? null;
        // $toDate = $_GET['to'] ?? null;
        // $sort = $_GET['sort'] ?? "product_id";
        // $sortOrder = $_GET['dir'] ?? "ASC";
        $limit = intval($_GET['limit'] ?? 7);
        $page = intval($_GET['page'] ?? 1);

        $statistic = $this->statisticService->getImportStatistic($startDate, $endDate, $sortPrice, $limit, $page);
        echo json_encode($statistic);
    }

    private function getProductStatisticOverView(): void
    {
        $statistic = $this->statisticService->getProductStatisticOverView();
        echo json_encode($statistic);
    }
}
?>