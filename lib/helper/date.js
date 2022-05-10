import { format } from 'date-fns';

const DATE_LONG = 'dd/MM/yyyy HH:mm:ss';
const DATE_SHORT = 'dd/MM/yyyy';

const formatDate = (dateTime, dateFormat = DATE_SHORT) => {
  const date = new Date(dateTime);
  return format(date, dateFormat);
};

export { formatDate, DATE_LONG, DATE_SHORT };