"use client";

import { useEffect, useState } from "react";

function getTimeRemaining(eventDate: Date) {
  const now = new Date().getTime();
  const then = eventDate.getTime();
  const diff = then - now;

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}

export function CountdownTimer({ eventDate }: { eventDate: Date }) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(eventDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const r = getTimeRemaining(eventDate);
      setRemaining(r);
      if (!r) clearInterval(interval);
    }, 60000);
    return () => clearInterval(interval);
  }, [eventDate]);

  if (!remaining) {
    const now = new Date().getTime();
    const then = eventDate.getTime();
    if (now > then) return null; // event passed
    return (
      <div className="text-center text-sm text-stone-400">
        Today is the day
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 text-center">
      <div>
        <span className="block font-serif text-2xl text-stone-800">
          {remaining.days}
        </span>
        <span className="text-xs tracking-wide text-stone-400 uppercase">
          Days
        </span>
      </div>
      <span className="text-xl text-stone-300">:</span>
      <div>
        <span className="block font-serif text-2xl text-stone-800">
          {remaining.hours}
        </span>
        <span className="text-xs tracking-wide text-stone-400 uppercase">
          Hours
        </span>
      </div>
      <span className="text-xl text-stone-300">:</span>
      <div>
        <span className="block font-serif text-2xl text-stone-800">
          {remaining.minutes}
        </span>
        <span className="text-xs tracking-wide text-stone-400 uppercase">
          Mins
        </span>
      </div>
    </div>
  );
}
