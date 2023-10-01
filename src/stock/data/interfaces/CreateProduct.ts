export default interface CreateProduct {
    name: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    date?: Date;
}