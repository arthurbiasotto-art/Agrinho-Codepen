/* ENGINE DE NAVEGAÇÃO ENTRE ABAS */
function switchTabSystem(eventRef, targetedTabId) {
  document.querySelectorAll('.tab-content').forEach(element => element.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(targetedTabId).classList.add('active');
  eventRef.currentTarget.classList.add('active');
}

/* ENGINE DO Jogo 1: ECO-GRID */
let airMetrics = 100;
let energyMetrics = 80;

setInterval(() => {
  if(airMetrics > 0 && energyMetrics > 0) {
    airMetrics -= 3;
    energyMetrics -= 2;
    syncGridVisuals();
  }
}, 2500);

function executeGridLogic(type) {
  if (airMetrics <= 0 || energyMetrics <= 0) {
    airMetrics = 100; energyMetrics = 80;
    document.getElementById('grid-system-alert').style.color = "var(--text-muted)";
    syncGridVisuals();
    return;
  }

  if(type === 'floresta') {
    airMetrics = Math.min(airMetrics + 22, 100);
    energyMetrics = Math.max(energyMetrics - 12, 0);
    document.getElementById('grid-system-alert').innerText = "Bio-filtros expandidos! Qualidade do ar restaurada.";
  } else {
    energyMetrics = Math.min(energyMetrics + 25, 120);
    airMetrics = Math.max(airMetrics - 8, 0);
    document.getElementById('grid-system-alert').innerText = "Reatores ativos! Grade energética recarregada.";
  }
  syncGridVisuals();
}

function syncGridVisuals() {
  const arLabel = document.getElementById('grid-ar-display');
  const enLabel = document.getElementById('grid-en-display');
  
  arLabel.innerText = airMetrics + "%";
  enLabel.innerText = energyMetrics;

  arLabel.style.color = airMetrics < 35 ? "var(--accent)" : "var(--primary)";
  enLabel.style.color = energyMetrics < 25 ? "var(--accent)" : "var(--secondary)";

  if(airMetrics <= 0 || energyMetrics <= 0) {
    document.getElementById('grid-system-alert').innerText = "🚨 COLAPSO URBANO! Infraestrutura falhou. Clique em qualquer botão para reiniciar.";
    document.getElementById('grid-system-alert').style.color = "var(--accent)";
  }
}

/* ENGINE DO JOGO 2: ECO-TRUNFO */
const trunfoDatabase = [
  {nome: "Painel de Grafeno", imp: 95, tech: 92, custo: 40},
  {nome: "Concreto Biogênico", imp: 88, tech: 75, custo: 20},
  {nome: "Filtro de Microalgas", imp: 98, tech: 80, custo: 50},
  {nome: "Reciclador Quântico", imp: 75, tech: 96, custo: 85}
];
let currentActiveCard = trunfoDatabase[2];

function triggerCardDuel(chosenAttr) {
  const adversaryBotCard = trunfoDatabase[Math.floor(Math.random() * trunfoDatabase.length)];
  
  let pVal = chosenAttr === 'impacto' ? currentActiveCard.imp : (chosenAttr === 'tech' ? currentActiveCard.tech : currentActiveCard.custo);
  let bVal = chosenAttr === 'impacto' ? adversaryBotCard.imp : (chosenAttr === 'tech' ? adversaryBotCard.tech : adversaryBotCard.custo);
  
  let playerVictory = false;
  if(chosenAttr === 'custo') {
    playerVictory = pVal < bVal;
  } else {
    playerVictory = pVal > bVal;
  }

  const logElement = document.getElementById('trunfo-duel-logs');
  if(playerVictory) {
    logElement.innerHTML = `🏆 Vitória! Seu oponente perdeu usando "${adversaryBotCard.nome}" (${bVal}).`;
    logElement.style.color = "var(--primary)";
  } else {
    logElement.innerHTML = `❌ Derrota! O bot superou você com "${adversaryBotCard.nome}" (${bVal}).`;
    logElement.style.color = "var(--accent)";
  }
  document.getElementById('btn-reset-trunfo-card').style.display = "block";
}

function loadNextTrunfoCard() {
  currentActiveCard = trunfoDatabase[Math.floor(Math.random() * trunfoDatabase.length)];
  document.getElementById('trunfo-card-title').innerText = currentActiveCard.nome;
  document.getElementById('val-attr-imp').innerText = currentActiveCard.imp;
  document.getElementById('val-attr-tech').innerText = currentActiveCard.tech;
  document.getElementById('val-attr-cost').innerText = currentActiveCard.custo;
  
  const logElement = document.getElementById('trunfo-duel-logs');
  logElement.innerText = "Sua vez! Selecione um atributo acima para iniciar o duelo.";
  logElement.style.color = "var(--secondary)";
  document.getElementById('btn-reset-trunfo-card').style.display = "none";
}

/* ENGINE DA ABA 3: LAB DE POLÍTICAS E TERMINAL DE LOGS */
let dynamicGlobalTemp = 2.5;
let dynamicGlobalBio = 30;

function evaluatePolicyChanges(btnRef, tempModifier, bioModifier, policyName) {
  btnRef.classList.toggle('active');
  let isEnacted = btnRef.classList.contains('active');
  
  dynamicGlobalTemp += isEnacted ? tempModifier : -tempModifier;
  dynamicGlobalBio += isEnacted ? bioModifier : -bioModifier;

  dynamicGlobalTemp = Math.max(-0.5, dynamicGlobalTemp);
  dynamicGlobalBio = Math.min(100, Math.max(0, dynamicGlobalBio));

  // Atualiza o terminal de logs simulado
  const term = document.getElementById('terminal-logs');
  const timeString = new Date().toLocaleTimeString();
  const statusText = isEnacted ? "ATIVADA" : "DESATIVADA";
  term.innerHTML += `<br>[${timeString}] DIRETRIZ: "${policyName}" foi ${statusText}.`;
  term.scrollTop = term.scrollHeight; // Auto-scroll para baixo

  renderLabDashboard();
}

function renderLabDashboard() {
  const barTempFill = document.getElementById('fill-temp-progress');
  const barBioFill = document.getElementById('fill-bio-progress');
  
  let calculatedVisualScale = (dynamicGlobalTemp + 0.5) * 30;
  barTempFill.style.width = Math.min(100, Math.max(0, calculatedVisualScale)) + "%";
  barTempFill.style.background = dynamicGlobalTemp > 1.4 ? "var(--accent)" : "var(--primary)";
  
  document.getElementById('label-temp-status').innerText = dynamicGlobalTemp.toFixed(1) + "°C";
  document.getElementById('label-temp-status').style.color = dynamicGlobalTemp > 1.4 ? "var(--accent)" : "var(--primary)";

  barBioFill.style.width = dynamicGlobalBio + "%";
  document.getElementById('label-bio-status').innerText = dynamicGlobalBio + "%";
}
