# Phase 4: Systeme & Features

**Priorität:** MITTEL
**Geschätzter Aufwand:** 4-6 Stunden
**Abhängigkeiten:** Phase 1 (Engine Fixes), Phase 3 (UI teilweise)

---

## Ziel

Fehlende Gameplay-Systeme vervollständigen, die für das volle Spielerlebnis notwendig sind.

---

## Aufgaben

### 4.1 Rebirth-System implementieren

Das Rebirth/Prestige-System ist konzeptionell geplant, aber nicht vollständig implementiert.

**Benötigt:**
- [ ] `RebirthManager.svelte.ts` erstellen
- [ ] Primordial Pixels (PP) berechnen bei Rebirth
- [ ] Run-State zurücksetzen
- [ ] Eternal-State behalten
- [ ] Rebirth-Bonuses anwenden
- [ ] UI für Rebirth-Entscheidung

**Kernlogik:**
```typescript
class RebirthManager {
    canRebirth(): boolean {
        // Min. Phase 5 erreicht
        // Genug Pixels für PP
    }

    calculatePP(): Decimal {
        // Basierend auf Fortschritt
    }

    performRebirth(): void {
        // 1. PP gutschreiben
        // 2. Run-State resetten
        // 3. Eternal-Upgrades anwenden
        // 4. Achievements behalten
    }
}
```

**UI-Komponente:**
- `RebirthPanel.svelte` - Zeigt PP-Vorschau, Confirm-Dialog

---

### 4.2 Ending-Sequenzen

Die 9 Endings sind definiert in `endings.ts`, aber es fehlt:

**Benötigt:**
- [ ] `EndingSequence.svelte` Komponente
- [ ] Typewriter-Effekt für Ending-Text
- [ ] Visual Effects pro Ending-Typ
- [ ] Credits/Epilog-Anzeige
- [ ] "New Game+" Trigger

**Ending Visual Effects:**
| Ending | Effect |
|--------|--------|
| The Creator | `ascend` - Aufsteigendes Licht |
| The Destroyer | `consume` - Alles wird schwarz |
| The Observer | `fade` - Sanftes Ausblenden |
| The Merged | `merge` - Verschmelzung |
| The Lonely | `void` - Isolation |
| The Returner | `loop` - Zurückspulen |
| The Transcendent | `transcend` - Fourth Wall Break |
| The Escaped | `shatter` - Realität zerbricht |
| The Nothing | `void` - Langsame Offenbarung |

---

### 4.3 Skill-Tree UI

Die Eternal Upgrades bilden einen Skill-Tree mit 3 Pfaden:
- **Efficiency** (Blau) - Produktion
- **Discovery** (Grün) - Content freischalten
- **Transcendence** (Lila) - Meta-Upgrades

**Benötigt:**
- [ ] `SkillTree.svelte` Komponente
- [ ] Visuelle Darstellung der Pfade
- [ ] Unlock-Zustand anzeigen
- [ ] Kosten & Effekte
- [ ] Purchase-Interaktion

**Layout-Konzept:**
```
        [Capstone]
           │
    ┌──────┼──────┐
    │      │      │
   [3]    [3]    [3]
    │      │      │
   [2]    [2]    [2]
    │      │      │
   [1]    [1]    [1]
    │      │      │
    └──────┴──────┘
         [Start]
```

---

### 4.4 Offline-Progress Popup

Bei Rückkehr zum Spiel soll ein Popup die Offline-Gewinne zeigen.

**Benötigt:**
- [ ] `OfflineGainsModal.svelte`
- [ ] Zeit weg anzeigen
- [ ] Gewonnene Ressourcen
- [ ] "Collect" Button
- [ ] Optional: Bonus durch Werbung (später)

**Daten von OfflineProgress.ts:**
```typescript
{
    timeAway: number,        // Sekunden
    cappedTime: number,      // Gecappte Zeit
    efficiency: number,      // Multiplikator
    dreamPixels: Decimal,    // Gewonnene Pixels
}
```

---

### 4.5 Settings-Panel

**Benötigt:**
- [ ] `SettingsPanel.svelte`
- [ ] Toggle: Auto-Save
- [ ] Toggle: Notifications
- [ ] Toggle: Musik/Sound (wenn implementiert)
- [ ] Notation-Style (Scientific, Engineering, etc.)
- [ ] Export/Import Save
- [ ] Hard Reset Button (mit Confirm)

---

### 4.6 Achievement-Panel Erweiterung

`AchievementList.svelte` existiert bereits, braucht aber:

- [ ] Kategorisierung nach Typ
- [ ] Progress-Tracking für incomplete Achievements
- [ ] Rarity/Tier-Anzeige
- [ ] PP-Reward-Anzeige
- [ ] Secrets verstecken bis entdeckt

---

## Akzeptanzkriterien

- [ ] Rebirth funktioniert und resetzt korrekt
- [ ] Alle 9 Endings spielbar
- [ ] Skill-Tree kaufbar und funktional
- [ ] Offline-Popup erscheint bei Rückkehr
- [ ] Settings persistent gespeichert
