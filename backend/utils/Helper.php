<?php

namespace utils;

class Helper
{
    public static function GenerateImageFileName(string $originalName, string $fileExtention): string
    {
        $originalName = preg_replace('/[^A-Za-z0-9 ]/', '', $originalName);

        $originalName = str_replace(' ', '', $originalName);

        $originalName = strtolower($originalName);

        return $originalName . '.' . $fileExtention;
    }

    public static function GenerateSkuCode(string $productName, string $color, string $internalOption): string
    {
        $productName = str_replace(' ', '', $productName);

        $color = str_replace(' ', '', $color);

        return strtoupper($productName . '-' . $color . '-' . $internalOption);
    }
}