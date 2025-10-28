import SearchBar from '@/components/SearchBar';
import UnitCard from '@/components/UnitCard';
import { api } from '@/lib/api';
import type { Unit } from '@/types/api';

export default async function Home() {
  let units: Unit[] = [];
  try {
    units = await api.listUnits();
  } catch (error) {
    console.error('Failed to load units', error);
  }

  return (
    <div className="space-y-6">
      <SearchBar />
      <section>
        <h2 className="mb-3 text-lg font-semibold">Units</h2>
        {units.length === 0 && (
          <div className="rounded-xl border border-dashed bg-white p-6 text-sm text-gray-500">
            No units available right now.
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </section>
    </div>
  );
}
