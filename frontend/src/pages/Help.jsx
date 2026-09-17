const faqs = [
  {
    q: 'How do I add income or an expense?',
    a: 'Use the "Add income" or "Add expense" button on the dashboard, or open Transactions and click "Add transaction". Fill in the amount, category, date, and an optional description.'
  },
  {
    q: 'How is my balance calculated?',
    a: 'Balance is your total income minus your total expenses, calculated from every transaction in your account.'
  },
  {
    q: 'How do I edit a transaction?',
    a: 'Open the Transactions page and click "Edit" next to the transaction you want to change, update the fields, and save.'
  },
  {
    q: 'How do I delete a transaction?',
    a: 'Click "Delete" next to a transaction in the Transactions page, then confirm in the dialog that appears. This cannot be undone.'
  },
  {
    q: 'How does authentication protect my data?',
    a: "Your password is hashed with BCrypt before it's stored, so the plain password is never saved. Once you log in, a secure session cookie keeps you signed in, and every transaction request is scoped to your account on the server - no one can see or change another account's data."
  }
];

export default function Help() {
  return (
    <div className="page-narrow">
      <h1>Help</h1>
      <div className="help-list">
        {faqs.map((item) => (
          <div key={item.q} className="help-item">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
