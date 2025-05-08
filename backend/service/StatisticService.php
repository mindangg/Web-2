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
    
    public function getTop5Users(?string $startDate, ?string $endDate, string $sortOrder): array
    {
        $users = $this->statisticRepository->getTopBuyers($startDate, $endDate, $sortOrder);

        return $users;
    }
    
    
    public function getOrderStatistic(array $data): array
    {
        $statistic = $this->statisticRepository->orderStatistics($data);
        
        // if(!$statistic)
        //     throw new \PDOException('Không tìm thấy vai trò', 404);
        
        // else
            return $statistic;
    }

    public function getRevenueStatistic($startDate, $endDate): array
    {
        if($startDate == null){
            $startDate = $this->statisticRepository->getMinReceiptDate();
            $startDate = $startDate['created_at'];
        }
        if($endDate == null){
            $endDate = date('Y-m-d');
        }

        $statistic = $this->statisticRepository->getRevenueByDate($startDate, $endDate);
        $tolalRevenue = 0;
        $totalProfit = 0;
        foreach ($statistic as $item) {
            $tolalRevenue += $item['total_revenue'];
            $totalProfit += $item['profit'];
        }
        $response = [
            'total_revenue' => $tolalRevenue,
            'total_profit' => $totalProfit,
            'data' => $statistic,
        ];
        return $response;
    }
}
?>