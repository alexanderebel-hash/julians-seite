import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';
import { Input, Label } from './Input';
import { AppSettings, DEFAULT_SETTINGS } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
    onSettingsChange(DEFAULT_SETTINGS);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="default"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Settings size={18} />
        Einstellungen
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 z-50 w-96"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Einstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tourStartTime">Tourstart-Zeit</Label>
                  <Input
                    id="tourStartTime"
                    type="time"
                    value={localSettings.tourStartTime}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, tourStartTime: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentDuration">Termindauer (Minuten)</Label>
                  <Input
                    id="appointmentDuration"
                    type="number"
                    min="15"
                    max="240"
                    step="15"
                    value={localSettings.appointmentDuration}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        appointmentDuration: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pauseMin">Minimale Pause (Minuten)</Label>
                  <Input
                    id="pauseMin"
                    type="number"
                    min="0"
                    max="180"
                    step="5"
                    value={localSettings.pauseMin}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        pauseMin: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pauseMax">Maximale Pause (Minuten)</Label>
                  <Input
                    id="pauseMax"
                    type="number"
                    min="0"
                    max="180"
                    step="5"
                    value={localSettings.pauseMax}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        pauseMax: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="enableTimeWindow"
                    type="checkbox"
                    checked={localSettings.enableTimeWindow}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        enableTimeWindow: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <Label htmlFor="enableTimeWindow" className="cursor-pointer">
                    3-Stunden-Zeitfenster aktivieren
                  </Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    Speichern
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="flex-1">
                    Zurücksetzen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
