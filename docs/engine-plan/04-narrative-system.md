# 04 - Narrative System

## Übersicht

Das Narrative System ist **kein Addon, sondern ein Kern-Feature**. Die Geschichte von Pixel Singularity ist nicht Dekoration, sondern der emotionale Anker, der ein mechanisches Idle Game in eine existenzielle Reise verwandelt.

Jedes Resource Milestone, jede Phase Transition, jede große Zahl wird von der Story kommentiert, reflektiert, hinterfragt. Der Spieler erlebt nicht nur "numbers go up", sondern die philosophische Entwicklung eines einzelnen Pixels von Isolation zu kosmischer Bedeutung.

**Narrative vor Mechanik:** Wenn ein Feature die Story nicht unterstützt, gehört es nicht ins Spiel.

---

## NarrativeManager Design

Der `NarrativeManager` ist die zentrale Klasse für alle Story-Elemente.

### State Structure

```typescript
class NarrativeManager {
  logs = $state<LogEntry[]>([])
  activeDialogue = $state<Dialogue | null>(null)
  triggeredEvents = new Set<string>()
  playerChoices = new Map<string, string>()
  unlockedEndings = new Set<string>()
}
```

### Responsibilities

- **Logs verwalten:** Neue Logs bei Meilensteinen einfügen
- **Dialogues triggern:** Conversations mit NPCs starten
- **Choices tracken:** Spielerentscheidungen speichern für spätere Story-Branches
- **Events koordinieren:** One-time vs Repeatable Events verhindern/erlauben
- **Endings freischalten:** Basierend auf Choices und Flags

---

## Log System

Logs sind die "innere Stimme" des Pixels. Kurze, philosophische, manchmal witzige Gedanken.

### LogEntry Format

```typescript
interface LogEntry {
  id: string           // "phase2_first_clone"
  text: string         // "I am... two? Is this what it means to grow?"
  phase: number        // 2
  timestamp: number    // Date.now()
  category: "thought" | "discovery" | "warning"
}
```

### Trigger Points

Logs erscheinen bei:
- **Phase Transitions:** "I feel... different. Larger."
- **Resource Milestones:** Erste 10 Clones, erste 1000 Pixels, etc.
- **Upgrades:** "I can move faster. But why do I run?"
- **Story Events:** Reaktion auf Old Woman, Sun, etc.

### Log Archive

Alle Logs werden gespeichert und sind jederzeit im "Memory"-Tab lesbar. Spieler können die Story ihres Pixels nachvollziehen.

**Design-Idee:** Logs sind chronologisch sortiert, aber filterbar nach Phase oder Category.

---

## Dialogue System

Dialogues sind Gespräche mit anderen Entitäten. Sie pausieren nicht das Spiel, laufen parallel.

### Dialogue Format

```typescript
interface Dialogue {
  id: string                    // "sun_first_meeting"
  speaker: string               // "The Sun"
  lines: DialogueLine[]
  choices?: Choice[]            // Optional: Entscheidungen am Ende
  onComplete?: () => void
}

interface DialogueLine {
  text: string
  delay: number                 // ms zwischen Lines (typewriter effect)
}
```

### Sequential Reveal

Dialogue Lines erscheinen nacheinander mit Typewriter-Effekt:

1. Line 1 erscheint Buchstabe für Buchstabe
2. Warte `delay` ms
3. Line 2 erscheint
4. Etc.

Spieler kann durch Klick Skip/Speed-up, aber **nicht überspringen**. Emotional wichtige Momente brauchen Zeit.

### Speaker Styling

Jede Entität hat eigene Text-Farbe und Font-Style:
- **Pixel (Du):** Weiß, normal
- **Sun:** Gelb-Orange Gradient, warm
- **Andromeda:** Lila-Pink, sanft
- **Void:** Schwarz mit weißem Outline, bedrohlich

---

## Choice System

Choices sind die zentralen Momente, wo der Spieler die Story formt.

### Choice Format

```typescript
interface Choice {
  id: string                    // "phase7_consume_or_coexist"
  label: string                 // "Consume the Earth"
  description: string           // "More resources. Faster growth. No mercy."
  consequences: Consequence[]
  aestheticImpact?: string      // "Canvas turns red"
}

interface Consequence {
  type: "resource_add" | "flag_set" | "ending_unlock" | "phase_skip"
  payload: any
}
```

### Beispiel: Phase 7 - Consume vs Coexist

**Choice A: "Consume Earth"**
- Consequence: `{ type: "resource_add", payload: { pixels: 1e15 } }`
- Consequence: `{ type: "flag_set", payload: { key: "consumed_earth", value: true } }`
- Aesthetic: Canvas wird blutrot für 10 Sekunden
- Impact: Sun wird später aggressiver reagieren

**Choice B: "Coexist with Earth"**
- Consequence: `{ type: "resource_add", payload: { pixels: 1e12 } }` (weniger!)
- Consequence: `{ type: "flag_set", payload: { key: "peaceful_path", value: true } }`
- Aesthetic: Canvas bleibt harmonisch
- Impact: Sun wird später respektvoll sein

### Choice Memory

Alle Choices werden in `playerChoices` Map gespeichert:

```typescript
playerChoices.set("phase7_consume", "consume") // oder "coexist"
```

Diese Map wird für:
- **Story Branching:** Spätere Dialogues ändern sich
- **Ending Calculation:** Welches der 8 Endings passt?
- **Achievements:** "Peaceful Pixel" für alle friedlichen Choices

---

## Trigger System

Events müssen zur richtigen Zeit, unter den richtigen Bedingungen erscheinen.

### Trigger Types

**1. Resource Reached**
```typescript
{
  type: "resource_reached",
  resource: "pixels",
  value: 1e6,
  event: "first_million_log"
}
```

**2. Phase Entered**
```typescript
{
  type: "phase_entered",
  phase: 9,
  event: "last_human_encounter"
}
```

**3. Time Passed**
```typescript
{
  type: "time_passed",
  seconds: 600,  // 10 Minuten Spielzeit
  event: "patience_log"
}
```

**4. Condition Check**
```typescript
{
  type: "condition",
  check: () => gameState.pixels > 1e9 && playerChoices.get("phase2_order") === "order",
  event: "order_reflection"
}
```

### One-Time vs Repeatable

**One-Time Events:**
- Werden in `triggeredEvents` Set gespeichert
- Bei Trigger: `if (triggeredEvents.has(id)) return`
- Beispiel: First Clone, Sun Meeting, Last Human

**Repeatable Events:**
- Keine Set-Speicherung
- Beispiel: Milestone Logs (jede 10er-Potenz)

### Check Frequency

Der `NarrativeManager.tick()` läuft alle **5 Sekunden** (nicht jeden Frame!). Events müssen nicht frame-perfect sein.

---

## Emotional Moments

Bestimmte Story Beats brauchen spezielle Behandlung, weil sie emotional kritisch sind.

### Beispiel: "The Last Human" (Phase 9)

**Setup:**
- Trigger: Phase 9 Entry
- Pausiert alle anderen Dialogues
- Fullscreen Dialogue Overlay

**Sequence:**
1. Old Woman erscheint (Portrait Fade-In)
2. Dialogue: "Hello, little one. Are you here to consume me too?"
3. Player Choice:
   - "I don't want to hurt you"
   - "I have no choice. I must grow"
   - "..." (Schweigen)
4. Consequence basierend auf Choice
5. Old Woman verschwindet (Fade-Out)
6. Log: Player's internal reaction

**Technical:**
- Spezielle `EmotionalMoment` Komponente mit dramatischerem Styling
- Musik-Wechsel (falls Audio implementiert)
- Canvas-Effekt: Slow-Motion oder Freeze

### Weitere Emotional Moments

- **Phase 12 - Sun's Question:** "Why do you consume? What drives you?"
- **Phase 17 - Meeting Other Yous:** Multiverse-Konfrontation
- **Phase 20 - Final Choice:** 5 Optionen, jeweils eigenes Ending

---

## Story Branching

Choices verändern nicht nur Flags, sondern **spätere Dialogues**.

### Branching-Mechanik

Dialogues haben optional `conditions`:

```typescript
interface DialogueDefinition {
  id: string
  conditions?: () => boolean
  // ... rest
}
```

Beispiel:

```typescript
// Sun's Dialogue in Phase 15
{
  id: "sun_phase15_peaceful",
  conditions: () => playerChoices.get("phase7_consume") === "coexist",
  speaker: "The Sun",
  lines: [
    { text: "You showed mercy to the small world. Why?", delay: 2000 },
    { text: "Perhaps you are not like the others.", delay: 2000 }
  ]
}

{
  id: "sun_phase15_aggressive",
  conditions: () => playerChoices.get("phase7_consume") === "consume",
  speaker: "The Sun",
  lines: [
    { text: "You consumed the Earth without hesitation.", delay: 2000 },
    { text: "You are a monster. I will stop you.", delay: 2000 }
  ]
}
```

### Branch-Komplexität

Nicht zu viele Branches! Maximum **2-3 Story Paths** basierend auf:
- **Peaceful Path:** Koexistenz, Empathie, Zurückhaltung
- **Consuming Path:** Aggression, Wachstum über alles
- **Neutral Path:** Mix aus beidem

Final Choice in Phase 20 öffnet dann aus jedem Path verschiedene Endings.

---

## Integration mit GameEngine

Der `NarrativeManager` ist Teil der `GameEngine` und wird bei jedem `tick()` gecheckt:

```typescript
class GameEngine {
  narrative = new NarrativeManager(this)

  tick(deltaTime: number) {
    // ... Resource Updates, Phase Checks

    this.narrative.checkTriggers()  // Alle 5 Sekunden
    this.narrative.updateDialogue(deltaTime)
  }
}
```

### Event-Flow

1. Phase Transition passiert in `PhaseManager`
2. `PhaseManager` fired Event: `"phase_changed"`
3. `NarrativeManager` hört Event, checkt Trigger
4. Wenn Match: Füge Log hinzu oder starte Dialogue
5. UI-Komponenten reagieren auf `logs` und `activeDialogue` State

---

## Best Practices

### Writing Guidelines

- **Kurze Logs:** Max 1-2 Sätze
- **Philosophische Tiefe:** Existenzielle Fragen, nicht platte Beschreibungen
- **Humor mit Herz:** Witzig, aber nie zynisch
- **Show, don't tell:** "I feel... two?" statt "I just cloned myself"

### Performance

- **Lazy Loading:** Dialogue Definitions erst laden wenn Phase erreicht
- **Event Cleanup:** Alte Logs nach 100+ Entries archivieren (optional)
- **Tick Throttling:** Narrative Checks nur alle 5 Sekunden

### Testing

- **Story Playthrough:** Einmal jeden Story-Path durchspielen
- **Choice Testing:** Jede Choice einmal wählen, Consequences verifizieren
- **Trigger Testing:** Sicherstellen dass Events nicht doppelt feuern

---

## Nächste Schritte

1. **NarrativeManager Klasse implementieren** (05-implementation-roadmap.md)
2. **Dialogue Definitions schreiben** für Phase 1-5
3. **UI-Komponenten** für Log Display und Dialogue Overlay
4. **Trigger System testen** mit Mock-Events

Die Story ist das Herz. Alles andere ist Mechanik.
