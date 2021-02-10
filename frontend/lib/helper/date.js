import { format } from 'date-fns';

/**
 * Date format long
 * @type {string}
 */
const DATE_LONG = 'dd/MM/yyyy HH:mm:ss';

/**
 * Date format short
 * @type {string}
 */
const DATE_SHORT = 'dd/MM/yyyy';

/**
 * Format date
 * @param {string} dateTime
 * @param {string} dateFormat
 * @return {string}
 */
const formatDate = (dateTime, dateFormat = DATE_SHORT) => {
  const date = new Date(dateTime);
  return format(date, dateFormat);
};

export { formatDate, DATE_LONG, DATE_SHORT };