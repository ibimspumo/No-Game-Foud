# Resource System

## Übersicht

Das "Pixel Singularity" Idle Game arbeitet mit massiven Zahlen - von 1 Pixel in Phase 1 bis zu Septillionen von Sternen in Phase 12. JavaScript's native `Number` Typ versagt bei `2^53` (ca. 9 Billiarden), was bereits in frühen Phasen erreicht wird.

**Lösung:** `break_eternity.js` - Eine BigNumber-Bibliothek speziell für Idle Games entwickelt.

### Ressourcen-Kategorien

1. **Run Resources** - Werden bei Rebirth zurückgesetzt (Pixels, Colors, Memory Fragments)
2. **Phase Resources** - Phasenspezifisch, bei Phase-Wechsel relevant (Knowledge, Power, Harmony)
3. **Eternal Resources** - Überleben Rebirth (Primordial Pixels, Dream Pixels)

---

## BigNumber Integration

### Warum break_eternity.js?

- **Performance:** Optimiert für Idle Games mit tausenden Berechnungen pro Tick
- **Notation Support:** Eingebaute Formatierung bis e1e308
- **API:** Einfacher als decimal.js, weniger Overhead
- **Kompatibilität:** Funktioniert perfekt mit Svelte 5 $state

### Wrapper-Funktionen

```typescript
// utils/bigNumber.ts
import Decimal from 'break_eternity.js';

export const BN = (value: number | string | Decimal) => new Decimal(value);
export const ZERO = BN(0);
export const ONE = BN(1);
```

### Grundlegende Operationen

```typescript
// Addition
const total = pixelAmount.add(newPixels);

// Multiplikation (Production)
const produced = baseRate.mul(multiplier).mul(deltaTime);

// Vergleiche
if (pixels.gte(cost)) { /* can afford */ }
```

---

## ResourceManager Design

### Core Structure

Der `ResourceManager` nutzt Svelte 5 `$state` für reaktive Updates:

```typescript
class ResourceManager {
  amounts = $state<Record<string, Decimal>>({});
  productionRates = $state<Record<string, Decimal>>({});

  add(resource: string, amount: Decimal): void
  get(resource: string): Decimal
  canAfford(resource: string, cost: Decimal): boolean
  update(deltaTime: number): void
}
```

### Flexibilität durch Record

Statt fester Properties (`this.pixels`, `this.colors`) nutzen wir ein `Record`:

**Vorteile:**
- Dynamisches Hinzufügen neuer Ressourcen zur Laufzeit
- Phasen können eigene Ressourcen registrieren
- Einfache Iteration für Save/Load
- Keine Code-Änderungen für neue Ressourcen

**Beispiel:**
```typescript
// Phase 2 registriert Colors
resourceManager.register('red', ZERO);
resourceManager.register('green', ZERO);
resourceManager.register('blue', ZERO);
```

### Production Rates vs Current Amounts

**Amounts:** Aktueller Bestand einer Ressource
**Production Rates:** Wie viel pro Sekunde generiert wird

```typescript
// Jedes Update (z.B. 20x pro Sekunde)
update(dt: number) {
  for (const [resource, rate] of Object.entries(this.productionRates)) {
    const produced = rate.mul(dt);
    this.add(resource, produced);
  }
}
```

---

## Ressourcen im Detail

### Basis-Ressourcen

**Pixels** (Phase 1+)
- Hauptwährung des Spiels
- Start: 0, Ziel: Unendlichkeit
- Basis-Generation: 1/s → 1e100+/s

**Colors** (Phase 2+)
- RGB-System: Red, Green, Blue
- Werden durch Color Extractors produziert
- Kombinieren zu höheren Farben (Cyan, Magenta, Yellow)

**Memory Fragments** (Phase 4+)
- Durch Process-Operationen gewonnen
- Unlock für Memory-Upgrades
- Temporär, bei Rebirth verloren

**Dream Pixels** (Phase 5+)
- Offline-Generation Ressource
- Akkumulieren basierend auf Production Rate
- Werden beim Login ausgezahlt

### Phasenspezifische Ressourcen

**Phase 7: The Abstract**
- Currency (abstrakte Ökonomie)
- Knowledge (Research-System)
- Power (Multiplikatoren)
- Harmony (Balance-Mechanik)

**Phase 9: Life**
- Life Pixels (biologische Evolution)
- DNA Strands (Upgrade-Material)

**Phase 11-12: Stellar**
- Solar Energy (Stern-Produktion)
- Fusion (Stern-Kombinationen)
- Dark Matter (Phase 12)

### Eternal Resources

**Primordial Pixels**
- Meta-Währung
- Überleben Rebirth
- Unlock für permanente Upgrades
- Gewonnen durch Rebirth mit hohem Pixel-Count

---

## Production Pipeline

### Base → Multipliers → Final Rate

```
Base Production (1.0)
  ↓
× Building Multipliers (1.5 × 2.0 = 3.0)
  ↓
× Upgrade Multipliers (additive: +50% +30% = +80% = 1.8)
  ↓
× Phase Bonuses (2x für Phase 3+)
  ↓
× Primordial Multiplier (1.5x permanent)
  ↓
= Final Production Rate
```

### Multiplier-Stacking

**Multiplicative (Buildings):**
```typescript
let mult = ONE;
buildings.forEach(b => mult = mult.mul(b.multiplier));
```

**Additive (Upgrades):**
```typescript
let bonus = ZERO;
upgrades.forEach(u => bonus = bonus.add(u.bonus));
const mult = ONE.add(bonus); // +50% +30% = 1.8x
```

**Warum der Unterschied?**
- Buildings: Exponentielles Wachstum gewünscht
- Upgrades: Balance, vermeidet Über-Stacking

### Upgrade-Einfluss

Upgrades modifizieren die Pipeline an verschiedenen Punkten:

1. **Base Production:** "Pixels produce 2x faster" → Base × 2
2. **Multiplier Bonus:** "+50% production" → Additive Bonus
3. **Post-Processing:** "Double all production" → Final Rate × 2

---

## Formatting System

### Notation Styles

**Scientific:** `1.23e45` (Standard für große Zahlen)
**Engineering:** `123e42` (nur Vielfache von e3)
**Letters:** `1.23 Qd` (Quadrillion)
**Mixed:** `1.23M` → `1.23B` → `1.23e12`

### formatNumber() Funktion

```typescript
function formatNumber(value: Decimal, notation: 'mixed' | 'scientific' = 'mixed'): string {
  if (value.lt(1e6)) {
    return value.toFixed(2); // 1234.56
  }
  if (notation === 'mixed' && value.lt(1e9)) {
    return value.toExponential(2); // 1.23e6 = 1.23M
  }
  return value.toExponential(2); // 1.23e45
}
```

### Phase-abhängige Formatierung

**Phase 1-3:** Einfache Zahlen, Mixed Notation
- 1, 10, 100, 1.5K, 2.3M

**Phase 4-6:** Wissenschaftliche Notation einführen
- 1.23e9, 4.56e15

**Phase 7+:** Nur noch Scientific
- 1.23e45, 9.87e123

**Phase 12:** Extreme Notation
- 1.23e1234, 5.67e10000

### Präzision

- **Small Numbers (<1M):** 2 Dezimalstellen
- **Medium (1M-1B):** 2 Dezimalstellen, Buchstaben
- **Large (>1B):** 2 signifikante Ziffern + Exponent

---

## Resource Unlocking

### Unlock-System

Ressourcen sind initial **locked** und werden durch Milestones freigeschaltet:

```typescript
interface ResourceDefinition {
  id: string;
  name: string;
  unlockCondition: () => boolean;
  category: 'run' | 'phase' | 'eternal';
}
```

### Unlock-Flow

1. **Check:** `unlockCondition()` wird jedes Update geprüft
2. **Register:** Bei true wird Ressource in `amounts` registriert
3. **UI:** Ressource erscheint automatisch in UI (Svelte Reactivity)
4. **Production:** Production Rate kann jetzt gesetzt werden

### Beispiel-Conditions

```typescript
// Colors unlock bei Phase 2
{ id: 'red', unlockCondition: () => phaseManager.phase >= 2 }

// Memory Fragments bei 1M Pixels
{ id: 'memory', unlockCondition: () => resources.get('pixels').gte(1e6) }

// Primordial Pixels bei erstem Rebirth
{ id: 'primordial', unlockCondition: () => gameState.rebirthCount > 0 }
```

### Dynamic Registration

Phasen können zur Laufzeit neue Ressourcen hinzufügen:

```typescript
// Phase 7 aktiviert
onPhaseEnter(7, () => {
  resources.register('currency', ZERO);
  resources.register('knowledge', ZERO);
  resources.register('power', ZERO);
  resources.register('harmony', ZERO);
});
```

---

## Save/Load Handling

### Serialisierung

```typescript
save() {
  return {
    amounts: Object.fromEntries(
      Object.entries(this.amounts).map(([k, v]) => [k, v.toString()])
    )
  };
}
```

### Deserialisierung

```typescript
load(data: SaveData) {
  for (const [resource, value] of Object.entries(data.amounts)) {
    this.amounts[resource] = BN(value);
  }
}
```

**Wichtig:** Decimal-Werte als String speichern, nicht als Number!

---

## Performance-Überlegungen

### Update-Frequency

- **Production Update:** 20x pro Sekunde (50ms)
- **UI Update:** Svelte 5 Reactivity handled automatisch
- **Save:** Alle 30 Sekunden + bei wichtigen Events

### Optimierungen

1. **Lazy Calculation:** Production nur für unlocked Ressourcen
2. **Delta Caching:** Multiplier nur bei Änderung neu berechnen
3. **Batch Updates:** Alle Ressourcen in einem Update-Cycle

---

## Zusammenfassung

Das Resource System ist das Herzstück von "Pixel Singularity":

- **BigNumbers** via break_eternity.js für unbegrenzte Skalierung
- **Flexibles Record-System** für dynamische Ressourcen
- **Production Pipeline** mit klarer Multiplier-Hierarchie
- **Smart Formatting** für lesbare Zahlen in allen Größenordnungen
- **Unlock-System** für progressive Komplexität

Nächster Schritt: **Building System** (wie Gebäude Ressourcen produzieren und kosten)
