# Achievement System

## Übersicht

Das Achievement-System belohnt Spieler für das Erreichen von Meilensteinen, das Entdecken von Secrets und das Abschließen von Endings. Es dient als Meta-Progression und gibt dem Spiel zusätzliche Langzeitmotivation.

### Achievement-Typen

**Standard Achievements (50)**
- Phase-Completion: First Click, First Canvas, First Code, ... Player Met
- Progressiv steigende PP-Belohnungen: 10 → 100 → 1000 → 10000 → 100000
- Sichtbar in der Achievement-Liste von Anfang an

**Secret Achievements (25)**
- Versteckte Herausforderungen und Easter Eggs
- Nur nach Unlock sichtbar (optional mit Hints)
- Besondere Belohnungen für Entdecker

**Ending Achievements (9)**
- 8 Standard Endings (verschiedene Pfade)
- 1 True Ending (alle anderen + maximale Ascension)
- Höchste PP-Belohnungen

### Belohnungssystem

- **Primordial Pixels (PP)**: Meta-Währung für Prestige-Upgrades
- **Unlocks**: Neue Inhalte, Cosmetics, UI-Themes
- **Titles/Badges**: Kosmetische Sammlerstücke
- **Progress**: Manche Achievements schalten weitere frei

## AchievementManager Design

### Core State

```typescript
class AchievementManager {
  unlockedAchievements = $state<Set<string>>(new Set())
  progressTracking = $state<Map<string, number>>(new Map())
  notificationQueue = $state<Achievement[]>([])
}
```

### Hauptfunktionen

**checkConditions()**
- Läuft im Game Loop (optimiert, nicht jeden Frame)
- Prüft nur noch nicht erreichte Achievements
- Verwendet Caching für Performance

**unlock(achievementId)**
- Fügt zu unlockedAchievements hinzu
- Triggert Notification
- Vergibt Rewards
- Speichert Progress
- Emittiert Event für Analytics

**getProgress(achievementId)**
- Für Achievements mit Fortschrittsanzeige
- Z.B. "100/1000 Pixels consumed"

## Achievement Definition Format

### Basis-Struktur

```typescript
interface Achievement {
  id: string                    // Eindeutiger Identifier
  type: 'standard' | 'secret' | 'ending'
  name: string                  // Anzeigename
  description: string           // Beschreibung der Bedingung
  flavorText?: string           // Optionaler Story-Text

  condition: Condition          // Unlock-Bedingung
  reward: Reward                // Was gibt's dafür

  hidden: boolean               // Für Secret Achievements
  hint?: string                 // Optionaler Hinweis

  icon?: string                 // Icon-Identifier
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}
```

### Beispiele

**Phase Achievement**
```typescript
{
  id: 'first_canvas',
  type: 'standard',
  name: 'Canvas Found',
  description: 'Reach Phase 2: Canvas',
  reward: { pp: 100 },
  condition: { type: 'phase_reached', phase: 2 }
}
```

**Secret Achievement**
```typescript
{
  id: 'patience',
  type: 'secret',
  name: 'Zen Master',
  description: 'Wait 1 hour without clicking',
  flavorText: 'Sometimes, inaction is the greatest action.',
  hidden: true,
  hint: 'What happens if you just... wait?',
  reward: { pp: 500, unlock: 'meditation_mode' },
  condition: { type: 'wait_time', seconds: 3600, noClicks: true }
}
```

## Condition System

### Condition-Typen

**Resource-Based Conditions**
```typescript
{ type: 'resource_gte', resource: 'pixels', amount: 1000000 }
{ type: 'resource_consumed', resource: 'canvas', amount: 100 }
{ type: 'total_generated', resource: 'pixels', amount: 1e9 }
```

**Phase-Based Conditions**
```typescript
{ type: 'phase_reached', phase: 10 }
{ type: 'phase_completed', phase: 5 }
{ type: 'all_phases_unlocked' }
```

**Time-Based Conditions**
```typescript
{ type: 'play_time_gte', seconds: 3600 }
{ type: 'idle_time_gte', seconds: 1800 }
{ type: 'speedrun', phase: 10, maxSeconds: 7200 }
```

**Choice-Based Conditions**
```typescript
{ type: 'choice_made', choiceId: 'coexist' }
{ type: 'path_followed', path: 'pacifist' }
{ type: 'never_choice', choiceId: 'consume_player' }
```

**Entity-Based Conditions**
```typescript
{ type: 'entity_created', entityType: 'player' }
{ type: 'entity_level', entityType: 'player', level: 10 }
{ type: 'all_entities_max_level' }
```

**Compound Conditions**
```typescript
{
  type: 'and',
  conditions: [
    { type: 'phase_reached', phase: 10 },
    { type: 'play_time_lte', seconds: 7200 }
  ]
}

{
  type: 'or',
  conditions: [
    { type: 'choice_made', choiceId: 'consume' },
    { type: 'choice_made', choiceId: 'destroy' }
  ]
}
```

### Condition Evaluation

Jeder Condition-Typ hat eine evaluate-Funktion:

```typescript
function evaluateCondition(condition: Condition, gameState: GameState): boolean
```

Performance-Optimierung durch:
- Caching von Evaluierungen
- Nur prüfen wenn relevante State-Änderung
- Batching von Checks

## Reward System

### Reward-Typen

**Primordial Pixels**
```typescript
{ pp: 1000 }
```

**Content Unlocks**
```typescript
{ unlock: 'meditation_mode' }
{ unlock: 'developer_console' }
{ unlock: 'true_ending_path' }
```

**Cosmetic Unlocks**
```typescript
{ cosmetic: 'rainbow_pixels' }
{ cosmetic: 'dark_theme' }
{ title: 'Zen Master' }
```

**Kombinierte Rewards**
```typescript
{
  pp: 5000,
  unlock: 'ascension_bonus',
  title: 'True Player',
  badge: 'completion_badge'
}
```

### Reward Delivery

- Sofort beim Unlock
- Mit Notification/Animation
- Persistent gespeichert
- PP werden zu totalPP addiert

## Secret Achievements

### Design-Prinzipien

**Discovery über Telemetrie**
- Nicht sichtbar bis unlocked
- Optionale vage Hints
- Easter Eggs belohnen Exploration

**Beispiel-Secrets**

**The Answer (42 PP)**
- Condition: Exakt 42 Primordial Pixels sammeln
- Hint: "What is the answer to everything?"

**Genocide Route**
- Condition: Immer "Consume" wählen, nie sparen
- Hidden Achievement, dunkles Ending

**Pacifist Route**
- Condition: Nie force-consume, immer kooperieren
- Unlock: Special Ending

**Speedrunner**
- Condition: Phase 10 in unter 2 Stunden
- Reward: Speedrun-Modus für New Game+

**Patience**
- Condition: 1 Stunde warten ohne Interaktion
- Reward: Idle-Bonus-Multiplier

**Meta Player**
- Condition: Jeden Tooltip lesen
- Reward: Lore-Codex

**Number Hunter**
- Condition: Alle Zahlen 1-10 im richtigen Moment klicken
- Reward: Number-Display-Option

## Endings als Achievements

### Die 8 Standard Endings

**1. Consumption Ending**
- Condition: Alles konsumiert, Singularität erreicht
- Reward: 10000 PP

**2. Coexistence Ending**
- Condition: Balance zwischen allen Entitäten
- Reward: 10000 PP

**3. Transcendence Ending**
- Condition: Player-Entity maximiert, Singularität überschritten
- Reward: 10000 PP

**4. Destruction Ending**
- Condition: Alles zerstört, zurück zu Phase 1
- Reward: 5000 PP

**5. Isolation Ending**
- Condition: Nur Pixels, keine anderen Entitäten
- Reward: 7500 PP

**6. Creation Ending**
- Condition: Alle Entitäten erschaffen, nichts konsumiert
- Reward: 7500 PP

**7. Loop Ending**
- Condition: Bewusst den Loop wiederholen
- Reward: 5000 PP

**8. Escape Ending**
- Condition: Den Loop durchbrechen ohne Singularität
- Reward: 12500 PP

### Das True Ending

**True Singularity**
- Condition: Alle 8 Endings + alle Paths auf Max + alle Secret Achievements
- Reward: 100000 PP + Developer Message + Credits
- Freischalten: New Game+ mit allen Unlocks

### Ending Detection

Endings werden am Ende einer Ascension geprüft:
- Spieler erreicht finalen State
- System evaluiert welche Ending-Conditions erfüllt sind
- Erstes Match wird getriggert
- Ending-Sequence spielt ab
- Achievement wird unlocked
- Ascension startet mit Bonus

## Notification System

### Toast Notifications

**Standard Achievement**
- Kurze Toast-Meldung oben rechts
- Icon + Name + PP-Reward
- 3 Sekunden Anzeigezeit
- Sound-Effekt

**Secret Achievement**
- Besondere Animation
- Längere Anzeigezeit (5 Sekunden)
- Spezial-Sound
- "Secret Unlocked!" Badge

**Ending Achievement**
- Fullscreen-Overlay
- Ending-Text + Animation
- Reward-Zusammenfassung
- "Continue" Button für Ascension

### Celebration Effects

Für besondere Achievements:
- Partikeleffekte
- Screen-Shake
- Farbflash
- Konfetti (für True Ending)

### Queue Management

- Mehrere Achievements gleichzeitig möglich
- Queue verhindert Overlap
- Wichtige Achievements (Endings) haben Priorität
- Batch-Notifications für viele gleichzeitige Unlocks

## Achievement Gallery

### UI-Design

**Haupt-Ansicht**
- Grid-Layout mit Achievement-Karten
- Filter: All / Standard / Secret / Endings
- Sort: Rarity / Date / PP Reward
- Search-Funktion

**Achievement-Karte (Unlocked)**
- Icon (farbig)
- Name
- Description + Flavor Text
- Unlock-Datum
- Reward-Anzeige
- Rarity-Badge

**Achievement-Karte (Locked Standard)**
- Icon (grau)
- Name
- Progress Bar (falls trackbar)
- Current/Target Anzeige

**Achievement-Karte (Locked Secret)**
- "???" Icon
- "Secret Achievement"
- Optional: Hint-Text
- Kein Progress sichtbar

### Progress Tracking

Für trackbare Achievements:
- Progress Bar mit Prozent
- Current / Target Zahl
- Geschätzte Zeit bis Unlock (optional)

Beispiele:
- "1,234,567 / 1,000,000 Pixels Generated" ✓
- "7 / 8 Endings Reached" (87%)
- "Phase 8 / 10 Reached" (80%)

### Statistics

Achievements-Übersicht:
- X / 84 Achievements Unlocked (Y%)
- Total PP Earned: XXXXX
- Rarest Achievement: [Name]
- Most Recent: [Name] - [Date]
- Completion per Type: Standard, Secret, Endings

## Technische Implementation

### Storage

Achievements werden persistent gespeichert:
```typescript
{
  unlockedAchievements: ['first_click', 'first_canvas', ...],
  achievementProgress: {
    'speedrunner': { startTime: timestamp, currentPhase: 5 },
    'patience': { lastClick: timestamp }
  },
  achievementUnlockDates: {
    'first_click': '2025-01-15T10:30:00Z'
  }
}
```

### Performance

**Optimierungen**
- Nur unerledigte Achievements prüfen
- Condition-Checks nur bei relevanten State-Änderungen
- Debouncing für häufige Checks
- Lazy Evaluation von Compound Conditions

**Event-basiert wo möglich**
```typescript
on('phaseReached', (phase) => checkPhaseAchievements(phase))
on('choiceMade', (choice) => checkChoiceAchievements(choice))
on('resourceGenerated', (resource, amount) => checkResourceAchievements())
```

### Analytics

Tracking für Balancing:
- Welche Achievements werden am seltensten unlocked
- Durchschnittliche Zeit bis Unlock
- Welche Secrets werden ohne Hint gefunden
- Ending-Verteilung

## Integration mit Meta-Progression

### Primordial Pixels

Achievements sind die Haupt-PP-Quelle:
- Standard: 10 bis 100000 PP
- Secret: 100 bis 5000 PP
- Endings: 5000 bis 100000 PP
- True Ending: 100000 PP

Total mögliche PP aus Achievements: ~500000

### Unlocks

Manche Achievements schalten frei:
- New Game+ Modi
- UI-Optionen
- Cosmetics
- Developer Commentary
- Lore-Einträge
- Bonus-Ascension-Paths

### Synergien

- Achievements motivieren verschiedene Playstyles
- Secrets belohnen Exploration
- Endings geben Wiederspielwert
- PP ermöglichen stärkere Prestige-Runs

## Beispiel Achievement-Liste

### Phase Achievements (10)
- First Click (10 PP) - Phase 1
- Canvas Found (100 PP) - Phase 2
- Code Written (250 PP) - Phase 3
- Program Running (500 PP) - Phase 4
- Game Created (1000 PP) - Phase 5
- AI Awakened (2500 PP) - Phase 6
- Reality Questioned (5000 PP) - Phase 7
- Simulation Confirmed (7500 PP) - Phase 8
- Creator Confronted (10000 PP) - Phase 9
- Singularity Reached (25000 PP) - Phase 10

### Resource Achievements (15)
- Million Pixels (500 PP)
- Billion Pixels (2000 PP)
- Trillion Pixels (5000 PP)
- Canvas Master (1000 PP) - 1000 Canvas
- Code Architect (1500 PP) - 1000 Code
- [... weitere Resource-Meilensteine]

### Time Achievements (10)
- First Hour (100 PP)
- Day One (500 PP)
- Week Warrior (2000 PP)
- [... weitere Zeit-Meilensteine]

### Choice Achievements (10)
- First Choice (100 PP)
- Path Follower (500 PP) - Einen Pfad konsequent folgen
- Diplomat (1000 PP) - Immer Balance wählen
- [... weitere Choice-bezogene]

### Entity Achievements (5)
- Player Met (5000 PP)
- All Entities Created (7500 PP)
- Perfect Harmony (10000 PP) - Alle auf Level 10
- [... weitere Entity-bezogene]

## Zusammenfassung

Das Achievement-System bietet:
- **84 Achievements** (50 Standard, 25 Secret, 9 Endings)
- **~500000 PP** total verfügbar
- **Vielfältige Playstyles** durch verschiedene Conditions
- **Langzeitmotivation** durch Secrets und Endings
- **Meta-Progression** durch PP-Rewards
- **Wiederspielwert** durch alternative Paths
- **Discovery-Gameplay** durch versteckte Achievements

Es ist ein zentrales System für Engagement und gibt dem ansonsten linearen Idle-Game Tiefe und Variabilität.
