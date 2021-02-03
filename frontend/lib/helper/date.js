import { format } from 'date-fns';

/**
 * Format date
 * @param {string} dateTime
 * @param {string} dateFormat
 * @return {string}
 */
const formatDate = (dateTime, dateFormat = 'dd/MM/yyyy HH:mm:ss') => {
  const date = new Date(dateTime);
  return format(date, dateFormat);
};

export { formatDate };