import { useState, useCallback, useEffect } from "react";
import * as tts from "../lib/tts";
import { getSettings } from "../lib/storage";

export function useTts() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    return () => tts.stop();
  }, []);

  const speak = useCallback((text: string) => {
    const settings = getSettings();
    if (!settings.ttsEnabled) return;
    setSpeaking(true);
    setPaused(false);
    tts.speak(text, settings.ttsRate, () => {
      setSpeaking(false);
      setPaused(false);
    });
  }, []);

  const pause = useCallback(() => {
    tts.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    tts.resume();
    setPaused(false);
  }, []);

  const stop = useCallback(() => {
    tts.stop();
    setSpeaking(false);
    setPaused(false);
  }, []);

  return { speaking, paused, speak, pause, resume, stop };
}
