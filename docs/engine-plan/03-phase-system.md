# Phase System - Pixel Singularity

## Übersicht

Das Phase System ist die zentrale State Machine des Spiels. Es orchestriert den Übergang durch 20 aufeinanderfolgende Phasen - von einem einzelnen Pixel bis zur Meta-Ebene des Spielers selbst.

**Kernkonzept**: Jede Phase ist eine eigenständige Welt mit eigenen Ressourcen, Upgrades, Story-Events und visuellen Styles. Der Spieler durchläuft einen evolutionären Bogen vom Konkreten (Pixel) zum Abstrakten (Void) bis zum Meta (Player).

## Die 20 Phasen

### PIXEL MODE (Phasen 1-10)
Grid-basiertes Gameplay mit sichtbaren, klickbaren Pixeln.

1. **The Pixel** - 2-5 min - Ein einzelner Pixel erwacht
2. **The Canvas** - 10-20 min - Eine kleine Leinwand entsteht
3. **The Gallery** - 30-60 min - Kunstwerke vermehren sich
4. **The Screen** - 45-90 min - Digitale Bildschirme entstehen
5. **The Room** - 1-2 h - Ein Raum voller Screens
6. **The House** - 2-3 h - Ein Haus voller Räume
7. **The City** - 3-4 h - Eine Stadt voller Häuser
8. **The Country** - 3-5 h - Ein Land voller Städte
9. **The Earth** - 4-6 h - Der gesamte Planet
10. **The Moon** - 1-2 h - Erster Schritt ins All

### ABSTRACT MODE (Phasen 11-20)
Text-zentriertes, minimalistisches, meditatives Gameplay.

11. **Solar System** - 4-6 h - Planeten als abstrakte Konzepte
12. **The Sun (Boss)** - 2-3 h - Erste Boss-Phase mit Herausforderung
13. **Milky Way** - 6-8 h - Galaktische Skala
14. **Local Group** - 5-7 h - Galaxien-Cluster
15. **Observable Universe** - 6-10 h - Die Grenzen der Beobachtung
16. **Black Holes (Boss)** - 4-6 h - Zweite Boss-Phase, Singularitäten
17. **Multiverse** - 6-8 h - Parallelwelten und Möglichkeiten
18. **The Void** - 3-5 h - Meditative Leere, minimale Interaktion
19. **Source Code** - 2-4 h - Meta-Ebene: Das Spiel selbst
20. **The Player** - Variable - Finale Meta-Reflexion

**Gesamtspielzeit**: 70-110 Stunden

## PhaseManager Design

### Core State

```typescript
class PhaseManager {
  currentPhase = $state<Phase>(PHASES[0])
  phaseStartTime = $state<number>(Date.now())

  // Transaktional: Alle Phase-Daten werden hier verwaltet
  unlockedPhases = $state<Set<number>>(new Set([0]))
}
```

### Transition Logik

**checkTransition()** - Wird im Tick Loop aufgerufen
- Prüft ob currentPhase.unlockConditions erfüllt sind
- Gibt `true` zurück wenn Transition bereit ist
- Trigger für Transition Animation

**advancePhase()**
- Deaktiviert alte Phase (cleanup)
- Spielt Transition Cutscene ab
- Aktiviert neue Phase (init)
- Setzt phaseStartTime zurück
- Bei Phase 11: Wechsel zu Abstract Mode

### Phase Definition Format

```typescript
interface PhaseDefinition {
  id: number
  name: string
  subtitle: string

  // Timing
  durationMin: number  // in Minuten
  durationMax: number

  // Unlock
  unlockConditions: Condition[]

  // Visuals
  visualMode: 'pixel' | 'abstract'
  gridSize?: { width: number, height: number }  // Nur PIXEL MODE

  // Content
  resources: ResourceType[]
  upgrades: UpgradeDefinition[]
  storyEvents: StoryEvent[]

  // Spezial
  isBossPhase: boolean
  isMeditationPhase: boolean
}
```

## Transition System

### Condition Types

**Resource Conditions**
- `{ type: 'resource', resource: 'pixels', amount: 1000 }`
- Prüft ob Ressourcen-Schwellwert erreicht

**Choice Conditions**
- `{ type: 'choice', choiceId: 'accept_void', value: true }`
- Prüft ob Story-Entscheidung getroffen

**Time Conditions**
- `{ type: 'time', minSeconds: 120 }`
- Mindestzeit in Phase verbracht

**Composite Conditions**
- `{ type: 'and', conditions: [...] }`
- `{ type: 'or', conditions: [...] }`

### Transition Flow

1. **Check** - checkTransition() läuft jede Sekunde
2. **Prepare** - UI zeigt "Transition bereit" Hinweis
3. **Trigger** - Spieler klickt "Advance" oder Auto-Transition
4. **Animation** - Fullscreen Transition/Cutscene (2-5 Sekunden)
5. **Cleanup** - Alte Phase speichert State, deaktiviert Ticker
6. **Initialize** - Neue Phase lädt Ressourcen, startet Systeme
7. **Complete** - Gameplay in neuer Phase beginnt

### Mode Switching bei Phase 11

Wenn Phase 11 (Solar System) erreicht wird:

- Fade Out des gesamten PIXEL MODE UI
- Cutscene: "The pixels dissolve into pure energy..."
- Fade In des ABSTRACT MODE UI
- UI wechselt von Grid zu Text/Minimalistisch
- Keine Pixel mehr sichtbar, nur noch abstrakte Konzepte

## Phase-spezifische Mechaniken

### Standard Phasen (1-10, 13-15, 17-19)

- Lineare Progression
- Ressourcen sammeln → Upgrades kaufen → Phase abschließen
- Story Events bei bestimmten Milestones

### Boss Phasen (12: Sun, 16: Black Holes)

**The Sun**
- Challenge: Erreiche Ziel in begrenzter "Zeit"
- Mechanik: Solar Flares zerstören Fortschritt
- Belohnung: Massive Ressourcen-Boost für Phase 13+

**Black Holes**
- Challenge: Navigiere durch Singularitäten
- Mechanik: Ressourcen können "verschluckt" werden
- Risiko/Belohnung: High stakes gambling

### Meditation Phase (18: The Void)

- Minimale UI, fast keine Buttons
- Sehr langsame, automatische Progression
- Spieler soll loslassen und warten
- Thematisch: Leere, Stille, Reflexion
- Kein Clicking, nur passives Idle

### Meta Phasen (19-20)

**Source Code**
- UI zeigt "echten" Code des Spiels
- Ressourcen sind "Functions", "Variables", "Bugs"
- Upgrades verändern "Spiel-Code"

**The Player**
- Finale Phase: Spricht Spieler direkt an
- Keine klassischen Mechaniken mehr
- Narrative Abschluss, Credits
- Optional: New Game+ Unlock

## Visual Mode System

### PIXEL MODE (Phasen 1-10)

**UI Komponenten**:
- `<PixelGrid>` - Zentrales Grid mit klickbaren Pixeln
- `<ResourceBar>` - Anzeige von Pixels, Energy, Art
- `<UpgradePanel>` - Kaufbare Upgrades
- `<StoryLog>` - Narrative Events

**Gameplay**:
- Aktives Clicking auf Grid
- Sichtbare Ressourcen-Generatoren
- Konkrete, visuelle Feedbacks

### ABSTRACT MODE (Phasen 11-20)

**UI Komponenten**:
- `<AbstractView>` - Minimal, Text-zentriert
- `<ConceptList>` - Liste abstrakter Konzepte
- `<PhilosophyLog>` - Narrative Reflexionen
- `<VoidMeter>` - Spezielle Ressourcen-Anzeige

**Gameplay**:
- Passives Idle dominiert
- Weniger Clicking
- Mehr Lesen, Reflektieren
- Längere Wartezeiten

### Component Switching Strategy

```svelte
{#if currentPhase.visualMode === 'pixel'}
  <PixelModeUI {currentPhase} />
{:else}
  <AbstractModeUI {currentPhase} />
{/if}
```

Beide Modes teilen sich:
- ResourceManager (Backend)
- UpgradeManager (Backend)
- SaveManager (Backend)

Nur UI Layer wechselt.

## Phase Metadata

Jede Phase definiert:

**Ressourcen**
- Welche Ressourcen sind verfügbar
- Startwerte, Caps, Generation Rates

**Upgrades**
- Liste von Upgrade IDs die freigeschaltet werden
- Abhängigkeiten zwischen Upgrades

**Story Events**
- Trigger Conditions (z.B. "50 Pixels erreicht")
- Text, Choices, Consequences

**Visuals**
- CSS Theme (Farben, Fonts)
- Hintergrund, Partikel-Effekte
- Musik/Sound Cues

**Pacing**
- Erwartete Spielzeit (min/max)
- Schwierigkeitskurve

## Speicherung

PhaseManager State wird in SaveGame gespeichert:

```typescript
{
  currentPhaseId: number
  phaseStartTime: number
  unlockedPhases: number[]
  phaseProgress: Map<number, PhaseProgress>
}
```

**PhaseProgress** tracked pro Phase:
- Beste Zeit
- Abgeschlossene Story Events
- Gesammelte Achievements

## Erweiterbarkeit

Das System erlaubt:

- **Neue Phasen** hinzufügen ohne Core Logic zu ändern
- **Alternative Paths**: Verzweigungen zwischen Phasen (für New Game+)
- **Bonus Phasen**: Secret Levels zwischen Hauptphasen
- **Dynamic Difficulty**: Phase-Dauer anpassen basierend auf Spieler-Performance

## Design Philosophie

**Early Game (1-5)**: Tutorial-artig, schnell, belohnend
**Mid Game (6-12)**: Hauptspielzeit, tiefere Systeme
**Late Game (13-17)**: Epic Scale, lange Sessions
**End Game (18-20)**: Reflexion, Slowdown, Abschluss

Jede Phase soll sich **distinct** anfühlen, aber der Übergang muss **smooth** sein.
