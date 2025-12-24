# 08 - UI Integration

## Übersicht

Die UI-Schicht verbindet die Game Engine mit Svelte 5 Components. Reaktivität erfolgt über Svelte 5 Runes (`$state`, `$derived`, `$effect`), die direkt in den Manager-Klassen verwendet werden.

**Zentrale Konzepte:**
- Game-Instanz via Context API bereitstellen
- Manager nutzen `$state` für reaktive Properties
- Components greifen via `getContext` auf Game zu
- Zwei visuelle Modi: Pixel Mode (Phase 1-10) und Abstract Mode (Phase 11-20)

---

## Context Pattern

### Game-Instanz bereitstellen

In `src/routes/+layout.svelte` wird die Game-Instanz erstellt und im Context gespeichert:

```typescript
// Context Key für Type Safety
const GAME_KEY = Symbol('game');

// Im <script>
import { setContext } from 'svelte';
import { Game } from '$lib/game/Game';

const game = new Game();
setContext(GAME_KEY, game);
```

### Zugriff in Components

```typescript
// In beliebigem Child Component
import { getContext } from 'svelte';

const game = getContext<Game>(GAME_KEY);
```

### TypeScript Typing

Context Helper für Type Safety:

```typescript
// lib/game/context.ts
export const GAME_CONTEXT_KEY = Symbol('game');

export function setGameContext(game: Game) {
  setContext(GAME_CONTEXT_KEY, game);
}

export function getGameContext(): Game {
  return getContext<Game>(GAME_CONTEXT_KEY);
}
```

---

## Reactive State in Managern

### $state in Klassen

Manager-Klassen nutzen `$state` direkt:

```typescript
class ResourceManager {
  pixels = $state(0);
  canvas = $state(0);

  addPixels(amount: number) {
    this.pixels += amount;
  }
}
```

### Automatische Component-Reaktivität

Components reagieren automatisch auf Änderungen:

```svelte
<script>
  const game = getGameContext();
</script>

<div>Pixels: {game.resources.pixels}</div>
```

### $derived für berechnete Werte

```typescript
class ResourceManager {
  pixels = $state(0);
  canvas = $state(0);

  totalResources = $derived(this.pixels + this.canvas);
}
```

---

## Component-Struktur

### Verzeichnis-Organisation

```
src/lib/components/
├── core/           # Wiederverwendbare Base Components
│   ├── PixelGrid.svelte
│   ├── CanvasThumbnail.svelte
│   ├── ProgressBar.svelte
│   ├── Counter.svelte
│   ├── TextReveal.svelte
│   └── Modal.svelte
├── phases/         # Phasenspezifische Components
│   ├── Phase01Pixel.svelte
│   ├── Phase02Canvas.svelte
│   ├── Phase11Abstract.svelte
│   └── Phase20Player.svelte
├── ui/             # Layout und Overlays
│   ├── Header.svelte
│   ├── Sidebar.svelte
│   ├── Dialogue.svelte
│   └── ChoicePanel.svelte
└── effects/        # Visuelle Effekte
    ├── Starfield.svelte
    ├── Glitch.svelte
    └── Pulse.svelte
```

### Core Components

**Pixel Mode:**
- `PixelGrid.svelte` - Interaktives Grid für einzelne Pixel
- `CanvasThumbnail.svelte` - Preview für Canvas-Objekte
- `Counter.svelte` - Animierte Zahlenanzeige

**Abstract Mode:**
- `TextReveal.svelte` - Schrittweise Text-Enthüllung
- `AbstractView.svelte` - Dots/Linien Darstellung
- `ProgressBar.svelte` - Fortschrittsbalken

**Universal:**
- `Modal.svelte` - Basis für Dialoge und Overlays

### Phase Components

Jede Phase hat ein dediziertes Component:
- `Phase01Pixel.svelte` - Initiale Pixel-Sammlung
- `Phase02Canvas.svelte` - Canvas-Erstellung
- `Phase11Abstract.svelte` - Übergang zu abstrakten Konzepten
- `Phase20Player.svelte` - Meta-Ebene: Spieler im Spiel

### UI Components

**Layout:**
- `Header.svelte` - Ressourcen-Anzeige, Phase-Indikator
- `Sidebar.svelte` - Upgrades, Actions, Achievements

**Overlays:**
- `Dialogue.svelte` - Story-Dialoge mit Typer-Effekt
- `ChoicePanel.svelte` - Narrative Choices
- `AchievementNotification.svelte` - Achievement Popups

### Effect Components

**Visuelle Effekte:**
- `Starfield.svelte` - Hintergrund-Effekt für spätere Phasen
- `Glitch.svelte` - Glitch-Effekt für "Breaching"-Momente
- `Pulse.svelte` - Puls-Animation für wichtige Elemente

---

## Phase Component Switching

### Dynamisches Laden

```svelte
<script>
  import { getGameContext } from '$lib/game/context';

  const game = getGameContext();

  // Map Phase IDs zu Components
  const phaseComponents = {
    'pixel-genesis': Phase01Pixel,
    'canvas-creation': Phase02Canvas,
    'abstract-dawn': Phase11Abstract,
    'player-awakening': Phase20Player
  };

  // Aktuelles Component basierend auf Phase
  const currentComponent = $derived(
    phaseComponents[game.phase.currentPhase?.id]
  );
</script>

<svelte:component this={currentComponent} />
```

### Alternative: If-Blocks

```svelte
{#if game.phase.currentPhase?.id === 'pixel-genesis'}
  <Phase01Pixel />
{:else if game.phase.currentPhase?.id === 'canvas-creation'}
  <Phase02Canvas />
{/if}
```

### Transition zwischen Phasen

```svelte
<script>
  import { fade, fly } from 'svelte/transition';
</script>

{#key game.phase.currentPhase?.id}
  <div in:fly={{ y: 20, duration: 300 }} out:fade={{ duration: 200 }}>
    <svelte:component this={currentComponent} />
  </div>
{/key}
```

---

## Modal/Overlay System

### Story Dialoge

```svelte
<!-- Dialogue.svelte -->
<script>
  export let dialogue: StoryDialogue;
  export let onClose: () => void;
</script>

<Modal {onClose}>
  <TextReveal text={dialogue.text} speed={dialogue.typeSpeed} />
  {#if dialogue.choices}
    <ChoicePanel choices={dialogue.choices} />
  {/if}
</Modal>
```

### Choice Panels

```svelte
<!-- ChoicePanel.svelte -->
<script>
  export let choices: Choice[];

  const game = getGameContext();

  function handleChoice(choice: Choice) {
    game.story.makeChoice(choice.id);
  }
</script>

<div class="choices">
  {#each choices as choice}
    <button
      onclick={() => handleChoice(choice)}
      disabled={!choice.available}
    >
      {choice.text}
    </button>
  {/each}
</div>
```

### Achievement Notifications

```svelte
<!-- AchievementNotification.svelte -->
<script>
  import { fade, fly } from 'svelte/transition';

  const game = getGameContext();

  // Zeige neueste Achievements
  const recentAchievements = $derived(
    game.achievements.getUnlocked().slice(-3)
  );
</script>

{#each recentAchievements as achievement (achievement.id)}
  <div class="notification" in:fly={{ x: 100 }} out:fade>
    <h4>{achievement.name}</h4>
    <p>{achievement.description}</p>
  </div>
{/each}
```

---

## Responsive Design

### Mobile-First Approach

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**CSS Variables:**
```css
:root {
  --grid-size: 10; /* Mobile */
  --pixel-size: 20px;
  --touch-target: 44px; /* iOS minimum */
}

@media (min-width: 640px) {
  :root {
    --grid-size: 15; /* Tablet */
    --pixel-size: 24px;
  }
}

@media (min-width: 1024px) {
  :root {
    --grid-size: 20; /* Desktop */
    --pixel-size: 32px;
  }
}
```

### Touch-Friendly Pixel Grids

```svelte
<script>
  let touchTargetSize = $state(44); // iOS guideline

  // Vergrößere Touch-Targets auf Mobile
  $effect(() => {
    if (window.innerWidth < 640) {
      touchTargetSize = 44;
    } else {
      touchTargetSize = 32;
    }
  });
</script>

<style>
  .pixel {
    min-width: var(--touch-target);
    min-height: var(--touch-target);
  }
</style>
```

### Layout Anpassungen

**Mobile:**
- Single Column Layout
- Sidebar als Bottom Sheet oder Drawer
- Header kompakt (nur wichtigste Ressourcen)

**Desktop:**
- Two/Three Column Layout
- Persistent Sidebar
- Expanded Header mit allen Ressourcen

---

## Animation Guidelines

### Phase-Abhängige Animation Speed

```typescript
class AnimationConfig {
  static getSpeed(phase: number): number {
    if (phase <= 5) return 1.0; // Normal
    if (phase <= 10) return 1.5; // Schneller
    if (phase <= 15) return 2.0; // Sehr schnell
    return 3.0; // Maximum
  }
}
```

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```svelte
<script>
  let prefersReducedMotion = $state(false);

  $effect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', (e) => {
      prefersReducedMotion = e.matches;
    });
  });
</script>
```

### CSS Animations vs Svelte Transitions

**CSS Animations:**
- Für kontinuierliche Effekte (Pulse, Rotation)
- Bessere Performance (GPU-beschleunigt)
- Nutze für Hintergrund-Effekte

**Svelte Transitions:**
- Für Component Ein/Aus
- Phase Transitions
- Modal Overlays

**Best Practice:**
```svelte
<script>
  import { fade } from 'svelte/transition';
</script>

<style>
  /* CSS für kontinuierliche Animation */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .pulsing {
    animation: pulse 2s infinite;
  }
</style>

<!-- Svelte Transition für Mount/Unmount -->
<div transition:fade class="pulsing">
  Pulsing Element
</div>
```

---

## Integration Checklist

- [ ] Context Setup in +layout.svelte
- [ ] Core Components erstellt
- [ ] Phase Components für Phase 1-3
- [ ] Modal System implementiert
- [ ] Responsive Breakpoints definiert
- [ ] Animation Speed Config
- [ ] prefers-reduced-motion Support
- [ ] Touch-Targets für Mobile optimiert
