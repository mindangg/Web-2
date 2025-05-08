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

                else if ($param === 'revenue')
                    $this->getRevenueStatistic();

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
}
?>