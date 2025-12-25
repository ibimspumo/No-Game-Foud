# Phase 1: Engine Fixes

**Priorität:** HOCH
**Geschätzter Aufwand:** 1-2 Stunden
**Abhängigkeiten:** Keine

---

## Ziel

Die bestehende Engine hat kleine Lücken und TODOs, die behoben werden müssen, bevor wir weiteren Content hinzufügen. Diese Phase stellt sicher, dass das Fundament stabil ist.

---

## Aufgaben

### 1.1 ProducerManager: Achievement-Check implementieren
**Datei:** `src/lib/engine/systems/ProducerManager.svelte.ts`
**Zeile:** 688

**Aktueller Code:**
```typescript
case 'achievement':
    // TODO: Check achievement manager
    break;
```

**Lösung:**
```typescript
case 'achievement':
    if (this.game.achievements.hasAchievement(condition.id)) {
        met = true;
    }
    break;
```

**Problem:** Der ProducerManager benötigt Zugriff auf den AchievementManager. Aktuell hat er keinen Context dafür.

**Schritte:**
- [ ] Context-Interface für ProducerManager erweitern
- [ ] `hasAchievement` Methode im Context hinzufügen
- [ ] In Game.svelte.ts den Context erstellen und setzen

---

### 1.2 SecretManager in Game integrieren
**Datei:** `src/lib/engine/core/Game.svelte.ts`

Der SecretManager existiert (`src/lib/engine/systems/SecretManager.svelte.ts`), wird aber nicht im Game verwendet.

**Schritte:**
- [ ] Import hinzufügen
- [ ] Property `readonly secrets: SecretManager` hinzufügen
- [ ] Im Constructor initialisieren
- [ ] Context erstellen (ähnlich wie bei anderen Managern)
- [ ] `init()` aufrufen
- [ ] `tick()` im Game-Loop aufrufen
- [ ] Serialize/Deserialize integrieren

---

### 1.3 Endings in NarrativeManager integrieren
**Datei:** `src/lib/engine/data/endings.ts` (existiert)
**Integration in:** `src/lib/engine/systems/NarrativeManager.svelte.ts`

Die Endings sind definiert, aber es gibt keine Logik um sie auszulösen.

**Schritte:**
- [ ] Ending-Definitions importieren
- [ ] `checkEndingConditions()` Methode hinzufügen
- [ ] `triggerEnding(endingId)` Methode hinzufügen
- [ ] Event `ending_triggered` emittieren
- [ ] UI-Hook für Ending-Sequenz vorbereiten

---

### 1.4 Story-Validierung implementieren (Optional)
**Datei:** `src/lib/engine/data/validators.ts`
**Zeile:** 878

Dies ist ein Placeholder für Entwickler-Tools. Kann später gemacht werden.

**Schritte:**
- [ ] Alle registrierten Story-Events sammeln
- [ ] Referenzen auf Ressourcen/Phasen/Choices validieren
- [ ] Fehlende Referenzen als Warnings ausgeben

---

## Akzeptanzkriterien

- [ ] Alle Producer mit Achievement-Conditions funktionieren
- [ ] SecretManager trackt Secrets und emittiert Events
- [ ] Endings können getriggert werden
- [ ] Keine TypeScript-Errors
- [ ] Bestehende Tests laufen noch

---

## Notizen

Diese Fixes sind relativ klein aber wichtig für die Integrität des Systems. Sie sollten vor dem Content-Erstellen erledigt werden, damit Story-Events korrekt funktionieren.
