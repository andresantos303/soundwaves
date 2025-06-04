// script.js

// Função para configurar drag & drop e gerir a reprodução dos sons
window.addEventListener('DOMContentLoaded', () => {
    const palette = document.getElementById('sound-palette');
    const canvas = document.getElementById('canvas-area');

    // Quando começa o arraste: guarda o URL do som
    palette.querySelectorAll('.sound-icon').forEach(icon => {
        icon.addEventListener('dragstart', ev => {
            ev.dataTransfer.setData('text/plain', icon.dataset.sound);
            // Podemos guardar também o nome ou caminho do ícone, se quisermos usar a mesma imagem
            ev.dataTransfer.setData('text/icon', icon.querySelector('img').src);
            ev.dataTransfer.effectAllowed = 'copy';
        });
    });

    // Quando algo entra no canvas
    canvas.addEventListener('dragover', ev => {
        ev.preventDefault();
        canvas.classList.add('dragover');
        ev.dataTransfer.dropEffect = 'copy';
    });

    // Quando algo sai do canvas (sem largar)
    canvas.addEventListener('dragleave', () => {
        canvas.classList.remove('dragover');
    });

    // Ao largar no canvas
    canvas.addEventListener('drop', ev => {
        ev.preventDefault();
        canvas.classList.remove('dragover');

        // Obter a informação do som e do ícone
        const soundSrc = ev.dataTransfer.getData('text/plain');
        const iconSrc = ev.dataTransfer.getData('text/icon');

        // Coordenadas onde largaste (relativas ao canvas)
        const rect = canvas.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;

        // Criar o elemento visual no canvas
        const dropped = document.createElement('div');
        dropped.classList.add('dropped-sound');
        dropped.style.left = (x - 40) + 'px'; // centrar o ícone (80px / 2 = 40px)
        dropped.style.top = (y - 40) + 'px';

        // Imagem e legenda
        const img = document.createElement('img');
        img.src = iconSrc;
        const span = document.createElement('span');
        // Extrair nome do som apenas para exibição
        const nomeSom = soundSrc.split('/').pop().split('.')[0];
        span.textContent = nomeSom;

        dropped.appendChild(img);
        dropped.appendChild(span);
        canvas.appendChild(dropped);

        // Criar e tocar o áudio em loop
        const audio = new Audio(soundSrc);
        audio.loop = true;
        audio.volume = 0.7; // podes ajustar o volume padrão
        audio.play();

        // Associa o elemento áudio ao próprio elemento visual,
        // para que possamos parar/retirar mais tarde, se quisermos
        dropped.audioElement = audio;

        // Ao clicar no ícone no canvas, pára ou retoma o som
        dropped.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                dropped.style.opacity = '1';
            } else {
                audio.pause();
                dropped.style.opacity = '0.5';
            }
        });

        // Se quiseres, adiciona a possibilidade de remover o ícone ao pressionar duplo clique
        dropped.addEventListener('dblclick', () => {
            audio.pause();
            canvas.removeChild(dropped);
        });
    });
});
