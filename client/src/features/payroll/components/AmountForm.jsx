import { useState } from "react";
import Card from "../../shared/components/Card";
import Input from "../../shared/components/Input";
import Textarea from "../../shared/components/Textarea";
import Button from "../../shared/components/Button";

// one small form, reused for bonus, advance and payment
const AmountForm = ({
  title,
  description,
  noteLabel,
  noteRequired = false,
  submitLabel,
  onSubmit, // (amount, note) => Promise. Throws the server's message on failure
  disabled = false,
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount above 0");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    try {
      const message = await onSubmit(value, note.trim());
      setNotice(message);
      setAmount("");
      setNote("");
    } catch (message) {
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <Input
          id={`amount-${title}`}
          label="Amount (₹)"
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          disabled={disabled}
          required
        />
        <Textarea
          id={`note-${title}`}
          label={noteLabel}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={200}
          disabled={disabled}
          required={noteRequired}
        />

        {error && (
          <p className="rounded-lg bg-bad-bg px-3.5 py-2.5 text-sm text-bad">{error}</p>
        )}
        {notice && (
          <p className="rounded-lg bg-ok-bg px-3.5 py-2.5 text-sm text-ok" role="status">
            {notice}
          </p>
        )}

        <Button type="submit" loading={saving} disabled={disabled}>
          {submitLabel}
        </Button>
      </form>
    </Card>
  );
};

export default AmountForm;