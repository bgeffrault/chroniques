import { Link } from "react-router";
import { getGame, getApiKey } from "../lib/storage";
import { useState } from "react";
import SettingsModal from "../components/SettingsModal";

export default function Home() {
  const game = getGame();
  const hasApiKey = !!getApiKey();
  const [showSettings, setShowSettings] = useState(!hasApiKey);

  return (
    <div className="flex flex-col items-center gap-8 pt-16">
      <h1 className="text-5xl font-serif text-accent tracking-wide">
        Chroniques
      </h1>
      <p className="text-text-muted text-center text-lg">
        Un jeu narratif fantasy pour deux aventuriers
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
        <Link
          to="/setup"
          className="block text-center py-3 px-6 bg-accent text-bg font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Nouvelle partie
        </Link>

        {game && game.status === "playing" && (
          <Link
            to="/game"
            className="block text-center py-3 px-6 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
          >
            Reprendre
          </Link>
        )}

        <button
          onClick={() => setShowSettings(true)}
          className="text-text-muted hover:text-text transition-colors text-sm mt-4"
        >
          Réglages
        </button>
      </div>

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export const Component = Home;
