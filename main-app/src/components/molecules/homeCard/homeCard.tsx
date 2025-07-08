import {
    casinoNewCard,
    footballCard,
    nbaCard,
    playstationCard,
    steamCard,
    tennisNewCard,
    xboxCard
} from '@/assets/images'

import { ProductCardType } from './productCardType'

export type HomeCardProps = {
    type: ProductCardType
    onClick: () => void
}

export default function HomeCard({
    type = ProductCardType.socker,
    onClick
}: HomeCardProps) {
    const cardImages = {
        [ProductCardType.socker]: footballCard,
        [ProductCardType.basketball]: nbaCard,
        [ProductCardType.casino]: casinoNewCard,
        [ProductCardType.playstation]: playstationCard,
        [ProductCardType.xbox]: xboxCard,
        [ProductCardType.steam]: steamCard,
        [ProductCardType.f1]: tennisNewCard
    }

    const cardImage = () => {
        return cardImages[type]
    }

    return (
        <div className="home-card" onClick={onClick}>
            <img src={cardImage()} alt={type} />
        </div>
    )
}
