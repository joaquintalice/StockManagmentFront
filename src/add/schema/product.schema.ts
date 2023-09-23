import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(1, { message: 'Tienes que seleccionar un producto' }),
    quantity: z.number().min(0.01, { message: 'Tienes que asignar una cantidad de kilos' }).nonnegative({ message: 'No puedes ingresar un número negativo' }),
    buyPrice: z.number().min(0.01, { message: 'Tienes que asignar un precio de compra' }).nonnegative({ message: 'No puedes ingresar un número negativo' }),
    sellPrice: z.number().min(0.01, { message: 'Tienes que asignar un precio de venta' }).nonnegative({ message: 'No puedes ingresar un número negativo' })
})

type ProductZod = z.infer<typeof productSchema>;

export default ProductZod