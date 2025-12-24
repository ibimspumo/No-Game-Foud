# Upgrade-System

## Übersicht

Das Upgrade-System ist das zentrale Progression-Element des Spiels. Es gibt drei Kategorien:

1. **Run Upgrades** - Phasenspezifische Upgrades, die nur für den aktuellen Run gelten
2. **Eternal Upgrades** - Permanente Upgrades im Skill Tree (drei Pfade)
3. **Secret Upgrades** - Versteckte Upgrades mit speziellen Unlock-Bedingungen

### Upgrade-Kategorien Rolle

- **Run Upgrades**: Beschleunigen die aktuelle Phase, schalten neue Mechaniken frei
- **Eternal Upgrades**: Permanente Boni für alle zukünftigen Runs, ermöglichen Ascension
- **Secret Upgrades**: Besondere Belohnungen für Exploration und Achievements

## UpgradeManager Design

Der `UpgradeManager` ist eine Svelte 5 Rune-basierte Klasse:

```typescript
class UpgradeManager {
  ownedUpgrades = $state<Set<string>>(new Set())
  upgradeDefinitions = new Map<string, UpgradeDefinition>()

  canAfford(upgradeId: string): boolean
  purchase(upgradeId: string): boolean
  getEffect(upgradeId: string): UpgradeEffect
  isUnlocked(upgradeId: string): boolean
}
```

### Kernmethoden

- `canAfford()` - Prüft Währung gegen Kosten
- `purchase()` - Kauft Upgrade, aktualisiert ownedUpgrades
- `getEffect()` - Gibt aktiven Effect-Wert zurück
- `isUnlocked()` - Prüft Phase und Dependencies

## Upgrade Definition Format

Jedes Upgrade wird als Objekt definiert:

```typescript
interface UpgradeDefinition {
  id: string
  name: string
  description: string

  // Kosten
  cost: BigNumber | ((level: number) => BigNumber)
  currency: 'pixels' | 'primordial'

  // Effekt
  effect: UpgradeEffect

  // Freischaltung
  phase: number
  requires?: string[] // Upgrade-IDs als Voraussetzung

  // Typ
  category: 'run' | 'eternal' | 'secret'
  path?: 'consumer' | 'creator' | 'observer' // für eternal

  // Wiederholbarkeit
  maxLevel?: number // undefined = unendlich
}
```

### Beispiel-Definitionen

**Run Upgrade (Phase 2):**
- id: `pixel_generator`
- cost: `1000 pixels`
- effect: `+50% passive pixel production`
- phase: `2`

**Eternal Upgrade (Consumer Path):**
- id: `quick_start`
- cost: `10 primordial pixels`
- effect: `Start each run with 100 pixels`
- requires: `[]`
- path: `consumer`

## Kosten-Berechnung

### Base Cost Scaling

Formel für wiederholbare Upgrades:

```
Kosten = Base Cost × Scaling^Level
```

Typische Scaling-Faktoren:
- Early Game: 1.15 - 1.25
- Mid Game: 1.5 - 2.0
- Late Game: 2.5 - 5.0

### Phase-basierte Skalierung

Kosten steigen mit jeder Phase:

- Phase 1-2: Base × 1
- Phase 3-4: Base × 10
- Phase 5-6: Base × 100
- Phase 7+: Base × 1000

### Multi-Buy Berechnung

Für "Buy 10" oder "Buy Max":

```
Gesamtkosten = Base × (Scaling^(Level+1) - Scaling^(Level+Amount)) / (Scaling - 1)
```

Buy Max findet maximales Amount, wo Gesamtkosten <= verfügbare Währung.

## Effect System

### Effect Types

1. **Multiplier Effects**
   - Multipliziert Produktionswerte
   - Stackt multiplikativ: `1.5 × 1.5 = 2.25`
   - Beispiel: `productionMultiplier: 1.5`

2. **Additive Effects**
   - Addiert zu Produktionswerten
   - Stackt additiv: `+100 + +100 = +200`
   - Beispiel: `productionBonus: BigNumber(100)`

3. **Unlock Effects**
   - Schaltet Features/Mechaniken frei
   - Boolean Flag
   - Beispiel: `unlocks: 'multi_canvas'`

4. **Passive Effects**
   - Immer aktiv sobald gekauft
   - Modifiziert globale Werte
   - Beispiel: `globalSpeedMultiplier: 1.2`

### Effect Application

Der GameEngine fragt UpgradeManager nach aktiven Effects:

```typescript
// Alle Multiplier sammeln
const multipliers = upgradeManager.getActiveMultipliers('pixel_production')
const totalMultiplier = multipliers.reduce((a, b) => a * b, 1)

// Production berechnen
production = baseProduction * totalMultiplier
```

## Skill Tree (Eternal Upgrades)

### Drei Pfade

**Consumer Path** (Geschwindigkeit):
1. Quick Start → Start with 100 pixels
2. Phase Skip → Unlock phases faster
3. Endless Hunger → 2× pixel gain

**Creator Path** (Synergien):
1. Seed of Life → Create pixels spread faster
2. Cooperation → Multi-canvas bonuses
3. Symbiosis → Gallery synergy 3×

**Observer Path** (Wissen):
1. Deep Memory → Retain progress info
2. Hidden Sight → See secret mechanics
3. True Seeing → Unlock final truth

### Dependency System

Upgrades können andere Upgrades voraussetzen:

```typescript
{
  id: 'phase_skip',
  requires: ['quick_start'] // muss zuerst gekauft sein
}
```

Skill Tree visualisiert Dependencies als Pfad-Struktur.

### Ascension Bedingung

Ascension wird freigeschaltet wenn:
- Alle drei Pfade bis zum Ende gekauft
- Mindestens Phase 7 erreicht
- 1000+ Primordial Pixels gesammelt

## Upgrade Unlocking

### Phase-basiertes Unlock

Upgrades werden sichtbar basierend auf aktueller Phase:

```typescript
isVisible(upgrade) {
  return currentPhase >= upgrade.phase
}
```

Progressive Disclosure: Spieler sehen nur relevante Upgrades.

### Dependency-basiertes Unlock

Upgrades mit `requires` werden erst freigeschaltet wenn alle Dependencies erfüllt:

```typescript
isUnlocked(upgrade) {
  if (!upgrade.requires) return true
  return upgrade.requires.every(id => ownedUpgrades.has(id))
}
```

### Secret Upgrades

Werden durch spezielle Aktionen freigeschaltet:

- **Anomaly Hunter**: Finde 10 versteckte Anomalien
- **Speed Demon**: Erreiche Phase 5 in unter 10 Minuten
- **Pacifist**: Erreiche Phase 7 ohne Stealth Mode

Secret Upgrades haben keine Phase-Requirement, nur Unlock-Condition.

## Kosten-Währungen

### Pixels (Run Currency)

- Verdient während des Runs
- Resetted bei Ascension
- Für Run Upgrades

### Primordial Pixels (Meta Currency)

- Verdient beim Ascension
- Permanent gespeichert
- Für Eternal Upgrades

Conversion Rate: `1 Primordial = 10^6 Pixels beim Ascension`

## UI Considerations

### Upgrade Panel Layout

Empfohlene Struktur:

```
┌─────────────────────────────────┐
│  [Run Upgrades] [Eternal] [All] │ ← Tabs
├─────────────────────────────────┤
│  Available Upgrades             │
│  ┌────────────┐ ┌────────────┐  │
│  │ Upgrade 1  │ │ Upgrade 2  │  │
│  │ Cost: 100  │ │ Cost: 500  │  │
│  │ [BUY]      │ │ [LOCKED]   │  │
│  └────────────┘ └────────────┘  │
│                                 │
│  Owned Upgrades                 │
│  • Quick Start (Lv 1)           │
│  • Pixel Generator (Lv 3)       │
└─────────────────────────────────┘
```

### Affordable Highlighting

Visual Feedback:

- **Green Border**: Kann gekauft werden
- **Gray Border**: Nicht genug Währung
- **Red Border**: Locked (Dependencies fehlen)
- **Gold Border**: Secret Upgrade verfügbar

### Auto-Buy Option

Optional: Auto-Buy Feature für wiederholbare Upgrades:

```typescript
autoBuyEnabled = $state(false)

tick() {
  if (autoBuyEnabled) {
    buyableUpgrades.forEach(upgrade => {
      if (canAfford(upgrade.id)) purchase(upgrade.id)
    })
  }
}
```

Kann in Settings aktiviert werden.

### Sorting und Filtering

- **Sort by Cost**: Billigste zuerst
- **Sort by Phase**: Aktuelle Phase zuerst
- **Filter by Affordable**: Nur kaufbare zeigen
- **Filter by Category**: Run/Eternal/Secret

## Persistence

### Speicherformat

```typescript
{
  runUpgrades: ['pixel_generator', 'color_attractor'],
  eternalUpgrades: ['quick_start', 'deep_memory'],
  upgradeLevels: {
    'pixel_generator': 5,
    'quick_start': 1
  }
}
```

### Load Logic

Beim Laden:
1. ownedUpgrades Set aus Array rekonstruieren
2. Levels für wiederholbare Upgrades setzen
3. Effects neu berechnen

## Balance Considerations

### Progression Curve

Frühe Upgrades (Phase 1-3):
- Häufige kleine Upgrades
- Sofortiges Feedback
- Kosten: 10^1 bis 10^6

Mittlere Upgrades (Phase 4-6):
- Seltene große Upgrades
- Strategische Entscheidungen
- Kosten: 10^6 bis 10^12

Späte Upgrades (Phase 7+):
- Sehr seltene massive Upgrades
- Long-term Planning
- Kosten: 10^12+

### Eternal Upgrade Balance

Primordial Pixels sollten wertvoll sein:
- Erste Ascension: ~10 PP
- Zweite Ascension: ~25 PP
- Zehnte Ascension: ~500 PP

Jedes Eternal Upgrade sollte spürbar sein, aber nicht gamebreaking.

## Anti-Patterns zu Vermeiden

- **Keine Upgrade-Traps**: Jedes Upgrade muss nützlich sein
- **Keine Dead Ends**: Skill Tree Pfade müssen alle viable sein
- **Keine Hidden Costs**: Alle Kosten klar anzeigen
- **Keine Power-Creep**: Eternal Upgrades balancieren

## Integration mit anderen Systemen

### PhaseManager

- Upgrades können Phasen-Fortschritt beschleunigen
- Bestimmte Upgrades nur in bestimmten Phasen verfügbar

### AscensionManager

- Berechnet Primordial Pixels basierend auf gekauften Upgrades
- Resetted Run Upgrades, behält Eternal Upgrades

### ResourceManager

- Prüft verfügbare Währung für canAfford()
- Deduct currency bei purchase()

### EventManager

- Event `upgrade_purchased` mit upgradeId
- Event `upgrade_unlocked` für UI-Benachrichtigung
