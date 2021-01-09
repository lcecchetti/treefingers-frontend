import { format } from 'date-fns';

/**
 * Default date format
 * @type {string}
 */
const DATE_FORMAT_DEFAULT = 'dd/MM/yyyy HH:mm:ss';

/**
 * Format date
 * @param {string} dateTime
 * @return {string}
 */
const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  return format(date, DATE_FORMAT_DEFAULT);
};

export { formatDate };