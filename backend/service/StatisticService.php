<?php
namespace service;
use DateTime;
use repository\StatisticRepository;

class StatisticService
{
    private StatisticRepository $statisticRepository;

    public function __construct() {
        $this->statisticRepository = new StatisticRepository();
    }

    private function respond(int $code, array $message): void 
    {
        http_response_code($code);
        echo json_encode($message);
        exit;
    }
    
    public function getTop5Users($startDate, $endDate, $sortOrder): array
    {
        $users = $this->statisticRepository->getTopBuyers($startDate, $endDate, $sortOrder);

        return $users;
    }
    
    public function getImportStatistic($startDate, $endDate, $sortOrder): array
    {
        $statistic = $this->statisticRepository->getTopBuyers($startDate, $endDate, $sortOrder);

        return $statistic;
    }
    
    public function getOrderStatistic(array $data): array
    {
        $statistic = $this->statisticRepository->orderStatistics($data);

        return $statistic;
    }

    public function getProductStatistic($fromDate, $toDate, $sort, $sortOrder, $limit, $page): array
    {
        if($fromDate === null){
            $fromDate = $this->statisticRepository->getMinReceiptDate();
            $fromDate = date('Y-m-d', strtotime($fromDate));
        }
        if($toDate === null){
            $toDate = date('Y-m-d');
        }

        $response = $this->statisticRepository->productStatistic($fromDate, $toDate, $sort, $sortOrder, $limit, $page);

        return $response;
    }

    public function getProductStatisticOverView(): array
    {
        $fromDate = $this->statisticRepository->getMinReceiptDate();
        $fromDate = date('Y-m-d', strtotime($fromDate));
        $toDate = date('Y-m-d');
        $response = $this->statisticRepository->productStatisticOverView($fromDate, $toDate);

        return $response;
    }
}
?>