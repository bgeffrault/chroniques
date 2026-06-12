import { useState, useCallback } from "react";
import type { Game, Chapter, Player } from "../types";
import { getGame, saveGame, deleteGame } from "../lib/storage";

const SUMMARY_THRESHOLD = 10;

export function useGame() {
  const [game, setGame] = useState<Game | null>(() => getGame());

  const persist = useCallback((updated: Game) => {
    saveGame(updated);
    setGame(updated);
  }, []);

  const createGame = useCallback(
    (
      players: [Player, Player],
      prologueText: string,
      firstChoices: string[],
      customContext: string | null
    ) => {
      const newGame: Game = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        customContext,
        players,
        currentTurn: 0,
        chapters: [
          {
            text: prologueText,
            choices: firstChoices,
            chosenOption: null,
            playerIndex: 0,
            timestamp: new Date().toISOString(),
          },
        ],
        summary: null,
        status: "playing",
      };
      persist(newGame);
      return newGame;
    },
    [persist]
  );

  const addChapter = useCallback(
    (chapter: Chapter) => {
      if (!game) return;
      const updated: Game = {
        ...game,
        chapters: [...game.chapters, chapter],
        currentTurn: game.currentTurn === 0 ? 1 : 0,
      };
      persist(updated);
    },
    [game, persist]
  );

  const recordChoice = useCallback(
    (chosenOption: string) => {
      if (!game) return;
      const chapters = [...game.chapters];
      const last = { ...chapters[chapters.length - 1], chosenOption };
      chapters[chapters.length - 1] = last;
      const updated: Game = { ...game, chapters };
      persist(updated);
    },
    [game, persist]
  );

  const updateSummary = useCallback(
    (summary: string) => {
      if (!game) return;
      const updated: Game = { ...game, summary };
      persist(updated);
    },
    [game, persist]
  );

  const finishGame = useCallback(
    (epilogueText: string) => {
      if (!game) return;
      const updated: Game = {
        ...game,
        chapters: [
          ...game.chapters,
          {
            text: epilogueText,
            choices: [],
            chosenOption: null,
            playerIndex: game.currentTurn,
            timestamp: new Date().toISOString(),
          },
        ],
        status: "finished",
      };
      persist(updated);
    },
    [game, persist]
  );

  const clearGame = useCallback(() => {
    deleteGame();
    setGame(null);
  }, []);

  const needsSummary =
    game !== null && game.chapters.length >= SUMMARY_THRESHOLD && game.chapters.length % SUMMARY_THRESHOLD === 0;

  return {
    game,
    createGame,
    addChapter,
    recordChoice,
    updateSummary,
    finishGame,
    clearGame,
    needsSummary,
  };
}
