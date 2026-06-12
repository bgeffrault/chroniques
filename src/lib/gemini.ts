import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiResponse, PrologueResponse, Game } from "../types";
import {
  buildSystemPrompt,
  buildProloguePrompt,
  buildTurnContext,
  buildSummaryPrompt,
  buildEpiloguePrompt,
} from "./prompts";

const MODEL = "gemini-2.0-flash";

function getModel(apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: "application/json" },
  });
}

function getTextModel(apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: MODEL });
}

function getImageModel(apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] } as any,
  });
}

function parseJSON<T>(text: string): T {
  const cleaned = text.replace(/```json\n?|```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generatePrologue(
  apiKey: string,
  playerNames: [string, string],
  customContext: string | null
): Promise<PrologueResponse> {
  const model = getModel(apiKey);
  const result = await model.generateContent([
    buildSystemPrompt(),
    buildProloguePrompt(playerNames, customContext),
  ]);
  return parseJSON<PrologueResponse>(result.response.text());
}

export async function generateTurn(
  apiKey: string,
  game: Game
): Promise<GeminiResponse> {
  const model = getModel(apiKey);
  const result = await model.generateContent([
    buildSystemPrompt(),
    buildTurnContext(game),
  ]);
  return parseJSON<GeminiResponse>(result.response.text());
}

export async function generateSummary(
  apiKey: string,
  game: Game
): Promise<string> {
  const chaptersToSummarize = game.chapters.slice(0, -6);
  const model = getTextModel(apiKey);
  const result = await model.generateContent(
    buildSummaryPrompt(chaptersToSummarize)
  );
  return result.response.text().trim();
}

export const IMAGE_INTERVAL = 4;

export async function generateImage(
  apiKey: string,
  prompt: string
): Promise<string> {
  const model = getImageModel(apiKey);
  const result = await model.generateContent(
    `Generate a beautiful storybook-style illustration: ${prompt}. Style: warm colors, painterly, atmospheric, no text or words in the image.`
  );
  const parts = result.response.candidates?.[0]?.content?.parts ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imagePart = parts.find((p: any) => p.inlineData);
  if (!imagePart || !("inlineData" in imagePart)) {
    throw new Error("No image generated");
  }
  const { mimeType, data } = imagePart.inlineData as { mimeType: string; data: string };
  return `data:${mimeType};base64,${data}`;
}

export async function generateEpilogue(
  apiKey: string,
  game: Game
): Promise<GeminiResponse> {
  const model = getModel(apiKey);
  const result = await model.generateContent([
    buildSystemPrompt(),
    buildEpiloguePrompt(game),
  ]);
  return parseJSON<GeminiResponse>(result.response.text());
}
