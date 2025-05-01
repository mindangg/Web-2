<?php

namespace service;

use repository\ColorRepository;

class ColorService
{
    private ColorRepository $colorRepository;

    public function __construct()
    {
        $this->colorRepository = new ColorRepository();
    }

    public function getAllColors(): array
    {
        return $this->colorRepository->findAll();
    }

    public function createColor(object $data): array
    {
        $response = [];
        if($this->colorRepository->isExisted($data->color)) {
            return $response = [
                'message' => 'Màu sắc đã tồn tại',
            ];
        }

        $this->colorRepository->create($data);
        return $response = [
            'message' => 'Màu sắc đã được tạo thành công',
        ];
    }
}