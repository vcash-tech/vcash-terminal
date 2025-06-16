import React from "react"

export default function HorizontalList({ title, list }: { title: string; list: React.ReactNode[] }) {
    return <div className="horizontal-list">
        <h3>{title}</h3>
        <div className="list-items">
            {list}
        </div>
    </div>
}
