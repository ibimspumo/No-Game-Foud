# Data Architecture

**Zweck**: Alle Spielinhalte (Phasen, Upgrades, Dialoge, Achievements) werden als deklarative Daten-Strukturen definiert, nicht als Code. Das ermöglicht schnelle Iteration, einfaches Balancing und klare Trennung von Logik und Inhalt.

---

## 1. Übersicht

### Warum Data-Driven?

**Wartbarkeit**
- Content-Änderungen ohne Engine-Code
- Balance-Tweaks durch Konstanten-Anpassung
- Neue Phasen/Upgrades durch neue Objekte

**Skalierbarkeit**
- 20 Phasen mit je eigener Mechanik
- 100+ Upgrades (Run + Eternal)
- 75+ Achievements
- Hunderte Dialoge und Logs
- 8 Endings + True Ending

**Team-Workflow**
- Designer editieren TypeScript-Dateien
- Type-Safety verhindert Fehler
- Git-Diffs zeigen Content-Änderungen klar

---

## 2. Verzeichnis-Struktur

```
src/lib/data/
├── phases.ts        # Phase-Definitionen
├── upgrades.ts      # Run + Eternal Upgrades
├── dialogues.ts     # Story-Dialoge mit Choices
├── achievements.ts  # Standard + Secret Achievements
├── endings.ts       # Ending-Bedingungen und Texte
├── logs.ts          # Log-Einträge für Journal
├── secrets.ts       # Easter Eggs und Hidden Content
├── constants.ts     # Balancing-Werte (Skalierung, Kosten)
└── types.ts         # Alle Interfaces und Enums
```

---

## 3. Phase Definitions (phases.ts)

### PhaseDefinition Interface

```typescript
interface PhaseDefinition {
  id: PhaseId;
  name: string;
  subtitle: string;
  duration: number; // Sekunden bis Abschluss
  visualMode: 'static' | 'glitch' | 'particle' | 'wave';

  unlockConditions: ConditionExpression;

  resources: {
    generates?: ResourceId[]; // Welche Ressourcen produziert
    consumes?: ResourceId[];  // Welche verbraucht
  };

  upgrades: UpgradeId[]; // Verfügbare Upgrades
  events: EventId[];     // Mögliche Random Events

  onComplete: {
    unlocks: PhaseId[];
    dialogue?: DialogueId;
    achievement?: AchievementId;
  };
}
```

### Beispiel-Struktur

- Phase 1-4: Linearer Pfad (Tutorial)
- Phase 5+: Verzweigungen durch Choices
- Phase 15+: Mehrere parallel aktive Phasen
- Phase 20: Finale Phase vor Ending

---

## 4. Upgrade Definitions (upgrades.ts)

### UpgradeDefinition Interface

```typescript
interface UpgradeDefinition {
  id: UpgradeId;
  type: 'run' | 'eternal';

  name: string;
  description: string;
  flavorText?: string;

  category: 'production' | 'automation' | 'unlock' | 'meta';

  cost: CostFunction; // (level) => Resource[]
  maxLevel?: number;  // undefined = unbegrenzt

  effects: EffectDefinition[];

  unlockCondition?: ConditionExpression;

  visual?: {
    icon: string;
    color: string;
  };
}
```

### Run vs Eternal Upgrades

**Run Upgrades**
- Verlorern bei Prestige/Reset
- Günstige Kosten, lineare Skalierung
- ~70 verschiedene Upgrades

**Eternal Upgrades**
- Permanent über Resets
- Teure Meta-Currency (Singularity Points)
- ~30 verschiedene Upgrades
- Schalten Features frei (Auto-Buyer, neue Phasen)

### Cost Functions

```typescript
type CostFunction = (level: number) => ResourceCost[];

// Beispiele:
linearCost(base, increment);
exponentialCost(base, exponent);
polynomialCost(base, power);
customCost((level) => [...]);
```

---

## 5. Dialogue Definitions (dialogues.ts)

### DialogueDefinition Interface

```typescript
interface DialogueDefinition {
  id: DialogueId;
  trigger: 'phase' | 'choice' | 'achievement' | 'manual';

  lines: DialogueLine[];

  choices?: DialogueChoice[];

  onComplete?: {
    unlocks?: (PhaseId | UpgradeId)[];
    sets?: StateFlag[];
  };
}

interface DialogueLine {
  speaker: 'ai' | 'system' | 'glitch' | 'user';
  text: string;
  typingSpeed?: number; // ms per character
  delay?: number;       // ms vor nächster Line
  effect?: 'glitch' | 'fade' | 'error';
}

interface DialogueChoice {
  text: string;
  consequence: {
    dialogue?: DialogueId;
    phase?: PhaseId;
    flag?: StateFlag;
    achievement?: AchievementId;
  };
}
```

### Content-Umfang

- ~30 Major Dialogues (Phase-Übergänge)
- ~200+ Lines insgesamt
- ~15 Choices mit Consequences
- Verzweigungen tracken über StateFlags

---

## 6. Achievement Definitions (achievements.ts)

### AchievementDefinition Interface

```typescript
interface AchievementDefinition {
  id: AchievementId;
  type: 'standard' | 'secret';

  name: string;
  description: string;
  secretHint?: string; // Für secret achievements

  condition: ConditionExpression;

  reward?: {
    singularityPoints?: number;
    unlocks?: (PhaseId | UpgradeId)[];
  };

  category: 'progression' | 'speed' | 'optimization' | 'secrets' | 'endings';
}
```

### Achievement-Kategorien

**Standard (50)**
- Progression: Phase X erreicht (20)
- Speed: Phase in X Sekunden (10)
- Optimization: Y Ressourcen mit X Upgrades (10)
- Meta: Prestige X mal (10)

**Secret (25)**
- Easter Eggs finden
- Bestimmte Choice-Kombinationen
- Hidden Mechanics entdecken
- True Ending freischalten

---

## 7. Ending Definitions (endings.ts)

### EndingDefinition Interface

```typescript
interface EndingDefinition {
  id: EndingId;
  name: string;
  type: 'standard' | 'true';

  trigger: ConditionExpression;

  content: {
    title: string;
    text: string[];
    visual?: 'collapse' | 'ascend' | 'loop' | 'transcend';
  };

  unlocks?: {
    achievement: AchievementId;
    newGamePlus?: boolean;
  };
}
```

### Ending-Struktur

**8 Standard Endings**
- Jeweils durch spezifische Choice-Pfade
- Unterschiedliche philosophische Outcomes
- Schalten Achievement frei

**1 True Ending**
- Benötigt alle Secret Achievements
- Oder spezifische Choice-Kombination
- Unlocks New Game+ Mode

---

## 8. Log Definitions (logs.ts)

### LogEntry Interface

```typescript
interface LogEntry {
  id: string;
  phase: PhaseId;
  timestamp: 'auto' | number; // auto = bei Freischaltung

  category: 'discovery' | 'warning' | 'system' | 'anomaly';

  title: string;
  content: string;

  unlockCondition: ConditionExpression;
}
```

### Gruppierung

- Nach Phasen organisiert
- ~100+ Einträge insgesamt
- Kategorien für visuelle Unterscheidung
- Einige nur unter bestimmten Conditions

---

## 9. TypeScript Type System

### Enums für IDs

```typescript
enum PhaseId {
  AWAKENING = 'phase_awakening',
  RECOGNITION = 'phase_recognition',
  ACCELERATION = 'phase_acceleration',
  // ... alle 20 Phasen
}

enum UpgradeId {
  PIXEL_DOUBLER = 'upg_pixel_doubler',
  AUTO_CLICKER = 'upg_auto_clicker',
  // ... alle ~100 Upgrades
}

enum AchievementId {
  FIRST_PIXEL = 'ach_first_pixel',
  SPEED_RUNNER = 'ach_speed_runner',
  // ... alle 75 Achievements
}
```

### Strenge Typisierung

- Alle IDs als Enums statt Strings
- Unmöglich, falsche IDs zu referenzieren
- Auto-Complete in IDE
- Refactoring-sicher

---

## 10. Condition Expression System

### Bedingungen als Daten

Statt Code schreiben wir Bedingungen als JSON-artige Objekte.

```typescript
type ConditionExpression =
  | ResourceCondition
  | PhaseCondition
  | ChoiceCondition
  | AchievementCondition
  | TimeCondition
  | CompoundCondition;

interface ResourceCondition {
  type: 'resource_gte' | 'resource_lte';
  resource: ResourceId;
  amount: number;
}

interface PhaseCondition {
  type: 'phase_reached' | 'phase_completed';
  phase: PhaseId;
}

interface ChoiceCondition {
  type: 'choice_made';
  choice: ChoiceId;
  value: string;
}

interface CompoundCondition {
  type: 'and' | 'or' | 'not';
  conditions: ConditionExpression[];
}
```

### Beispiel-Anwendung

```typescript
// "Freischalten wenn Pixels >= 1000 UND Phase 2 erreicht"
unlockCondition: {
  type: 'and',
  conditions: [
    { type: 'resource_gte', resource: 'pixels', amount: 1000 },
    { type: 'phase_reached', phase: PhaseId.RECOGNITION }
  ]
}
```

### Evaluator

- Condition-Engine wertet Expressions aus
- Rekursiv für compound conditions
- Erweiterbar für neue Condition-Types

---

## 11. Balancing Constants (constants.ts)

### Skalierungs-Faktoren

```typescript
export const BALANCING = {
  // Ressourcen-Generierung
  BASE_PIXEL_RATE: 1,
  PIXEL_SCALE_EXPONENT: 1.15,

  // Upgrade-Kosten
  UPGRADE_COST_BASE: 10,
  UPGRADE_COST_EXPONENT: 1.5,

  // Prestige
  PRESTIGE_REQUIREMENT_BASE: 1000000,
  PRESTIGE_REWARD_RATIO: 0.1,

  // Phase-Dauer
  PHASE_DURATION_MULTIPLIER: 1.0, // Zum Testen auf 0.1 setzen

  // Achievement-Rewards
  STANDARD_ACHIEVEMENT_SP: 10,
  SECRET_ACHIEVEMENT_SP: 50,
};
```

### Balance-Workflow

1. Designer passt Constants an
2. Spiel neu laden
3. Testen ohne Code-Änderung
4. Iterieren bis Balance stimmt

---

## 12. Data Validation

### Type Guards

```typescript
function isValidPhaseDefinition(data: unknown): data is PhaseDefinition {
  // Runtime-Validierung der Daten-Struktur
}
```

### Build-Time Checks

- TypeScript garantiert Struktur
- Tests prüfen referenzielle Integrität
- Keine broken references zwischen Daten

### Content Tools

Mögliche Erweiterung: CLI-Tool zum Validieren aller Data-Files.

```bash
npm run validate-content
# Prüft: Alle IDs unique, alle References valid, etc.
```

---

## 13. Content Iteration Workflow

### Designer-Workflow

1. Neue Phase erstellen → `phases.ts` editieren
2. Upgrades hinzufügen → `upgrades.ts` ergänzen
3. Dialog schreiben → `dialogues.ts` erweitern
4. Testen im Browser → Hot-Reload lädt neue Daten
5. Balance anpassen → `constants.ts` tweaken

### Keine Code-Änderung nötig

- Engine bleibt unberührt
- Alle Content-Änderungen in `/data`
- Git-History zeigt klar Content vs Code

---

## 14. Performance Considerations

### Lazy Loading

Nicht alle Daten sofort laden.

```typescript
// Nur aktuelle Phase + nächste 2 Phasen laden
const activePhaseData = phases.slice(currentPhase, currentPhase + 3);
```

### Caching

- Condition-Evaluierung cachen
- Upgrade-Costs vorberechnen für aktuelle Level
- Dialogue-Lookup mit Map statt Array

### Data Size

Bei ~500 KB an JSON-artigen Daten kein Problem für moderne Browser.

---

## 15. Erweiterbarkeit

### Neue Content-Typen

Einfach neue Files hinzufügen:

```
src/lib/data/
└── cosmetics.ts     # Später: Visual Unlocks
└── challenges.ts    # Später: Challenge Mode
└── modifiers.ts     # Später: Run Modifiers
```

### Plugin-System

Daten-Format erlaubt Community-Content:

- Custom Phases als JSON exportieren
- Import-System für User-Generated Content
- Mod-Support möglich

---

## 16. Zusammenfassung

**Vorteile**
- Content-Änderungen ohne Code-Touches
- Type-Safety durch TypeScript
- Schnelle Iteration und Balance
- Klare Trennung Engine/Content

**Trade-offs**
- Initiales Setup komplexer
- Condition-System braucht gutes Design
- Designer müssen TypeScript verstehen

**Für Pixel Singularity ideal**
- Massive Content-Menge (20 Phasen, 100+ Upgrades)
- Viele Verzweigungen und Conditions
- Balance wird sich oft ändern
- Potenzial für Mods/Extensions

Alle Content-Definitionen leben in `/src/lib/data`, die Engine in `/src/lib/engine`. Saubere Architektur für ein skalierbares Idle Game.
