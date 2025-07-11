import { playstationClean, steamClean, xboxClean } from '@/assets/images'

export const gamingVoucherCards = [
    {
        title: 'gamingVouchers.cards.playstation.title',
        body: 'gamingVouchers.cards.playstation.body',
        image: playstationClean,
        price: 'gamingVouchers.priceFrom'
    },
    {
        title: 'gamingVouchers.cards.xbox.title',
        body: 'gamingVouchers.cards.xbox.body',
        image: xboxClean,
        price: 'gamingVouchers.priceFrom'
    },
    {
        title: 'gamingVouchers.cards.steam.title',
        body: 'gamingVouchers.cards.steam.body',
        image: steamClean,
        price: 'gamingVouchers.priceFrom'
    },
    {
        title: 'gamingVouchers.cards.comingSoon.title',
        body: 'gamingVouchers.cards.comingSoon.body',
        isComing: true
    }
]
