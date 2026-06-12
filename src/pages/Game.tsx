import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useGame } from "../hooks/useGame";
import { getApiKey } from "../lib/storage";
import { generateTurn, generateSummary, generateEpilogue, generateImage, IMAGE_INTERVAL } from "../lib/gemini";
import NarrativeText from "../components/NarrativeText";
import ChoicePanel from "../components/ChoicePanel";
import PlayerBadge from "../components/PlayerBadge";

export default function Game() {
  const navigate = useNavigate();
  const {
    game,
    addChapter,
    recordChoice,
    updateSummary,
    finishGame,
    needsSummary,
  } = useGame();
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!game || game.status === "finished") {
      navigate(game?.status === "finished" ? "/ending" : "/");
    }
  }, [game, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [game?.chapters.length]);

  if (!game) return null;

  const lastChapter = game.chapters[game.chapters.length - 1];
  const waitingForChoice = lastChapter.chosenOption === null;

  async function handleChoice(choice: string) {
    const apiKey = getApiKey();
    if (!apiKey || !game) return;

    recordChoice(choice);
    setLoading(true);

    try {
      if (needsSummary) {
        const summary = await generateSummary(apiKey, game);
        updateSummary(summary);
      }

      const updatedGame = {
        ...game,
        chapters: game.chapters.map((ch, i) =>
          i === game.chapters.length - 1 ? { ...ch, chosenOption: choice } : ch
        ),
        currentTurn: (game.currentTurn === 0 ? 1 : 0) as 0 | 1,
      };

      const response = await generateTurn(apiKey, updatedGame);

      if (response.isEnding) {
        finishGame(response.narrative);
      } else {
        const chapterIndex = game.chapters.length;
        const shouldGenerateImage =
          response.imagePrompt && chapterIndex % IMAGE_INTERVAL === 0;

        let imageUrl: string | undefined;
        if (shouldGenerateImage && response.imagePrompt) {
          try {
            imageUrl = await generateImage(apiKey, response.imagePrompt);
          } catch {
            // Image generation is best-effort
          }
        }

        addChapter({
          text: response.narrative,
          choices: response.choices,
          chosenOption: null,
          playerIndex: updatedGame.currentTurn,
          timestamp: new Date().toISOString(),
          imageUrl,
        });
      }
    } catch (e) {
      console.error("Gemini error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestEnding() {
    const apiKey = getApiKey();
    if (!apiKey || !game) return;

    setLoading(true);
    try {
      const response = await generateEpilogue(apiKey, game);
      finishGame(response.narrative);
    } catch (e) {
      console.error("Epilogue error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pt-4 pb-12">
      <div className="flex justify-between items-center">
        <PlayerBadge
          playerName={game.players[0].name}
          characterName={game.players[0].characterName}
          playerIndex={0}
          isActive={game.currentTurn === 0}
        />
        <PlayerBadge
          playerName={game.players[1].name}
          characterName={game.players[1].characterName}
          playerIndex={1}
          isActive={game.currentTurn === 1}
        />
      </div>

      <hr className="border-text-muted/20" />

      <NarrativeText text={lastChapter.text} imageUrl={lastChapter.imageUrl} />

      {waitingForChoice && !loading && (
        <>
          <p className="text-sm text-text-muted">
            C'est au tour de{" "}
            <span
              className={
                game.currentTurn === 0 ? "text-player1" : "text-player2"
              }
            >
              {game.players[game.currentTurn].characterName}
            </span>
          </p>
          <ChoicePanel
            choices={lastChapter.choices}
            onChoose={handleChoice}
            disabled={loading}
          />
        </>
      )}

      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto" />
          <p className="text-text-muted text-sm mt-2">L'histoire continue...</p>
        </div>
      )}

      <button
        onClick={handleRequestEnding}
        disabled={loading}
        className="text-xs text-text-muted hover:text-accent transition-colors"
      >
        Conclure l'aventure
      </button>

      <div ref={bottomRef} />
    </div>
  );
}

export const Component = Game;
