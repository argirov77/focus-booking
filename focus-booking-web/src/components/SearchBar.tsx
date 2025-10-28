'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const r = useRouter();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [guests, setGuests] = useState(1);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) return;
    const q = new URLSearchParams({ start_date: start, end_date: end, guests: String(guests) });
    r.push(`/search?${q.toString()}`);
  };

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-5 bg-white p-4 rounded-2xl shadow">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-600">Check‑in</label>
        <input
          required
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-600">Check‑out</label>
        <input
          required
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600">Guests</label>
        <input
          min={1}
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value) || 1)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </div>
      <div className="sm:col-span-5 flex justify-end">
        <button type="submit" className="rounded-xl border bg-black px-5 py-2 text-white hover:opacity-90">
          Search
        </button>
      </div>
    </form>
  );
}
