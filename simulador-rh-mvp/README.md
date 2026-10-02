# Simulador RH — MVP

Protótipo pedagógico para Introdução à Administração de Empresas.

Fluxo: recrutamento → triagem → CHA → teste/entrevista → decisão → treinamento → devolutiva.

Os 30 candidatos são personagens fictícios. O sistema não grava os nomes dos alunos no repositório; o participante informa seu código no início.

Próximas etapas: associar os 30 retratos, criar teste técnico interativo, banco de perguntas de entrevista, matriz de pontuação por descritor, painel do professor e integração opcional com Google Sheets/Apps Script.


## Painel do professor
`professor.html` permite importar os relatórios JSON exportados pelos estudantes e consolidar as médias por descritor. Os arquivos são processados localmente no navegador.

## Publicação
Foi incluído um workflow para GitHub Pages. Após a entrada da alteração na `main` e a configuração do Pages no repositório, o workflow publica automaticamente a pasta `simulador-rh-mvp`.
