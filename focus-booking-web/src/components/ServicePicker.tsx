'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Service } from '@/types/api';

type Props = {
  onSelect: (service: Service) => void;
  selectedId?: string;
};

export default function ServicePicker({ onSelect, selectedId }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let active = true;
    api
      .listServices()
      .then((data) => {
        if (!active) return;
        setServices(data);
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

  if (loading) {
    return <div className="text-sm text-gray-500">Loading services…</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">Failed to load services: {error}</div>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {services.map((service) => (
        <button
          key={service.id}
          type="button"
          onClick={() => onSelect(service)}
          className={`rounded-2xl border bg-white p-4 text-left shadow transition hover:shadow-md ${
            selectedId === service.id ? 'ring-2 ring-black' : ''
          }`}
        >
          <div className="flex items-baseline justify-between">
            <div className="font-semibold">{service.name}</div>
            <div className="text-sm">{service.price.toFixed(2)} BGN</div>
          </div>
          <div className="text-xs text-gray-600">Duration: {service.duration_min} min</div>
          {service.description && <p className="mt-2 text-xs text-gray-500">{service.description}</p>}
        </button>
      ))}
    </div>
  );
}
