import './_homeCards.scss'

import { memo } from 'react'

import HomeCard from '@/components/molecules/homeCard/homeCard'

import { useHomeCardsColumns } from './useHomeCardsColumns'

export type HomeCardsProps = {
    onTap?: () => void
    isAnimating?: boolean
}

const HomeCards = ({
    onTap,
    isAnimating = false
}: HomeCardsProps) => {
    const { containerRef, columns, getVisibleCards } = useHomeCardsColumns()
    return (
        <div
            ref={containerRef}
            className={`home-cards ${isAnimating ? 'animating' : ''}`}>
            {columns?.map((column) => (
                <div
                    key={column.id}
                    className="home-cards-column"
                    style={{
                        animationDuration: `${column?.animationDuration}s`
                    }}>
                    {getVisibleCards(column.id)?.map((card) => (
                        <div key={card.id} className="home-card-wrapper">
                            <HomeCard type={card?.type} onClick={onTap} />
                        </div>
                    ))}
                </div>
            ))}
            <div className="home-cards-header" />
            <div className="home-cards-footer" />
        </div>
    )
}

export default memo(HomeCards)
