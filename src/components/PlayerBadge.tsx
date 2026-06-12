interface Props {
  playerName: string;
  characterName: string;
  playerIndex: 0 | 1;
  isActive: boolean;
}

export default function PlayerBadge({
  playerName,
  characterName,
  playerIndex,
  isActive,
}: Props) {
  const color = playerIndex === 0 ? "text-player1" : "text-player2";
  const border = playerIndex === 0 ? "border-player1" : "border-player2";

  return (
    <div
      className={`px-3 py-1.5 rounded-lg border text-sm transition-opacity ${border} ${color} ${
        isActive ? "opacity-100" : "opacity-30"
      }`}
    >
      <span className="font-semibold">{characterName}</span>
      <span className="text-text-muted ml-1.5 text-xs">({playerName})</span>
    </div>
  );
}
