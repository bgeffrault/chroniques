import { useTts } from "../hooks/useTts";

interface Props {
  text: string;
}

export default function NarrativeText({ text }: Props) {
  const { speaking, paused, speak, pause, resume, stop } = useTts();

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="font-serif text-lg leading-relaxed whitespace-pre-line">
        {text}
      </div>
      <div className="flex gap-2">
        {!speaking && (
          <button
            onClick={() => speak(text)}
            className="text-xs text-text-muted hover:text-accent transition-colors flex items-center gap-1"
          >
            🔊 Écouter
          </button>
        )}
        {speaking && !paused && (
          <>
            <button
              onClick={pause}
              className="text-xs text-accent hover:text-accent/80 transition-colors"
            >
              ⏸ Pause
            </button>
            <button
              onClick={stop}
              className="text-xs text-text-muted hover:text-red-400 transition-colors"
            >
              ⏹ Stop
            </button>
          </>
        )}
        {speaking && paused && (
          <>
            <button
              onClick={resume}
              className="text-xs text-accent hover:text-accent/80 transition-colors"
            >
              ▶ Reprendre
            </button>
            <button
              onClick={stop}
              className="text-xs text-text-muted hover:text-red-400 transition-colors"
            >
              ⏹ Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
