# Phase 3: UI Komponenten

**Priorität:** MITTEL
**Geschätzter Aufwand:** 8-12 Stunden
**Abhängigkeiten:** Phase 1 (Engine Fixes)

---

## Ziel

Svelte-Komponenten für jede der 20 Game-Phasen erstellen. Jede Phase hat eine einzigartige visuelle Darstellung, die das Thema widerspiegelt.

---

## Bereits fertig

| Komponente | Status | Beschreibung |
|------------|--------|--------------|
| `Phase01Pixel.svelte` | ✅ | Einzelner Pixel, minimalistisch |
| `Phase02Canvas.svelte` | ✅ | 8x8 Grid zum Füllen |

---

## Zu erstellen

### Gruppe 1: Lokale Skala (Phasen 3-6)

#### 3.1 Phase03Gallery.svelte
**Konzept:** Grid von Canvas-Thumbnails, Gallery-Atmosphäre

**Features:**
- Grid von kleinen Canvases (6x12 oder ähnlich)
- Jedes Canvas zeigt Fortschritt
- Hover zeigt Details
- "Gallery Units" Counter

**UI-Elemente:**
- Canvas-Grid
- Fortschrittsbalken pro Canvas
- Gesamtfortschritt

---

#### 3.2 Phase04Screen.svelte
**Konzept:** Computer-Desktop Simulation

**Features:**
- Fake Desktop mit Icons
- Browser-Fenster (die Gallery)
- "Programme" zum Konvertieren
- Antivirus-Events

**UI-Elemente:**
- Desktop Icons
- Taskleiste
- Fortschrittsbalken für Konvertierung
- Popup-Fenster für Events

---

#### 3.3 Phase05Room.svelte
**Konzept:** Isometrische/2.5D Raum-Ansicht

**Features:**
- Raum mit Objekten
- Objekte werden pixelig
- Atmosphärische Beleuchtung
- "Anwesenheits"-Hinweise

**UI-Elemente:**
- Objekt-Liste mit Status
- Konvertierungs-Fortschritt
- Ambient Events

---

#### 3.4 Phase06House.svelte
**Konzept:** Haus-Grundriss/Querschnitt

**Features:**
- Mehrere Stockwerke
- Räume zum Auswählen
- Familie-Hinweise
- Basement-Mystery

**UI-Elemente:**
- Raum-Karte
- Raum-Details Panel
- Memory Fragments

---

### Gruppe 2: Zivilisation (Phasen 7-9)

#### 3.5 Phase07City.svelte
**Konzept:** Stadt-Karte von oben

**Features:**
- Distrikte mit verschiedenen Farben
- Awareness-Meter
- Military Response Events
- City AI Boss

**UI-Elemente:**
- Interaktive Karte
- Distrikt-Info Sidebar
- Awareness-Anzeige
- Resistance-Events

---

#### 3.6 Phase08Country.svelte
**Konzept:** Landkarte mit Städten als Punkten

**Features:**
- Country Shape
- Städte als Dots
- Militär-Perimeter
- President-Dialog

**UI-Elemente:**
- Karten-View
- Region-Auswahl
- Military Status
- Conversion Waves

---

#### 3.7 Phase09Earth.svelte
**Konzept:** Erde aus dem Weltraum

**Features:**
- Rotating Globe (oder statisch)
- Kontinente konvertieren
- Emotionale Momente
- "Last Human" Event

**UI-Elemente:**
- Globe-Visualisierung
- Continent Progress
- Global Events Panel
- Final Broadcast

---

### Gruppe 3: Kosmisch (Phasen 10-15)

#### 3.8 Phase10Moon.svelte
**Konzept:** Mond mit Erde im Hintergrund

**Features:**
- Stille Atmosphäre
- Krater-Locations
- Apollo Sites
- Core Mystery

---

#### 3.9 Phase11SolarSystem.svelte
**Konzept:** Orrery/Planeten-Diagramm

**Features:**
- Sonne im Zentrum
- Planeten auf Orbits
- Jeder Planet anklickbar
- Asteroid Belt

---

#### 3.10 Phase12Sun.svelte
**Konzept:** Intensive Sonnen-Visualisierung

**Features:**
- Flare-Animationen
- Gefährliche Nähe
- Heat-Meter
- Majestätisch und bedrohlich

---

#### 3.11 Phase13MilkyWay.svelte
**Konzept:** Spiral-Galaxie von außen

**Features:**
- Spiralarme
- "We are here" Marker
- Unendlichkeit andeuten

---

#### 3.12 Phase14GalaxyClusters.svelte
**Konzept:** Kosmisches Web aus Galaxien

**Features:**
- Punkte = Galaxien
- Verbindungslinien
- Zoom-Effekt

---

#### 3.13 Phase15Universe.svelte
**Konzept:** Abstrakte Darstellung von "Allem"

**Features:**
- Cosmic Microwave Background
- Expandierende Kreise
- "Edge of Everything"

---

### Gruppe 4: Transzendenz (Phasen 16-20)

#### 3.14 Phase16BlackHoles.svelte
**Konzept:** Schwarze Löcher, Heat Death

**Features:**
- Letzte Sterne sterben
- Event Horizons
- Dunkelheit breitet sich aus
- Trauer-Atmosphäre

---

#### 3.15 Phase17Multiverse.svelte
**Konzept:** Parallelwelten/Bubbles

**Features:**
- Universen als Blasen
- Andere "Spieler" andeuten
- Unendliche Möglichkeiten

---

#### 3.16 Phase18Void.svelte
**Konzept:** Absolute Leere

**Features:**
- Fast schwarzer Bildschirm
- Minimale UI
- Existenzielle Stille
- Glitch-Effekte

---

#### 3.17 Phase19SourceCode.svelte
**Konzept:** Matrix-Style Code-Rain

**Features:**
- Fallender Code
- Game-Code sichtbar machen
- Meta-Kommentare
- Fourth Wall Break

---

#### 3.18 Phase20Player.svelte
**Konzept:** Spiegel/Reflektion

**Features:**
- "Du bist das Ziel"
- Webcam-Integration? (optional)
- Final Choice UI
- Ending-Sequenzen

---

## Shared Components (bereits teilweise vorhanden)

- `PixelGrid.svelte` - Wiederverwendbar für Grid-Phasen
- `ProgressBar.svelte` - Fortschrittsanzeigen
- `Starfield.svelte` - Hintergrund für kosmische Phasen
- `Glitch.svelte` - Effekte für späte Phasen
- `Pulse.svelte` - Animationseffekte

---

## PhaseView.svelte Integration

Die bestehende `PhaseView.svelte` sollte als Router fungieren:

```svelte
{#if currentPhase === 1}
    <Phase01Pixel />
{:else if currentPhase === 2}
    <Phase02Canvas />
{:else if currentPhase === 3}
    <Phase03Gallery />
<!-- etc. -->
{/if}
```

---

## Akzeptanzkriterien

- [ ] Alle 20 Phase-Komponenten existieren
- [ ] Jede Komponente ist visuell distinkt
- [ ] Smooth Transitions zwischen Phasen
- [ ] Responsive Design
- [ ] Konsistente Interaktion
