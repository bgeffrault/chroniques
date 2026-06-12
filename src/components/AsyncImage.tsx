import { useState, useEffect, useRef } from "react";
import { generateImage } from "../lib/gemini";
import { getApiKey } from "../lib/storage";

const cache = new Map<string, string>();

interface Props {
  prompt: string;
}

export default function AsyncImage({ prompt }: Props) {
  const [state, setState] = useState<"loading" | "done" | "error">(() =>
    cache.has(prompt) ? "done" : "loading"
  );
  const [src, setSrc] = useState(() => cache.get(prompt));
  const aborted = useRef(false);

  useEffect(() => {
    if (cache.has(prompt)) {
      setSrc(cache.get(prompt));
      setState("done");
      return;
    }

    aborted.current = false;
    setState("loading");

    const apiKey = getApiKey();
    if (!apiKey) {
      setState("error");
      return;
    }

    generateImage(apiKey, prompt)
      .then((dataUrl) => {
        if (aborted.current) return;
        cache.set(prompt, dataUrl);
        setSrc(dataUrl);
        setState("done");
      })
      .catch(() => {
        if (aborted.current) return;
        setState("error");
      });

    return () => {
      aborted.current = true;
    };
  }, [prompt]);

  if (state === "error") return null;

  if (state === "loading") {
    return (
      <div className="w-full aspect-[16/10] rounded-lg border border-text-muted/20 bg-surface flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full mx-auto" />
          <p className="text-xs text-text-muted">Illustration en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Illustration de la scène"
      className="w-full rounded-lg border border-text-muted/20 animate-fade-in"
    />
  );
}
