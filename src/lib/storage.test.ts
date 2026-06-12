import { describe, it, expect, beforeEach } from "vitest";
import {
  getApiKey,
  setApiKey,
  getGame,
  saveGame,
  deleteGame,
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from "./storage";

beforeEach(() => {
  localStorage.clear();
});

describe("apiKey", () => {
  it("returns null when no key stored", () => {
    expect(getApiKey()).toBeNull();
  });

  it("stores and retrieves a key", () => {
    setApiKey("test-key-123");
    expect(getApiKey()).toBe("test-key-123");
  });
});

describe("game", () => {
  const game = {
    id: "abc",
    createdAt: "2026-01-01T00:00:00Z",
    customContext: null,
    players: [
      { name: "Alice", characterName: "Elara" },
      { name: "Bob", characterName: "Thorin" },
    ] as [{ name: string; characterName: string }, { name: string; characterName: string }],
    currentTurn: 0 as const,
    chapters: [],
    summary: null,
    status: "playing" as const,
  };

  it("returns null when no game stored", () => {
    expect(getGame()).toBeNull();
  });

  it("saves and retrieves a game", () => {
    saveGame(game);
    expect(getGame()).toEqual(game);
  });

  it("deletes a game", () => {
    saveGame(game);
    deleteGame();
    expect(getGame()).toBeNull();
  });
});

describe("settings", () => {
  it("returns defaults when nothing stored", () => {
    expect(getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("saves and retrieves settings", () => {
    const settings = { ttsEnabled: false, ttsRate: 1.5 };
    saveSettings(settings);
    expect(getSettings()).toEqual(settings);
  });
});
