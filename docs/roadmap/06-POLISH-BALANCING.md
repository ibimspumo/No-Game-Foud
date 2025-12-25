# Phase 6: Polish & Balancing

**Priorität:** NIEDRIG (aber ongoing)
**Geschätzter Aufwand:** Ongoing
**Abhängigkeiten:** Phasen 1-5 abgeschlossen

---

## Ziel

Feinschliff, Balancing und Qualitätsverbesserungen für ein poliertes Endprodukt.

---

## Aufgaben

### 6.1 Zahlen-Balancing

Die Werte in `constants.ts` müssen durch Playtesting angepasst werden.

**Zu balancieren:**

| Konstante | Aktuell | Bereich | Notizen |
|-----------|---------|---------|---------|
| `BASE_PIXEL_RATE` | 1 | 1-10 | Basis-Klickwert |
| `PIXEL_SCALE_EXPONENT` | 1.15 | 1.1-1.5 | Exponentielles Wachstum |
| `COLOR_DROP_CHANCE` | 0.01 | 0.005-0.05 | Rarität von Farben |
| `UPGRADE_COST_EXPONENT` | 1.5 | 1.3-2.0 | Kostenkurve |
| `PRESTIGE_REQUIREMENT_BASE` | 1M | 100K-10M | Erster Rebirth |
| `OFFLINE_EFFICIENCY` | 0.5 | 0.25-0.75 | Offline-Multiplikator |

**Ziele:**
- [ ] Phase 1-3 sollten 5-15 Minuten dauern
- [ ] Phase 4-9 je 30-60 Minuten
- [ ] Phase 10-15 je 1-2 Stunden
- [ ] Phase 16-20 je 2-4 Stunden
- [ ] Voller Durchlauf: 15-25 Stunden

---

### 6.2 Animationen verfeinern

**Bereiche:**

#### Phase-Transitions
- [ ] Smooth Fade zwischen Phasen
- [ ] Zoom-Out Effekt (Room → House → City etc.)
- [ ] Thematische Übergänge

#### UI-Animationen
- [ ] Button Hover/Click Feedback
- [ ] Counter-Rollups (Zahlen animieren)
- [ ] Achievement-Unlock Celebration
- [ ] Upgrade-Kauf Feedback

#### Effekt-Animationen
- [ ] Pixel-Pulse bei Click
- [ ] Conversion-Waves
- [ ] Starfield-Parallax
- [ ] Glitch-Effekte für späte Phasen

---

### 6.3 Sound-Integration

**Sound-Kategorien:**

#### Musik
- [ ] Ambient Tracks pro Phase-Gruppe
  - Phase 1-3: Minimal, ruhig
  - Phase 4-6: Unheimlich, personal
  - Phase 7-9: Episch, orchestral
  - Phase 10-15: Kosmisch, spacey
  - Phase 16-20: Abstract, ethereal

#### Sound Effects
- [ ] Click-Sound (satisfying!)
- [ ] Purchase-Sound
- [ ] Level-Up Sound
- [ ] Achievement-Sound
- [ ] Phase-Transition
- [ ] Dialog-Typewriter

**Implementation:**
- [ ] Howler.js oder Web Audio API
- [ ] Volume Controls
- [ ] Mute Toggle
- [ ] Seamless Looping

---

### 6.4 Performance-Optimierung

**Potenzielle Bottlenecks:**

#### Rendering
- [ ] Canvas statt DOM für große Grids
- [ ] RequestAnimationFrame optimieren
- [ ] Visibility API nutzen (Tab-Pause)

#### State Updates
- [ ] Batch-Updates statt einzeln
- [ ] Memoization für teure Berechnungen
- [ ] Lazy-Loading für Story-Content

#### Memory
- [ ] Event-Listener Cleanup
- [ ] Alte Logs begrenzen (max 1000?)
- [ ] Producer-State komprimieren

**Ziel-Metriken:**
- Tick-Time < 5ms
- FPS konstant 60
- Save-Größe < 100KB
- Initial Load < 2 Sekunden

---

### 6.5 Accessibility

#### Keyboard Navigation
- [ ] Tab-Navigation durch UI
- [ ] Enter für Actions
- [ ] Escape für Modal schließen
- [ ] Shortcuts (S = Save, etc.)

#### Screen Reader
- [ ] ARIA Labels
- [ ] Alt-Text für visuelle Elemente
- [ ] Announcements für Events

#### Visual
- [ ] High Contrast Mode
- [ ] Font-Size Scaling
- [ ] Colorblind-friendly Palette

#### Motion
- [ ] Reduced Motion Option
- [ ] Pause-fähige Animationen

---

### 6.6 Localization (Optional/Später)

**Sprachen:**
- [x] Englisch (Basis)
- [ ] Deutsch
- [ ] Weitere nach Bedarf

**Implementation:**
- [ ] i18n Library (svelte-i18n?)
- [ ] Alle Strings extrahieren
- [ ] Story-Content separieren
- [ ] RTL Support (falls nötig)

---

### 6.7 Mobile Support (Optional)

**Touch-Optimierungen:**
- [ ] Tap statt Click
- [ ] Swipe für Navigation
- [ ] Größere Touch-Targets
- [ ] Responsive Layouts

**PWA:**
- [ ] Service Worker
- [ ] Offline Support
- [ ] Install Prompt
- [ ] App-Icon

---

### 6.8 Analytics (Optional)

**Tracking:**
- [ ] Phase-Completion Rates
- [ ] Average Playtime
- [ ] Drop-off Points
- [ ] Ending Distribution
- [ ] Upgrade Popularity

**Tools:**
- Simple Analytics / Plausible (Privacy-friendly)
- Custom Event Logging

---

## Checkliste vor Release

- [ ] Alle Phasen spielbar
- [ ] Alle Endings erreichbar
- [ ] Keine bekannten Bugs
- [ ] Performance akzeptabel
- [ ] Save/Load zuverlässig
- [ ] Sounds funktionieren
- [ ] Responsive auf gängigen Geräten
- [ ] Keine Console-Errors
- [ ] Favicon & Meta-Tags
- [ ] README aktuell

---

## Post-Release

- [ ] Bug Reports sammeln
- [ ] Feedback auswerten
- [ ] Balancing anpassen
- [ ] Content Updates planen
- [ ] Community aufbauen
