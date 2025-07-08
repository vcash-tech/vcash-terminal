import './_homeCards.scss'

import { memo } from 'react'

import HomeCard from '@/components/molecules/homeCard/homeCard'

import { useHomeCardsColumns } from './useHomeCardsColumns'

export type HomeCardsProps = {
    isFullScreen: boolean
    onTap: () => void
    isAnimating?: boolean
}

const HomeCards = ({
    isFullScreen,
    onTap,
    isAnimating = false
}: HomeCardsProps) => {
    const { containerRef, columns, getVisibleCards } = useHomeCardsColumns({
        isFullScreen
    })
    return (
        <div
            ref={containerRef}
            className={`home-cards ${isFullScreen ? 'full-screen' : ''} ${isAnimating ? 'animating' : ''}`}>
            {columns?.map((column) => (
                <div
                    key={column.id}
                    className="home-cards-column"
                    style={{
                        animationDelay: `${column?.startOffset * 0.01}s`,
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
        </div>
    )
}

export default memo(HomeCards)
