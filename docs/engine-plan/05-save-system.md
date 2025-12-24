# Save System

## Übersicht

Das Save-System von Pixel Singularity verwendet eine **Two-Layer Architektur**, die zwischen vergänglichem Run State und permanentem Eternal State unterscheidet.

### Kernprinzipien
- **Run State**: Wird bei jedem Rebirth zurückgesetzt (aktueller Fortschritt)
- **Eternal State**: Bleibt für immer erhalten (Meta-Progression)
- **Offline Progression**: Spieler erhalten Dream Pixels für Zeit offline
- **Auto-Save**: Automatisches Speichern alle 30 Sekunden
- **Import/Export**: Backup-Funktionalität für Save-Daten

---

## SaveSystem Design

### Hauptklasse
```typescript
class SaveSystem {
  save(): void
  load(): SaveData | null
  autoSaveEnabled: boolean
  lastSaveTimestamp: number
}
```

### LocalStorage Keys
- `pixelsingularity_save` - Hauptspeicher
- `pixelsingularity_settings` - Einstellungen
- `pixelsingularity_backup` - Automatisches Backup (vor Rebirth)

### Serialization
BigNumber-Werte müssen für JSON serialisiert werden:
- **Speichern**: `BigNumber.toString()` → String
- **Laden**: `new BigNumber(string)` → BigNumber
- Alle numerischen Werte (Pixels, Conversions, etc.) durchlaufen Serializer

---

## Save Data Structure

### Version System
```typescript
interface SaveData {
  version: string // z.B. "1.0.0"
  lastPlayed: number // Unix Timestamp
  runData: RunData
  eternalData: EternalData
  settings: SettingsData
}
```

### RunData Interface
Wird bei Rebirth gelöscht:
```typescript
interface RunData {
  currentPhase: number
  pixels: string // BigNumber serialisiert
  conversions: number
  choiceHistory: ChoiceRecord[]
  playTime: number // Sekunden im aktuellen Run
  phaseProgress: Record<number, PhaseProgress>
}
```

### EternalData Interface
Bleibt permanent erhalten:
```typescript
interface EternalData {
  primordialPixels: string // Meta-Currency
  totalRebirths: number
  completedEndings: string[] // Ending-IDs
  achievements: string[] // Achievement-IDs
  skillTree: SkillTreeData
  memories: MemoryData[]
  statistics: GlobalStatistics
}
```

### SettingsData Interface
```typescript
interface SettingsData {
  audioEnabled: boolean
  musicVolume: number
  sfxVolume: number
  autoSaveInterval: number
  theme: 'light' | 'dark' | 'auto'
  language: string
}
```

---

## Auto-Save Strategie

### Trigger-Punkte
1. **Interval-basiert**: Alle 30 Sekunden (konfigurierbar)
2. **Tab-Wechsel**: Bei `visibilitychange` Event
3. **Kritische Momente**:
   - Vor Phasenwechsel
   - Nach Conversion
   - Nach Choice-Selektion
   - Vor Rebirth
4. **Manuell**: Save-Button in Settings

### Implementierung
```typescript
// Auto-Save Timer
setInterval(() => saveSystem.save(), 30000)

// Visibility Change Handler
document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveSystem.save()
})
```

### Performance
- Throttling bei häufigen Saves (max 1x pro Sekunde)
- Dirty-Flag: Nur speichern wenn Änderungen vorhanden
- Kompression für große Save-Daten (optional)

---

## Offline Progression

### Konzept
Spieler erhalten **Dream Pixels** für Zeit, die sie offline verbringen. Dies belohnt regelmäßige Rückkehr ohne aktives Spielen zu erzwingen.

### Berechnung
```typescript
calculateOfflineProgress(deltaTime: number): OfflineReward {
  // deltaTime in Sekunden
  const hours = deltaTime / 3600

  // Formel: 10% der aktuellen Pixel-Rate pro Stunde
  const baseRate = calculateCurrentPixelRate()
  const dreamPixels = baseRate * 0.1 * hours

  // Cap bei 8 Stunden (optimale Session-Länge)
  const cappedHours = Math.min(hours, 8)

  return {
    dreamPixels: dreamPixels * cappedHours,
    timeAway: deltaTime,
    bonus: cappedHours >= 8 ? 'Full Rest Bonus' : null
  }
}
```

### Timestamp Handling
- `lastPlayedAt` wird bei jedem Save aktualisiert
- Beim Load: `deltaTime = Date.now() - lastPlayedAt`
- Minimum 60 Sekunden für Offline-Bonus (verhindert Exploit)

### Präsentation
Zeige beim Laden eine Welcome-Back-Message mit:
- Zeit abwesend
- Erhaltene Dream Pixels
- Optional: Kurze Zusammenfassung was sich geändert hat

---

## Rebirth Handling

### Ablauf
1. **Backup erstellen**: Save aktuellen State als Backup
2. **Berechne Primordial Pixels**: Basierend auf Fortschritt
3. **Reset Run State**: Lösche alle temporären Daten
4. **Preserve Eternal State**: Behalte Meta-Progression
5. **Speichere neuen State**: Save nach Rebirth

### Primordial Pixel Berechnung
```typescript
calculatePrimordialPixels(runData: RunData): BigNumber {
  const baseReward = runData.currentPhase >= 10
    ? new BigNumber(10)
    : new BigNumber(0)

  // Bonus für hohe Phase
  const phaseBonus = Math.max(0, runData.currentPhase - 10) * 2

  // Bonus für Conversions
  const conversionBonus = Math.floor(runData.conversions / 100)

  return baseReward.plus(phaseBonus).plus(conversionBonus)
}
```

### Reset Run State
```typescript
resetRunState(): RunData {
  return {
    currentPhase: 1,
    pixels: "0",
    conversions: 0,
    choiceHistory: [],
    playTime: 0,
    phaseProgress: {}
  }
}
```

### Preserve Eternal State
```typescript
preserveEternalState(current: EternalData, reward: BigNumber): EternalData {
  return {
    ...current,
    primordialPixels: new BigNumber(current.primordialPixels).plus(reward).toString(),
    totalRebirths: current.totalRebirths + 1
  }
}
```

---

## Data Migration

### Version-basierte Migrations
Bei Änderungen am Save-Format müssen alte Saves migriert werden:

```typescript
migrations: {
  "1.0.0": (data: any) => data, // Initial version
  "1.1.0": (data: any) => {
    // Füge neues Feld hinzu
    if (!data.eternalData.memories) {
      data.eternalData.memories = []
    }
    return data
  },
  "1.2.0": (data: any) => {
    // Ändere Structure
    data.settings.language = data.settings.lang || 'en'
    delete data.settings.lang
    return data
  }
}
```

### Migration Workflow
1. Lade Save-Daten
2. Prüfe `version` Feld
3. Wende alle Migrations zwischen alter und neuer Version an
4. Speichere mit aktueller Version

### Fallbacks
Für fehlende oder korrupte Felder:
```typescript
function sanitizeSaveData(data: any): SaveData {
  return {
    version: data.version || "1.0.0",
    lastPlayed: data.lastPlayed || Date.now(),
    runData: data.runData || getDefaultRunData(),
    eternalData: data.eternalData || getDefaultEternalData(),
    settings: data.settings || getDefaultSettings()
  }
}
```

---

## Import/Export

### Export Funktion
Generiere einen Base64-kodierten String der Save-Daten:

```typescript
exportSave(): string {
  const saveData = this.save()
  const json = JSON.stringify(saveData)
  return btoa(json) // Base64 encoding
}
```

### Import Funktion
Lade Save-Daten aus Base64-String:

```typescript
importSave(saveString: string): boolean {
  try {
    const json = atob(saveString)
    const data = JSON.parse(json)

    // Validierung
    if (!this.validateSaveData(data)) {
      throw new Error("Invalid save data")
    }

    // Migration falls nötig
    const migrated = this.migrateData(data)

    // Speichere importierte Daten
    localStorage.setItem('pixelsingularity_save', JSON.stringify(migrated))

    return true
  } catch (error) {
    console.error("Import failed:", error)
    return false
  }
}
```

### Use Cases
- **Backup**: Spieler können Save exportieren und lokal speichern
- **Cloud Sync**: Export/Import für manuellen Cross-Device Transfer
- **Sharing**: Teilen von interessanten Save-States (z.B. für Speedruns)

---

## Hard Reset

### Funktionalität
Komplettes Löschen aller Save-Daten (Run State + Eternal State).

### Confirmation Flow
```typescript
confirmHardReset(): void {
  // Zeige Warning Dialog
  const confirmed = confirm(
    "WARNUNG: Dies löscht ALLE Daten permanent!\n" +
    "Primordial Pixels, Achievements, alles.\n" +
    "Bist du sicher?"
  )

  if (!confirmed) return

  // Zweite Confirmation
  const reallyConfirmed = prompt(
    "Tippe 'DELETE' um zu bestätigen:"
  ) === "DELETE"

  if (reallyConfirmed) {
    this.hardReset()
  }
}
```

### Implementation
```typescript
hardReset(): void {
  // Erstelle finales Backup (für 24h)
  const backup = localStorage.getItem('pixelsingularity_save')
  localStorage.setItem('pixelsingularity_emergency_backup', backup)
  localStorage.setItem('pixelsingularity_backup_timestamp', Date.now().toString())

  // Lösche alle Daten
  localStorage.removeItem('pixelsingularity_save')
  localStorage.removeItem('pixelsingularity_settings')
  localStorage.removeItem('pixelsingularity_backup')

  // Reload Page
  window.location.reload()
}
```

### Emergency Recovery
24-Stunden-Fenster für versehentliche Resets:
- Backup bleibt 24h in `emergency_backup` Key
- Settings-Menü zeigt "Recover Last Reset" Option
- Nach 24h wird Backup automatisch gelöscht

---

## Technische Details

### Error Handling
- Try-Catch um alle Save/Load Operationen
- Fallback zu Default-State bei korrupten Daten
- User-Notification bei Save-Fehlern

### Testing
- Unit Tests für Serialization/Deserialization
- Migration Tests für jede Version
- Offline Progression Kalkulationen

### Security
- Validierung aller importierten Daten
- Sanity Checks (z.B. keine negativen Pixels)
- Rate Limiting für Import (verhindert Spam)

### Browser Compatibility
- LocalStorage Support Check
- Fallback zu in-Memory Save (Session-only)
- Cookie-basierter Fallback für alte Browser
