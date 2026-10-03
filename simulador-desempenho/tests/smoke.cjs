const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const banco = JSON.parse(fs.readFileSync(path.join(root, "dados/cenarios.json"), "utf8"));
const participantes = JSON.parse(fs.readFileSync(path.join(root, "dados/participantes.json"), "utf8")).participantes;
assert.equal(participantes.length, 61, "inclui os 60 nomes numerados e ANA CLARA SOUSA CRUZ");
assert.equal(new Set(participantes).size, participantes.length, "não duplica nomes no seletor");
class Storage {
  data = new Map();
  getItem(k) { return this.data.has(k) ? this.data.get(k) : null; }
  setItem(k, v) { this.data.set(k, String(v)); }
  removeItem(k) { this.data.delete(k); }
}
function node() { return { innerHTML: "", textContent: "", value: "", style: {}, scrollIntoView() {} }; }
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
  sim.context.document.querySelector("#nome").value = "__codigo__";
  sim.context.document.querySelector("#codigo").value = "Estudante Teste";
  sim.context.document.querySelector("#serie").value = "2ª série – Ensino Médio";
  sim.context.document.querySelector("#turma").value = "2º AT";
  vm.runInContext("iniciar()", sim.context);
  const decisions = ["criteria", "balanced", "cha", "fact"];
  for (let i = 0; i < 6; i++) {
    const stage = i;
    const qs = vm.runInContext(`banco.etapas[${stage}].questoes`, sim.context);
    for (const q of qs) vm.runInContext(`selecionar(${JSON.stringify(q.id)}, ${JSON.stringify(q.opcoes.find(o => o[2] === 1)[0])})`, sim.context);
    if (i < 4) vm.runInContext(`decidir("s${21 + i}_desafio", ${JSON.stringify(decisions[i])})`, sim.context);
    if (i === 4) {
      for (const [key, value] of Object.entries({ specific: "Enviar atualização antes da reunião", measure: "Duas atualizações mensais", achievable: "Usar modelo e prática orientada", relevant: "Antecipar riscos de prazo", time: "Revisar em 60 dias", action: "Apresentar status quinzenal com mentoria" })) vm.runInContext(`guardar("s25_${key}", ${JSON.stringify(value)})`, sim.context);
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
  assert.ok(rows[0].descritores["S25 • SMART specific"], "inclui pontuação do SMART por componente");
  assert.match(sim.app.innerHTML, /Dossiê completo/, "apresenta o dossiê final");
  assert.equal(sim.storage.getItem("desempenho_rascunho_v2"), null, "remove rascunho após concluir");
  vm.runInContext("novaMissao()", sim.context);
  sim.context.document.querySelector("#nome").value = "Estudante 2";
  vm.runInContext("iniciar()", sim.context);
  assert.equal(vm.runInContext("etapa", sim.context), 0, "nova missão começa na primeira etapa");
  vm.runInContext("etapa=3; persistir()", sim.context);
  const reload = runtime(sim.storage);
  vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), reload.context);
  await new Promise(resolve => setImmediate(resolve));
  reload.context.document.querySelector("#nome").value = "__codigo__";
  reload.context.document.querySelector("#codigo").value = "Estudante 2";
  reload.context.document.querySelector("#serie").value = "2ª série – Ensino Médio";
  reload.context.document.querySelector("#turma").value = "2º AT";
  vm.runInContext("iniciar()", reload.context);
  assert.equal(vm.runInContext("etapa", reload.context), 3, "retoma o rascunho na etapa salva");

  const panel = runtime(sim.storage);
  panel.storage.setItem("desempenho_resultados", JSON.stringify(rows));
  vm.runInContext(fs.readFileSync(path.join(root, "professor.js"), "utf8"), panel.context);
  assert.match(panel.nodes.get("#resultados").innerHTML, /Estudante Teste/, "painel lista resultados locais");
  assert.match(panel.nodes.get("#resumo").innerHTML, /missões concluídas/, "painel calcula resumo");
  vm.runInContext(`ver(${JSON.stringify(rows[0].id)})`, panel.context);
  assert.match(panel.nodes.get("#detalhe").innerHTML, /Parecer do gestor/, "painel abre dossiê detalhado");
  vm.runInContext("exportarCSV(); exportarJSON()", panel.context);
  assert.deepEqual(panel.downloads.sort(), ["resultados-simulador-desempenho.csv", "resultados-simulador-desempenho.json"].sort(), "exporta a turma em CSV e JSON");
  assert.match(vm.runInContext('efeitoDecisao(1, "halo")', sim.context), /halo/, "decisão enviesada produz consequência pedagógica específica");
  const legacy = runtime();
  legacy.storage.setItem("desempenho_resultados", JSON.stringify([{ data: new Date().toISOString(), participante: "Registro anterior", serie: "2ª série", turma: "2º AT", nota: 75, nota_S21: 50 }]));
  vm.runInContext(fs.readFileSync(path.join(root, "professor.js"), "utf8"), legacy.context);
  assert.match(legacy.nodes.get("#resultados").innerHTML, /Registro anterior/, "mantém resultados gravados pelo MVP anterior");
  assert.match(legacy.nodes.get("#resultados").innerHTML, /50/, "exibe notas antigas por etapa");
  console.log("Smoke test concluído: missão completa, pontuação/relatório local e painel do professor.");
})().catch(error => { console.error(error); process.exitCode = 1; });
