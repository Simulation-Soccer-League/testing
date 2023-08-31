export const formatDateTime = (
  datetime?: string,
  dateOnly?: boolean,
): string => {
  const utcDate = datetime ? new Date(datetime) : new Date();

  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
  );

  const formattedDate = `${localDate.getMonth() + 1}/${localDate.getDate()}/${
    localDate.getFullYear() % 100
  }`;

  let hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const amPm = hours >= 12 ? 'pm' : 'am';

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  const formattedTime = `${hours}:${minutes
    .toString()
    .padStart(2, '0')}${amPm}`;

  return `${formattedDate}${dateOnly ? '' : ` at ${formattedTime}`}`;
};
