# Design — Apontamento, versão 2

Implementação autorizada em 30/10/2026. Substitui a landing page anterior.

Três destinos reais em Next.js: Inicial (/), Simulação (/simulacao), Cálculos (/calculos). Navegação superior discreta com seleção por linha ciano, identidade Apontamento, interface escura. Direção da skill: Data terminal, seed 241356276. O shell sem barra lateral substitui o trilho sorteado porque o usuário pediu três abas nomeadas e a cena precisa de largura.

Inicial: observatório 3D em quase toda a tela. Terra noturna da referência, atmosfera ciano, relevo e estrelas; modelo TDRS fornecido. Desafio em um canto, entrada para simulação. A câmera pode girar lentamente e ser manipulada; não há manobra calculada, gráfico ou feixe de simulação na inicial. Pausa da câmera e movimento reduzido disponíveis.

Simulação: cena e controle lado a lado, gráfico abaixo da cena; parâmetros e erro do mesmo modelo. Feixe atual contínuo e referência tracejada; pulsos ilustrativos quando em execução. A geometria de Terra, estação e satélite permanece fixa durante a manobra; apenas orientação e feixe respondem à EDO. Pausar congela os efeitos e o relógio. Mudar de aba pausa, preservando parâmetros e instante.

Cálculos: roteiro navegável dentro da aba, derivação legível em blocos; parâmetros atuais e exemplo numérico vinculados à simulação. Fontes matemáticas KaTeX são necessárias ao conteúdo. Hipóteses, unidades, soluções dos três regimes e referências presentes.

Fonte de verdade matemática: lib/model.ts. Fonte de verdade do estado: SimulationProvider. Tempo 0–25 s, e0 5–40 graus, zeta 0.1–3, frequência 0.5–2 rad/s. Faixa ±1 grau é didática, sem estimar potência ou taxa de dados.

Recursos: three-globe (mesmo renderizador interno do react-globe.gl da referência), earth-night.jpg, earth-topology.png e night-sky.png nas URLs originais agora armazenados localmente. Atmosfera #72DBE7, altitude relativa 0.15, graticules e estação São Luís herdados da referência. TDRS GLB original do usuário e decodificador Draco local.

Perguntas por tela: qual é o desafio? / como o amortecimento muda o apontamento? / como Laplace produz o movimento? Identidade: globo noturno e TDRS reais, feixe baseado no erro; sem estatísticas inventadas, seções promocionais ou ornamentos genéricos.

Responsividade: desktop em duas colunas, tablet e celular com cena antes dos controles, navegação sempre nomeada. Verificar 1440, 768 e 390 px, teclado, persistência entre abas, carregamento/falhas de WebGL e ausência de requisições remotas em uso.

## Aplicação da referência NeuroSync
Reafirmada pelo usuário durante a implementação. Inter 400/500/600, JetBrains Mono nos valores técnicos, base 8 px, intervalo 16 px, preenchimento 24 px, controles e painéis com raio 8 px, superfície #191C21 e hierarquia operacional compacta aplicados. Paleta de fundo adaptada ao tema espacial escuro previamente solicitado; acento ciano para dados e referência de direção. O HTML mencionado no arquivo NeuroSync não foi fornecido, portanto não se afirma reprodução exata da composição original. A narrativa longa foi substituída pelas três abas por decisão explícita do usuário.
