import { basketballCard, casinoCard, casinoCard2, f1Card, playstationCard, sockerCard, steamCard, xboxCard } from "@/assets/images"

import { ProductCardType } from "./productCardType"

export type HomeCardProps = {
    type: ProductCardType
    onClick: () => void
}

export default function HomeCard({ type = ProductCardType.socker, onClick }: HomeCardProps) {
    const cardImages = {
        [ProductCardType.socker]: sockerCard,
        [ProductCardType.basketball]: basketballCard,
        [ProductCardType.casino]: casinoCard,
        [ProductCardType.casino2]: casinoCard2,
        [ProductCardType.playstation]: playstationCard,
        [ProductCardType.xbox]: xboxCard,
        [ProductCardType.steam]: steamCard,
        [ProductCardType.f1]: f1Card 
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