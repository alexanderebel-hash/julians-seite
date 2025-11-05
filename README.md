# Tour Report Manager

Eine moderne Web-App zur Verwaltung und Planung von Tour-Terminen mit automatischer Zeitplanung und Export-Funktionen.

## Features

- **Datei-Upload**: Unterstützt TXT, PDF und Excel (XLSX/XLS) Dateien
- **Automatisches Parsing**: Extrahiert Datum, Mitarbeitername und Termine aus Tour-Reports
- **Intelligente Zeitplanung**:
  - Konfigurierbarer Tourstart (Standard: 09:00)
  - Anpassbare Termindauer (Standard: 60 Min)
  - Zufällige Pausen zwischen Terminen (60-90 Min, konfigurierbar)
  - Optionale 3-Stunden-Zeitfenster
- **Export**: CSV und Excel (XLSX) Export
- **Lokale Verarbeitung**: Alle Daten werden im Browser verarbeitet
- **Responsive Design**: Funktioniert auf Desktop und mobilen Geräten
- **Persistente Einstellungen**: Einstellungen werden im Browser gespeichert

## Tech Stack

- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **TailwindCSS** für Styling
- **pdfjs-dist** für PDF-Parsing
- **xlsx** für Excel-Verarbeitung
- **date-fns** für Datumsoperationen
- **lucide-react** für Icons
- **framer-motion** für Animationen

## Installation

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

3. **Produktions-Build erstellen:**
   ```bash
   npm run build
   ```

4. **Vorschau des Builds:**
   ```bash
   npm run preview
   ```

## Verwendung

### 1. Datei-Format

Die App erkennt Tour-Reports in folgendem Format:

```
Tour – Max Mustermann
Datum: 15.03.24

1. Müller aus Hamburg
2. Schmidt aus Berlin
3. Wagner aus München
```

**Wichtig:**
- Datum im Format: `DD.MM.YY` oder `DD.MM.YYYY`
- Mitarbeitername nach `–` oder `-`
- Termine nummeriert: `1. Kundenname`

### 2. Datei hochladen

- Klicken Sie auf "Datei auswählen" oder ziehen Sie die Datei per Drag & Drop
- Unterstützte Formate: TXT, PDF, XLSX, XLS

### 3. Einstellungen anpassen

Klicken Sie auf den "Einstellungen"-Button, um:
- **Tourstart-Zeit** anzupassen (Standard: 09:00)
- **Termindauer** zu ändern (Standard: 60 Minuten)
- **Pausen-Dauer** zu konfigurieren (Min: 60, Max: 90 Minuten)
- **3-Stunden-Zeitfenster** zu aktivieren/deaktivieren

### 4. Export

Nach dem Upload können Sie die Termine als:
- **CSV** exportieren (für weitere Verarbeitung)
- **Excel** exportieren (formatierte XLSX-Datei)

## Projektstruktur

```
tour-report-app/
├── src/
│   ├── types/
│   │   └── index.ts              # TypeScript-Typen
│   ├── lib/
│   │   ├── parser.ts             # Datei-Parser (TXT/PDF/Excel)
│   │   ├── scheduler.ts          # Zeitplanung-Logik
│   │   └── export.ts             # CSV/Excel-Export
│   ├── components/
│   │   ├── Card.tsx              # Card-Komponente
│   │   ├── Button.tsx            # Button-Komponente
│   │   ├── Input.tsx             # Input-Komponente
│   │   ├── SettingsPanel.tsx    # Einstellungen-Panel
│   │   ├── FileUpload.tsx        # Datei-Upload
│   │   └── AppointmentTable.tsx  # Termin-Tabelle
│   ├── App.tsx                   # Haupt-App
│   ├── main.tsx                  # Entry Point
│   └── index.css                 # Styles
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── index.html
```

## Parsing-Logik

### Datum-Extraktion
Regex: `/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/`
- Erkennt: `15.03.24` oder `15.03.2024`

### Mitarbeiter-Extraktion
Regex: `/(?:–|-)[\s]*([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)*)/`
- Erkennt: `Tour – Max Mustermann` oder `Report - John Doe`

### Termin-Extraktion
Regex: `/(\d+)\.\s+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?)/g`
- Erkennt: `1. Müller aus Hamburg`

## Zeitplanung-Algorithmus

1. Start bei konfigurierter Tourstart-Zeit (z.B. 09:00)
2. Für jeden Termin (außer dem ersten):
   - Zufällige Pause zwischen Min und Max (z.B. 60-90 Min)
3. Termindauer (z.B. 60 Min)
4. Optional: 3-Stunden-Zeitfenster ab Terminstart

**Beispiel:**
```
09:00 - 10:00  Termin 1
[75 Min Pause]
11:15 - 12:15  Termin 2
[82 Min Pause]
13:37 - 14:37  Termin 3
```

## Datenschutz

Alle Daten werden **ausschließlich lokal** im Browser verarbeitet. Es werden keine Daten an externe Server gesendet.

## Browser-Kompatibilität

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Moderne mobile Browser

## Lizenz

MIT License

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue auf GitHub.
