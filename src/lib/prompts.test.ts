import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildTurnContext, buildProloguePrompt, buildSummaryPrompt, buildEpiloguePrompt } from "./prompts";
import type { Game } from "../types";

const baseGame: Game = {
  id: "test",
  createdAt: "2026-01-01T00:00:00Z",
  customContext: null,
  players: [
    { name: "Alice", characterName: "Elara" },
    { name: "Bob", characterName: "Thorin" },
  ],
  currentTurn: 0,
  chapters: [],
  summary: null,
  status: "playing",
};

describe("buildSystemPrompt", () => {
  it("includes narrator role and JSON format instructions", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("narrateur");
    expect(prompt).toContain("JSON");
    expect(prompt).toContain("narrative");
    expect(prompt).toContain("choices");
    expect(prompt).toContain("isEnding");
  });
});

describe("buildProloguePrompt", () => {
  it("includes player names", () => {
    const prompt = buildProloguePrompt(["Alice", "Bob"], null);
    expect(prompt).toContain("Alice");
    expect(prompt).toContain("Bob");
  });

  it("includes custom context when provided", () => {
    const prompt = buildProloguePrompt(["Alice", "Bob"], "une histoire de pirates");
    expect(prompt).toContain("pirates");
  });
});

describe("buildTurnContext", () => {
  it("includes character names and chosen option", () => {
    const game: Game = {
      ...baseGame,
      chapters: [
        {
          text: "Le voyage commence...",
          choices: ["Aller au nord", "Aller au sud"],
          chosenOption: "Aller au nord",
          playerIndex: 0,
          timestamp: "2026-01-01T00:00:01Z",
        },
      ],
    };
    const context = buildTurnContext(game);
    expect(context).toContain("Elara");
    expect(context).toContain("Thorin");
    expect(context).toContain("Aller au nord");
  });

  it("includes summary when present", () => {
    const game: Game = {
      ...baseGame,
      summary: "Résumé des événements précédents.",
      chapters: [
        {
          text: "Suite...",
          choices: ["A", "B"],
          chosenOption: "A",
          playerIndex: 0,
          timestamp: "2026-01-01T00:00:01Z",
        },
      ],
    };
    const context = buildTurnContext(game);
    expect(context).toContain("Résumé des événements précédents");
  });

  it("includes custom context when present", () => {
    const game: Game = {
      ...baseGame,
      customContext: "monde sous-marin",
      chapters: [
        {
          text: "Début...",
          choices: ["A"],
          chosenOption: "A",
          playerIndex: 0,
          timestamp: "2026-01-01T00:00:01Z",
        },
      ],
    };
    const context = buildTurnContext(game);
    expect(context).toContain("monde sous-marin");
  });
});

describe("buildSummaryPrompt", () => {
  it("includes the chapters to summarize", () => {
    const chapters = [
      { text: "Chapitre un.", choices: [], chosenOption: "X", playerIndex: 0, timestamp: "" },
      { text: "Chapitre deux.", choices: [], chosenOption: "Y", playerIndex: 1, timestamp: "" },
    ];
    const prompt = buildSummaryPrompt(chapters);
    expect(prompt).toContain("Chapitre un");
    expect(prompt).toContain("Chapitre deux");
  });
});

describe("buildEpiloguePrompt", () => {
  it("includes game context for epilogue", () => {
    const game: Game = {
      ...baseGame,
      chapters: [
        { text: "Aventure...", choices: ["A"], chosenOption: "A", playerIndex: 0, timestamp: "" },
      ],
    };
    const prompt = buildEpiloguePrompt(game);
    expect(prompt).toContain("épilogue");
  });
});
