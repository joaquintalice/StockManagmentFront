import { z } from 'zod'

export const cashboxSchema = z.object({
    amount: z.coerce.number().nonnegative({ message: 'No puedes ingresar un número negativo.' })
})

type cashboxType = z.infer<typeof cashboxSchema>

export default cashboxType