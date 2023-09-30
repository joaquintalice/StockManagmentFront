import Product from "../interfaces/Product";
import CreateProduct from "../interfaces/CreateProduct";


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

    getByName: async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/name/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error en getByName:', error);
            throw error;
        }
    },

    create: async (createProductData: CreateProduct) => {
        try {
            const { name, quantity, buyPrice, sellPrice } = createProductData;
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    quantity,
                    buyPrice,
                    sellPrice,
                }),
            });

            const data = await res.json();
            console.log(data);
            return data;
        } catch (error) {
            // Propaga el error original o crea una excepción personalizada
            console.error('Error en create, trycatch:', error);
            throw error;
        }
    }
    ,

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
