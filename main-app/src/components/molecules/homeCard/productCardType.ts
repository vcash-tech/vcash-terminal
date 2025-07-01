import { z } from 'zod'

const productCardTypeValues = [
    'socker',
    'basketball',
    'casino',
    'casino2',
    'playstation',
    'xbox',
    'steam',
    'f1'
] as const

export const ProductCardTypeSchema = z.enum(productCardTypeValues)

export type ProductCardType = z.infer<typeof ProductCardTypeSchema>

export const ProductCardType = {
    socker: 'socker' as const,
    basketball: 'basketball' as const,
    casino: 'casino' as const,
    casino2: 'casino2' as const,
    playstation: 'playstation' as const,
    xbox: 'xbox' as const,
    steam: 'steam' as const,
    f1: 'f1' as const,
    schema: ProductCardTypeSchema,
    parse: (value: unknown) => ProductCardTypeSchema.parse(value),
    safeParse: (value: unknown) => ProductCardTypeSchema.safeParse(value)
} as const
