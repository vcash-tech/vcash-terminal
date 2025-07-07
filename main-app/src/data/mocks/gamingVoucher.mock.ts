import { playStationCard, steamCard, xboxCard } from '@/assets/images'

export const gamingVoucherCards = [
    {
        title: 'gamingVouchers.cards.playstation.title',
        body: 'gamingVouchers.cards.playstation.body',
        image: playStationCard,
        price: 'gamingVouchers.priceFrom'
    },
    {
        title: 'gamingVouchers.cards.xbox.title',
        body: 'gamingVouchers.cards.xbox.body',
        image: xboxCard,
        price: 'gamingVouchers.priceFrom'
    },
    {
        title: 'gamingVouchers.cards.steam.title',
        body: 'gamingVouchers.cards.steam.body',
        image: steamCard,
        price: 'gamingVouchers.priceFrom'
    },
    {
        title: 'gamingVouchers.cards.comingSoon.title',
        body: 'gamingVouchers.cards.comingSoon.body',
        isComing: true
    }
]
