# Beispiel-Daten für Tour Report Manager

Diese Beispieldateien können zum Testen der Tour Report App verwendet werden.

## Verfügbare Test-Dateien

### Julian's Tour Reports (Reale Daten)
- **report-julian-21-03-2024.txt** - 4 Termine am 21.03.2024 in Dinslaken
- **report-julian-01-03-2024.txt** - 5 Termine am 01.03.2024 in Hünxe
- **report-julian-15-03-2024.txt** - 4 Termine am 15.03.2024 in Voerde

### Demo-Daten
- **tour-report-beispiel.txt** - Max Mustermann, 5 Termine am 15.03.24
- **tour-report-maria.txt** - Maria Weber, 7 Termine am 12.11.24

## Verwendung

1. Starten Sie die Tour Report App: `npm run dev`
2. Öffnen Sie http://localhost:5174/
3. Laden Sie eine der Beispieldateien hoch (per Drag & Drop oder Button)
4. Die App zeigt automatisch die geplanten Termine mit Zeitfenstern

## Erwartetes Ergebnis

Nach dem Upload einer Datei sollte die App:
- Das Datum korrekt extrahieren (z.B. 21.03.2024)
- Den Mitarbeiternamen identifizieren (z.B. "Julian")
- Alle nummerierten Termine erfassen
- Zeitplanung erstellen (Start 09:00, 60 Min pro Termin, 60-90 Min Pausen)
- Termine in der Tabelle anzeigen
- Export als CSV/Excel ermöglichen

## Format-Anforderungen

Die TXT-Dateien folgen diesem Format:
```
Report - [Mitarbeitername]
Datum: [DD.MM.YYYY oder DD.MM.YY]

1. [Kundenname] aus [Ort]
2. [Kundenname] aus [Ort]
...
```

## Hinweise

- Original-Reports von Julian enthalten detaillierte Notizen, die beim Parsing ignoriert werden
- Die App extrahiert nur Datum, Mitarbeiter und nummerierte Kundenliste
- Für Steuerdokumentation werden die Zeiten automatisch berechnet
