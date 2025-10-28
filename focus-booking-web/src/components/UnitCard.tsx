import Link from 'next/link';
import type { Unit } from '@/types/api';

export default function UnitCard({ unit }: { unit: Unit }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow transition hover:shadow-md">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{unit.name}</h3>
        <div className="text-sm text-gray-500">Capacity: {unit.capacity}</div>
      </div>
      <p className="mt-1 text-sm text-gray-600 line-clamp-3">{unit.description || '—'}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-base font-medium">{unit.price.toFixed(2)} BGN / night</div>
        <Link href={`/units/${unit.id}`} className="text-sm underline">
          Details
        </Link>
      </div>
    </div>
  );
}
