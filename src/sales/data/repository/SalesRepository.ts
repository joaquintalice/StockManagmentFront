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


    insert: async (body: ICreateSale) => {
        try {

        } catch (error) {

        }
    },


    update: async (id: number, body: Partial<ICreateSale>) => {
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

export default SalesRepository