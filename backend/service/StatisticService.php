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

    public function getProductStatistic($fromDate, $toDate, $sort, $sortOrder, $searchBy, $search, $limit, $page): array
    {
        if($fromDate === null){
            $fromDate = $this->statisticRepository->getMinReceiptDate();
            $fromDate = date('Y-m-d', strtotime($fromDate));
        }
        if($toDate === null){
            $toDate = date('Y-m-d');
        }


        $response = $this->statisticRepository->productStatistic($fromDate, $toDate, $sort, $sortOrder, $searchBy, $search, $limit, $page);

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

    public function getReceiptAndImport(array $data): array
    {
        $skuId = $data['sku_id'] ?? null;
        $importPrice = $data['import_price'] ?? null;
        $invoicePrice = $data['invoice_price'] ?? null;

        if ($skuId === null || $importPrice === null || $invoicePrice === null) {
            return [
                'status' => 401,
                'message' => 'Thiếu thông tin dữ liệu'
            ];
        }
        $receipt = $this->statisticRepository->getReceiptWithSkuIdAndPrice($skuId, $invoicePrice);
        $import = $this->statisticRepository->getImportWithSkuIdAndPrice($skuId, $importPrice);

        return [
            'status' => 200,
            'receipt' => $receipt,
            'import' => $import
        ];
    }
}
?>