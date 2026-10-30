"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import SceneStage from "./SceneStage";
import { useSimulation } from "./SimulationProvider";
import { degrees, angle, duration } from "../../lib/model";
const presets = [
  {
    label: "Oscilante",
    value: 0.3,
    copy: "Cruza o alvo e oscila antes de se acomodar.",
  },
  {
    label: "Crítica",
    value: 1,
    copy: "Retorna sem oscilar. Equilíbrio entre rapidez e amortecimento.",
  },
  {
    label: "Lenta",
    value: 2,
    copy: "Amortecimento elevado: retorno gradual à direção desejada.",
  },
];
function RunControls() {
  const { running, time, toggle, reset } = useSimulation();
  return (
    <div className="run-controls">
      <button className="primary" onClick={toggle}>
        {running
          ? "Pausar"
          : time > 0 && time < 25
            ? "Continuar"
            : "Iniciar manobra"}
        <span>{running ? "Ⅱ" : "▷"}</span>
      </button>
      <button
        className="secondary reset"
        aria-label="Reiniciar manobra"
        title="Reiniciar manobra"
        onClick={reset}
      >
        ↺
      </button>
    </div>
  );
}
function ResponseChart() {
  const { parameters, time, error, scrub } = useSimulation();
  const path = useMemo(
    () =>
      Array.from(
        { length: 501 },
        (_, i) =>
          `${i ? "L" : "M"}${48 + i * 1.4},${110 - degrees(angle((i / 500) * duration, parameters)) * 2}`,
      ).join(" "),
    [parameters],
  );
  return (
    <div className="response-chart">
      <div className="panel-title">
        <h2>Resposta angular</h2>
        <span>Ângulo (°) × tempo (s)</span>
      </div>
      <svg
        viewBox="0 0 780 240"
        role="img"
        aria-label={`Erro atual ${degrees(error).toFixed(2)} graus em ${time.toFixed(1)} segundos`}
      >
        <rect x="48" y="108" width="700" height="4" fill="#294d48" />
        {[-40, -20, 0, 20, 40].map((v) => (
          <g key={v}>
            <path
              d={`M48 ${110 - v * 2}H748`}
              stroke={v === 0 ? "#8b9fa9" : "#202c36"}
              strokeDasharray={v === 0 ? "5 5" : undefined}
            />
            <text x="30" y={114 - v * 2} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        {[0, 5, 10, 15, 20, 25].map((v) => (
          <text x={48 + (v / 25) * 700} y="220" textAnchor="middle" key={v}>
            {v}
          </text>
        ))}
        <path d={path} fill="none" stroke="#79e8db" strokeWidth="2.5" />
        <path
          d={`M${48 + (time / 25) * 700} 20V195`}
          stroke="#94aaa9"
          strokeDasharray="3 4"
        />
        <circle
          cx={48 + (time / 25) * 700}
          cy={110 - degrees(error) * 2}
          r="4"
          fill="#ecfdf9"
        />
      </svg>
      <label className="scrub-label">
        Explorar um instante <output>{time.toFixed(1)} s</output>
        <input
          aria-label="Instante da simulação"
          type="range"
          min="0"
          max="25"
          step="0.1"
          value={time}
          onChange={(e) => scrub(+e.target.value)}
        />
      </label>
      <p className="micro">
        Faixa sombreada: ±1°. Entrar na faixa não significa permanecer
        estabilizado.
      </p>
    </div>
  );
}
export default function Simulation() {
  const {
    parameters: p,
    time,
    running,
    error,
    notice,
    update,
  } = useSimulation();
  const [expanded, setExpanded] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
        button.current?.focus();
      }
      if (e.key === "Tab") {
        const items = Array.from(
          wrapper.current?.querySelectorAll<HTMLElement>(
            "button,a,input,summary",
          ) ?? [],
        ).filter((item) => item.getClientRects().length > 0);
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
    };
  }, [expanded]);
  const e = degrees(error);
  return (
    <div
      className={`workspace ${expanded ? "presentation" : ""}`}
      ref={wrapper}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded || undefined}
      aria-label={expanded ? "Apresentação da simulação" : undefined}
    >
      <div className="workspace-title">
        <div>
          <h1>Controle de apontamento</h1>
          <p>Altere a resposta. Observe a direção da antena.</p>
        </div>
        <button
          ref={button}
          className="secondary"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Sair da apresentação" : "Modo apresentação"} ↗
        </button>
      </div>
      <div className="mobile-run-controls">
        <RunControls />
        <a className="secondary" href="#configurar-manobra">
          Ajustar
        </a>
      </div>
      <div className="simulation-grid">
        <div className="visual-column">
          <div className="simulation-scene">
            <SceneStage
              simulation
              error={error}
              time={time}
              running={running}
            />
            <div className="scene-legend">
              <span>
                <i
                  className="line actual"
                  style={{
                    borderColor:
                      Math.abs(e) <= 1 ? "var(--accent)" : "var(--warm)",
                  }}
                />
                Direção atual
              </span>
              <span>
                <i className="line target" />
                Alvo · São Luís
              </span>
            </div>
          </div>
          <div className="telemetry">
            <div>
              <span>Erro de apontamento</span>
              <strong data-testid="error">
                {e.toFixed(2)}
                <small>°</small>
              </strong>
            </div>
            <div>
              <span>Tempo decorrido</span>
              <strong data-testid="time">
                {time.toFixed(1)}
                <small> s</small>
              </strong>
            </div>
            <div>
              <span>Alinhamento</span>
              <strong className="status-text">
                <i
                  className={
                    Math.abs(e) <= 1 ? "status-dot aligned" : "status-dot"
                  }
                />
                {Math.abs(e) <= 1 ? "Dentro da faixa" : "Fora da faixa"}
              </strong>
            </div>
          </div>
          <ResponseChart />
        </div>
        <aside className="control-panel" id="configurar-manobra">
          <div className="panel-title">
            <h2>Configurar manobra</h2>
            <span>Um eixo</span>
          </div>
          <p>Escolha o comportamento do satélite.</p>
          <div className="preset-options">
            {presets.map((v) => (
              <button
                key={v.value}
                aria-pressed={p.damping === v.value}
                onClick={() => update({ ...p, damping: v.value })}
              >
                <span>{v.label}</span>
                <span>ζ = {v.value.toFixed(1)}</span>
              </button>
            ))}
          </div>
          <p className="preset-description">
            {presets.find((v) => v.value === p.damping)?.copy ??
              "Resposta personalizada para o amortecimento selecionado."}
          </p>
          <div className="parameter-fields">
            <label>
              Desalinhamento inicial{" "}
              <output>{degrees(p.initial).toFixed(0)}°</output>
              <input
                type="range"
                min="5"
                max="40"
                value={degrees(p.initial)}
                onChange={(e) =>
                  update({ ...p, initial: (+e.target.value * Math.PI) / 180 })
                }
              />
            </label>
            <label>
              Amortecimento <output>ζ = {p.damping.toFixed(2)}</output>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.05"
                value={p.damping}
                onChange={(e) => update({ ...p, damping: +e.target.value })}
              />
            </label>
            <label>
              Frequência natural <output>{p.frequency.toFixed(1)} rad/s</output>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={p.frequency}
                onChange={(e) => update({ ...p, frequency: +e.target.value })}
              />
            </label>
          </div>
          <RunControls />
          <p className="notice" role="status">
            {notice}
          </p>
          <div className="model-note">
            <h3>Um modelo, três leituras.</h3>
            <p>
              A orientação 3D, o erro e o gráfico usam a mesma solução da EDO.
            </p>
            <Link href="/calculos" className="text-action">
              Ver os cálculos <span>→</span>
            </Link>
          </div>
          <p className="micro">
            Posições fixas e escala ilustrativa. O feixe representa a direção da
            antena; os pulsos não representam a velocidade física do sinal.
          </p>
        </aside>
      </div>
    </div>
  );
}
