import zod from "zod"

import {ServiceType} from "../enums/serviceType.ts"

export const DigitalService = zod.object({
    id: zod.string().optional(),
    name: zod.string(),
    description: zod.string().optional(),
    price: zod.number().optional(),
    image: zod.string(),
    serviceType: ServiceType.default("Game"),
    order: zod.number().optional(),
    isTopUp: zod.boolean().default(false).optional(),
    currency: zod.string().default("RSD").optional(),
})

export type DigitalService = zod.infer<typeof DigitalService>;

export default DigitalService