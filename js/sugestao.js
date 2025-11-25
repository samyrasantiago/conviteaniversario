const modal = document.getElementById('meuModal');
const imgModal = document.getElementById('imgNoModal');

// Função para abrir o Zoom
function abrirZoom(elementoImg) {
    if(imgModal && modal) {
        imgModal.src = elementoImg.src;
        modal.style.display = 'flex';
    }
}

// Função para fechar
function fecharZoom() {
    if(modal) {
        modal.style.display = 'none';
    }
}