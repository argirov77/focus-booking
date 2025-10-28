'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Specialist } from '@/types/api';

type Props = {
  serviceId?: string;
  onSelect: (id: string) => void;
  selectedId?: string;
};

export default function SpecialistPicker({ serviceId, onSelect, selectedId }: Props) {
  const [list, setList] = useState<Specialist[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .listSpecialists()
      .then((data) => {
        if (!active) return;
        setList(data);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!serviceId) return list;
    return list.filter((s) => s.skills.includes(serviceId));
  }, [list, serviceId]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading specialists…</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">Failed to load specialists: {error}</div>;
  }

  if (filtered.length === 0) {
    return <div className="text-sm text-gray-500">No specialists available.</div>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((sp) => (
        <button
          key={sp.id}
          type="button"
          onClick={() => onSelect(sp.id)}
          className={`rounded-2xl border bg-white p-4 text-left shadow transition hover:shadow-md ${
            selectedId === sp.id ? 'ring-2 ring-black' : ''
          }`}
        >
          <div className="font-semibold">{sp.name}</div>
          <div className="text-xs text-gray-600">Services: {sp.skills.length}</div>
        </button>
      ))}
    </div>
  );
}
