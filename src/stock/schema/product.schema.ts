import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(1, { message: 'Selecciona un producto' }).trim(),
    unit: z.string().min(1, { message: 'Selecciona una unidad' }),
    quantity: z.coerce.number().min(0.01, { message: 'Ingresa una cantidad' }).nonnegative({ message: 'No puedes ingresar un número negativo' }),
    buyPrice: z.coerce.number().min(0.01, { message: 'Ingresa un precio de compra' }).nonnegative({ message: 'No puedes ingresar un número negativo' }),
    sellPrice: z.coerce.number().min(0.01, { message: 'Ingresa un precio de venta' }).nonnegative({ message: 'No puedes ingresar un número negativo' })
})

type ProductZod = z.infer<typeof productSchema>;

export default ProductZod