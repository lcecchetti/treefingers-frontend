import { parseISO } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { useState, useEffect } from 'react';
import { formatDate, DATE_SHORT } from './date';

/**
 * Format date on client to prevent ssr rendering mismatch
 */
const useFormattedDate = (dateTime: string, dateFormat: string = DATE_SHORT): string => {
  const parsedTime = parseISO(dateTime);
  const utcTime = utcToZonedTime(parsedTime, 'UTC');

  const [formattedDate, setFormattedDate] = useState(formatDate(utcTime, dateFormat, { timeZone: 'UTC' }));

  useEffect(() => setFormattedDate(formatDate(dateTime, dateFormat)), [dateTime, dateFormat]);

  return formattedDate;
};

export { useFormattedDate };
