import { DateTime } from 'luxon';

export const getFormattedCurrentDate = (
  timezone: string = 'Asia/Tbilisi',
): string => {
  return DateTime.now()
    .setZone(timezone)
    .setLocale('en')
    .toFormat('EEEE, yyyy-LL-dd, HH:mm');
};
