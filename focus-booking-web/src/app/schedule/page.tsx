'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import DaySlots from '@/components/DaySlots';
import ServicePicker from '@/components/ServicePicker';
import SpecialistPicker from '@/components/SpecialistPicker';
import { api } from '@/lib/api';
import type { Service } from '@/types/api';

type HoldState = {
  id: string;
  expires_at: string;
};

export default function SchedulePage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [specialistId, setSpecialistId] = useState('');
  const [date, setDate] = useState('');
  const [hold, setHold] = useState<HoldState | undefined>();
  const holdIdRef = useRef<string | null>(null);
  const [holdError, setHoldError] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [startISO, setStartISO] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appointmentError, setAppointmentError] = useState<string | undefined>();

  const clearHold = useCallback(async () => {
    if (holdIdRef.current) {
      try {
        await api.releaseHold(holdIdRef.current);
      } catch (err) {
        console.error('Failed to release hold', err);
      }
    }
    holdIdRef.current = null;
    setHold(undefined);
    setStartISO('');
  }, []);

  useEffect(() => {
    return () => {
      void clearHold();
    };
  }, [clearHold]);

  useEffect(() => {
    if (!hold?.expires_at) {
      setSecondsLeft(null);
      return;
    }
    const update = () => {
      const diff = Math.floor((new Date(hold.expires_at).getTime() - Date.now()) / 1000);
      if (diff <= 0) {
        setSecondsLeft(0);
        void clearHold();
      } else {
        setSecondsLeft(diff);
      }
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [hold?.expires_at, clearHold]);

  const handleSelectService = useCallback(
    (service: Service) => {
      setSelectedService(service);
      setSpecialistId('');
      setHoldError(undefined);
      void clearHold();
    },
    [clearHold]
  );

  const handleSelectSpecialist = useCallback(
    (id: string) => {
      setSpecialistId(id);
      setHoldError(undefined);
      void clearHold();
    },
    [clearHold]
  );

  useEffect(() => {
    setHoldError(undefined);
    void clearHold();
  }, [date, clearHold]);

  const handlePickSlot = useCallback(
    async (start: string) => {
      if (!selectedService || !specialistId) {
        setHoldError('Choose service and specialist first.');
        return;
      }
      setHoldError(undefined);
      try {
        await clearHold();
        const res = await api.holdSlot({
          specialist_id: specialistId,
          start,
          duration_min: selectedService.duration_min,
        });
        holdIdRef.current = res.hold_id;
        setHold({ id: res.hold_id, expires_at: res.expires_at });
        setStartISO(start);
      } catch (err) {
        if (err instanceof Error) {
          setHoldError(err.message);
        } else {
          setHoldError('Failed to hold the slot.');
        }
      }
    },
    [clearHold, selectedService, specialistId]
  );

  const canSubmit = useMemo(() => {
    return Boolean(selectedService && specialistId && startISO && firstName && lastName && email);
  }, [email, firstName, lastName, selectedService, specialistId, startISO]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedService) {
      setAppointmentError('Fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setAppointmentError(undefined);
    try {
      await api.createAppointment({
        specialist_id: specialistId,
        service_id: selectedService.id,
        start: startISO,
        guest: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || undefined,
        },
        hold_id: hold?.id,
      });
      void clearHold();
      router.push('/thank-you');
    } catch (err) {
      if (err instanceof Error) {
        setAppointmentError(err.message);
      } else {
        setAppointmentError('Failed to create appointment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Запись на массаж</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <div>
            <div className="mb-2 text-sm font-medium">1) Выберите услугу</div>
            <ServicePicker onSelect={handleSelectService} selectedId={selectedService?.id} />
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">2) Специалист</div>
            <SpecialistPicker
              serviceId={selectedService?.id}
              onSelect={handleSelectSpecialist}
              selectedId={specialistId}
            />
          </div>
        </div>
        <div className="space-y-4 md:col-span-2">
          <div>
            <label className="block text-xs font-medium text-gray-600">Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 rounded-lg border px-3 py-2"
            />
          </div>
          {holdError && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{holdError}</div>}
          {selectedService && specialistId && date && (
            <DaySlots
              specialistId={specialistId}
              date={date}
              durationMin={selectedService.duration_min}
              onPick={handlePickSlot}
              activeStart={startISO}
            />
          )}
          {hold && (
            <div className="rounded-xl border bg-white p-4 shadow">
              <div className="text-sm text-gray-700">
                Слот удерживается до{' '}
                {new Date(hold.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {typeof secondsLeft === 'number' && secondsLeft > 0 && ` (${secondsLeft}s)`}
              </div>
              <form onSubmit={submit} className="mt-3 grid gap-2">
                {appointmentError && (
                  <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{appointmentError}</div>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    required
                    placeholder="First name"
                    className="rounded-lg border px-3 py-2"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    required
                    placeholder="Last name"
                    className="rounded-lg border px-3 py-2"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="rounded-lg border px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  placeholder="Phone"
                  className="rounded-lg border px-3 py-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                  >
                    {submitting ? 'Saving…' : 'Подтвердить запись'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void clearHold()}
                    className="rounded-xl border px-4 py-2 text-sm"
                  >
                    Cancel hold
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
