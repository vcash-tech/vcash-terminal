import React from 'react'
// import Marquee from 'react-fast-marquee'

export interface AvailableServicesVerticalProps {
    items: {
        image: string
        backgroundColor: string
        serviceName: string
        region: string
        priceRangeCurrency: string
        priceRangeText: string
    }[]
}

const AvailableServicesVertical: React.FC<AvailableServicesVerticalProps> = ({
    items
}) => {
    // Create two copies of the items for seamless scrolling
    const renderItems = (keyPrefix: string) =>
        items.map((item, idx) => (
            <div
                key={`${keyPrefix}-${item.image}-${idx}`}
                className="marquee-item"
                style={{ backgroundColor: item.backgroundColor }}>
                <img src={item.image} />
                <div className="main-info">
                    <div className="service-name">{item.serviceName}</div>
                    <div className="service-region">{item.region}</div>
                </div>
                <div className="price-range">
                    <div className="price-range-currency">
                        {item.priceRangeCurrency}
                    </div>
                    <div className="price-range-text">
                        {item.priceRangeText}
                    </div>
                </div>
            </div>
        ))

    return (
        <div className="availableServicesVertical">
            <div className="marquee-container">
                <div className="marquee-content">
                    {renderItems('first')}
                    {renderItems('second')}
                </div>
            </div>
        </div>
    )
}

export default AvailableServicesVertical
