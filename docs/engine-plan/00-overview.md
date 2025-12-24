# 00 - Engine Overview: Pixel Singularity

## Executive Summary

Die **Pixel Singularity Engine** ist eine spezialisierte Idle Game Engine für ein philosophisches Incremental Game, das von einem einzelnen Pixel bis zum Multiversum skaliert. Die Engine muss extreme Zahlenräume (von 1 bis 10^308+), zwei völlig unterschiedliche visuelle Modi und eine tiefgehende Meta-Progression unterstützen.

**Kernziel**: Eine wartbare, erweiterbare Architektur schaffen, die es erlaubt, 20 fundamental unterschiedliche Phasen ohne Code-Spaghetti zu implementieren.

## Design Principles: Die 5 Säulen

### 1. Escalation (Mechanische Tiefe)
Jede Phase fügt neue Mechaniken hinzu, ohne alte obsolet zu machen. Die Engine muss beliebig viele Systeme parallel unterstützen können.

### 2. Emotion (Spielergefühl)
Die Engine reagiert auf Spielerfortschritt mit visuellen/auditiven Feedbacks. Separation zwischen "kalter Logik" (Engine) und "warmer Präsentation" (UI).

### 3. Philosophy (Narrative Integration)
Mechaniken sind nicht abstrakt - sie erzählen die Geschichte des Spiels. Die Engine muss kontextsensitive Texte und Events unterstützen.

### 4. Surprise (Unvorhersehbarkeit)
Die Engine ermöglicht "Einbrüche" - unerwartete Events, die Spielererwartungen brechen (z.B. Glitch-Effekte, UI-Transformationen).

### 5. Agency (Spielerentscheidungen)
Verschiedene Pfade zum Ziel. Die Engine muss alternative Strategien und Builds unterstützen.

## Technology Stack

```
Frontend:  Svelte 5 (Runes: $state, $derived, $effect)
Language:  TypeScript (strict mode)
Numbers:   break_eternity.js (Decimal class für bis zu e308)
Build:     Vite + SvelteKit
Storage:   localStorage (mit Kompression für Save-States)
```

**Warum Svelte 5 Runes?**
- Fine-grained Reactivity ohne manuelles Subscription-Management
- $derived für automatische Berechnungen (z.B. Produktionsraten)
- $effect für Game Loop und Offline-Progression
- Minimaler Overhead für bis zu 100+ parallele Ressourcen

**Warum break_eternity.js?**
- Native Numbers reichen nur bis 10^308 (Number.MAX_VALUE)
- Phase 15+ operiert in e100+ Bereichen
- Performanter als decimal.js (optimiert für Incremental Games)

## High-Level Architecture: Das Manager-Pattern

```
GameInstance (Singleton)
├── ResourceManager     - Verwaltet alle Ressourcen (Pixels, Energy, etc.)
├── UpgradeManager      - Kauft/Aktiviert Upgrades
├── PhaseManager        - Steuert Phasenübergänge
├── ProductionManager   - Berechnet Produktionsraten
├── RebirthManager      - Handhabt Prestige-Mechaniken
├── AchievementManager  - Trackt Erfolge
├── SaveManager         - Speichern/Laden
└── TickManager         - Game Loop (Delta Time)
```

**Vorteile**:
- Jeder Manager hat eine klar definierte Verantwortung
- Manager kommunizieren über die zentrale GameInstance
- Testbar (Mocks für einzelne Manager möglich)
- Erweiterbar (neue Manager für neue Phasen)

**Alternativen erwogen**:
- ECS (Entity Component System): Zu komplex für Idle Game
- Redux-Style Store: Zu viel Boilerplate für TypeScript
- Reactive Streams (RxJS): Overkill, Svelte Runes reichen

## Verzeichnisstruktur

```
src/lib/engine/
├── core/
│   ├── GameInstance.ts          - Singleton, hält alle Manager
│   ├── TickManager.ts            - Game Loop (requestAnimationFrame)
│   └── SaveManager.ts            - localStorage + Kompression
│
├── systems/
│   ├── ResourceManager.ts        - Ressourcen-CRUD
│   ├── ProductionManager.ts      - Rate-Berechnungen
│   ├── UpgradeManager.ts         - Upgrade-Logik
│   ├── PhaseManager.ts           - Phasenübergänge
│   ├── RebirthManager.ts         - Prestige-Mechaniken
│   └── AchievementManager.ts     - Achievement-Tracking
│
├── models/
│   ├── Resource.ts               - interface Resource { id, amount, ... }
│   ├── Upgrade.ts                - interface Upgrade { id, cost, effect, ... }
│   ├── Phase.ts                  - interface Phase { id, unlockCondition, ... }
│   └── GameState.ts              - RunState + EternalState
│
├── data/
│   ├── phases.ts                 - Phasen-Definitionen (1-20)
│   ├── upgrades/                 - Upgrades pro Phase
│   ├── resources.ts              - Ressourcen-Definitionen
│   └── achievements.ts           - Achievement-Definitionen
│
└── utils/
    ├── DecimalHelpers.ts         - Wrapper um break_eternity.js
    ├── OfflineProgress.ts        - Offline-Zeit-Berechnung
    └── Validators.ts             - Save-State-Validierung
```

**Philosophie**:
- `/core` = Engine-Fundament (selten geändert)
- `/systems` = Gameplay-Logik (häufig erweitert)
- `/models` = TypeScript Interfaces (Datenstruktur)
- `/data` = Spielinhalte (HIER wird designed, nicht im Code!)
- `/utils` = Hilfsfunktionen (stateless)

## Die zwei visuellen Modi

### PIXEL MODE (Phase 1-10)
**Visuelle Sprache**: Konkret, pixelbasiert, Retro-Ästhetik
- Phase 1: Ein Pixel auf schwarzem Hintergrund
- Phase 5: Pixelcluster mit Animationen
- Phase 10: Komplexe Pixel-Maschinen

**Engine-Anforderung**: Canvas-Rendering für bis zu 10.000 animierte Pixel

### ABSTRACT MODE (Phase 11-20)
**Visuelle Sprache**: Abstrakt, mathematisch, kosmisch
- Phase 11: Fraktale und mathematische Muster
- Phase 15: Dimensionale Visualisierungen
- Phase 20: Multiversum-Diagramme

**Engine-Anforderung**: WebGL/Three.js für 3D-Visualisierungen

**Warum zwei Modi?**
- Phase 1-10: Spieler braucht greifbare Fortschrittsgefühle
- Phase 11-20: Zahlen werden zu groß für "echte" Darstellung
- Narrativer Twist: Der Übergang von konkret → abstrakt spiegelt die Story wider

## Core Loops

### Micro Loop (Sekunden)
1. Klicke Pixel → Erzeuge Ressourcen
2. Sehe Zahl steigen → Dopamin
3. Kaufe Upgrade → Zahl steigt schneller

**Engine**: TickManager mit 60 FPS, $derived für automatische Rate-Updates

### Macro Loop (Minuten)
1. Sammle genug für Phasenübergang
2. Neue Mechanik wird freigeschaltet
3. Lerne neue Mechanik → Zurück zu Micro Loop

**Engine**: PhaseManager mit Unlock-Conditions, Event-System für UI-Notifications

### Meta Loop (Stunden/Tage)
1. Erreiche Rebirth-Schwelle
2. Reset mit permanenten Boni
3. Schnellerer Durchlauf → Nächster Rebirth

**Engine**: RebirthManager mit Eternal-State, Offline-Progression-Berechnung

### Transcendent Loop (Wochen)
1. Entdecke versteckte Mechaniken
2. Achievements schalten neue Pfade frei
3. Experimentiere mit alternativen Strategien

**Engine**: AchievementManager mit Conditional-Unlocks, Feature-Flags

## State Management Konzept

### Run State (Bei Rebirth gelöscht)
```typescript
interface RunState {
  resources: Map<string, Decimal>      // Pixels, Energy, Matter...
  upgrades: Set<string>                 // Gekaufte Upgrades
  currentPhase: number                  // 1-20
  runtime: number                       // Sekunden in diesem Run
}
```

### Eternal State (Überlebt Rebirth)
```typescript
interface EternalState {
  totalRebirths: number
  eternalUpgrades: Set<string>          // Meta-Upgrades
  achievements: Set<string>
  statistics: {
    totalPixelsGenerated: Decimal
    fastestRunTime: number
    // ...
  }
}
```

**Separations-Regel**:
- RunState → Alles, was sich "zurücksetzen anfühlt"
- EternalState → Alles, was "Fortschritt über Runs" repräsentiert

**Technische Umsetzung**:
- Zwei separate Svelte $state() Objekte
- RebirthManager.reset() löscht nur RunState
- SaveManager serialisiert beide unabhängig

## Performance-Ziele

| Metrik | Ziel | Begründung |
|--------|------|------------|
| Game Loop | 60 FPS | Flüssige Animationen im Pixel Mode |
| Save Time | <100ms | Nicht-blockierendes Auto-Save alle 10s |
| Load Time | <500ms | Schneller App-Start |
| Offline Calc | <2s | Auch nach Wochen-Pause |
| Memory | <50MB | Mobile-Browser-Kompatibilität |

**Kritische Optimierungen**:
- Lazy-Loading für Phase-spezifische Systeme
- Object Pooling für Pixel-Entitäten (Canvas Mode)
- Memoization für teure Berechnungen ($derived Caching)

## Integration mit UI

**Engine = Dumb, UI = Smart**
```
Engine:  Verwaltet Zahlen, Logik, State
UI:      Interpretiert State, zeigt Feedback, Animationen
```

**Anti-Pattern vermeiden**:
❌ Engine enthält `showNotification()` Logik
✅ Engine emitted Event → UI entscheidet, ob/wie Notification

**Event-System**:
```typescript
GameInstance.on('phaseUnlocked', (phase) => {
  // UI entscheidet: Konfetti? Sound? Modal?
})
```

## Referenzen zu anderen Dokumenten

- **01-core-systems.md** - Detaillierte Manager-Implementierungen
- **02-resource-system.md** - Ressourcen-Datenmodell, Produktionsberechnung
- **03-upgrade-system.md** - Upgrade-Trees, Conditional-Unlocks
- **04-phase-progression.md** - Phasenübergänge, Unlock-Logic
- **05-rebirth-system.md** - Prestige-Mechaniken, Eternal-Upgrades
- **06-offline-progression.md** - Offline-Zeit-Berechnung, Fairness
- **07-save-system.md** - Serialisierung, Versionierung, Migration
- **08-number-handling.md** - break_eternity.js Best Practices
- **09-testing-strategy.md** - Unit Tests, Integration Tests, Balance Tests

## Nächste Schritte

1. **Dokumentation vervollständigen** (01-09 schreiben)
2. **Prototyp Phase 1-3** - Validierung der Architektur
3. **Performance-Profiling** - Frühe Bottleneck-Erkennung
4. **Daten-Schema finalisieren** - `/data` Strukturen definieren

---

**Letzte Aktualisierung**: 2025-12-24
**Version**: 0.1.0 (Initialplanung)
