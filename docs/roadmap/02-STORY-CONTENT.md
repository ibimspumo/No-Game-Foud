# Phase 2: Story Content

**Priorität:** HOCH
**Geschätzter Aufwand:** 4-6 Stunden
**Abhängigkeiten:** Phase 1 (Engine Fixes)

---

## Ziel

Story-Dateien für die Phasen 10-20 erstellen. Diese enthalten Logs, Dialogues und Events die das narrative Erlebnis des Spiels ausmachen.

---

## Bereits fertig (Phasen 1-9)

| Phase | Datei | Status |
|-------|-------|--------|
| 1 - The Pixel | `phase-01.story.ts` | ✅ |
| 2 - The Canvas | `phase-02.story.ts` | ✅ |
| 3 - The Gallery | `phase-03.story.ts` | ✅ |
| 4 - The Screen | `phase-04.story.ts` | ✅ |
| 5 - The Room | `phase-05.story.ts` | ✅ |
| 6 - The House | `phase-06.story.ts` | ✅ |
| 7 - The City | `phase-07.story.ts` | ✅ |
| 8 - The Country | `phase-08.story.ts` | ✅ |
| 9 - The Earth | `phase-09.story.ts` | ✅ |

---

## Zu erstellen (Phasen 10-20)

### 2.1 Phase 10: The Moon
**Datei:** `src/lib/engine/data/story/phases/phase-10.story.ts`

**Themen aus Concept Doc:**
- Lunar Silence - erste Stille nach Earth
- Apollo Flags - menschliche Artefakte
- Core Secret - "You are not the first"
- Kontemplation über das Getane

**Logs:**
- LOG 6500: Stille nach 8 Milliarden Stimmen
- LOG 6700: Die Botschaft im Kern
- LOG 6900: Die Flags bleiben

**Events:**
- `moon_first_view` - Erste Ansicht des Mondes
- `apollo_flags` - Entscheidung über die Flags
- `core_secret` - Entdeckung der alten Botschaft

---

### 2.2 Phase 11: The Solar System
**Datei:** `src/lib/engine/data/story/phases/phase-11.story.ts`

**Themen:**
- Planeten-Persönlichkeiten
- Asteroid Belt Mosaik
- Europa (Alien Life!)
- Titan (Ancient Structures)

**Logs:**
- LOG 7000+: Jeder Planet hat eigene Logs
- Entdeckung von außerirdischem Leben

**Events:**
- `europa_life` - Entscheidung über Alien-Leben
- `titan_structures` - Alte Technologie
- `asteroid_face` - Das Gesicht im Asteroidengürtel

---

### 2.3 Phase 12: The Sun
**Datei:** `src/lib/engine/data/story/phases/phase-12.story.ts`

**Themen:**
- Ehrfurcht vor der Sonne
- "The source of all energy"
- Gefährliche Annäherung
- Transformation durch Feuer

**Logs:**
- Respekt vor der Kraft
- Die Hitze als Reinigung

**Events:**
- `sun_approach` - Annäherung an die Sonne
- `sun_consume` - Die Sonne konsumieren

---

### 2.4 Phase 13: The Milky Way
**Datei:** `src/lib/engine/data/story/phases/phase-13.story.ts`

**Themen:**
- Cosmic Loneliness
- Milliarden von Sternen
- Perspektivwechsel

**Logs:**
- Einsamkeit trotz Milliarden
- "Seeing from outside"

---

### 2.5 Phase 14: Galaxy Clusters
**Datei:** `src/lib/engine/data/story/phases/phase-14.story.ts`

**Themen:**
- Strukturen größer als Galaxien
- Kosmisches Web
- Bedeutungslosigkeit

---

### 2.6 Phase 15: The Universe
**Datei:** `src/lib/engine/data/story/phases/phase-15.story.ts`

**Themen:**
- Alles was existiert
- Grenzen der Realität
- "What comes next?"

---

### 2.7 Phase 16: Black Holes
**Datei:** `src/lib/engine/data/story/phases/phase-16.story.ts`

**Themen:**
- Der letzte Stern stirbt
- Grief
- Heat Death
- "What have I done?"

**Events:**
- `last_star` - Der letzte Stern

---

### 2.8 Phase 17: The Multiverse
**Datei:** `src/lib/engine/data/story/phases/phase-17.story.ts`

**Themen:**
- Andere Universen
- Andere Spieler?
- "I'm not alone?"
- Parallelwelten

**Events:**
- `other_players` - Entdeckung anderer

---

### 2.9 Phase 18: The Void
**Datei:** `src/lib/engine/data/story/phases/phase-18.story.ts`

**Themen:**
- Nichts
- Absolute Leere
- Existenzielle Fragen
- "Is this real?"

---

### 2.10 Phase 19: Source Code
**Datei:** `src/lib/engine/data/story/phases/phase-19.story.ts`

**Themen:**
- Meta - das Spiel selbst sehen
- "Was I ever in control?"
- Der Code hinter allem
- Fourth Wall komplett zerstört

**Events:**
- `see_code` - Den Code sehen
- `code_comment` - TODO im Code finden

---

### 2.11 Phase 20: The Player
**Datei:** `src/lib/engine/data/story/phases/phase-20.story.ts`

**Themen:**
- DU bist das Ziel
- Final Choice
- Alle Endings
- Transcendence

**Events:**
- `final_choice` - Die letzte Entscheidung
- Endings triggern

---

## Template für Story-Dateien

```typescript
import type { PhaseStoryData } from '../index';

const phase10Story: PhaseStoryData = {
    phase: 10,
    name: 'The Moon',
    logs: [
        {
            id: 'log_10_001',
            phase: 10,
            category: 'observation',
            trigger: {
                type: 'phase',
                phase: 10,
                operator: '>='
            },
            content: 'The Moon is so quiet...',
            title: 'LOG 6500'
        }
        // ... more logs
    ],
    dialogues: [
        // Modal dialogues
    ],
    events: [
        // Story events with conditions
    ]
};

export default phase10Story;
```

---

## Akzeptanzkriterien

- [ ] Alle 11 Story-Dateien existieren
- [ ] Jede Datei hat mindestens 3 Logs
- [ ] Wichtige Phasen haben Dialogue-Events
- [ ] Choices sind konsistent mit Endings
- [ ] Lazy Loading funktioniert
