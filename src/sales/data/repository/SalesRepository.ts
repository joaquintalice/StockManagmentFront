import ICreateSale from "../interfaces/CreateSale.interface";

const BASE_URL = 'http://localhost:3000/stockmovement'

export const SalesRepository = {


    getAll: async () => {
        try {
            const res = await fetch(`${BASE_URL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!res.ok) throw new Error(`Error fetching data (get all)`);
            const data = await res.json();
            return data
        } catch (error) {
            console.log(error)
        }
    },


    getById: async (id: number) => {
        try {

        } catch (error) {

        }
    },


    insert: async ({ total }: ICreateSale) => {
        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total
                }),
            });

            const data = await res.json();

            return data;
        } catch (error) {
            console.error('Error en create, trycatch:', error);
            throw error;
        }
    },


    update: async (id: number, body: Partial<ICreateSale>) => {
        try {

        } catch (error) {

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


}

export default SalesRepository