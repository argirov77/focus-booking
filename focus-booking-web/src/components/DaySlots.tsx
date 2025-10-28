'use client';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Slot } from '@/types/api';

type Props = {
  specialistId: string;
  date: string;
  durationMin: number;
  onPick: (startISO: string) => void;
  activeStart?: string;
};

export default function DaySlots({ specialistId, date, durationMin, onPick, activeStart }: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!specialistId || !date) {
      return;
    }
    let active = true;
    startTransition(() => {
      if (!active) return;
      setLoading(true);
      setError(undefined);
    });
    api
      .listSlots({ specialist_id: specialistId, date })
      .then((data) => {
        if (!active) return;
        setSlots(data);
        setError(undefined);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
        setSlots([]);
      })
      .finally(() => {
        if (!active) return;
        startTransition(() => {
          if (!active) return;
          setLoading(false);
        });
      });
    return () => {
      active = false;
    };
  }, [specialistId, date]);

  const sorted = useMemo(() => {
    return [...slots].sort((a, b) => a.start.localeCompare(b.start));
  }, [slots]);

  if (!specialistId || !date) {
    return <div className="text-sm text-gray-500">Select specialist and date to see availability.</div>;
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading slots…</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">Failed to load slots: {error}</div>;
  }

  if (sorted.length === 0) {
    return <div className="text-sm text-gray-500">No slots available for this day.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {sorted.map((slot) => {
        const disabled = slot.status !== 'free';
        const isActive = activeStart === slot.start;
        const startLabel = new Date(slot.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const endLabel = new Date(slot.end).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        return (
          <button
            key={`${slot.specialist_id}-${slot.start}`}
            type="button"
            disabled={disabled}
            onClick={() => onPick(slot.start)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white hover:shadow'
            } ${isActive ? 'ring-2 ring-black' : ''}`}
          >
            <div>{startLabel}</div>
            <div className="text-xs text-gray-500">→ {endLabel}</div>
            {durationMin > 0 && (
              <div className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
                {durationMin} min
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
