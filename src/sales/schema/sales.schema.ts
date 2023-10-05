import { z } from 'zod';

export const SalesSchema = z.object({
    name: z.string().min(1, { message: 'Debes seleccionar un producto' }),
    quantity: z.coerce.number().min(0.01, { message: 'Ingresa una cantidad' }).nonnegative({ message: 'No puedes ingresar un número negativo' }),

});

type SalesZod = z.infer<typeof SalesSchema>;

console.log(SalesSchema)

export default SalesZod