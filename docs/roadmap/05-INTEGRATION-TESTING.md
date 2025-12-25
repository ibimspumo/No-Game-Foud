# Phase 5: Integration & Testing

**Priorität:** MITTEL
**Geschätzter Aufwand:** 3-4 Stunden
**Abhängigkeiten:** Phasen 1-4

---

## Ziel

Alle Systeme zusammenführen, durchspielen und sicherstellen, dass das Spiel von Phase 1 bis Phase 20 funktioniert.

---

## Aufgaben

### 5.1 End-to-End Gameplay Test

**Testplan:**
- [ ] Neues Spiel starten
- [ ] Phase 1 durchspielen (Klicken bis 64)
- [ ] Phase 2 Canvas füllen
- [ ] Phase 3 Gallery vollständig
- [ ] Phase 4 Screen konvertieren
- [ ] Phase 5 Room mit Events
- [ ] Phase 6-9 Civilization Arc
- [ ] Phase 10-15 Cosmic Arc
- [ ] Phase 16-20 Transcendence Arc
- [ ] Mindestens 1 Ending erreichen

**Checkliste pro Phase:**
```
□ Phase startet korrekt
□ UI zeigt richtige Komponente
□ Ressourcen werden produziert
□ Upgrades kaufbar
□ Logs erscheinen
□ Events triggern
□ Transition zur nächsten Phase funktioniert
```

---

### 5.2 Save/Load Verifizierung

**Tests:**
- [ ] Manuelles Speichern funktioniert
- [ ] Auto-Save alle 10 Sekunden
- [ ] Load bei Neustart korrekt
- [ ] Alle Daten wiederhergestellt:
  - Ressourcen
  - Producer-Levels
  - Upgrade-Levels
  - Aktuelle Phase
  - Narrative-State
  - Achievements
  - Statistics

**Edge Cases:**
- [ ] Save in mitten einer Phase-Transition
- [ ] Save während Dialog aktiv
- [ ] Corrupted Save handling
- [ ] Backup-Wiederherstellung

---

### 5.3 Phasen-Übergänge testen

Jede Transition muss smooth sein:

| Von | Nach | Trigger | Check |
|-----|------|---------|-------|
| 1 | 2 | 64 Pixels | Dialog + Animation |
| 2 | 3 | Canvas 100% | Gallery erscheint |
| 3 | 4 | 64 Canvases | Screen-View |
| 4 | 5 | Root Access | Room erscheint |
| 5 | 6 | 100% Room | House-View |
| 6 | 7 | 100% House | City-Map |
| 7 | 8 | 100% City | Country-Map |
| 8 | 9 | 100% Country | Earth-Globe |
| 9 | 10 | 100% Earth | Moon-View |
| 10 | 11 | 100% Moon | Solar System |
| 11 | 12 | 95% System | Sun Focus |
| 12 | 13 | 100% Sun | Milky Way |
| 13 | 14 | 100% Galaxy | Clusters |
| 14 | 15 | 100% Clusters | Universe |
| 15 | 16 | 100% Universe | Black Holes |
| 16 | 17 | Heat Death | Multiverse |
| 17 | 18 | 100% Multiverse | Void |
| 18 | 19 | Void Complete | Source Code |
| 19 | 20 | Code Consumed | The Player |

---

### 5.4 Story-Trigger verifizieren

**Für jede Phase:**
- [ ] Logs erscheinen bei korrekten Bedingungen
- [ ] Dialoge blockieren Gameplay korrekt
- [ ] Choices werden gespeichert
- [ ] Choice-Konsequenzen angewendet
- [ ] Events nicht mehrfach getriggert

**Kritische Story-Momente:**
- [ ] Phase 2: Order/Chaos Choice
- [ ] Phase 5: Room Events (Footsteps etc.)
- [ ] Phase 6: The Letter
- [ ] Phase 7: Consume/Coexist Choice
- [ ] Phase 8: President Dialog
- [ ] Phase 9: Last Human
- [ ] Phase 10: Apollo Flags Choice
- [ ] Phase 11: Europa Life Decision
- [ ] Phase 20: Final Choice → Ending

---

### 5.5 Achievements testen

**Categories:**
- [ ] Progress Achievements (Phasen erreichen)
- [ ] Resource Achievements (Mengen)
- [ ] Speed Achievements (Zeitlimits)
- [ ] Secret Achievements (versteckt)
- [ ] Choice Achievements (bestimmte Pfade)

**PP-Rewards:**
- [ ] Correct PP amount awarded
- [ ] PP persists across rebirths
- [ ] Total PP displayed correctly

---

### 5.6 Performance-Check

**Metriken:**
- [ ] FPS stabil bei 60
- [ ] Keine Memory Leaks über Zeit
- [ ] Save-Größe angemessen
- [ ] Tick-Time unter 16ms
- [ ] Große Zahlen (1e100+) funktionieren

---

## Test-Tools

### Debug-Befehle (in Console)

```javascript
// Phase skippen
game.phases.setPhase(10);

// Ressourcen hinzufügen
game.resources.add('pixels', D('1e50'));

// Achievement unlocken
game.achievements.unlock('first_pixel');

// Save löschen
game.deleteSave();
```

### Test-Mode

Überlege einen `?debug=true` Query-Parameter:
- Zeigt alle Logs
- Ermöglicht Phase-Skipping
- Zeigt versteckte Stats

---

## Akzeptanzkriterien

- [ ] Vollständiger Durchlauf von Phase 1-20 möglich
- [ ] Alle 9 Endings erreichbar
- [ ] Keine Crashes oder Freezes
- [ ] Save/Load zuverlässig
- [ ] Performance akzeptabel
