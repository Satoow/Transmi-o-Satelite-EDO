"use client";
import { useState } from "react";
import Link from "next/link";
import Formula from "../Formula";
import { useSimulation } from "./SimulationProvider";
import { degrees } from "../../lib/model";
const chapters = [
  "Modelo físico",
  "Equação diferencial",
  "Transformada de Laplace",
  "Solução no tempo",
  "Exemplo da simulação",
];
export default function Calculations() {
  const [chapter, setChapter] = useState(0);
  const { parameters: p, time, error } = useSimulation();
  return (
    <div className="workspace calculations-page">
      <div className="workspace-title">
        <div>
          <h1>Do modelo ao movimento</h1>
          <p>A transformada de Laplace, passo a passo.</p>
        </div>
        <Link href="/simulacao" className="secondary">
          Voltar à simulação ↗
        </Link>
      </div>
      <div className="calculation-grid">
        <aside className="chapter-navigation">
          <h2>Roteiro de cálculo</h2>
          <label className="chapter-picker">
            Etapa do cálculo
            <select
              value={chapter}
              onChange={(event) => setChapter(Number(event.target.value))}
            >
              {chapters.map((name, i) => (
                <option value={i} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <div
            role="tablist"
            aria-label="Etapas do cálculo"
            aria-orientation="vertical"
          >
            {chapters.map((name, i) => (
              <button
                role="tab"
                aria-selected={chapter === i}
                aria-controls="chapter-panel"
                id={`chapter-${i}`}
                key={name}
                tabIndex={chapter === i ? 0 : -1}
                onClick={() => setChapter(i)}
                onKeyDown={(e) => {
                  if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
                    e.preventDefault();
                    const n =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 4
                          : (i + (e.key === "ArrowDown" ? 1 : 4)) % 5;
                    setChapter(n);
                    document.getElementById(`chapter-${n}`)?.focus();
                  }
                }}
              >
                {name}
                <span>↗</span>
              </button>
            ))}
          </div>
          <div className="current-parameters">
            <span className="section-label">Configuração atual</span>
            <dl>
              <div>
                <dt>Erro inicial</dt>
                <dd>{degrees(p.initial).toFixed(0)}°</dd>
              </div>
              <div>
                <dt>Amortecimento</dt>
                <dd>{p.damping.toFixed(2)}</dd>
              </div>
              <div>
                <dt>Frequência natural</dt>
                <dd>{p.frequency.toFixed(1)} rad/s</dd>
              </div>
              <div>
                <dt>Instante</dt>
                <dd>{time.toFixed(1)} s</dd>
              </div>
            </dl>
            <p className="micro">
              Os valores acompanham a última configuração da simulação.
            </p>
          </div>
        </aside>
        <article
          id="chapter-panel"
          className="chapter-panel"
          role="tabpanel"
          aria-labelledby={`chapter-${chapter}`}
          tabIndex={0}
        >
          <h2>{chapters[chapter]}</h2>
          {chapter === 0 && (
            <>
              <p>
                O objetivo é orientar a antena do satélite em direção a uma
                estação terrestre. A posição dos dois permanece fixa: estudamos
                apenas a rotação em torno de um eixo.
              </p>
              <div className="equation-focus">
                <Formula value={String.raw`J\ddot\theta=\tau`} />
                <span>Torque produz aceleração angular.</span>
              </div>
              <h3>Uma correção com amortecimento</h3>
              <p>
                O controle aplica um torque proporcional ao erro angular e outro
                contrário à velocidade. O primeiro busca o alvo; o segundo reduz
                as oscilações.
              </p>
              <Formula
                value={String.raw`\tau=-k(\theta-\theta_{\mathrm{ref}})-c\dot\theta`}
              />
              <table>
                <thead>
                  <tr>
                    <th>Símbolo</th>
                    <th>Significado</th>
                    <th>Unidade</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["J", "Momento de inércia", "kg·m²"],
                    ["θ", "Ângulo de orientação", "rad"],
                    ["τ", "Torque de controle", "N·m"],
                    ["k", "Ganho proporcional", "N·m/rad"],
                    ["c", "Coeficiente de amortecimento", "N·m·s/rad"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell) => (
                        <td key={cell}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="callout">
                Hipóteses: corpo rígido, J, k e c positivos, referência
                constante, sem perturbações externas ou limites dos atuadores. A
                direção do alvo define θref = 0.
              </p>
            </>
          )}
          {chapter === 1 && (
            <>
              <p>
                Definimos o erro como a diferença entre a orientação atual e o
                alvo. Como a referência é constante, suas derivadas são nulas.
              </p>
              <Formula value={String.raw`e=\theta-\theta_{\mathrm{ref}}`} />
              <Formula value={String.raw`J\ddot e+c\dot e+ke=0`} />
              <p>
                Dividindo pela inércia J e introduzindo a frequência natural ωₙ
                e o fator de amortecimento ζ:
              </p>
              <Formula
                value={String.raw`\omega_n=\sqrt{\frac{k}{J}},\qquad\zeta=\frac{c}{2\sqrt{kJ}}`}
              />
              <div className="equation-focus">
                <Formula
                  value={String.raw`\ddot e+2\zeta\omega_n\dot e+\omega_n^2e=0`}
                />
                <span>EDO linear homogênea de segunda ordem.</span>
              </div>
              <h3>Condições iniciais</h3>
              <Formula value={String.raw`e(0)=e_0,\qquad\dot e(0)=0`} />
              <p>
                A antena começa desalinhada e em repouso. Os cálculos usam
                radianos; a interface converte o resultado para graus.
              </p>
            </>
          )}
          {chapter === 2 && (
            <>
              <p>
                Chamamos de E(s) a transformada do erro e(t). A transformação
                das derivadas inclui as condições iniciais.
              </p>
              <Formula value={String.raw`\mathcal L\{\dot e\}=sE(s)-e_0`} />
              <Formula value={String.raw`\mathcal L\{\ddot e\}=s^2E(s)-se_0`} />
              <h3>Substituir e agrupar</h3>
              <Formula
                value={String.raw`\begin{aligned}s^2E(s)-se_0&+2\zeta\omega_n[sE(s)-e_0]\\&+\omega_n^2E(s)=0\end{aligned}`}
              />
              <p>
                Agora isolamos E(s). Uma equação diferencial tornou-se uma
                equação algébrica:
              </p>
              <div className="equation-focus">
                <Formula
                  value={String.raw`E(s)=\frac{e_0(s+2\zeta\omega_n)}{s^2+2\zeta\omega_ns+\omega_n^2}`}
                />
                <span>A forma do denominador determina o comportamento.</span>
              </div>
              <p>
                Os polos são as raízes do denominador. Eles podem ser complexos
                conjugados, reais iguais ou reais distintos — os três regimes
                disponíveis na simulação.
              </p>
            </>
          )}
          {chapter === 3 && (
            <>
              <p>
                A transformada inversa devolve o erro no tempo. Com a referência
                em zero, esse erro também é o ângulo usado para girar o
                satélite.
              </p>
              <h3>Oscilante · 0 &lt; ζ &lt; 1</h3>
              <Formula value={String.raw`\omega_d=\omega_n\sqrt{1-\zeta^2}`} />
              <Formula
                value={String.raw`\begin{aligned}e(t)=e_0e^{-\zeta\omega_nt}\big[&\cos(\omega_dt)\\&+\tfrac{\zeta\omega_n}{\omega_d}\sin(\omega_dt)\big]\end{aligned}`}
              />
              <h3>Crítica · ζ = 1</h3>
              <div className="equation-focus">
                <Formula
                  value={String.raw`e(t)=e_0(1+\omega_nt)e^{-\omega_nt}`}
                />
              </div>
              <h3>Lenta · ζ &gt; 1</h3>
              <Formula
                value={String.raw`r_{1,2}=-\omega_n(\zeta\mp\sqrt{\zeta^2-1})`}
              />
              <Formula
                value={String.raw`e(t)=e_0\frac{r_2e^{r_1t}-r_1e^{r_2t}}{r_2-r_1}`}
              />
              <p className="callout">
                Com frequência natural fixa e velocidade inicial nula, o regime
                crítico retorna sem oscilar mais rapidamente que o
                superamortecido. Isso não significa ser o mais rápido segundo
                qualquer métrica.
              </p>
            </>
          )}
          {chapter === 4 && (
            <>
              <p>
                Este exemplo usa os valores que você escolheu. A simulação é
                pausada ao trocar de aba, preservando o instante para a análise.
              </p>
              <Formula
                value={`e_0=${p.initial.toFixed(5)}\\;\\mathrm{rad},\\quad \\dot e(0)=0`}
              />
              <div className="equation-focus">
                <Formula
                  value={`\\ddot e+${(2 * p.damping * p.frequency).toFixed(2)}\\dot e+${(p.frequency ** 2).toFixed(2)}e=0`}
                />
              </div>
              <Formula
                value={`E(s)=\\frac{${p.initial.toFixed(5)}(s+${(2 * p.damping * p.frequency).toFixed(2)})}{s^2+${(2 * p.damping * p.frequency).toFixed(2)}s+${(p.frequency ** 2).toFixed(2)}}`}
              />
              <h3>Resultado no instante selecionado</h3>
              <div className="example-result">
                <span>t = {time.toFixed(2)} s</span>
                <strong>{degrees(error).toFixed(2)}°</strong>
                <span>e(t) = {error.toFixed(6)} rad</span>
              </div>
              <p>
                A antena, o feixe e o marcador no gráfico utilizam esse mesmo
                e(t). A faixa de ±1° informa proximidade angular; não mede
                potência, velocidade de transmissão ou qualidade real do enlace.
              </p>
              <Link href="/simulacao" className="text-action">
                Experimentar outros parâmetros →
              </Link>
            </>
          )}
          <div className="chapter-footer">
            <span>
              {chapter + 1} de {chapters.length}
            </span>
            <button
              className="secondary"
              onClick={() => setChapter((chapter + 1) % 5)}
            >
              {chapter === 4 ? "Voltar ao modelo" : "Próxima etapa"} →
            </button>
          </div>
        </article>
      </div>
      <details className="sources">
        <summary>Referências, recursos e limites do experimento</summary>
        <p>
          Modelo didático de apontamento: não calcula órbitas, propagação
          eletromagnética, saturação de atuadores ou potência recebida. Terra e
          TDRS estão fora de escala.
        </p>
        <a
          href="https://tutorial.math.lamar.edu/classes/de/ivpwithlaplace.aspx"
          target="_blank"
          rel="noreferrer"
        >
          Paul’s Online Math Notes — Solving IVPs with Laplace Transforms ↗
        </a>
        <a
          href="https://math.mit.edu/~gs/dela/delasol_all.pdf"
          target="_blank"
          rel="noreferrer"
        >
          MIT — Differential Equations and Linear Algebra ↗
        </a>
        <p>
          Terra adaptada de GlobeScene.tsx do projeto de referência: texturas
          earth-night, earth-topology e night-sky dos exemplos Three Globe.
          Modelo TDRS fornecido pelo autor do trabalho. Recursos armazenados
          localmente.
        </p>
        <a
          href="https://github.com/vasturiano/three-globe/tree/master/example/img"
          target="_blank"
          rel="noreferrer"
        >
          Origem das texturas do globo ↗
        </a>
        <p>Integrantes e instituição: a preencher pelos autores.</p>
      </details>
    </div>
  );
}
