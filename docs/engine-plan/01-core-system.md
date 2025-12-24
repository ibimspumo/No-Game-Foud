# Core System - Das Herz der Engine

## Übersicht

Das Core System bildet das Fundament der "Pixel Singularity" Engine. Es orchestriert alle Sub-Systeme, verwaltet den Game Loop und ermöglicht die Kommunikation zwischen Komponenten über ein Event-basiertes Pub/Sub-System.

**Verantwortlichkeiten:**
- Initialisierung und Koordination aller Manager (Resource, Phase, Automation, Story, etc.)
- Zentrale Tick-Verarbeitung für konsistente Game-Updates
- Event-basierte Kommunikation zwischen Systemen
- Lifecycle-Management (Start, Pause, Save, Rebirth, Reset)

**Warum diese Architektur?**
- Entkopplung: Manager kommunizieren über Events, nicht direkt
- Erweiterbarkeit: Neue Manager lassen sich einfach hinzufügen
- Testbarkeit: Jeder Manager kann isoliert getestet werden
- Performance: Zentrale Tick-Kontrolle ermöglicht Optimierungen

---

## Game.ts Architektur

### Singleton vs. Context-Pattern

**Empfehlung: Context-basiert (SvelteKit-freundlich)**
- Svelte Stores für reaktive State-Verwaltung
- Keine globalen Singletons, sondern Context API
- Server-Side Rendering kompatibel
- Besseres Tree-Shaking

```typescript
// Vereinfachtes Konzept
class Game {
  private managers: Map<string, Manager>
  private eventManager: EventManager
  private gameLoop: GameLoop
}
```

### Sub-System Initialisierung

**Reihenfolge ist kritisch:**
1. EventManager (zuerst - alle anderen brauchen ihn)
2. SaveManager (lädt gespeicherte Daten)
3. ResourceManager (Core-Ressourcen Setup)
4. PhaseManager (Phasen-State wiederherstellen)
5. AutomationManager, StoryManager, etc.
6. GameLoop (zuletzt - startet die Tick-Verarbeitung)

**Warum diese Reihenfolge?**
- Events müssen verfügbar sein, bevor Manager kommunizieren
- Save-Daten müssen geladen sein, bevor State wiederhergestellt wird
- Abhängigkeiten werden von unten nach oben aufgebaut
- Loop startet erst, wenn alle Systeme bereit sind

### Tick-Methode und Update-Reihenfolge

Die `tick(deltaTime)` Methode ist der Herzschlag der Engine. Sie wird vom GameLoop aufgerufen und orchestriert alle Updates.

**Update-Reihenfolge pro Tick:**
1. PhaseManager.tick() - Prüft Phase-Transitions
2. ResourceManager.tick() - Generiert Ressourcen (Produktion)
3. AutomationManager.tick() - Führt automatische Aktionen aus
4. StoryManager.tick() - Prüft Story-Trigger
5. AchievementManager.tick() - Prüft Achievement-Bedingungen
6. UIManager.tick() - Aktualisiert UI (falls nötig)

**Warum diese Reihenfolge?**
- Phasen-Wechsel können Produktions-Raten ändern → muss zuerst passieren
- Ressourcen-Generierung muss vor Automation, damit Automation aktuelle Werte sieht
- Story und Achievements reagieren auf Game-State → am Ende prüfen

### init() Flow

Der Initialisierungs-Flow ist komplex, da er Offline-Progression berechnen muss.

**Schritte:**
1. **Load Save** - SaveManager lädt persistierten State
2. **Restore State** - Jeder Manager restauriert seinen State
3. **Calculate Offline** - Berechne Zeit seit letztem Save × Produktions-Rate
4. **Apply Offline Gains** - Füge Offline-Ressourcen hinzu (Event: offline_gains_calculated)
5. **Validate State** - Prüfe auf inkonsistente Daten (z.B. Phase nicht erreichbar)
6. **Start Loop** - GameLoop.start()

**Offline-Berechnung:**
- Max Offline-Zeit: 24 Stunden (verhindert Exploits)
- Reduzierte Effizienz: 50% der normalen Produktions-Rate
- Keine Story-Progression offline
- Keine Automation-Käufe offline

---

## GameLoop.ts Design

### DeltaTime-Berechnung

```typescript
let lastTime = performance.now()
function loop(currentTime: number) {
  const deltaTime = (currentTime - lastTime) / 1000 // Sekunden
  lastTime = currentTime
  game.tick(Math.min(deltaTime, 0.1)) // Cap bei 100ms
}
```

**Warum DeltaTime cappen?**
- Verhindert "Zeitsprünge" bei Tab-Wechsel oder Lag-Spikes
- Große Deltas können zu instabilen Berechnungen führen
- Echte Offline-Zeit wird separat in init() behandelt

### Tick-Rate

**Empfehlung: 20 Ticks/Sekunde (50ms pro Tick)**

**Vorteile:**
- Balance zwischen Performance und Reaktivität
- Smooth genug für UI-Updates
- Nicht zu CPU-intensiv für Idle Game
- Erlaubt präzise Zeitberechnungen (50ms ist saubere Zahl)

**Alternativen:**
- 10 tps (100ms): Besser für Performance, aber UI fühlt sich träge an
- 30 tps (33ms): Smoother, aber unnötig für Idle-Mechaniken
- Variable Rate: Komplex, schwer zu debuggen

### Tab-Visibility Handling

**Problem:** Browser drosseln `requestAnimationFrame` in inaktiven Tabs (1 fps statt 60 fps).

**Lösung:**
```typescript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gameLoop.pause()
    saveManager.save() // Auto-save beim Tab-Wechsel
  } else {
    saveManager.load()
    calculateOfflineProgress()
    gameLoop.resume()
  }
})
```

**Warum so?**
- Spart CPU in inaktiven Tabs
- Nutzt bestehende Offline-Logik für Tab-Wechsel
- Auto-save verhindert Datenverlust

### Pause-Mechanik

**Use Cases:**
- Story-Momente (Text soll in Ruhe gelesen werden)
- Menüs/Modals (z.B. Rebirth-Bestätigung)
- Manual Pause (falls User-Option)

**Implementation:**
- `GameLoop.pause()` stoppt `requestAnimationFrame`
- `GameLoop.resume()` startet mit neuem Timestamp (kein Delta-Sprung)
- Events: `game_paused`, `game_resumed` für UI-Feedback

---

## EventManager.ts Pattern

### Event-Types Definition

Zentrale Event-Registry für type-safe Events:

**Core Events:**
- `game_initialized` - Engine fertig geladen
- `game_paused` / `game_resumed` - Loop-Zustand
- `tick` - Jeder Frame (für Debug/Stats)

**Phase Events:**
- `phase_unlocked` - Neue Phase verfügbar
- `phase_entered` - Wechsel zu neuer Phase
- `phase_requirements_checked` - Für UI-Updates

**Resource Events:**
- `resource_changed` - Ressourcen-Menge geändert
- `resource_unlocked` - Neue Ressource verfügbar
- `production_changed` - Produktions-Rate geändert

**Progression Events:**
- `achievement_unlocked`
- `rebirth_started` / `rebirth_completed`
- `offline_gains_calculated`

**Story Events:**
- `story_triggered` - Neuer Story-Moment
- `story_completed` - Story-Text gelesen
- `tutorial_step_completed`

### Subscribe/Publish Mechanismus

**Simple, typsichere Implementation:**
```typescript
type EventCallback<T> = (data: T) => void
private listeners = new Map<string, Set<EventCallback<any>>>()

subscribe<T>(event: string, callback: EventCallback<T>) {
  // Fügt Listener hinzu, gibt Unsubscribe-Funktion zurück
}

publish<T>(event: string, data: T) {
  // Ruft alle Listener auf
}
```

**Best Practices:**
- Events sind immutable (keine Payload-Mutation)
- Listener dürfen keine langen Operations ausführen (Async verwenden)
- Listener werden in Registrierungs-Reihenfolge aufgerufen
- Unsubscribe wird automatisch bei Manager-Cleanup aufgerufen

### Cleanup bei Rebirth

**Problem:** Events können "alte" Listener behalten, die nach Rebirth nicht mehr relevant sind.

**Lösung:**
- Jeder Manager speichert seine Subscriptions
- Bei Rebirth: Manager.reset() ruft alle Unsubscribe-Funktionen auf
- Neue Subscriptions werden in Manager.init() registriert

**Wichtig:** Nicht alle Events werden bei Rebirth gecleart (z.B. UI-Listener bleiben)

---

## Manager Kommunikation

### Grundprinzip: Loose Coupling

Manager kommunizieren **nur** über Events, nie direkt.

**Anti-Pattern (vermeiden):**
```typescript
// SCHLECHT: Direkter Zugriff
resourceManager.addResource('pixels', 100)
```

**Best Practice:**
```typescript
// GUT: Event-basiert
eventManager.publish('automation_buy_attempt', {
  buyerId: 'pixel-clicker',
  cost: { pixels: 10 }
})
// ResourceManager hört auf automation_buy_attempt und verarbeitet
```

**Vorteile:**
- Manager können ausgetauscht werden ohne Code-Änderungen
- Einfacher zu testen (Mock-Events statt Mock-Manager)
- Klare Daten-Flows sichtbar durch Event-Log

### Ausnahmen für direkte Kommunikation

**Game → Manager:** Erlaubt für `tick()` Aufrufe
- Game koordiniert Update-Reihenfolge
- Alternativen wären zu komplex

**Manager → EventManager:** Natürlich erlaubt
- EventManager ist Infrastructure, keine Business-Logic

**Getter für Read-Only State:** Erlaubt in speziellen Fällen
- Z.B. `ResourceManager.getAmount('pixels')` für UI
- Nur lesen, nie schreiben
- Events bleiben primäre Kommunikation

---

## Lifecycle

### Start

1. `Game.create()` - Instanziiert alle Manager
2. `Game.init()` - Load Save → Calculate Offline → Start Loop
3. Event: `game_initialized`
4. UI zeigt Haupt-Screen

### Pause / Resume

**Pause:**
- `GameLoop.pause()` stoppt Ticks
- Event: `game_paused`
- UI zeigt Pause-Indikator

**Resume:**
- Optional: Mini-Offline-Berechnung (falls pausiert > 1 Sekunde)
- `GameLoop.resume()` startet Ticks
- Event: `game_resumed`

### Save

**Auto-Save Trigger:**
- Alle 30 Sekunden (Timer)
- Bei Tab-Wechsel (visibilitychange)
- Vor Rebirth
- Bei kritischen Actions (z.B. große Käufe)

**Save-Flow:**
1. `SaveManager.save()` sammelt State von allen Managern
2. Serialize zu JSON
3. Schreibe in LocalStorage (+ optional Cloud-Backup)
4. Event: `game_saved` (für UI-Feedback)

### Rebirth

Der komplexeste Lifecycle-Schritt.

**Flow:**
1. User klickt "Rebirth" → UI zeigt Bestätigung
2. `GameLoop.pause()` - Stoppt alle Updates
3. `RebirthManager.calculateGains()` - Zeigt Preview
4. User bestätigt → Event: `rebirth_started`
5. `SaveManager.save()` - Backup vor Reset
6. Jeder Manager: `reset()` - Löscht transienten State
7. `ResourceManager.applyRebirthBonus()` - Meta-Progression
8. `Game.init()` - Restart (ohne Save-Load)
9. Event: `rebirth_completed`
10. `GameLoop.resume()`

**Was bleibt nach Rebirth:**
- Meta-Währung (Singularity Points)
- Permanente Upgrades
- Achievements
- Story-Progress (optional: Unlock-Flags)

**Was resettet:**
- Alle Ressourcen (außer Meta)
- Aktuelle Phase → zurück zu Phase 1
- Automation-Käufe
- Temporäre Boosts

### Hard Reset

**User-Option für kompletten Neustart:**
1. `SaveManager.deleteSave()`
2. `location.reload()` - Kompletter Page-Reload

**Keine partielle Reset-Logik:**
- Zu fehleranfällig
- Reload ist sauberer und sicherer

---

## Performance-Überlegungen

### Tick-Optimierung

**Problem:** 20 tps × 10+ Manager = 200+ Funktions-Aufrufe/Sekunde

**Lösungen:**
- **Early Exit:** Manager prüfen "hat sich was geändert?" vor teuren Ops
- **Dirty Flags:** Nur updaten wenn State changed
- **Batch Events:** Ressourcen-Änderungen sammeln, 1× pro Tick publishen statt N×

### Event-Overhead

**Problem:** Zu viele Events können CPU belasten

**Lösungen:**
- **Throttling:** `resource_changed` nur alle 100ms publishen, nicht jeden Tick
- **Event-Batching:** Sammle mehrere Changes, sende als Array
- **Selective Subscription:** UI subscribt nur zu sichtbaren Ressourcen

### Memory Management

**Problem:** Event-Listener können Memory-Leaks verursachen

**Lösungen:**
- **Unsubscribe-Cleanup:** Jede Subscription wird in Manager gespeichert und bei Destroy entfernt
- **WeakMap für Listener:** Falls referenzierte Objekte GC'd werden
- **Periodic Cleanup:** Alle 1000 Ticks prüfen auf tote Listener

---

## Debug-Tools

### Event-Logger

Für Development-Mode: Log alle Events mit Timestamp und Payload.

**Nutzen:**
- Sehe Event-Flow in Echtzeit
- Debug Race-Conditions
- Verstehe Manager-Interaktionen

### Performance-Monitor

Track pro Tick:
- Zeit pro Manager-Update
- Anzahl publizierte Events
- Frame-Time (sollte < 50ms sein für 20 tps)

**Warnung bei:**
- Manager-Update > 10ms
- Frame-Time > 60ms (Lag-Spike)
- Event-Count > 100/Tick

### State-Inspector

UI-Tool (Debug-Menü) um aktuellen State zu sehen:
- Alle Ressourcen mit Werten
- Aktive Phase
- Unlocked Features
- Event-Listener Count

---

## Testing-Strategie

### Unit-Tests für Manager

Jeder Manager isoliert testbar:
```typescript
const mockEvents = new MockEventManager()
const resourceMgr = new ResourceManager(mockEvents)
resourceMgr.init()
// Assert: resource_unlocked Events wurden gefeuert
```

### Integration-Tests für Game

Test komplette Flows:
- Init → Tick 100× → Check Resource-Amounts
- Rebirth → Check State Reset
- Save → Load → Check State-Gleichheit

### Performance-Tests

Benchmark kritische Pfade:
- 1000 Ticks durchlaufen < 1 Sekunde
- Offline-Berechnung für 24h < 100ms
- Save/Load < 50ms

---

## Zusammenfassung

Das Core System ist das Rückgrat der Engine. Es:
- **Orchestriert** alle Sub-Systeme über eine zentrale Tick-Schleife
- **Entkoppelt** Manager via Event-System für Flexibilität
- **Verwaltet** komplexe Lifecycles (Offline, Rebirth, Save/Load)
- **Optimiert** für Performance durch Batching und Dirty-Checking

**Nächste Schritte:**
- `02-resource-system.md` für Ressourcen-Verwaltung
- `03-phase-system.md` für 20-Phasen Progression
- `04-automation-system.md` für Idle-Mechaniken
