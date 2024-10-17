'use client'
import { useEffect, useState } from 'react';

const TimeDisplay = () => {
  const [dateTime, setDateTime] = useState({ time: '', date: '' });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeZone = 'America/Mexico_City';

      const optionsDate = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone,
      };
      const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone,
        hour12: false,
      };

      const formattedDate = new Intl.DateTimeFormat('es-MX', optionsDate).format(now);
      const formattedTime = new Intl.DateTimeFormat('es-MX', optionsTime).format(now);

      setDateTime({ time: formattedTime, date: formattedDate });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p className='w-[280px] text-[12px] text-white'>México city: {dateTime.date} {dateTime.time}</p>
    </div>
  );
};

export default TimeDisplay;