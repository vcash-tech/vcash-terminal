export type HomeItemProps = {
    title: string
    image: string
    body: string
}

export default function HomeItem({ image, title, body }: HomeItemProps) {
    return (
        <button className="home-item">
            <div className="image-container">
                <img src={image} alt={title} />
            </div>

            <div className="text-content">
                <p className="title">{title}</p>
                <p>{body}</p>
            </div>
        </button>
    )
}
