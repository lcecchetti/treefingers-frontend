import { parseISO } from 'date-fns';
import format from 'date-fns-tz/format';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { useState, useEffect } from 'react';

const DATE_LONG = 'dd/MM/yyyy HH:mm:ss';
const DATE_SHORT = 'dd/MM/yyyy';

const formatDate = (dateTime: string | Date, dateFormat: string = DATE_SHORT, options?: Record<string, unknown>): string => {
  const date = new Date(dateTime);
  return format(date, dateFormat, options);
};

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

export { formatDate, useFormattedDate, DATE_LONG, DATE_SHORT };
