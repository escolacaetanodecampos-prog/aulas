const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const banco = JSON.parse(fs.readFileSync(path.join(root, "dados/cenarios.json"), "utf8"));
const participantes = JSON.parse(fs.readFileSync(path.join(root, "dados/participantes.json"), "utf8")).participantes;
assert.equal(participantes.length, 61, "inclui os 60 nomes numerados e ANA CLARA SOUSA CRUZ");
assert.equal(new Set(participantes).size, participantes.length, "não duplica nomes no seletor");
const pagesWorkflow = fs.readFileSync(path.resolve(root, "../.github/workflows/desempenho-pages.yml"), "utf8");
assert.match(pagesWorkflow, /cp -R simulador-rh-mvp\/\. _site\/simulador-rh-mvp\//, "publica o caminho direto do simulador RH");
assert.match(pagesWorkflow, /cp -R rh\/\. _site\/rh\//, "publica o atalho /rh para o simulador RH");
assert.match(pagesWorkflow, /test -f _site\/rh\/index\.html/, "garante que o atalho /rh foi copiado");
assert.match(pagesWorkflow, /test -f _site\/simulador-rh-mvp\/index\.html/, "falha o deploy se faltar a página do simulador RH");
class Storage {
  data = new Map();
  getItem(k) { return this.data.has(k) ? this.data.get(k) : null; }
  setItem(k, v) { this.data.set(k, String(v)); }
  removeItem(k) { this.data.delete(k); }
}
function node() { return { innerHTML: "", textContent: "", value: "", style: {}, hidden: false, focus() {}, scrollIntoView() {} }; }
function runtime(storage = new Storage()) {
  const nodes = new Map();
  const app = node();
  nodes.set("#app", app);
  const downloads = [];
  const document = {
    querySelector(key) { if (!nodes.has(key)) nodes.set(key, node()); return nodes.get(key); },
    createElement() { const a = { _download: "", click() { downloads.push(a._download); }, set href(v) {}, set download(v) { a._download = v; } }; return a; }
  };
  const context = vm.createContext({
    document, localStorage: storage, console, Date, Math, Blob, URL,
    setTimeout() {}, fetch: async url => ({ ok: true, json: async () => String(url).includes("participantes.json") ? { participantes } : banco })
  });
  return { context, nodes, app, storage, downloads };
}

(async () => {
  const sim = runtime();
  vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), sim.context);
  await new Promise(resolve => setImmediate(resolve));
  assert.match(sim.app.innerHTML, /ANA CLARA SOUSA CRUZ/, "exibe os nomes cadastrados para seleção");
  assert.doesNotMatch(sim.app.innerHTML, /Código pedagógico|3ª série/, "não oferece código pedagógico ou terceira série");
  assert.match(sim.app.innerHTML, /2º AT - Administração/);
  assert.match(sim.app.innerHTML, /2º BT - Administração/);
  sim.context.document.querySelector("#nome").value = "";
  sim.context.document.querySelector("#turma").value = "";
  vm.runInContext("iniciar()", sim.context);
  assert.match(sim.nodes.get("#erroIdentificacao").textContent, /Selecione seu nome/);
  sim.context.document.querySelector("#nome").value = "ANA CLARA SOUSA CRUZ";
  sim.context.document.querySelector("#serie").value = "2ª série – Ensino Médio";
  sim.context.document.querySelector("#turma").value = "2º AT - Administração";
  vm.runInContext("iniciar()", sim.context);
  const decisions = ["criteria", "balanced", "cha", "fact"];
  for (let i = 0; i < 6; i++) {
    const stage = i;
    const qs = vm.runInContext(`banco.etapas[${stage}].questoes`, sim.context);
    for (const q of qs) vm.runInContext(`selecionar(${JSON.stringify(q.id)}, ${JSON.stringify(q.opcoes.find(o => o[2] === 1)[0])})`, sim.context);
    if (i < 4) vm.runInContext(`decidir("s${21 + i}_desafio", ${JSON.stringify(decisions[i])})`, sim.context);
    if (i === 4) {
      vm.runInContext('classificarSmart("s25", "specific", "measure")', sim.context);
      assert.match(sim.nodes.get("#retorno").innerHTML, /Vamos revisar/, "dá retorno imediato quando a classificação precisa ser revista");
      assert.match(sim.nodes.get("#retorno").innerHTML, /corresponde a <strong>Específica<\/strong>/, "informa a classificação correta no retorno");
      for (const key of ["specific", "measure", "achievable", "relevant", "time", "action"]) vm.runInContext(`classificarSmart("s25", ${JSON.stringify(key)}, ${JSON.stringify(key)})`, sim.context);
      assert.equal(vm.runInContext("validacaoEtapa()", sim.context), "", "permite avançar após classificar as seis frases");
    }
    if (i === 5) {
      vm.runInContext('decidir("s26_lead", "autonomy")', sim.context);
      vm.runInContext('guardar("s26_dossier", "CAND-027 demonstra qualidade nos registros; combinamos atualizações quinzenais com apoio, indicador e revisão em 60 dias.")', sim.context);
    }
    vm.runInContext("avancar()", sim.context);
  }
  const rows = JSON.parse(sim.storage.getItem("desempenho_resultados"));
  assert.equal(rows.length, 1, "salva uma missão concluída");
  assert.equal(rows[0].nota, 100, "atribui pontuação máxima a todas as respostas e produções completas");
  assert.equal(Object.keys(rows[0].porEtapa).length, 6, "reporta as seis etapas");
  assert.ok(rows[0].descritores["S25 • Específica"], "inclui pontuação de classificação por campo SMART");
  assert.equal(rows[0].descritores["S25 • Ação do PDI"].nota, 100, "pontua a classificação da ação do PDI");
  assert.match(rows[0].producoes["S25 • Classificação — Específica"], /Classificação escolhida: Específica/, "relatório registra a frase e a classificação escolhida");
  assert.match(sim.app.innerHTML, /Dossiê completo/, "apresenta o dossiê final");
  assert.match(sim.app.innerHTML, /Baixar relatório HTML/);
  vm.runInContext("baixarRelatorio(); baixarHTML()", sim.context);
  assert.deepEqual(sim.downloads.sort(), ["dossie-gestor-CAND-027.html", "dossie-gestor-CAND-027.txt"].sort(), "exporta o dossiê individual em HTML e TXT");
  assert.equal(sim.storage.getItem("desempenho_rascunho_v2"), null, "remove rascunho após concluir");
  vm.runInContext("novaMissao()", sim.context);
  sim.context.document.querySelector("#nome").value = "ANALY BARBOSA DE SOUSA";
  sim.context.document.querySelector("#turma").value = "2º BT - Administração";
  vm.runInContext("iniciar()", sim.context);
  assert.equal(vm.runInContext("etapa", sim.context), 0, "nova missão começa na primeira etapa");
  vm.runInContext("etapa=3; persistir()", sim.context);
  const reload = runtime(sim.storage);
  vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), reload.context);
  await new Promise(resolve => setImmediate(resolve));
  reload.context.document.querySelector("#nome").value = "ANALY BARBOSA DE SOUSA";
  reload.context.document.querySelector("#serie").value = "2ª série – Ensino Médio";
  reload.context.document.querySelector("#turma").value = "2º BT - Administração";
  vm.runInContext("iniciar()", reload.context);
  assert.equal(vm.runInContext("etapa", reload.context), 3, "retoma o rascunho na etapa salva");

  const panel = runtime(sim.storage);
  panel.storage.setItem("desempenho_resultados", JSON.stringify(rows));
  vm.runInContext(fs.readFileSync(path.join(root, "professor.js"), "utf8"), panel.context);
  const lockedResults = panel.context.document.querySelector("#resultados");
  panel.context.document.querySelector("#painelProfessor").hidden = true;
  assert.equal(lockedResults.innerHTML, "", "não revela resultados antes do código de acesso");
  panel.context.document.querySelector("#codigoAcesso").value = "000000";
  vm.runInContext('acessarPainel({ preventDefault() {} })', panel.context);
  assert.equal(panel.context.document.querySelector("#painelProfessor").hidden, true, "painel permanece fechado quando o código está incorreto");
  panel.context.document.querySelector("#codigoAcesso").value = "131313";
  vm.runInContext('acessarPainel({ preventDefault() {} })', panel.context);
  assert.equal(panel.context.document.querySelector("#painelProfessor").hidden, false, "abre o painel com o código correto");
  assert.equal(panel.context.document.querySelector("#acessoProfessor").hidden, true, "oculta o formulário de acesso após autenticação");
  assert.match(panel.nodes.get("#resultados").innerHTML, /ANA CLARA SOUSA CRUZ/, "painel lista resultados locais após o acesso");
  assert.match(panel.nodes.get("#resumo").innerHTML, /missões concluídas/, "painel calcula resumo");
  vm.runInContext(`ver(${JSON.stringify(rows[0].id)})`, panel.context);
  assert.match(panel.nodes.get("#detalhe").innerHTML, /Parecer do gestor/, "painel abre dossiê detalhado");
  vm.runInContext("exportarCSV(); exportarJSON()", panel.context);
  assert.deepEqual(panel.downloads.sort(), ["resultados-simulador-desempenho.csv", "resultados-simulador-desempenho.json"].sort(), "exporta a turma em CSV e JSON");
  assert.match(vm.runInContext('efeitoDecisao(1, "halo")', sim.context), /halo/, "decisão enviesada produz consequência pedagógica específica");
  const legacy = runtime();
  legacy.storage.setItem("desempenho_resultados", JSON.stringify([{ data: new Date().toISOString(), participante: "Registro anterior", serie: "2ª série", turma: "2º AT", nota: 75, nota_S21: 50 }]));
  vm.runInContext(fs.readFileSync(path.join(root, "professor.js"), "utf8"), legacy.context);
  const legacyRows = legacy.context.document.querySelector("#resultados");
  legacy.context.document.querySelector("#painelProfessor").hidden = true;
  assert.equal(legacyRows.innerHTML, "", "mantém resultados anteriores protegidos até o acesso");
  legacy.context.document.querySelector("#codigoAcesso").value = "131313";
  vm.runInContext('acessarPainel({ preventDefault() {} })', legacy.context);
  assert.match(legacy.nodes.get("#resultados").innerHTML, /Registro anterior/, "mantém resultados gravados pelo MVP anterior");
  assert.match(legacy.nodes.get("#resultados").innerHTML, /50/, "exibe notas antigas por etapa");
  console.log("Smoke test concluído: missão completa, pontuação/relatório local e painel do professor.");
})().catch(error => { console.error(error); process.exitCode = 1; });
