import type { Game, Settings } from "../types";

const KEYS = {
  apiKey: "narrativeGame:apiKey",
  game: "narrativeGame:currentGame",
  settings: "narrativeGame:settings",
} as const;

export const DEFAULT_SETTINGS: Settings = {
  ttsEnabled: true,
  ttsRate: 1.0,
};

export function getApiKey(): string | null {
  return localStorage.getItem(KEYS.apiKey) || import.meta.env.VITE_GEMINI_API_KEY || null;
}

export function setApiKey(key: string): void {
  localStorage.setItem(KEYS.apiKey, key);
}

export function getGame(): Game | null {
  const raw = localStorage.getItem(KEYS.game);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function saveGame(game: Game): void {
  localStorage.setItem(KEYS.game, JSON.stringify(game));
}

export function deleteGame(): void {
  localStorage.removeItem(KEYS.game);
}

export function getSettings(): Settings {
  const raw = localStorage.getItem(KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  return JSON.parse(raw);
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}
