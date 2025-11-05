export interface TourEntry {
  date: Date;
  employee: string;
  appointmentNumber: number;
  customer: string;
  startTime: Date;
  endTime: Date;
  timeWindow: string;
}

export interface ParsedTourData {
  date: Date;
  employee: string;
  appointments: Array<{
    number: number;
    customer: string;
  }>;
}

export interface AppSettings {
  tourStartTime: string;
  appointmentDuration: number;
  pauseMin: number;
  pauseMax: number;
  enableTimeWindow: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  tourStartTime: '09:00',
  appointmentDuration: 60,
  pauseMin: 60,
  pauseMax: 90,
  enableTimeWindow: false,
};

export type FileType = 'txt' | 'pdf' | 'xlsx' | 'xls';
