import ICreateCashbox from "../interfaces/UpdateCashbox";

const BASE_URL = 'http://localhost:3000/cashbox'

export const CashboxRepository = {


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
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!res.ok) throw new Error(`Error fetching data (get all)`);
            const data = await res.json();
            return data
        } catch (error) {

        }
    },


    insert: async ({ name, amount }: ICreateCashbox) => {
        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    amount
                }),
            });

            const data = await res.json();

            return data;
        } catch (error) {
            console.error('Error en create, trycatch:', error);
            throw error;
        }
    },


    update: async (id: number, { name, amount }: Partial<ICreateCashbox>) => {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    amount
                })
            });
            const data = await res.json();
            return data
        } catch (error) {
            console.error('Error updating cashbox', error);
            throw error
        }
    },


    delete: async (id: number) => {
        try {

        } catch (error) {

        }
    },


}

export default CashboxRepository