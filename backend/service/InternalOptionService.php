<?php

namespace service;

use repository\InternalOptionRepository;

class InternalOptionService
{
    private InternalOptionRepository $internalOptionRepository;

    public function __construct()
    {
        $this->internalOptionRepository = new InternalOptionRepository();
    }

    public function getAllOptions(): array
    {
        $options = $this->internalOptionRepository->findAll();
        if (!$options) {
            throw new \PDOException('No options found', 404);
        }
        return $options;
    }
}