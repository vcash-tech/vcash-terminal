import { betVoucher, gamingVoucher } from '@/assets/images'

export const serviceList = [
    {
        title: 'service.cards.bet.title',
        subtitle: 'service.cards.bet.body',
        image: betVoucher,
        variant: 'bet',
        onPress: () => console.log('Bet voucher pressed')
    },
    {
        title: 'service.cards.gaming.title',
        subtitle: 'service.cards.gaming.body',
        image: gamingVoucher,
        variant: 'gaming',
        onPress: () => console.log('Gaming voucher pressed')
    }
]
