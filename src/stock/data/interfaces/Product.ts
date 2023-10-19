export default interface Product {
    id: number;
    name: string;
    description?: string;
    date: Date;
    unit: string
    updatedAt: Date;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    warehouseId: number;
    stockMovementDetailId?: number;
}