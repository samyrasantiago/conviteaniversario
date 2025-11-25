const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqmVMxLdKm2tmiwcjvwbrAT2Qxr3CgFFkbpQfkoJmbLfRkQL7oFuVJMWCaaQ0OF6OkqQ/exec";
const DATA_LIMITE = new Date(2025, 11, 20); 

const selectStatus = document.getElementById('status');
const divDetalhes = document.getElementById('detalhes-extras');
const selectAdultos = document.getElementById('adultos');
const containerAdultos = document.getElementById('container-adultos');
const selectCriancas = document.getElementById('criancas');
const containerCriancas = document.getElementById('container-criancas');

if(selectStatus){
    selectStatus.addEventListener('change', function() {
        if (this.value === 'sim') {
            divDetalhes.classList.remove('hidden');
        } else {
            divDetalhes.classList.add('hidden');
            selectAdultos.value = "1";
            selectCriancas.value = "0";
            containerAdultos.innerHTML = '';
            containerCriancas.innerHTML = '';
        }
    });
}

if(selectAdultos){
    selectAdultos.addEventListener('change', function() {
        const qtd = parseInt(this.value);
        containerAdultos.innerHTML = ''; 
        if (qtd > 1) {
            const titulo = document.createElement('p');
            titulo.innerText = "Nome COMPLETO dos acompanhantes:";
            titulo.className = "titulo-dinamico";
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
}


if(selectCriancas){
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
                inputNome.type = "text"; inputNome.placeholder = `Nome da Criança ${i}`;
                inputNome.className = "nome-crianca"; inputNome.required = true;

                const selectIdade = document.createElement('select');
                selectIdade.className = "idade-crianca"; selectIdade.required = true;
                selectIdade.innerHTML = `<option value="">Idade...</option><option value="Bebê">Bebê (-1 ano)</option>`;
                for(let j=1; j<=12; j++) selectIdade.innerHTML += `<option value="${j} anos">${j} anos</option>`;
                
                wrapper.appendChild(inputNome); wrapper.appendChild(selectIdade);
                containerCriancas.appendChild(wrapper);
            }
        }
    });
}

const form = document.getElementById('form-convite');
if(form){
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('btn-enviar');
        const vaiNaFesta = document.getElementById('status').value === 'sim';
        
        let nomesAdultos = "Nenhum";
        const inAdultos = document.querySelectorAll('.input-adulto-extra');
        if(inAdultos.length > 0) nomesAdultos = Array.from(inAdultos).map(i => i.value).join(', ');

        let detCriancas = "Nenhuma";
        const wrCriancas = document.querySelectorAll('.wrapper-crianca');
        if(wrCriancas.length > 0) {
            detCriancas = Array.from(wrCriancas).map(div => {
                return `${div.querySelector('.nome-crianca').value} (${div.querySelector('.idade-crianca').value})`;
            }).join('; ');
        }

        btn.disabled = true; btn.innerText = "Enviando...";

        const dados = {
            tipo: "rsvp",
            nome: document.getElementById('nome').value,
            status: document.getElementById('status').value,
            adultos: vaiNaFesta ? document.getElementById('adultos').value : "0",
            criancas: vaiNaFesta ? document.getElementById('criancas').value : "0",
            nomes_adultos_extras: nomesAdultos,
            detalhes_criancas: detCriancas
        };

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        }).then(() => {
            
            let tituloMsg = "";
            let corpoMsg = "";

            if(vaiNaFesta) {
                tituloMsg = "Confirmadíssimo! 🎉";
                corpoMsg = "Oba! Sua presença foi registrada com sucesso.";
            } else {
                tituloMsg = "Que pena! 😢";
                corpoMsg = "Sentiremos sua falta, mas obrigado por avisar!";
            }

            document.getElementById('rsvp-section').innerHTML = `
                <div style="text-align:center; padding: 40px;">
                    <h2 style="color:#C71585; font-family:'Dancing Script'; font-size: 2.5rem;">${tituloMsg}</h2>
                    <p style="font-size: 1.1rem; margin-top: 10px;">${corpoMsg}</p>
                </div>`;
            
            form.style.display = 'none'; 
            
            const tituloPagina = document.querySelector('.section-title'); 
            if(tituloPagina) tituloPagina.style.display = 'none'; 

        }).catch(() => {
            alert("Erro ao enviar."); btn.disabled = false; btn.innerText = "Tentar Novamente";
        });
    });
}

const hoje = new Date();
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('lote') !== '2' && hoje > DATA_LIMITE) {
    if(form) form.classList.add('hidden');
    document.getElementById('msg-expirado')?.classList.remove('hidden');

}
