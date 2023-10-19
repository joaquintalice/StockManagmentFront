export default interface CreateProduct {
    name: string;
    unit: string
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    date?: Date;
}