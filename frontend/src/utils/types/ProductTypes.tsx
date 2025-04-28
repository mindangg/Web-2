export type BrandType = {
    brand_id: number;
    brand_name: string;
}

export type ColorType = {
    color_id: number;
    color: string;
}

export type InternalOptionType = {
    internal_option_id: number;
    storage: string;
    ram: string;
}

export type ProviderType = {
    provider_id: number;
    name: string;
    phone: string;
    address: string;
    email: string;
}

export type ProductType = {
    product_id: number;
    brand: BrandType;
    provider: ProviderType;
    series: string;
    name: string;
    image: string;
    cpu: string;
    screen: string;
    battery: string;
    front_camera: string;
    back_camera: string;
    description: string;
    base_price: number;
    release_date: Date;
    warranty_period: number;
    status: boolean;
    moTa: string;
}

export type SkuType = {
    sku_id: number;
    product_id: number;
    internal_option: InternalOptionType;
    color: ColorType;
    sku_code: string;
    sku_name: string;
    image: string;
    import_price: number;
    invoice_price: number;
    sold: number;
    stock: number;
    updated_date: Date;
}

export type OptionListType = {
    internal_option: InternalOptionType[];
    color: ColorType[];
}