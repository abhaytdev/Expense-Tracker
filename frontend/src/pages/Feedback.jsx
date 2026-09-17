import { useState } from 'react';
import * as feedbackApi from '../api/feedbackApi';

export default function Feedback() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus('error');
      setStatusMessage('Feedback message is required');
      return;
    }
    setSubmitting(true);
    try {
      await feedbackApi.submitFeedback({ message });
      setStatus('success');
      setStatusMessage("Thanks - your feedback has been sent.");
      setMessage('');
    } catch (err) {
      setStatus('error');
      setStatusMessage(err.response?.data?.message || 'Could not send feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Feedback</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {status === 'success' && <p className="form-success">{statusMessage}</p>}
        {status === 'error' && <p className="form-error form-error--top">{statusMessage}</p>}

        <div className="form-field">
          <label htmlFor="feedback-message">Your feedback</label>
          <textarea
            id="feedback-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's working and what isn't..."
          />
        </div>

        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Sending...' : 'Submit feedback'}
        </button>
      </form>
    </div>
  );
}
