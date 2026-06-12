export function speak(
  text: string,
  rate: number = 1.0,
  onEnd?: () => void
): void {
  stop();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = rate;
  if (onEnd) utterance.onend = onEnd;
  speechSynthesis.speak(utterance);
}

export function pause(): void {
  speechSynthesis.pause();
}

export function resume(): void {
  speechSynthesis.resume();
}

export function stop(): void {
  speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return speechSynthesis.speaking;
}
