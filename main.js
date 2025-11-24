const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqmVMxLdKm2tmiwcjvwbrAT2Qxr3CgFFkbpQfkoJmbLfRkQL7oFuVJMWCaaQ0OF6OkqQ/exec";

const DATA_LIMITE = new Date(2025, 11, 20); 

const selectStatus = document.getElementById('status');
const divDetalhes = document.getElementById('detalhes-extras');
const selectAdultos = document.getElementById('adultos');
const containerAdultos = document.getElementById('container-adultos');
const selectCriancas = document.getElementById('criancas');
const containerCriancas = document.getElementById('container-criancas');

selectStatus.addEventListener('change', function() {
    if (this.value === 'sim') {
        divDetalhes.classList.remove('hidden');
    } else {
        divDetalhes.classList.add('hidden');
        limparCamposDinamicos();
    }
});

function limparCamposDinamicos() {
    selectAdultos.value = "1";
    selectCriancas.value = "0";
    containerAdultos.innerHTML = '';
    containerCriancas.innerHTML = '';
}


selectAdultos.addEventListener('change', function() {
    const qtd = parseInt(this.value);
    containerAdultos.innerHTML = ''; 

    
    if (qtd > 1) {
        const titulo = document.createElement('p');
        titulo.innerText = "Nome COMPLETO dos acompanhantes:";
        titulo.className = "titulo-dinamico";
        titulo.style.color = "#d63031"; 
        containerAdultos.appendChild(titulo);

        
        for (let i = 2; i <= qtd; i++) {
            const input = document.createElement('input');
            input.type = "text";
            input.placeholder = `Nome do Adulto ${i}`;
            input.className = "input-adulto-extra"; 
            input.required = true;
            input.style.marginBottom = "10px";
            containerAdultos.appendChild(input);
        }
    }
});


selectCriancas.addEventListener('change', function() {
    const qtd = parseInt(this.value);
    containerCriancas.innerHTML = ''; 

    if (qtd > 0) {
        const titulo = document.createElement('p');
        titulo.innerText = "Nome e Idade das crianças:";
        titulo.className = "titulo-dinamico";
        containerCriancas.appendChild(titulo);

        for (let i = 1; i <= qtd; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'wrapper-crianca'; 
            
           
            const inputNome = document.createElement('input');
            inputNome.type = "text";
            inputNome.placeholder = `Nome da Criança ${i}`;
            inputNome.className = "nome-crianca";
            inputNome.required = true;

       
            const selectIdade = document.createElement('select');
            selectIdade.className = "idade-crianca";
            selectIdade.required = true;
            selectIdade.innerHTML = `<option value="">Idade...</option>`;
            selectIdade.innerHTML += `<option value="Bebê">Bebê (-1 ano)</option>`;
            for(let j=1; j<=12; j++) selectIdade.innerHTML += `<option value="${j} anos">${j} anos</option>`;
            selectIdade.innerHTML += `<option value="+12 anos">+12 anos</option>`;

            wrapper.appendChild(inputNome);
            wrapper.appendChild(selectIdade);
            containerCriancas.appendChild(wrapper);
        }
    }
});


function checarPrazo() {
    const hoje = new Date();
    const urlParams = new URLSearchParams(window.location.search);
    const ehLote2 = urlParams.get('lote') === '2';

    if (!ehLote2 && hoje > DATA_LIMITE) {
        document.getElementById('form-convite').classList.add('hidden');
        document.getElementById('msg-expirado').classList.remove('hidden');
    }
}

const form = document.getElementById('form-convite');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-enviar');
    
 
    if (selectStatus.value === 'sim' && selectStatus.value === '') {
       alert("Por favor, informe se você vai ou não.");
       return;
    }

    
    let nomesAdultosExtras = "Nenhum";
    const inputsAdultos = document.querySelectorAll('.input-adulto-extra');
    if(inputsAdultos.length > 0) {
        const nomes = Array.from(inputsAdultos).map(input => input.value);
        nomesAdultosExtras = nomes.join(', ');
    }

    /
    let detalhesCriancas = "Nenhuma";
    const wrappersCriancas = document.querySelectorAll('.wrapper-crianca');
    if(wrappersCriancas.length > 0) {
        const dados = Array.from(wrappersCriancas).map(div => {
            const nome = div.querySelector('.nome-crianca').value;
            const idade = div.querySelector('.idade-crianca').value;
            return `${nome} (${idade})`; 
        detalhesCriancas = dados.join('; ');
    }

    btn.disabled = true;
    btn.innerText = "Enviando...";

    
    const dados = {
        nome: document.getElementById('nome').value,
        status: document.getElementById('status').value,
        adultos: document.getElementById('adultos').value,
        criancas: document.getElementById('criancas').value,
        
        nomes_adultos_extras: nomesAdultosExtras,
        detalhes_criancas: detalhesCriancas
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    }).then(() => {
      
        document.getElementById('rsvp-section').innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <h2 style="color:var(--text-color); font-family:'Dancing Script'">Confirmadíssimo!</h2>
                <p>Obrigado, ${dados.nome.split(' ')[0]}!</p>
                <p>Sua presença foi registrada com sucesso.</p>
                <br>🦋
            </div>
        `;
        form.style.display = 'none'; 
    }).catch(err => {
        console.error(err);
        alert("Erro ao enviar. Tente novamente.");
        btn.disabled = false;
        btn.innerText = "Tentar Novamente";
    });
});

checarPrazo();