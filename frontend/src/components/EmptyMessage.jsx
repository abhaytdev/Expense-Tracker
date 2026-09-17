export default function EmptyMessage({ text = 'Nothing here yet.' }) {
  return <p className="state-message state-message--empty">{text}</p>;
}
