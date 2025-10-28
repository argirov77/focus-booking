import type {
  Appointment,
  CreateAppointmentPayload,
  Guest,
  Hold,
  Reservation,
  Service,
  Slot,
  Specialist,
  Unit,
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} -> ${res.status}: ${text}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export const api = {
  listUnits: () => request<Unit[]>(`/api/units`, { cache: 'no-store' }),
  getUnit: (id: string) => request<Unit>(`/api/units/${id}`, { cache: 'no-store' }),
  searchAvailability: (params: { start_date: string; end_date: string; guests?: number }) => {
    const q = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
      ...(params.guests ? { guests: String(params.guests) } : {}),
    }).toString();
    return request<Unit[]>(`/api/units/availability?${q}`, { cache: 'no-store' });
  },

  createGuest: (payload: Partial<Guest>) =>
    request<Guest>(`/api/guests`, { method: 'POST', body: JSON.stringify(payload) }),
  createReservation: (payload: Partial<Reservation>) =>
    request<Reservation>(`/api/reservations`, { method: 'POST', body: JSON.stringify(payload) }),
  listReservations: () => request<Reservation[]>(`/api/reservations`, { cache: 'no-store' }),

  listServices: () => request<Service[]>(`/api/services`, { cache: 'no-store' }),
  listSpecialists: () => request<Specialist[]>(`/api/specialists`, { cache: 'no-store' }),
  listSlots: (q: { specialist_id: string; date: string }) =>
    request<Slot[]>(`/api/slots?${new URLSearchParams(q as Record<string, string>).toString()}`, {
      cache: 'no-store',
    }),
  holdSlot: (payload: { specialist_id: string; start: string; duration_min: number }) =>
    request<Hold>(`/api/holds`, { method: 'POST', body: JSON.stringify(payload) }),
  releaseHold: (id: string) => request<void>(`/api/holds/${id}`, { method: 'DELETE' }),
  createAppointment: (payload: CreateAppointmentPayload & { hold_id?: string }) =>
    request<Appointment>(`/api/appointments`, { method: 'POST', body: JSON.stringify(payload) }),
};

export type { Guest, Unit, Reservation, Service, Specialist, Slot, Appointment } from '@/types/api';
