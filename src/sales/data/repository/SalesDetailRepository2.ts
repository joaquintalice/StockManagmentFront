import ICreateSalesDetail from "../interfaces/SalesDetail.interface";

const BASE_URL = 'http://localhost:3000/stockmovementdetails'

export const SalesDetailRepository2 = {


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


    insert: async (body: ICreateSalesDetail[]) => {
        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            console.log(body)
            const data = await res.json();

            return data;
        } catch (error) {
            console.error('Error en create, trycatch:', error);
            throw error;
        }
    },


    update: async (id: number, body: Partial<ICreateSalesDetail>) => {
        try {

        } catch (error) {

        }
    },


    delete: async (id: number) => {
        try {

        } catch (error) {

        }
    },


}

export default SalesDetailRepository2