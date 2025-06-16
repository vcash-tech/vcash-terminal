import { disney, eaPlay, gPay, hbo,hulu, ps, steam } from '../../assets/images'
import { ServiceType } from '../enums/serviceType'

export const services = {
    streamingServices: [
        {
            name: 'Hulu',
            image: hulu,
            price: 2000,
            serviceType: "Streaming" as ServiceType,
            isTopUp: false,
            currency: 'RSD'
        },
        {
            name: 'Max Voucher',
            image: hbo,
            price: 2000,
            serviceType: "Streaming" as ServiceType,
            isTopUp: false,
            currency: 'RSD'
        },
        {
            name: 'Disney+ Voucher',
            image: disney,
            price: 2000,
            serviceType: "Streaming" as ServiceType,
            isTopUp: false,
            currency: 'RSD'
        }
    ],
    gamingServices: [
        {
            name: 'Xbox Gift Card Voucher',
            image: eaPlay,
            price: 2000,
            serviceType: "Game" as ServiceType,
            isTopUp: false,
            currency: 'RSD'
        },
        {
            name: 'PS5 Card Voucher',
            image: ps,
            price: 2000,
            serviceType: "Game" as ServiceType,
            isTopUp: false,
            currency: 'RSD'
        },
        {
            name: 'Steam Gift Card Voucher',
            image: steam,
            price: 2000,
            serviceType: "Game" as ServiceType,
            isTopUp: false,
            currency: 'RSD'
        }
    ],
    topServices: [
        {
            name: 'GPay Voucher',
            image: gPay,
            price: 2000,
            serviceType: "Payment" as ServiceType,
            isTopUp: true,
            currency: 'RSD'
        }, {
            name: 'Max Voucher',
            image: hbo,
            price: 2000,
            serviceType: "Streaming" as ServiceType,
            isTopUp: true,
            currency: 'RSD'
        }, {
            name: 'Disney+ Voucher',
            image: disney,
            price: 2000,
            serviceType: "Streaming" as ServiceType,
            isTopUp: true,
            currency: 'RSD'
        }
    ]
}