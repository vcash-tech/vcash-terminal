import { useCallback, useEffect, useRef, useState } from 'react'

import { homeCardsData } from '@/components/molecules/homeCard/homeCard.mock'
import { ProductCardType } from '@/components/molecules/homeCard/productCardType'

type CardInstance = {
    id: string
    type: ProductCardType
    data: (typeof homeCardsData)[0]
    bottomPosition: number // Position from the bottom of the viewport in pixels
    removed?: boolean // Flag to mark cards for removal instead of immediately removing them
    removeTime?: number // Timestamp when the card was marked for removal
}

type ColumnData = {
    startOffset: number
    animationDuration: number
    id: number
    cards: CardInstance[]
    animationSpeed: number // pixels per second
    lastCardAddition: number // timestamp when last card was added
}

interface UseHomeCardsColumnsProps {
    isFullScreen: boolean
}

export const useHomeCardsColumns = ({
    isFullScreen: _
}: UseHomeCardsColumnsProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [columns, setColumns] = useState<ColumnData[]>([])
    const [isAnimating, setIsAnimating] = useState(false)
    const animationFrameRef = useRef<number | undefined>(undefined)
    const lastFrameTimeRef = useRef<number | undefined>(undefined)

    const CARD_HEIGHT = 320
    const CARD_GAP = 16
    const CARD_WITH_GAP = CARD_HEIGHT + CARD_GAP

    // Function to generate a random card instance
    const createRandomCard = useCallback((bottomPosition: number) => {
        const sportCards = homeCardsData.filter(
            (card) =>
                card.type === ProductCardType.socker ||
                card.type === ProductCardType.basketball ||
                card.type === ProductCardType.f1
        )
        const casinoCards = homeCardsData.filter(
            (card) =>
                card.type === ProductCardType.casino ||
                card.type === ProductCardType.casino2
        )
        const gamingCards = homeCardsData.filter(
            (card) =>
                card.type === ProductCardType.steam ||
                card.type === ProductCardType.playstation ||
                card.type === ProductCardType.xbox
        )

        const random = Math.random()
        let selectedCard

        if (random < 0.5 && sportCards.length > 0) {
            selectedCard =
                sportCards[Math.floor(Math.random() * sportCards.length)]
        } else if (random < 0.8 && casinoCards.length > 0) {
            selectedCard =
                casinoCards[Math.floor(Math.random() * casinoCards.length)]
        } else {
            selectedCard =
                gamingCards[Math.floor(Math.random() * gamingCards.length)]
        }

        if (!selectedCard) {
            selectedCard =
                homeCardsData[Math.floor(Math.random() * homeCardsData.length)]
        }

        return {
            id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            data: selectedCard,
            type: selectedCard.type,
            bottomPosition
        }
    }, [])

    // Generate random animation speed for a column
    const getRandomAnimationSpeed = useCallback(() => {
        // Speed in pixels per second - between 20-50 pixels per second
        return 20 + Math.random() * 30
    }, [])

    // Initialize columns with cards
    const initializeColumns = useCallback(() => {
        if (!containerRef.current) return []

        const containerWidth = containerRef.current.clientWidth
        const containerHeight = window.innerHeight
        const cardWidth = 220
        const cardGap = 16

        // Calculate number of columns that fit in the container width
        // and add 2 more columns (one on each side)
        const numColumns = Math.max(
            4, // Minimum 4 columns
            Math.floor(containerWidth / (cardWidth + cardGap)) + 2
        )

        const newColumns: ColumnData[] = []

        for (let i = 0; i < numColumns; i++) {
            const cards: CardInstance[] = []
            const animationSpeed = getRandomAnimationSpeed()

            const cardsNeeded =
                Math.ceil(containerHeight / CARD_WITH_GAP) * 3 + 5

            for (let j = 0; j < cardsNeeded; j++) {
                // Position cards starting from the bottom of the screen and going down
                // This way, when cards are removed, the positions of other cards don't need to change
                const bottomPosition = j * CARD_WITH_GAP
                cards.push(createRandomCard(bottomPosition))
            }

            const startOffset = Math.floor(Math.random() * 100)
            const animationDuration = 80 + Math.random() * 40

            newColumns.push({
                id: i,
                cards,
                animationSpeed,
                startOffset,
                animationDuration,
                lastCardAddition: Date.now()
            })
        }

        setColumns(newColumns)
        setIsAnimating(true)
    }, [createRandomCard, getRandomAnimationSpeed, CARD_WITH_GAP])

    // Animation loop
    const animate = useCallback(
        (currentTime: number) => {
            if (!lastFrameTimeRef.current) {
                lastFrameTimeRef.current = currentTime
            }

            const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000 // Convert to seconds
            lastFrameTimeRef.current = currentTime

            setColumns((prevColumns) => {
                return prevColumns.map((column) => {
                    // First, update positions of all cards (moving them up = decreasing bottomPosition)
                    const updatedCards = column.cards.map((card) => {
                        // Continue moving cards even if they're marked for removal
                        return {
                            ...card,
                            bottomPosition:
                                card.bottomPosition -
                                column.animationSpeed * deltaTime
                        }
                    })

                    // Mark cards for removal when they're above the viewport by the card height
                    // With bottom positioning, cards are removed when they reach viewport height + card height
                    updatedCards.forEach((card) => {
                        if (
                            card.bottomPosition <
                                -window.innerHeight - CARD_HEIGHT &&
                            !card.removed
                        ) {
                            card.removed = true
                            card.removeTime = Date.now()
                        }
                    })

                    const currentTime = Date.now()
                    const filteredCards = updatedCards.filter((card) => {
                        if (!card.removed) return true

                        // Keep removed cards for a short time to ensure smooth transitions
                        return currentTime - (card.removeTime || 0) < 500
                    })

                    // Get visible cards and find the one at the bottom to determine if we need more cards
                    const visibleCards = filteredCards.filter(
                        (card) => !card.removed
                    )
                    const bottomCard = visibleCards[visibleCards.length - 1]

                    // Add more cards if the bottom card is moving up too far
                    // With bottom positioning, we add cards when the bottom card's position gets too small
                    if (
                        bottomCard &&
                        bottomCard.bottomPosition < CARD_WITH_GAP * 3
                    ) {
                        const cardsToAdd = Math.max(
                            1,
                            Math.ceil((CARD_WITH_GAP * 3) / CARD_HEIGHT)
                        )
                        for (let i = 0; i < cardsToAdd; i++) {
                            // Add new cards at increasing bottom positions
                            // This ensures they appear below the current bottom card
                            const newBottomPosition =
                                bottomCard.bottomPosition +
                                CARD_WITH_GAP * (i + 1)
                            filteredCards.push(
                                createRandomCard(newBottomPosition)
                            )
                        }
                    }

                    return {
                        ...column,
                        cards: filteredCards
                    }
                })
            })

            if (isAnimating) {
                animationFrameRef.current = requestAnimationFrame(animate)
            }
        },
        [isAnimating, createRandomCard, CARD_WITH_GAP]
    )

    useEffect(() => {
        if (isAnimating && !animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = undefined
            }
        }
    }, [isAnimating, animate, CARD_WITH_GAP])

    const hasInitializedRef = useRef(false)

    useEffect(() => {
        if (!hasInitializedRef.current) {
            initializeColumns()
            hasInitializedRef.current = true
        }
    }, [initializeColumns])

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return

            const containerWidth = containerRef.current.clientWidth
            const cardWidth = 220
            const cardGap = 16
            const newNumColumns = Math.max(
                4, // Minimum 4 columns
                Math.floor(containerWidth / (cardWidth + cardGap)) + 2
            )

            // Only adjust columns if the number needs to change significantly
            if (Math.abs(columns.length - newNumColumns) > 1) {
                // IMPORTANT: Always preserve existing columns and their cards
                if (columns.length < newNumColumns) {
                    // Add new columns without disturbing existing ones
                    setColumns((prevColumns) => {
                        // Create a deep copy to ensure we don't modify existing columns
                        const newColumns = JSON.parse(
                            JSON.stringify(prevColumns)
                        )

                        // Add the additional columns needed
                        for (let i = columns.length; i < newNumColumns; i++) {
                            const cards: CardInstance[] = []
                            const animationSpeed = getRandomAnimationSpeed()
                            const containerHeight = window.innerHeight

                            // Create cards for the new column
                            const cardsNeeded =
                                Math.ceil(containerHeight / CARD_WITH_GAP) * 3 +
                                5
                            for (let j = 0; j < cardsNeeded; j++) {
                                const yPosition =
                                    -CARD_HEIGHT + j * CARD_WITH_GAP
                                cards.push(createRandomCard(yPosition))
                            }

                            // Calculate a random start offset and animation duration
                            const startOffset = Math.floor(Math.random() * 100)
                            const animationDuration = 80 + Math.random() * 40

                            newColumns.push({
                                id: i,
                                cards,
                                animationSpeed,
                                startOffset,
                                animationDuration,
                                lastCardAddition: Date.now()
                            })
                        }

                        return newColumns
                    })
                } else {
                    // We need to remove columns - only remove excess columns, preserve the rest
                    setColumns((prevColumns) =>
                        prevColumns.slice(0, newNumColumns)
                    )
                }
            }
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [
        columns.length,
        createRandomCard,
        getRandomAnimationSpeed,
        CARD_WITH_GAP
    ])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    // We don't need the additional effect for column filling anymore
    // as it was causing columns to be fully replaced
    // Instead, we'll rely on the animation loop to add cards as needed

    // Get cards for a specific column
    const getVisibleCards = useCallback(
        (columnId: number) => {
            const column = columns.find((col) => col.id === columnId)
            if (!column) return []

            // Return cards that are within the viewport plus a buffer
            // With bottom positioning, cards are visible when their bottom position is
            // between -viewport height - buffer and buffer
            return column.cards.filter(
                (card) =>
                    card.bottomPosition >
                        -window.innerHeight - CARD_HEIGHT * 3 &&
                    card.bottomPosition < window.innerHeight + CARD_HEIGHT * 3
            )
        },
        [columns, CARD_HEIGHT]
    )

    return {
        containerRef,
        columns,
        isAnimating,
        getVisibleCards
    }
}

export default useHomeCardsColumns
