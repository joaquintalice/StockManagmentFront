import Product from "../interfaces/Product";


const BASE_URL = 'http://localhost:3000/products';

const ProductRepository = {
    getAll: async () => {
        try {
            const res = await fetch(BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    },

    getById: async (id: number) => {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    },

    create: async (createProductData: Product) => {
        try {
            const { name, description, date, quantity, buyPrice, sellPrice, warehouseId, stockMovementDetailId } = createProductData;
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    date,
                    quantity,
                    buyPrice,
                    sellPrice,
                    warehouseId,
                    stockMovementDetailId
                }),
            });
            const data = await res.json();
            alert('data guardada en la db je');
            return data;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    },

    update: async (id: number, updateProductData: Partial<Product>) => {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateProductData),
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    },

    delete: async (id: number) => {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    },
};

export default ProductRepository;
