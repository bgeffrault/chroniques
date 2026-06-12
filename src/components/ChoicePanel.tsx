import { useState } from "react";

interface Props {
  choices: string[];
  onChoose: (choice: string) => void;
  disabled: boolean;
}

export default function ChoicePanel({ choices, onChoose, disabled }: Props) {
  const [custom, setCustom] = useState("");

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (custom.trim()) {
      onChoose(custom.trim());
      setCustom("");
    }
  }

  return (
    <div className="space-y-3">
      {choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => onChoose(choice)}
          disabled={disabled}
          className="w-full text-left py-3 px-4 border border-accent/40 rounded-lg text-text hover:bg-accent/10 hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {choice}
        </button>
      ))}

      <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Autre action..."
          disabled={disabled}
          className="flex-1 bg-surface border border-text-muted/30 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={disabled || !custom.trim()}
          className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm hover:bg-accent/30 transition-colors disabled:opacity-40"
        >
          OK
        </button>
      </form>
    </div>
  );
}
