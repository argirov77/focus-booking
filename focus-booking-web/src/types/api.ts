export type UUID = string;

export interface Guest {
  id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface Unit {
  id: UUID;
  name: string;
  capacity: number;
  price: number;
  description?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: UUID;
  unit_id: UUID;
  guest_id: UUID;
  start_date: string;
  end_date: string;
  total_price: number;
  status: ReservationStatus;
}

export interface Service {
  id: UUID;
  name: string;
  duration_min: number;
  price: number;
  description?: string;
}

export interface Specialist {
  id: UUID;
  name: string;
  avatar?: string;
  skills: UUID[];
  timezone?: string;
}

export type SlotStatus = 'free' | 'held' | 'booked';

export interface Slot {
  specialist_id: UUID;
  start: string;
  end: string;
  status: SlotStatus;
}

export interface Hold {
  hold_id: UUID;
  expires_at: string;
}

export interface AppointmentGuest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface Appointment {
  id: UUID;
  specialist_id: UUID;
  service_id: UUID;
  guest_id: UUID;
  start: string;
  end: string;
  price: number;
  status: ReservationStatus | 'completed';
}

export interface CreateAppointmentPayload {
  specialist_id: UUID;
  service_id: UUID;
  start: string;
  guest: AppointmentGuest;
}
