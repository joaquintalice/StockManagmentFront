export default interface Product {
    id: number;
    name: string;
    description?: string;
    date: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    warehouseId: number;
    stockMovementDetailId?: number;
}