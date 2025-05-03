<?php

namespace repository;

use config\Database;
use PDO;

class ProductRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $database = new Database();
        $this->pdo = $database->getConnection();
    }

    public function isExistedWithName(string $name): bool
    {
        $sql = "SELECT COUNT(*) FROM product WHERE name = :name";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function findAll(?string $brand,
                            ?string $sort,
                            ?string $sort_dir,
                            ?int    $max_price,
                            ?int    $min_price,
                            ?string $searchBy,
                            ?string $search,
                            ?int    $limit,
                            ?int    $page,
                            ?bool   $status): array
    {
        $additional = "";

        $sql = "SELECT *
                FROM product
                    JOIN brand ON product.brand = brand.brand_id
                    JOIN provider ON product.provider = provider.provider_id
                WHERE 1=1";
        $totalQuery = "SELECT COUNT(*)
                       FROM product
                            JOIN brand ON product.brand = brand.brand_id
                            JOIN provider ON product.provider = provider.provider_id
                       WHERE 1=1";

        if ($brand) {
            $additional .= " AND brand.brand_name LIKE '%$brand%'";
        }

        if ($min_price) {
            $additional .= " AND base_price >= $min_price";
        }

        if ($max_price) {
            $additional .= " AND base_price <= $max_price";
        }

        if ($searchBy) {
            switch ($searchBy) {
                case 'name':
                    $additional .= " AND $searchBy LIKE '%$search%'";
                    break;
                case 'product_id':
                case 'brand_id':
                case 'provider_id':
                    $additional .= " AND $searchBy = $search";
                    break;
                case 'status':
                    $additional .= " AND $searchBy = '$search'";
                    break;
            }
        }

        if ($status) {
            $additional .= " AND status = $status";
        }

        if ($sort) {
            $additional .= " ORDER BY $sort $sort_dir";
        }

        $total = $this->pdo->query($totalQuery . $additional)->fetchColumn();

        $offset = ($page - 1) * $limit;
        $additional .= " LIMIT $limit OFFSET $offset";

        $stmt = $this->pdo->prepare($sql . $additional);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response = [
            'totalProduct' => $total,
            'totalPage' => ceil($total / $limit),
            'currentPage' => $page,
            'products' => $products
        ];

        return $response;
    }

    public function findById(int $id)
    {
        $sql = "SELECT * 
        FROM product
            JOIN brand ON product.brand = brand.brand_id
            JOIN provider ON product.provider = provider.provider_id
        WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create(object $data): int
    {
        $sql = "INSERT INTO product (brand, provider, series, name, image, screen, battery, front_camera, back_camera, description, release_date, warranty_period, cpu)
                VALUES (:brand, :provider, :series, :name, :image, :screen, :battery, :front_camera, :back_camera, :description, :release_date, :warranty_period, :cpu)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':brand', $data->brand);
        $stmt->bindValue(':provider', $data->provider);
        $stmt->bindValue(':series', $data->series);
        $stmt->bindValue(':name', $data->name);
        $stmt->bindValue(':image', $data->image);
        $stmt->bindValue(':screen', $data->screen);
        $stmt->bindValue(':battery', $data->battery);
        $stmt->bindValue(':front_camera', $data->front_camera);
        $stmt->bindValue(':back_camera', $data->back_camera);
        $stmt->bindValue(':description', $data->description);
        $stmt->bindValue(':release_date', $data->release_date);
        $stmt->bindValue(':warranty_period', intval($data->warranty_period));
        $stmt->bindValue(':cpu', $data->cpu);
        if ($stmt->execute()) {
            return (int)$this->pdo->lastInsertId();
        } else {
            return -1;
        }
    }

    public function update(int $id, object $data): int
    {
        $sql = "UPDATE product 
                SET brand = :brand,
                    provider = :provider,
                    series = :series,
                    name = :name,
                    image = :image,
                    screen = :screen,
                    battery = :battery,
                    base_price = :base_price,
                    cpu = :cpu,
                    front_camera = :front_camera,
                    back_camera = :back_camera,
                    description = :description,
                    release_date = :release_date,
                    warranty_period = :warranty_period,
                    status = :status
                WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':brand', $data->brand);
        $stmt->bindValue(':provider', $data->provider);
        $stmt->bindValue(':series', $data->series);
        $stmt->bindValue(':name', $data->name);
        $stmt->bindValue(':image', $data->image);
        $stmt->bindValue(':screen', $data->screen);
        $stmt->bindValue(':battery', $data->battery);
        $stmt->bindValue(':base_price', $data->base_price);
        $stmt->bindValue(':cpu', $data->cpu);
        $stmt->bindValue(':front_camera', $data->front_camera);
        $stmt->bindValue(':back_camera', $data->back_camera);
        $stmt->bindValue(':description', $data->description);
        $stmt->bindValue(':release_date', $data->release_date);
        $stmt->bindValue(':warranty_period', intval($data->warranty_period));
        $stmt->bindValue(':status', $data->status == 'true' ? 1 : 0);
        $stmt->bindValue(':id', $id);

        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        } else {
            return -1;
        }
    }

    public function delete(int $id): int
    {
        $sql = "DELETE FROM product WHERE product_id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        } else {
            return -3;
        }
    }
}