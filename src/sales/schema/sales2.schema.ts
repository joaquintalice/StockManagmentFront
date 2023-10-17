import { z } from 'zod';

export const SalesSchema2 = z.array(
    z.object({
        name: z.string().min(1, { message: 'Debes seleccionar un producto' }),
        quantity: z.coerce.number().min(0.01, { message: 'Ingresa una cantidad' }).nonnegative({ message: 'No puedes ingresar un número negativo' }),

    }));

type SalesZod2 = z.infer<typeof SalesSchema2>;

console.log(SalesSchema2)

export default SalesZod2