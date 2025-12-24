/**
 * @fileoverview Save data migration system for handling version upgrades.
 * Provides utilities for migrating save data between versions, sanitizing
 * corrupt data, and ensuring backward compatibility.
 *
 * @module engine/core/SaveMigration
 */

import type {
	SerializedGameState,
	SerializedRunState,
	SerializedEternalState,
	SerializedStatistics,
	PlayerPreferences
} from '../models/types';
import { D, ZERO, isNaN as isDecimalNaN } from '../utils/decimal';

/**
 * Migration function type that transforms save data from one version to another.
 * @param data - The save data to migrate
 * @returns The migrated save data
 */
export type MigrationFunction = (data: SerializedGameState) => SerializedGameState;

/**
 * Registry for managing save data migrations across versions.
 *
 * Migrations are applied sequentially from the save's version to the current
 * version, ensuring all intermediate transformations are applied correctly.
 *
 * @example
 * ```typescript
 * const registry = new MigrationRegistry(1);
 *
 * // Register a migration from version 1 to 2
 * registry.registerMigration(2, (data) => {
 *   // Add new field
 *   data.eternal.discoveredSecrets = data.eternal.discoveredSecrets || [];
 *   return data;
 * });
 *
 * // Migrate old save data
 * const oldSave = { ...saveData, meta: { ...meta, version: 1 } };
 * const migrated = registry.migrate(oldSave);
 * ```
 */
export class MigrationRegistry {
	/**
	 * Map of version numbers to their migration functions.
	 * Key is the target version, value is the function to migrate to that version.
	 */
	private migrations: Map<number, MigrationFunction> = new Map();

	/**
	 * The current save format version.
	 */
	private currentVersion: number;

	/**
	 * Creates a new migration registry.
	 *
	 * @param currentVersion - The current save format version
	 */
	constructor(currentVersion: number) {
		this.currentVersion = currentVersion;
	}

	/**
	 * Register a migration function for a specific version.
	 *
	 * @param targetVersion - The version this migration upgrades to
	 * @param migrationFn - The migration function to apply
	 * @throws Error if a migration for this version already exists
	 *
	 * @example
	 * ```typescript
	 * registry.registerMigration(2, (data) => {
	 *   // Add new eternal resource
	 *   if (!data.eternal.eternalResources.dreamPixels) {
	 *     data.eternal.eternalResources.dreamPixels = "0";
	 *   }
	 *   return data;
	 * });
	 * ```
	 */
	registerMigration(targetVersion: number, migrationFn: MigrationFunction): void {
		if (this.migrations.has(targetVersion)) {
			throw new Error(`Migration for version ${targetVersion} already exists`);
		}
		this.migrations.set(targetVersion, migrationFn);
	}

	/**
	 * Migrate save data from its current version to the latest version.
	 *
	 * Applies all migrations sequentially in order. If the save is already
	 * at the current version, returns it unchanged.
	 *
	 * @param data - The save data to migrate
	 * @returns The migrated save data
	 * @throws Error if a required migration is missing
	 *
	 * @example
	 * ```typescript
	 * const oldSave = loadFromStorage();
	 * const migrated = registry.migrate(oldSave);
	 * // migrated is now at the current version
	 * ```
	 */
	migrate(data: SerializedGameState): SerializedGameState {
		const fromVersion = data.meta.version;

		// Already at current version
		if (fromVersion === this.currentVersion) {
			return data;
		}

		// Don't downgrade
		if (fromVersion > this.currentVersion) {
			console.warn(
				`Save version ${fromVersion} is newer than current version ${this.currentVersion}. ` +
				`This may cause data loss.`
			);
			return data;
		}

		let migrated = data;

		// Apply migrations sequentially
		for (let version = fromVersion + 1; version <= this.currentVersion; version++) {
			const migration = this.migrations.get(version);

			if (!migration) {
				throw new Error(
					`Missing migration for version ${version}. Cannot migrate from ${fromVersion} to ${this.currentVersion}.`
				);
			}

			console.log(`Applying migration to version ${version}...`);
			migrated = migration(migrated);
			migrated.meta.version = version;
		}

		console.log(`Successfully migrated save from version ${fromVersion} to ${this.currentVersion}`);
		return migrated;
	}

	/**
	 * Get the current save format version.
	 *
	 * @returns The current version number
	 */
	getCurrentVersion(): number {
		return this.currentVersion;
	}

	/**
	 * Check if a migration path exists from a given version to current.
	 *
	 * @param fromVersion - The starting version
	 * @returns True if migration is possible
	 */
	canMigrate(fromVersion: number): boolean {
		if (fromVersion === this.currentVersion) {
			return true;
		}

		if (fromVersion > this.currentVersion) {
			return false;
		}

		// Check that all intermediate migrations exist
		for (let version = fromVersion + 1; version <= this.currentVersion; version++) {
			if (!this.migrations.has(version)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get all registered migration versions.
	 *
	 * @returns Sorted array of version numbers with registered migrations
	 */
	getRegisteredVersions(): number[] {
		return Array.from(this.migrations.keys()).sort((a, b) => a - b);
	}
}

/**
 * Sanitize and validate save data, filling in missing fields with defaults.
 *
 * This function is crucial for handling corrupt saves, partial data, or
 * saves from very old versions that might be missing entire sections.
 *
 * @param data - The potentially incomplete save data
 * @returns Complete and valid save data
 *
 * @example
 * ```typescript
 * const rawData = JSON.parse(saveString);
 * const safe = sanitizeSaveData(rawData);
 * // safe is guaranteed to have all required fields
 * ```
 */
export function sanitizeSaveData(data: Partial<SerializedGameState>): SerializedGameState {
	// Sanitize meta
	const meta = {
		version: data.meta?.version ?? 1,
		lastSaved: data.meta?.lastSaved ?? Date.now(),
		lastPlayed: data.meta?.lastPlayed ?? Date.now(),
		gameVersion: data.meta?.gameVersion ?? '0.1.0',
		saveId: data.meta?.saveId ?? generateSaveId()
	};

	// Sanitize run state
	const run: SerializedRunState = {
		resources: sanitizeStringRecord(data.run?.resources ?? {}),
		productionRates: sanitizeStringRecord(data.run?.productionRates ?? {}),
		purchasedUpgrades: sanitizeStringArray(data.run?.purchasedUpgrades ?? []),
		upgradeLevels: sanitizeNumberRecord(data.run?.upgradeLevels ?? {}),
		currentPhase: clampNumber(data.run?.currentPhase ?? 1, 1, 20),
		highestPhase: clampNumber(data.run?.highestPhase ?? 1, 1, 20),
		runTime: Math.max(0, data.run?.runTime ?? 0),
		triggeredStoryEvents: sanitizeStringArray(data.run?.triggeredStoryEvents ?? []),
		storyChoices: sanitizeStringRecord(data.run?.storyChoices ?? {}),
		unlockedResources: sanitizeStringArray(data.run?.unlockedResources ?? []),
		unlockedUpgrades: sanitizeStringArray(data.run?.unlockedUpgrades ?? [])
	};

	// Sanitize statistics
	const statistics: SerializedStatistics = {
		totalPixelsGenerated: sanitizeDecimalString(data.eternal?.statistics?.totalPixelsGenerated),
		totalClicks: Math.max(0, data.eternal?.statistics?.totalClicks ?? 0),
		fastestPhaseTimes: sanitizeNumberRecord(data.eternal?.statistics?.fastestPhaseTimes ?? {}),
		fastestRunTime: data.eternal?.statistics?.fastestRunTime ?? null,
		totalUpgradesPurchased: Math.max(0, data.eternal?.statistics?.totalUpgradesPurchased ?? 0),
		totalStoryEventsTriggered: Math.max(0, data.eternal?.statistics?.totalStoryEventsTriggered ?? 0),
		firstPlayDate: data.eternal?.statistics?.firstPlayDate ?? Date.now(),
		lastPlayDate: data.eternal?.statistics?.lastPlayDate ?? Date.now()
	};

	// Sanitize preferences
	const preferences: PlayerPreferences = {
		notation: isValidNotation(data.eternal?.preferences?.notation)
			? data.eternal!.preferences!.notation
			: 'mixed',
		animationSpeed: clampNumber(data.eternal?.preferences?.animationSpeed ?? 1.0, 0.5, 2.0),
		showOfflineProgress: data.eternal?.preferences?.showOfflineProgress ?? true,
		autoSaveInterval: Math.max(0, data.eternal?.preferences?.autoSaveInterval ?? 30),
		pauseOnStory: data.eternal?.preferences?.pauseOnStory ?? false,
		confirmRebirth: data.eternal?.preferences?.confirmRebirth ?? true,
		volume: {
			master: clampNumber(data.eternal?.preferences?.volume?.master ?? 1.0, 0, 1),
			music: clampNumber(data.eternal?.preferences?.volume?.music ?? 0.7, 0, 1),
			sfx: clampNumber(data.eternal?.preferences?.volume?.sfx ?? 0.8, 0, 1)
		}
	};

	// Sanitize eternal state
	const eternal: SerializedEternalState = {
		totalRebirths: Math.max(0, data.eternal?.totalRebirths ?? 0),
		totalPlayTime: Math.max(0, data.eternal?.totalPlayTime ?? 0),
		eternalResources: sanitizeStringRecord(data.eternal?.eternalResources ?? {}),
		eternalUpgrades: sanitizeStringArray(data.eternal?.eternalUpgrades ?? []),
		achievements: sanitizeStringArray(data.eternal?.achievements ?? []),
		permanentStoryFlags: sanitizeStringArray(data.eternal?.permanentStoryFlags ?? []),
		permanentChoices: sanitizeStringRecord(data.eternal?.permanentChoices ?? {}),
		statistics,
		highestPhaseEver: clampNumber(data.eternal?.highestPhaseEver ?? 1, 1, 20),
		discoveredSecrets: sanitizeStringArray(data.eternal?.discoveredSecrets ?? []),
		preferences
	};

	return {
		run,
		eternal,
		meta
	};
}

/**
 * Create a default run state for a fresh game.
 * This is used when starting a new game or performing a rebirth.
 *
 * @returns A fresh run state with initial values
 *
 * @example
 * ```typescript
 * // Reset run state on rebirth
 * gameState.run = DEFAULT_RUN_STATE();
 * ```
 */
export function DEFAULT_RUN_STATE(): SerializedRunState {
	return {
		resources: {},
		productionRates: {},
		purchasedUpgrades: [],
		upgradeLevels: {},
		currentPhase: 1,
		highestPhase: 1,
		runTime: 0,
		triggeredStoryEvents: [],
		storyChoices: {},
		unlockedResources: [],
		unlockedUpgrades: []
	};
}

/**
 * Create a default eternal state for a completely new game.
 * This should only be used when no save exists.
 *
 * @returns A fresh eternal state with initial values
 *
 * @example
 * ```typescript
 * // Initialize new game
 * const newSave: SerializedGameState = {
 *   run: DEFAULT_RUN_STATE(),
 *   eternal: DEFAULT_ETERNAL_STATE(),
 *   meta: { ... }
 * };
 * ```
 */
export function DEFAULT_ETERNAL_STATE(): SerializedEternalState {
	return {
		totalRebirths: 0,
		totalPlayTime: 0,
		eternalResources: {},
		eternalUpgrades: [],
		achievements: [],
		permanentStoryFlags: [],
		permanentChoices: {},
		statistics: {
			totalPixelsGenerated: ZERO.toString(),
			totalClicks: 0,
			fastestPhaseTimes: {},
			fastestRunTime: null,
			totalUpgradesPurchased: 0,
			totalStoryEventsTriggered: 0,
			firstPlayDate: Date.now(),
			lastPlayDate: Date.now()
		},
		highestPhaseEver: 1,
		discoveredSecrets: [],
		preferences: {
			notation: 'mixed',
			animationSpeed: 1.0,
			showOfflineProgress: true,
			autoSaveInterval: 30,
			pauseOnStory: false,
			confirmRebirth: true,
			volume: {
				master: 1.0,
				music: 0.7,
				sfx: 0.8
			}
		}
	};
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sanitize a record of string values, removing invalid entries.
 *
 * @param record - The record to sanitize
 * @returns Sanitized record with only valid string values
 */
function sanitizeStringRecord(record: Record<string, unknown>): Record<string, string> {
	const result: Record<string, string> = {};

	for (const [key, value] of Object.entries(record)) {
		if (typeof value === 'string' && value.length > 0) {
			result[key] = value;
		} else if (typeof value === 'number' && !Number.isNaN(value)) {
			// Convert numbers to strings (for backward compatibility)
			result[key] = value.toString();
		}
	}

	return result;
}

/**
 * Sanitize a record of number values, removing invalid entries.
 *
 * @param record - The record to sanitize
 * @returns Sanitized record with only valid number values
 */
function sanitizeNumberRecord(record: Record<string, unknown>): Record<string, number> {
	const result: Record<string, number> = {};

	for (const [key, value] of Object.entries(record)) {
		if (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)) {
			result[key] = Math.max(0, Math.floor(value));
		}
	}

	return result;
}

/**
 * Sanitize an array of strings, removing invalid entries.
 *
 * @param array - The array to sanitize
 * @returns Array with only valid, unique strings
 */
function sanitizeStringArray(array: unknown[]): string[] {
	const result: string[] = [];
	const seen = new Set<string>();

	for (const item of array) {
		if (typeof item === 'string' && item.length > 0 && !seen.has(item)) {
			result.push(item);
			seen.add(item);
		}
	}

	return result;
}

/**
 * Sanitize a decimal string, ensuring it's valid.
 *
 * @param value - The value to sanitize
 * @returns Valid decimal string or "0"
 */
function sanitizeDecimalString(value: unknown): string {
	if (typeof value === 'string' && value.length > 0) {
		try {
			const decimal = D(value);
			if (!decimal.isFinite() || isDecimalNaN(decimal)) {
				return ZERO.toString();
			}
			return decimal.toString();
		} catch {
			return ZERO.toString();
		}
	}
	return ZERO.toString();
}

/**
 * Clamp a number between min and max values.
 *
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
function clampNumber(value: number, min: number, max: number): number {
	if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
		return min;
	}
	return Math.max(min, Math.min(max, value));
}

/**
 * Check if a notation value is valid.
 *
 * @param value - The value to check
 * @returns True if value is a valid notation type
 */
function isValidNotation(value: unknown): value is PlayerPreferences['notation'] {
	return (
		value === 'scientific' ||
		value === 'engineering' ||
		value === 'mixed' ||
		value === 'letters'
	);
}

/**
 * Generate a unique save ID.
 *
 * @returns A unique identifier string
 */
function generateSaveId(): string {
	return `save_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
