import { parseISO } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { useState, useEffect } from "react";

const DATE_LONG = 'dd/MM/yyyy HH:mm:ss';
const DATE_SHORT = 'dd/MM/yyyy';

const formatDate = (dateTime, dateFormat = DATE_SHORT, options) => {
  const date = new Date(dateTime);
  return format(date, dateFormat, options);
};

/**
 * Format date on client to prevent ssr rendering mismatch
 */
const useFormattedDate = (dateTime, dateFormat = DATE_SHORT) => {
  const parsedTime = parseISO(dateTime);
  const utcTime = utcToZonedTime(parsedTime, 'UTC');

  const [formattedDate, setFormattedDate] = useState(formatDate(utcTime, dateFormat, { timeZone: 'UTC' }));

  useEffect(() => setFormattedDate(formatDate(dateTime, dateFormat)), [dateTime, dateFormat]);

  return formattedDate;
};

export { formatDate, useFormattedDate, DATE_LONG, DATE_SHORT };