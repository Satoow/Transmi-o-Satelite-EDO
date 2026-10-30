"use client";
import Link from "next/link";
import SceneStage from "./SceneStage";
export default function Observatory() {
  return (
    <div className="observatory">
      <SceneStage />
      <div className="observatory-heading">
        <h1>Entre a Terra e o espaço.</h1>
        <p>Uma perspectiva sobre o controle de satélites.</p>
      </div>
      <div className="object-note">
        <span>TDRS</span>
        <p>
          Tracking and Data
          <br />
          Relay Satellite
        </p>
      </div>
      <aside className="challenge-note">
        <span className="section-label">O desafio</span>
        <h2>Apontar é só o começo.</h2>
        <p>
          Como orientar a antena de um satélite para uma estação na Terra sem
          continuar oscilando?
        </p>
        <Link href="/simulacao" className="text-action">
          Investigar na simulação <span>↗</span>
        </Link>
      </aside>
      <div className="observatory-footer">
        <span>Visualização livre · sem simulação física</span>
        <span>Terra noturna / TDRS</span>
      </div>
    </div>
  );
}
