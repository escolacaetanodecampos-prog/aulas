# Simulador de Gestão de Desempenho

Missão pedagógica do 4º bimestre de Introdução à Administração, Legislação e Pessoas. Aplicação estática, em português, sem dependências ou backend. O percurso usa o caso fictício **CAND-027 — Nayara Pinos Ortiz**; não use o simulador para decisões reais de emprego.

## Percurso de aprendizagem

| Etapa | Fase | Conteúdo e produção |
|---|---|---|
| S21 | CONHECER | Finalidade, critérios, período e estrutura da avaliação |
| S22 | ANALISAR | Indicadores, métodos, evidências e vieses (recência e halo) |
| S23 | DECIDIR | Competências e análise CHA (conhecimento, habilidade e atitude observável) |
| S24 | JUSTIFICAR | Laboratório de feedback com situação, impacto, escuta e decisão |
| S25 | PLANEJAR | Meta SMART com ação de desenvolvimento individual (PDI) |
| S26 | LIDERAR | Autonomia, acompanhamento, engajamento e dossiê final do gestor |

Cada etapa combina duas questões conceituais do banco `dados/cenarios.json` e um desafio aplicado. As escolhas mostram feedback e consequências pedagógicas prováveis. A missão final reúne a decisão, a produção do participante e um relatório por etapa e descritor.

## Identificação dos participantes

A tela inicial oferece um seletor com os 61 nomes informados pela turma (incluindo ANA CLARA SOUSA CRUZ). A identificação é feita pelo nome; a série é fixa em 2ª série do Ensino Médio e a turma é escolhida entre **2º AT - Administração** e **2º BT - Administração**. A lista fica em `dados/participantes.json` e os nomes selecionados são registrados nos resultados e relatórios.

## Pontuação e persistência

A pontuação soma descritores demonstrados: acerto das questões de conhecimento, escolha da decisão indicada no cenário, classificação correta das cinco partes da meta SMART e da ação do PDI, escolha de liderança e extensão mínima do parecer (100 caracteres). Na etapa S25, o estudante lê frases prontas do caso CAND-027 e escolhe em menus qual campo cada uma representa; cada classificação correta vale um descritor. A atividade apresenta retorno explicativo após cada escolha.

O rascunho atual fica em `localStorage` com a chave `desempenho_rascunho_v2`; resultados concluídos continuam na chave existente `desempenho_resultados`, mantendo compatibilidade com tentativas anteriores. A persistência é limitada ao perfil do navegador e à origem (domínio/protocolo/pasta publicada). Não há sincronização entre dispositivos ou envio a servidor. O painel `professor.html` solicita o código `131313`, filtra registros locais, mostra notas por etapa e produções, e exporta CSV ou JSON para consolidação manual. Como o projeto é estático, o código é uma barreira de interface, não autenticação de servidor. Apagar registros é uma ação explícita no painel.

O participante pode baixar o dossiê individual em TXT ou HTML. O painel do professor mantém as exportações da turma em CSV e JSON. Os arquivos contêm identificação e respostas; armazene e compartilhe com cuidado.

## Publicação e manutenção

Os arquivos podem ser servidos como site estático/GitHub Pages. `index.html` carrega `app.js`, `styles.css` e `dados/cenarios.json`; o painel carrega `professor.js`. Mantenha esses arquivos na mesma pasta e publique o subdiretório completo. O atalho `/desempenho/` existente redireciona para o simulador. `../rh/` continua separado; as mudanças desta versão ficam somente no simulador.

## Validação local

- Verifique a sintaxe de `app.js` e `professor.js` com Node.js: `node --check app.js` e `node --check professor.js`.
- Sirva a pasta por HTTP para que `fetch()` carregue o JSON (abrir o HTML por `file://` não é suportado).
- Complete uma missão, recarregue o painel na mesma origem, confira notas/produções e teste as exportações CSV e JSON.
- Verifique em janela móvel que a tabela do painel rola horizontalmente e que o fluxo de etapas cabe na tela.

## Limites conhecidos

Este é um protótipo pedagógico offline. O painel não é uma base institucional multiusuário, não controla identidade nem permissões, e os dados podem ser removidos pelo navegador. Os indicadores do caso são fictícios e servem apenas para discussão didática.
