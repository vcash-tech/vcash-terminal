export default function Divider({ gap }: { gap?: number }) {
    return <div className="divider" style={{ marginBottom: gap, paddingBottom: gap }} />
}