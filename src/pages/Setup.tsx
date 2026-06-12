import { useState } from "react";
import { useNavigate } from "react-router";
import { getApiKey } from "../lib/storage";
import { generatePrologue, generateImage } from "../lib/gemini";
import { useGame } from "../hooks/useGame";
import type { PrologueResponse } from "../types";

type Phase = "names" | "loading" | "characters" | "error";

const DEFAULT_SCENARIO = {
  player1: "Baptiste",
  player2: "Charlotte",
  context:
    "On joue deux chats : Aristote (un bâtard malin qui sait se faire chier pour manipuler ses maîtres) et Artémis (une chatte qui manipule facilement le maître Baptiste). Ils vivent dans une grande maison en campagne avec un grand jardin, chez Baptiste et Charlotte. Il y a aussi Atlas, un chien qui peut les aider ou les embêter. L'objectif des chats : réussir à obtenir deux fois de la pâtée dans la journée au lieu d'une seule. Ton humoristique, du point de vue des chats.",
};

export default function Setup() {
  const navigate = useNavigate();
  const { createGame } = useGame();

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [phase, setPhase] = useState<Phase>("names");
  const [prologue, setPrologue] = useState<PrologueResponse | null>(null);
  const [char1, setChar1] = useState("");
  const [char2, setChar2] = useState("");
  const [error, setError] = useState("");
  const [prologueImage, setPrologueImage] = useState<string | undefined>();

  async function handleGenerate() {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError("Configure ta clé API Gemini dans les réglages.");
      setPhase("error");
      return;
    }
    if (!player1.trim() || !player2.trim()) return;

    setPhase("loading");
    try {
      const result = await generatePrologue(
        apiKey,
        [player1.trim(), player2.trim()],
        customContext.trim() || null
      );
      setPrologue(result);
      setChar1(result.characters[0]);
      setChar2(result.characters[1]);
      setPhase("characters");
      if (result.imagePrompt) {
        generateImage(apiKey, result.imagePrompt)
          .then(setPrologueImage)
          .catch(() => {});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la génération.");
      setPhase("error");
    }
  }

  function handleStart() {
    if (!prologue) return;
    createGame(
      [
        { name: player1.trim(), characterName: char1.trim() },
        { name: player2.trim(), characterName: char2.trim() },
      ],
      prologue.narrative,
      prologue.choices,
      customContext.trim() || null,
      prologueImage
    );
    navigate("/game");
  }

  return (
    <div className="space-y-8 pt-8">
      <h1 className="text-3xl font-serif text-accent">Nouvelle aventure</h1>

      {phase === "names" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-text-muted">Joueur 1</label>
            <input
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              placeholder="Prénom..."
              className="w-full bg-surface border border-text-muted/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-text-muted">Joueur 2</label>
            <input
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              placeholder="Prénom..."
              className="w-full bg-surface border border-text-muted/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-text-muted">
              Contexte / trame (optionnel)
            </label>
            <textarea
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="Ex: une histoire de pirates maudits, un monde de dragons..."
              rows={3}
              className="w-full bg-surface border border-text-muted/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent resize-none"
            />
          </div>
          {!player1 && !player2 && !customContext && (
            <button
              onClick={() => {
                setPlayer1(DEFAULT_SCENARIO.player1);
                setPlayer2(DEFAULT_SCENARIO.player2);
                setCustomContext(DEFAULT_SCENARIO.context);
              }}
              className="w-full py-2 border border-accent/40 text-accent rounded-lg hover:bg-accent/10 transition-colors text-sm"
            >
              🐱 Aventure des chats — Aristote & Artémis
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={!player1.trim() || !player2.trim()}
            className="w-full py-3 bg-accent text-bg font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Générer le prologue
          </button>
        </div>
      )}

      {phase === "loading" && (
        <div className="text-center space-y-4 py-12">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
          <p className="text-text-muted">Gemini écrit votre histoire...</p>
        </div>
      )}

      {phase === "characters" && prologue && (
        <div className="space-y-6 animate-fade-in">
          {prologueImage && (
            <img
              src={prologueImage}
              alt="Illustration du prologue"
              className="w-full rounded-lg border border-text-muted/20"
            />
          )}
          <div className="font-serif text-lg leading-relaxed whitespace-pre-line">
            {prologue.narrative}
          </div>

          <hr className="border-text-muted/20" />

          <p className="text-text-muted text-sm">
            Validez ou modifiez les noms de vos personnages :
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-player1">{player1}</label>
              <input
                value={char1}
                onChange={(e) => setChar1(e.target.value)}
                className="w-full bg-surface border border-player1/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-player1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-player2">{player2}</label>
              <input
                value={char2}
                onChange={(e) => setChar2(e.target.value)}
                className="w-full bg-surface border border-player2/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-player2"
              />
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!char1.trim() || !char2.trim()}
            className="w-full py-3 bg-accent text-bg font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Commencer l'aventure
          </button>
        </div>
      )}

      {phase === "error" && (
        <div className="space-y-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => setPhase("names")}
            className="text-accent hover:underline"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}

export const Component = Setup;
