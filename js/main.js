// --- CONFIGURAÇÕES ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEREv8esvovTv6Q5fgGoTYtVpLkYaoGe529dnqxXN3kvToXSPy77DrSugJGsaUrqh0_A/exec";

// --- ELEMENTOS DO MURAL DE RECADOS ---
const formRecado = document.getElementById('form-recado');
const listaRecados = document.getElementById('lista-recados');
const btnPostar = document.getElementById('btn-postar');

// 1. Função para buscar recados (GET)
async function carregarRecados() {
    if(!listaRecados) return;

    try {
        listaRecados.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Carregando recadinhos...</p>';
        
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const recados = await response.json();

        listaRecados.innerHTML = ''; 

        if (!recados || recados.length === 0) {
            listaRecados.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Seja o primeiro a deixar um recado! 🥰</p>';
            return;
        }

        recados.forEach(recado => {
            criarElementoRecado(recado.nome, recado.mensagem);
        });

    } catch (error) {
        console.error("Erro ao carregar recados:", error);
        listaRecados.innerHTML = '<p style="text-align:center; color:#d63031;">Não foi possível carregar os recados.</p>';
    }
}

// 2. Cria o visual do recado
function criarElementoRecado(nome, msg) {
    const div = document.createElement('div');
    div.className = 'recado-postado'; // Usa a classe do CSS novo
    // Estilos inline de backup caso o CSS falhe
    div.style.background = "#fffbf5";
    div.style.borderLeft = "4px solid #FF69B4";
    div.style.padding = "15px";
    div.style.marginBottom = "15px";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
    
    div.innerHTML = `
        <div style="font-weight:bold; color:#C71585; margin-bottom:5px;">${nome} escreveu:</div>
        <div style="color:#555; font-style:italic;">"${msg}"</div>
    `;
    listaRecados.appendChild(div);
}

// 3. Enviar novo recado (POST)
if(formRecado) {
    formRecado.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('mensagem-nome').value;
        const msg = document.getElementById('mensagem-texto').value;

        btnPostar.disabled = true;
        btnPostar.innerText = "Postando...";

        const dados = {
            tipo: "recado",
            nome: nome,
            mensagem: msg
        };

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        }).then(() => {
            const div = document.createElement('div');
            div.style.background = "#fffbf5";
            div.style.borderLeft = "4px solid #64B87B"; 
            div.style.padding = "15px";
            div.style.marginBottom = "15px";
            div.style.borderRadius = "8px";
            
            div.innerHTML = `
                <div style="font-weight:bold; color:#C71585; margin-bottom:5px;">${nome} (Você) escreveu agora:</div>
                <div style="color:#555; font-style:italic;">"${msg}"</div>
            `;
            listaRecados.prepend(div);
            
            formRecado.reset();
            btnPostar.disabled = false;
            btnPostar.innerText = "Postar Recado";
            alert("Recado enviado com sucesso! 🦋");

        }).catch(err => {
            console.error(err);
            alert("Erro ao postar.");
            btnPostar.disabled = false;
            btnPostar.innerText = "Postar Recado";
        });
    });
}

carregarRecados();