"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { angle, radians, duration, type Parameters } from "../../lib/model";
const initial: Parameters = { initial: radians(20), damping: 1, frequency: 1 };
type Model = {
  parameters: Parameters;
  time: number;
  running: boolean;
  error: number;
  notice: string;
  update: (p: Parameters) => void;
  toggle: () => void;
  reset: () => void;
  scrub: (t: number) => void;
};
const Context = createContext<Model | null>(null);
export function SimulationProvider({ children }: { children: ReactNode }) {
  const [parameters, setParameters] = useState(initial),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [notice, setNotice] = useState("Pronto para iniciar");
  const route = usePathname();
  const clock = useRef(0);
  useEffect(() => {
    setRunning(false);
    setNotice(clock.current > 0 ? "Manobra pausada" : "Pronto para iniciar");
  }, [route]);
  useEffect(() => {
    if (!running) return;
    let frame = 0,
      last = performance.now(),
      rendered = last;
    const tick = (now: number) => {
      clock.current = Math.min(duration, clock.current + (now - last) / 1000);
      last = now;
      if (now - rendered > 32 || clock.current >= duration) {
        setTime(clock.current);
        rendered = now;
      }
      if (clock.current >= duration) {
        setRunning(false);
        setNotice("Horizonte de 25 segundos concluído");
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  function reset() {
    clock.current = 0;
    setTime(0);
    setRunning(false);
    setNotice("Pronto para iniciar");
  }
  function update(p: Parameters) {
    setParameters(p);
    reset();
    setNotice("Parâmetros atualizados. Manobra reiniciada.");
  }
  function toggle() {
    if (clock.current >= duration) {
      clock.current = 0;
      setTime(0);
    }
    setRunning(!running);
    setNotice(running ? "Manobra pausada" : "Manobra em andamento");
  }
  function scrub(t: number) {
    clock.current = t;
    setTime(t);
    setRunning(false);
    setNotice("Instante selecionado na trajetória");
  }
  return (
    <Context.Provider
      value={{
        parameters,
        time,
        running,
        error: angle(time, parameters),
        notice,
        update,
        toggle,
        reset,
        scrub,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useSimulation() {
  const c = useContext(Context);
  if (!c) throw Error("SimulationProvider ausente");
  return c;
}
