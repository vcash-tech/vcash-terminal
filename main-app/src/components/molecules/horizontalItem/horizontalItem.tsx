export default function HorizontalItem({
    title,
    body,
    image
}: {
    title: string
    body: string
    image?: string
}) {
    return (
        <div className="horizontal-item">
            {image && <img src={image} alt={title} className="item-icon" />}
            <p className="title">{title}</p>
            <p>{body}</p>
        </div>
    )
}
