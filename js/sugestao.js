const modal = document.getElementById('meuModal');
const imgModal = document.getElementById('imgNoModal');

function abrirZoom(elementoImg) {
    if(imgModal && modal) {
        imgModal.src = elementoImg.src;
        modal.style.display = 'flex';
    }
}

function fecharZoom() {
    if(modal) {
        modal.style.display = 'none';
    }

}
