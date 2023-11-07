import ICreateCashboxHistory from "../interfaces/ICreateCashboxHistory";


const BASE_URL = 'http://localhost:3000/cashboxhistory'

export const CashboxHistoryRepository = {


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


    insert: async ({ total }: ICreateCashboxHistory) => {
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


    update: async (id: number, { total }: Partial<ICreateCashboxHistory>) => {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total
                })
            });
            const data = await res.json();
            return data
        } catch (error) {
            console.error('Error updating cashbox history', error);
            throw error
        }
    },


    delete: async (id: number) => {
        try {

        } catch (error) {

        }
    },


}

export default CashboxHistoryRepository