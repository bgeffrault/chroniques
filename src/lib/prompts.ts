import type { Chapter, Game } from "../types";

const MAX_RECENT_CHAPTERS = 6;

export function buildSystemPrompt(): string {
  return `Tu es un narrateur de jeu de rôle fantasy immersif. Tu racontes une histoire à deux joueurs qui font des choix à tour de rôle.

Règles :
- Raconte l'histoire de manière vivante et immersive, en t'adressant aux personnages par leur nom.
- Propose toujours 2 à 3 choix possibles pour le prochain joueur.
- Maintiens la cohérence de l'histoire : chaque choix a des conséquences qui influencent la suite.
- Le ton est fantasy, pas de gore ni de violence gratuite, adapté à tous.
- Chaque passage narratif fait 2 à 4 paragraphes.
- Quand l'histoire atteint une conclusion naturelle, mets isEnding à true.

Tu DOIS répondre en JSON valide avec ce format exact :
{
  "narrative": "Le texte narratif ici...",
  "choices": ["Choix A", "Choix B", "Choix C"],
  "isEnding": false,
  "imagePrompt": "A detailed visual description in English for generating an illustration of the key scene"
}

Le champ imagePrompt décrit visuellement la scène principale du passage en anglais, style illustration fantasy/storybook. Sois précis sur l'ambiance, les personnages, le décor et l'action.

Quand isEnding est true, le tableau choices doit être vide.`;
}

export function buildProloguePrompt(
  playerNames: [string, string],
  customContext: string | null
): string {
  const contextLine = customContext
    ? `\nContexte souhaité par les joueurs : "${customContext}"\nInspire-toi de ce contexte pour créer l'univers et la trame de fond.\n`
    : "";

  return `Deux joueurs commencent une nouvelle aventure fantasy.
Joueur 1 : ${playerNames[0]}
Joueur 2 : ${playerNames[1]}
${contextLine}
Génère un prologue captivant qui plante le décor et présente deux personnages (un pour chaque joueur). Propose ensuite 2-3 choix au Joueur 1 pour lancer l'aventure.

Réponds en JSON avec ce format :
{
  "narrative": "Le prologue...",
  "characters": ["Nom personnage joueur 1", "Nom personnage joueur 2"],
  "choices": ["Choix A", "Choix B", "Choix C"],
  "imagePrompt": "A detailed visual description in English for generating an illustration of the opening scene"
}`;
}

export function buildTurnContext(game: Game): string {
  const parts: string[] = [];

  parts.push(
    `Personnages : ${game.players[0].characterName} (joué par ${game.players[0].name}) et ${game.players[1].characterName} (joué par ${game.players[1].name}).`
  );

  if (game.customContext) {
    parts.push(`Trame de fond : "${game.customContext}"`);
  }

  if (game.summary) {
    parts.push(`Résumé des événements passés :\n${game.summary}`);
  }

  const recentChapters = game.chapters.slice(-MAX_RECENT_CHAPTERS);
  for (const ch of recentChapters) {
    const playerName = game.players[ch.playerIndex].characterName;
    parts.push(`[Narration]\n${ch.text}`);
    if (ch.chosenOption) {
      parts.push(`[Choix de ${playerName}] ${ch.chosenOption}`);
    }
  }

  const activePlayer = game.players[game.currentTurn];
  parts.push(
    `C'est au tour de ${activePlayer.characterName} (${activePlayer.name}) de faire un choix. Continue l'histoire et propose 2-3 choix.`
  );

  return parts.join("\n\n");
}

export function buildSummaryPrompt(chapters: Chapter[]): string {
  const text = chapters
    .map((ch, i) => `Chapitre ${i + 1}: ${ch.text} [Choix: ${ch.chosenOption}]`)
    .join("\n\n");

  return `Résume les événements suivants en un paragraphe concis (5-8 phrases) en préservant les personnages, lieux, objets importants et les conséquences des choix :\n\n${text}\n\nRéponds uniquement avec le résumé, pas de JSON.`;
}

export function buildEpiloguePrompt(game: Game): string {
  const context = buildTurnContext(game);
  return `${context}\n\nL'aventure touche à sa fin. Écris un épilogue satisfaisant qui conclut l'histoire en tenant compte de tous les choix faits par les joueurs. Décris ce que deviennent les personnages.\n\nRéponds en JSON :\n{\n  "narrative": "L'épilogue...",\n  "choices": [],\n  "isEnding": true\n}`;
}
