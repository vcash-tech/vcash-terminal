export default function PaymentCard({ image, text, callback }: { image: string; text: string; callback: () => void }) {
    return (
      <button onClick={callback} className="payment-card">
          <div className="card-text">{text}</div>
          <div className="card-image"><img src={image} alt={text} /></div>
      </button>
  );
}