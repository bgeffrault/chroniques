export interface Player {
  name: string;
  characterName: string;
}

export interface Chapter {
  text: string;
  choices: string[];
  chosenOption: string | null;
  playerIndex: number;
  timestamp: string;
  imagePrompt?: string;
}

export interface Game {
  id: string;
  createdAt: string;
  customContext: string | null;
  players: [Player, Player];
  currentTurn: 0 | 1;
  chapters: Chapter[];
  summary: string | null;
  status: "playing" | "finished";
}

export interface Settings {
  ttsEnabled: boolean;
  ttsRate: number;
}

export interface GeminiResponse {
  narrative: string;
  choices: string[];
  isEnding: boolean;
  imagePrompt?: string;
}

export interface PrologueResponse {
  narrative: string;
  characters: [string, string];
  choices: string[];
  imagePrompt: string;
}
