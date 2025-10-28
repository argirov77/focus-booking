import Link from 'next/link';
import { api } from '@/lib/api';

interface PageProps {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function UnitDetails({ params, searchParams }: PageProps) {
  const unit = await api.getUnit(params.id);
  const start_date = typeof searchParams.start_date === 'string' ? searchParams.start_date : '';
  const end_date = typeof searchParams.end_date === 'string' ? searchParams.end_date : '';

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries({ unit_id: unit.id, start_date, end_date }).filter(([, value]) => value)
    )
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2 space-y-2">
        <h2 className="text-2xl font-semibold">{unit.name}</h2>
        <div className="text-sm text-gray-600">Capacity: {unit.capacity}</div>
        <p className="text-gray-700">{unit.description || '—'}</p>
      </div>
      <aside className="rounded-2xl border bg-white p-4 shadow">
        <div className="text-lg font-medium">{unit.price.toFixed(2)} BGN / night</div>
        <Link
          href={`/checkout?${query.toString()}`}
          className="mt-3 inline-block rounded-xl bg-black px-5 py-2 text-white hover:opacity-90"
        >
          Book
        </Link>
      </aside>
    </div>
  );
}
