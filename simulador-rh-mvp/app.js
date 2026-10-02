
const S={step:0,student:"",turma:"",c:[],tri:[],cha:{},final:[],hire:"",train:""};
const A=document.querySelector("#app");
const steps=["Briefing","Triagem","CHA","Teste/entrevista","Decisão","Desenvolvimento","Resultado"];
async function boot(){
 S.c=(await (await fetch("dados/candidatos.json")).json()).candidatos;
 document.querySelector("#start").onclick=function(){S.student=document.querySelector("#student").value||"SEM-CODIGO";S.turma=document.querySelector("#class").value;S.step=1;render()};
}
function nav(){return "<p>"+steps.map(function(x,i){return "<span class='tag'>"+(i+1)+". "+x+"</span>"}).join("")+"</p>"}
function render(){A.innerHTML=nav()+views[S.step]();window.scrollTo(0,0)}
function card(c){
 return "<article class='candidate "+(S.tri.includes(c.id)?"selected":"")+"'><b>"+c.nome+"</b><p>"+c.formacao+"</p><p>"+c.experiencia+"</p><p>"+c.hard.slice(0,3).map(function(x){return "<span class='tag'>"+x+"</span>"}).join("")+"</p><button onclick=\"tri('"+c.id+"')\">"+(S.tri.includes(c.id)?"Retirar":"Selecionar")+"</button></article>"
}
const views=[
function(){return ""},
function(){return "<section class='card'><small>MISSÃO</small><h1>Assistente Administrativo</h1><p>A empresa fictícia Nova Gestão Serviços Administrativos Ltda. precisa contratar alguém para apoiar documentos, atendimento, planilhas e controles internos.</p><div class='notice'><b>Requisitos:</b> ensino médio, informática básica, organização, comunicação e trabalho em equipe.<br><b>Diferenciais:</b> Excel intermediário, experiência administrativa, ERP e indicadores.</div><h2>Recrutamento</h2><p>Os 30 candidatos estão inscritos. Analise os perfis e faça a triagem.</p><button onclick='go(2)'>Abrir candidatos</button></section>"},
function(){return "<section class='card'><h1>Triagem curricular</h1><p>Selecione até 8 candidatos usando as informações profissionais. Não use a aparência como critério.</p><div class='grid'>"+S.c.map(card).join("")+"</div><p><b>"+S.tri.length+"/8 selecionados</b></p><button onclick='go(3)' "+(S.tri.length<3?"disabled":"")+">Continuar para CHA</button></section>"},
function(){return "<section class='card'><h1>Modelo CHA</h1><p>Classifique uma competência técnica e uma socioemocional para cada candidato encaminhado.</p>"+S.tri.map(function(id){var c=S.c.find(function(x){return x.id===id});return "<div class='notice'><b>"+c.nome+"</b><label>Hard skill<select onchange=\"setcha('"+id+"','h',this.value)\"><option value=''>Selecione</option>"+c.hard.map(function(x){return "<option>"+x+"</option>"}).join("")+"</select></label><label>Soft skill<select onchange=\"setcha('"+id+"','s',this.value)\"><option value=''>Selecione</option>"+c.soft.map(function(x){return "<option>"+x+"</option>"}).join("")+"</select></label></div>"}).join("")+"<br><button onclick='go(4)'>Ver resultados</button></section>"},
function(){return "<section class='card'><h1>Teste técnico e entrevista</h1><p>Compare as novas evidências antes da decisão.</p><div class='grid'>"+S.tri.map(function(id){var c=S.c.find(function(x){return x.id===id});return "<article class='candidate'><b>"+c.nome+"</b><p>Teste técnico: <b>"+c.teste+"/100</b></p><p>Entrevista: <b>"+c.entrevista+"/100</b></p><p>Ponto de desenvolvimento: "+c.desenvolvimento+"</p></article>"}).join("")+"</div><button onclick='go(5)'>Tomar decisão</button></section>"},
function(){return "<section class='card'><h1>Decisão final</h1><p>Escolha até 3 finalistas e indique quem seria contratado.</p><div class='grid'>"+S.tri.map(function(id){var c=S.c.find(function(x){return x.id===id});return "<article class='candidate "+(S.final.includes(id)?"selected":"")+"'><b>"+c.nome+"</b><p>Teste "+c.teste+" • Entrevista "+c.entrevista+"</p><button onclick=\"fin('"+id+"')\">"+(S.final.includes(id)?"Retirar":"Finalista")+"</button></article>"}).join("")+"</div><label>Contratado<select id='hire'><option value=''>Selecione</option>"+S.final.map(function(id){var c=S.c.find(function(x){return x.id===id});return "<option value='"+id+"'>"+c.nome+"</option>"}).join("")+"</select></label><label>Justificativa<textarea id='why' rows='4' placeholder='Quais evidências sustentam sua decisão?'></textarea></label><button onclick='decision()'>Confirmar decisão</button></section>"},
function(){var c=S.c.find(function(x){return x.id===S.hire});return "<section class='card'><h1>Desenvolvimento</h1><div class='notice'><b>"+c.nome+"</b><br>Necessidade: "+c.desenvolvimento+"</div><p>Escolha a modalidade de treinamento adequada.</p><div class='grid'>"+["Presencial","Online","Híbrido","Prático no trabalho"].map(function(x){return "<button onclick=\"train('"+x+"')\">"+x+"</button>"}).join("")+"</div></section>"},
function(){var c=S.c.find(function(x){return x.id===S.hire});var filled=Object.values(S.cha).filter(function(x){return x.h&&x.s}).length;return "<section class='card'><small>DEVOLUTIVA</small><h1>Processo concluído</h1><p><b>Participante:</b> "+S.student+" • <b>Turma:</b> "+S.turma+"</p><p><b>Contratado:</b> "+c.nome+"</p><p><b>Triagem:</b> "+S.tri.length+" candidatos • <b>CHA:</b> "+filled+"/"+S.tri.length+"</p><p><b>Treinamento:</b> "+S.train+"</p><div class='notice'>A decisão será analisada considerando os requisitos da vaga e as evidências técnicas e socioemocionais obtidas no processo.</div><br><button onclick='location.reload()'>Nova simulação</button></section>"}
];
function go(n){S.step=n;render()}
function tri(id){if(S.tri.includes(id))S.tri=S.tri.filter(function(x){return x!==id});else if(S.tri.length<8)S.tri.push(id);render()}
function setcha(id,k,v){if(!S.cha[id])S.cha[id]={};S.cha[id][k]=v}
function fin(id){if(S.final.includes(id))S.final=S.final.filter(function(x){return x!==id});else if(S.final.length<3)S.final.push(id);render()}
function decision(){S.hire=document.querySelector("#hire").value;if(!S.hire)return alert("Selecione o contratado.");go(6)}
function train(x){S.train=x;go(7)}
boot();
