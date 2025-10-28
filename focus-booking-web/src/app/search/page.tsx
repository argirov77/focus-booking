import UnitCard from '@/components/UnitCard';
import { api } from '@/lib/api';
import type { Unit } from '@/types/api';

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function SearchPage({ searchParams }: Props) {
  const start_date = typeof searchParams.start_date === 'string' ? searchParams.start_date : undefined;
  const end_date = typeof searchParams.end_date === 'string' ? searchParams.end_date : undefined;
  const guestsParam = typeof searchParams.guests === 'string' ? Number(searchParams.guests) : undefined;

  let units: Unit[] = [];
  if (start_date && end_date) {
    try {
      units = await api.searchAvailability({ start_date, end_date, guests: guestsParam });
    } catch (error) {
      console.error('Failed to search availability', error);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available units</h2>
      {(!units || units.length === 0) && (
        <div className="text-sm text-gray-500">No results. Change dates or guests.</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}
