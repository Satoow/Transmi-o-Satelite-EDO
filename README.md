# Apontamento — versão 2

Site acadêmico em Next.js e React, com três abas: Inicial, Simulação e Cálculos.

## Executar

```sh
npm ci
npm run dev
```

Produção: `npm run build` e `npm start`. A revisão desta sessão está em http://127.0.0.1:3005.

## O que foi implementado

- Inicial: Terra noturna em 3D, TDRS original do usuário, câmera animada/interativa e desafio no canto. Nenhuma manobra calculada nessa aba.
- Simulação: posições fixas, orientação calculada, direção atual, alvo, pulsos ilustrativos, controles, gráfico, exploração de um instante e modo apresentação com Escape.
- Cálculos: cinco etapas de derivação de Laplace, unidades, hipóteses e exemplo vinculado ao estado da simulação. Trocar de aba pausa e preserva o instante; recarregar a página restaura os valores iniciais.
- Estado central em `components/v2/SimulationProvider.tsx`; matemática em `lib/model.ts`; 3D em `components/v2/OrbitalScene.tsx`.
- Recursos do 3D locais, inclusive o decodificador Draco. Alternativa 2D em caso de indisponibilidade de WebGL.

## Design e referência

`desingn.md` especifica a versão 2. O arquivo original NeuroSync está preservado em `referencia/neurosync-master-your-mind-1-DESIGN.md`. Aplicados: Inter, JetBrains Mono para dados, superfície #191C21, espaçamento 8/16/24 px, raios de 8 px, hierarquia operacional compacta. Tema escuro espacial conforme o briefing; o HTML mencionado na referência não foi fornecido.

A Terra usa **three-globe**, mesmo renderizador interno de react-globe.gl do projeto antigo, com as texturas e configurações de `referencia/satellite-signal-edo-simulator-main/src/components/globe/GlobeScene.tsx`. Atmosfera ciano, relevo, textura noturna e linhas geográficas preservados; câmera, escala e integração foram adaptadas para React Three Fiber. Projeto antigo não alterado.

## Recursos e fontes

- `public/models/Tracking and Data Relay Satellites (TDRS) (D).glb`: modelo escolhido e fornecido pelo usuário, preservado sem edição. Antena principal modelada no plano XZ; +Y adotado como eixo de apontamento, com origem visual no alimentador da antena lateral. Escala didática, sem validar parâmetros físicos do satélite real.
- `public/textures/earth-night.jpg`, `earth-topology.png`, `night-sky.png`: mesmas URLs da referência, https://github.com/vasturiano/three-globe/tree/master/example/img. A origem é indicada na aba Cálculos; sem atribuir esses recursos aos autores do trabalho.
- `public/draco/*`: decodificador distribuído com Three.js, licença Apache 2.0 do Draco. Cabeçalhos de licença preservados.
- Laplace: https://tutorial.math.lamar.edu/classes/de/ivpwithlaplace.aspx
- Material acadêmico: https://math.mit.edu/~gs/dela/delasol_all.pdf

## Verificar

- `npm test`: condições iniciais, resíduos da EDO, convergência e continuidade perto de ζ=1.
- `node tests/v2-browser.mjs`: controles, cálculos, estado entre abas e layouts 1440/768/390. Requer servidor na porta 3005 e Microsoft Edge.
- `node tests/v2-navigation.mjs`: 18 trocas entre abas sem erros JavaScript.
- `node tests/v2-fallback.mjs`: desabilita WebGL e verifica alternativa 2D e controles.

A faixa ±1° representa somente alinhamento. Não calculamos órbita, potência, propagação, velocidade do sinal ou saturação de atuadores. Integrantes e instituição ainda devem ser informados. Nenhum deploy realizado.
