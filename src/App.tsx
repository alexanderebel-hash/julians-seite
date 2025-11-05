import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { AppointmentTable } from './components/AppointmentTable';
import { SettingsPanel } from './components/SettingsPanel';
import { parseFile } from './lib/parser';
import { scheduleAllTours } from './lib/scheduler';
import { TourEntry, AppSettings, DEFAULT_SETTINGS } from './types';

const SETTINGS_KEY = 'tour-report-settings';

function App() {
  const [entries, setEntries] = useState<TourEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));

    // Reprocess entries with new settings if we have data
    if (entries.length > 0) {
      // We need to store the parsed data to reprocess, for now just keep entries as-is
      // In a more sophisticated implementation, we'd store the parsed data separately
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Parse the file
      const parsedData = await parseFile(file);

      if (parsedData.length === 0) {
        alert('Keine gültigen Tour-Daten in der Datei gefunden.');
        return;
      }

      // Schedule tours based on parsed data and current settings
      const scheduledEntries = scheduleAllTours(parsedData, settings);
      setEntries(scheduledEntries);
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                <Calendar size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Tour Report Manager</h1>
                <p className="text-sm text-muted-foreground">
                  Termine planen und exportieren
                </p>
              </div>
            </div>
            <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* File Upload */}
          <FileUpload onFileUpload={handleFileUpload} />

          {/* Appointment Table */}
          <AppointmentTable entries={entries} />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Alle Daten werden lokal in Ihrem Browser verarbeitet.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
