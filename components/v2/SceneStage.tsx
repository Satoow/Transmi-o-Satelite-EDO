"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import type { SceneProps } from "./OrbitalScene";
const OrbitalScene = dynamic(() => import("./OrbitalScene"), {
  ssr: false,
  loading: () => (
    <div className="scene-loading">Preparando o observatório 3D…</div>
  ),
});
export default function SceneStage({
  simulation = false,
  error = 0,
  time = 0,
  running = false,
}: SceneProps) {
  const [auto, setAuto] = useState(false),
    [command, setCommand] = useState<SceneProps["command"]>(),
    [ready, setReady] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setAuto(!simulation && !media.matches);
    const change = () => setAuto(!simulation && !media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, [simulation]);
  const onReady = useCallback(() => setReady(true), []);
  const action = (a: "reset" | "in" | "out") =>
    setCommand((c) => ({ id: (c?.id ?? 0) + 1, action: a }));
  return (
    <div
      className="scene-stage"
      aria-label="Cena interativa da Terra e do satélite TDRS"
      data-ready={ready}
    >
      <OrbitalScene
        simulation={simulation}
        error={error}
        time={time}
        running={running}
        autoRotate={auto && !simulation}
        command={command}
        onReady={onReady}
      />
      {!ready && (
        <div className="scene-loading" role="status">
          Carregando Terra e TDRS…
        </div>
      )}
      <div className="camera-tools" aria-label="Controles da câmera">
        <button
          onClick={() => action("in")}
          aria-label="Aproximar câmera"
          title="Aproximar"
        >
          +
        </button>
        <button
          onClick={() => action("out")}
          aria-label="Afastar câmera"
          title="Afastar"
        >
          −
        </button>
        <button
          onClick={() => action("reset")}
          aria-label="Restaurar câmera"
          title="Restaurar câmera"
        >
          ↺
        </button>
        {!simulation && (
          <button
            className="auto-camera"
            aria-pressed={auto}
            onClick={() => setAuto(!auto)}
          >
            {auto ? "Pausar câmera" : "Animar câmera"}
          </button>
        )}
      </div>
      <div className="scene-hint">
        Arraste para explorar <span>·</span> Role para aproximar
      </div>
    </div>
  );
}
