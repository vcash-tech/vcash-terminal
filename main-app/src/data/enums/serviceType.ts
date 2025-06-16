import zod from 'zod'

export const ServiceType = zod.enum(['Game', 'Streaming', 'Payment'])

export type ServiceType = zod.infer<typeof ServiceType>