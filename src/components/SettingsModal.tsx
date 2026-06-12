import { useState } from "react";
import {
  getApiKey,
  setApiKey,
  getSettings,
  saveSettings,
} from "../lib/storage";

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const [key, setKey] = useState(getApiKey() ?? "");
  const [settings, setSettings] = useState(getSettings());

  function handleSave() {
    if (key.trim()) setApiKey(key.trim());
    saveSettings(settings);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-md space-y-6">
        <h2 className="text-xl font-serif text-accent">Réglages</h2>

        <div className="space-y-2">
          <label className="text-sm text-text-muted">Clé API Gemini</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIza..."
            className="w-full bg-bg border border-text-muted/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={settings.ttsEnabled}
              onChange={(e) =>
                setSettings({ ...settings, ttsEnabled: e.target.checked })
              }
              className="accent-accent"
            />
            Lecture audio activée
          </label>

          <div className="space-y-1">
            <label className="text-sm text-text-muted">
              Vitesse de lecture : {settings.ttsRate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.ttsRate}
              onChange={(e) =>
                setSettings({ ...settings, ttsRate: parseFloat(e.target.value) })
              }
              className="w-full accent-accent"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-muted hover:text-text transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent text-bg rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
