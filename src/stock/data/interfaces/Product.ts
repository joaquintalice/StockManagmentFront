export default interface Product {
    id: number;
    name: string;
    description?: string;
    date: Date;
    updatedAt: Date;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    warehouseId: number;
    stockMovementDetailId?: number;
}