export default function IconHeading({ icon, heading }: { icon: string; heading: string;}) {
    return (
        <h1 className="icon-heading">
          <img className="icon" alt={heading} src={icon} />
          {heading}
        </h1>
    )
}