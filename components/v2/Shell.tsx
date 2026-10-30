"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SimulationProvider } from "./SimulationProvider";
export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <SimulationProvider>
      <a href="#conteudo" className="skip">
        Pular para o conteúdo
      </a>
      <header className="app-header">
        <Link href="/" className="brand" aria-label="Apontamento — início">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="7" />
            <ellipse
              cx="16"
              cy="16"
              rx="15"
              ry="6"
              transform="rotate(-35 16 16)"
            />
            <circle cx="27" cy="8" r="2" fill="currentColor" />
          </svg>
          <span>
            Apontamento<small>Laboratório orbital</small>
          </span>
        </Link>
        <nav aria-label="Abas principais">
          {[
            ["/", "Inicial"],
            ["/simulacao", "Simulação"],
            ["/calculos", "Cálculos"],
          ].map(([href, name]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <span className="header-note">EDO & transformada de Laplace</span>
      </header>
      <main id="conteudo">{children}</main>
    </SimulationProvider>
  );
}
