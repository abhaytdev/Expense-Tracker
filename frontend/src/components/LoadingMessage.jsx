export default function LoadingMessage({ text = 'Loading...' }) {
  return <p className="state-message state-message--loading">{text}</p>;
}
