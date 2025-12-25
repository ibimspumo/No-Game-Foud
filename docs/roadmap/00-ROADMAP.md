# Pixel Singularity - Entwicklungs-Roadmap

## Status-Übersicht

| Bereich | Status | Fortschritt |
|---------|--------|-------------|
| Core Engine | ✅ Fertig | 100% |
| Manager-Systeme | ⚠️ Fast fertig | 95% |
| Story Content (Phase 1-9) | ✅ Fertig | 100% |
| Story Content (Phase 10-20) | ❌ Fehlt | 0% |
| UI Komponenten | ⚠️ Begonnen | 15% |
| Integration & Testing | ❌ Ausstehend | 0% |
| Polish & Balancing | ❌ Ausstehend | 0% |

---

## Entwicklungsphasen

### [Phase 1: Engine Fixes](./01-ENGINE-FIXES.md)
**Priorität:** HOCH | **Aufwand:** 1-2 Stunden

Kleine aber wichtige Fixes in der bestehenden Engine:
- [ ] TODO in ProducerManager fixen (Achievement-Check)
- [ ] SecretManager in Game.svelte.ts integrieren
- [ ] Story-Validierung implementieren
- [ ] Endings in NarrativeManager integrieren

---

### [Phase 2: Story Content](./02-STORY-CONTENT.md)
**Priorität:** HOCH | **Aufwand:** 4-6 Stunden

Story-Dateien für die fehlenden Phasen 10-20 erstellen:
- [ ] Phase 10: The Moon
- [ ] Phase 11: The Solar System
- [ ] Phase 12: The Sun
- [ ] Phase 13: The Milky Way
- [ ] Phase 14: Galaxy Clusters
- [ ] Phase 15: The Universe
- [ ] Phase 16: Black Holes
- [ ] Phase 17: The Multiverse
- [ ] Phase 18: The Void
- [ ] Phase 19: Source Code
- [ ] Phase 20: The Player

---

### [Phase 3: UI Komponenten](./03-UI-COMPONENTS.md)
**Priorität:** MITTEL | **Aufwand:** 8-12 Stunden

Svelte-Komponenten für jede Game-Phase:
- [x] Phase01Pixel.svelte
- [x] Phase02Canvas.svelte
- [ ] Phase03Gallery.svelte
- [ ] Phase04Screen.svelte
- [ ] Phase05Room.svelte
- [ ] Phase06House.svelte
- [ ] Phase07City.svelte
- [ ] Phase08Country.svelte
- [ ] Phase09Earth.svelte
- [ ] Phase10Moon.svelte
- [ ] Phase11SolarSystem.svelte
- [ ] Phase12Sun.svelte
- [ ] Phase13MilkyWay.svelte
- [ ] Phase14GalaxyClusters.svelte
- [ ] Phase15Universe.svelte
- [ ] Phase16BlackHoles.svelte
- [ ] Phase17Multiverse.svelte
- [ ] Phase18Void.svelte
- [ ] Phase19SourceCode.svelte
- [ ] Phase20Player.svelte

---

### [Phase 4: Systeme & Features](./04-SYSTEMS-FEATURES.md)
**Priorität:** MITTEL | **Aufwand:** 4-6 Stunden

Fehlende Gameplay-Systeme vervollständigen:
- [ ] Rebirth-System implementieren
- [ ] Ending-Sequenzen
- [ ] Skill-Tree UI
- [ ] Offline-Progress Popup

---

### [Phase 5: Integration & Testing](./05-INTEGRATION-TESTING.md)
**Priorität:** MITTEL | **Aufwand:** 3-4 Stunden

Alles zusammenführen und testen:
- [ ] End-to-End Gameplay testen
- [ ] Save/Load verifizieren
- [ ] Phasen-Übergänge testen
- [ ] Story-Trigger verifizieren
- [ ] Achievements testen

---

### [Phase 6: Polish & Balancing](./06-POLISH-BALANCING.md)
**Priorität:** NIEDRIG | **Aufwand:** Ongoing

Feinschliff und Anpassungen:
- [ ] Balancing der Zahlen
- [ ] Animationen verfeinern
- [ ] Sound-Integration
- [ ] Performance-Optimierung
- [ ] Accessibility

---

## Empfohlene Reihenfolge

```
1. Engine Fixes      → Fundament stabilisieren
       ↓
2. Story Content     → Narrative für alle Phasen
       ↓
3. UI Komponenten    → Visuelle Darstellung
       ↓
4. Systeme           → Gameplay-Features
       ↓
5. Integration       → Alles verbinden
       ↓
6. Polish            → Feinschliff
```

---

## Bekannte TODOs im Code

| Datei | Zeile | Beschreibung |
|-------|-------|--------------|
| `ProducerManager.svelte.ts` | 688 | Achievement-Check fehlt |
| `validators.ts` | 878 | Story-Validierung Placeholder |

---

## Dateien die noch erstellt werden müssen

### Story-Dateien
```
src/lib/engine/data/story/phases/
├── phase-10.story.ts  ❌
├── phase-11.story.ts  ❌
├── phase-12.story.ts  ❌
├── phase-13.story.ts  ❌
├── phase-14.story.ts  ❌
├── phase-15.story.ts  ❌
├── phase-16.story.ts  ❌
├── phase-17.story.ts  ❌
├── phase-18.story.ts  ❌
├── phase-19.story.ts  ❌
└── phase-20.story.ts  ❌
```

### UI-Komponenten
```
src/lib/components/phases/
├── Phase01Pixel.svelte       ✅
├── Phase02Canvas.svelte      ✅
├── Phase03Gallery.svelte     ❌
├── Phase04Screen.svelte      ❌
├── Phase05Room.svelte        ❌
├── Phase06House.svelte       ❌
├── Phase07City.svelte        ❌
├── Phase08Country.svelte     ❌
├── Phase09Earth.svelte       ❌
├── Phase10Moon.svelte        ❌
├── Phase11SolarSystem.svelte ❌
├── Phase12Sun.svelte         ❌
├── Phase13MilkyWay.svelte    ❌
├── Phase14GalaxyClusters.svelte ❌
├── Phase15Universe.svelte    ❌
├── Phase16BlackHoles.svelte  ❌
├── Phase17Multiverse.svelte  ❌
├── Phase18Void.svelte        ❌
├── Phase19SourceCode.svelte  ❌
└── Phase20Player.svelte      ❌
```
