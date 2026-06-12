import { useNavigate } from "react-router";
import { useGame } from "../hooks/useGame";
import NarrativeText from "../components/NarrativeText";

export default function Ending() {
  const navigate = useNavigate();
  const { game, clearGame } = useGame();

  if (!game || game.status !== "finished") {
    navigate("/");
    return null;
  }

  const epilogue = game.chapters[game.chapters.length - 1];
  const keyMoments = game.chapters
    .filter((ch) => ch.chosenOption !== null)
    .slice(-5)
    .map((ch) => ({
      player: game.players[ch.playerIndex].characterName,
      choice: ch.chosenOption!,
    }));

  function handleNewGame() {
    clearGame();
    navigate("/setup");
  }

  return (
    <div className="space-y-8 pt-8 pb-12">
      <h1 className="text-3xl font-serif text-accent text-center">
        Fin de l'aventure
      </h1>

      <NarrativeText text={epilogue.text} />

      {keyMoments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-serif text-text-muted">
            Moments clés
          </h2>
          <ul className="space-y-2">
            {keyMoments.map((m, i) => (
              <li key={i} className="text-sm text-text-muted">
                <span className="text-accent">{m.player}</span> a choisi :{" "}
                <span className="text-text italic">"{m.choice}"</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-4 items-center pt-4">
        <button
          onClick={handleNewGame}
          className="py-3 px-8 bg-accent text-bg font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Nouvelle aventure
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-text-muted hover:text-text transition-colors text-sm"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export const Component = Ending;
