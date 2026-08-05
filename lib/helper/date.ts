import format from 'date-fns-tz/format';

const DATE_LONG = 'dd/MM/yyyy HH:mm:ss';
const DATE_SHORT = 'dd/MM/yyyy';

const formatDate = (dateTime: string | Date, dateFormat: string = DATE_SHORT, options?: Record<string, unknown>): string => {
  const date = new Date(dateTime);
  return format(date, dateFormat, options);
};

export { formatDate, DATE_LONG, DATE_SHORT };
