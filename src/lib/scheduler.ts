import { addMinutes, format } from 'date-fns';
import { TourEntry, ParsedTourData, AppSettings } from '../types';

/**
 * Generate a random pause duration between min and max minutes
 */
function getRandomPause(minMinutes: number, maxMinutes: number): number {
  return Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
}

/**
 * Generate a 3-hour time window string based on appointment start time
 */
function generateTimeWindow(startTime: Date): string {
  const startHour = format(startTime, 'HH:mm');
  const endTime = addMinutes(startTime, 180); // 3 hours
  const endHour = format(endTime, 'HH:mm');
  return `${startHour} - ${endHour}`;
}

/**
 * Parse time string (HH:mm) and set it on a date
 */
function setTimeOnDate(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}

/**
 * Schedule appointments for a single tour with breaks between appointments
 */
export function scheduleTour(
  parsedData: ParsedTourData,
  settings: AppSettings
): TourEntry[] {
  const entries: TourEntry[] = [];

  // Set the tour start time on the tour date
  let currentTime = setTimeOnDate(parsedData.date, settings.tourStartTime);

  parsedData.appointments.forEach((appointment, index) => {
    // Add random pause before appointment (except for the first one)
    if (index > 0) {
      const pauseDuration = getRandomPause(settings.pauseMin, settings.pauseMax);
      currentTime = addMinutes(currentTime, pauseDuration);
    }

    const startTime = new Date(currentTime);
    const endTime = addMinutes(startTime, settings.appointmentDuration);

    const timeWindow = settings.enableTimeWindow
      ? generateTimeWindow(startTime)
      : '-';

    entries.push({
      date: parsedData.date,
      employee: parsedData.employee,
      appointmentNumber: appointment.number,
      customer: appointment.customer,
      startTime,
      endTime,
      timeWindow,
    });

    // Move to next appointment
    currentTime = endTime;
  });

  return entries;
}

/**
 * Schedule all tours from multiple parsed data sets
 */
export function scheduleAllTours(
  parsedDataList: ParsedTourData[],
  settings: AppSettings
): TourEntry[] {
  const allEntries: TourEntry[] = [];

  parsedDataList.forEach((parsedData) => {
    const tourEntries = scheduleTour(parsedData, settings);
    allEntries.push(...tourEntries);
  });

  // Sort by date and appointment number
  allEntries.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.appointmentNumber - b.appointmentNumber;
  });

  return allEntries;
}
