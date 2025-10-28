'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unit_id = searchParams.get('unit_id') || '';
  const start_date = searchParams.get('start_date') || '';
  const end_date = searchParams.get('end_date') || '';

  const [first_name, setFirst] = useState('');
  const [last_name, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit_id || !start_date || !end_date) {
      setError('Missing reservation details.');
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const guest = await api.createGuest({ first_name, last_name, email, phone });
      await api.createReservation({ unit_id, guest_id: guest.id, start_date, end_date });
      router.push('/thank-you');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create reservation.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Checkout</h2>
      <div className="text-sm text-gray-600">
        Dates: {start_date || '—'} → {end_date || '—'}
      </div>
      <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white p-4 shadow">
        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="First name"
            className="rounded-lg border px-3 py-2"
            value={first_name}
            onChange={(e) => setFirst(e.target.value)}
          />
          <input
            required
            placeholder="Last name"
            className="rounded-lg border px-3 py-2"
            value={last_name}
            onChange={(e) => setLast(e.target.value)}
          />
        </div>
        <input
          required
          type="email"
          placeholder="Email"
          className="rounded-lg border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Phone"
          className="rounded-lg border px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-xl bg-black px-5 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Confirm reservation'}
        </button>
      </form>
    </div>
  );
}
