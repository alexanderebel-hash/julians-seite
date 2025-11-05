import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { TourEntry } from '../types';
import { exportToCSV, exportToExcel } from '../lib/export';
import { motion } from 'framer-motion';

interface AppointmentTableProps {
  entries: TourEntry[];
}

export function AppointmentTable({ entries }: AppointmentTableProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            Keine Termine vorhanden. Laden Sie eine Datei hoch, um zu beginnen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tour-Termine ({entries.length})</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(entries)}
              className="gap-2"
            >
              <Download size={16} />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToExcel(entries)}
              className="gap-2"
            >
              <FileSpreadsheet size={16} />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-left text-sm font-semibold">Datum</th>
                <th className="p-3 text-left text-sm font-semibold">Mitarbeiter</th>
                <th className="p-3 text-left text-sm font-semibold">Termin Nr.</th>
                <th className="p-3 text-left text-sm font-semibold">Kunde</th>
                <th className="p-3 text-left text-sm font-semibold">Start</th>
                <th className="p-3 text-left text-sm font-semibold">Ende</th>
                <th className="p-3 text-left text-sm font-semibold">Zeitfenster</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3 text-sm">
                    {format(entry.date, 'dd.MM.yyyy', { locale: de })}
                  </td>
                  <td className="p-3 text-sm font-medium">{entry.employee}</td>
                  <td className="p-3 text-sm text-center">{entry.appointmentNumber}</td>
                  <td className="p-3 text-sm">{entry.customer}</td>
                  <td className="p-3 text-sm font-mono">
                    {format(entry.startTime, 'HH:mm')}
                  </td>
                  <td className="p-3 text-sm font-mono">
                    {format(entry.endTime, 'HH:mm')}
                  </td>
                  <td className="p-3 text-sm font-mono text-muted-foreground">
                    {entry.timeWindow}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Gesamt: {entries.length} Termine
      </CardFooter>
    </Card>
  );
}
