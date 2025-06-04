// script.js

// 1) Selecionar elementos principais
const soundIcons = document.querySelectorAll('.sound-icon');
const canvas = document.getElementById('canvas-area');
const controlsArea = document.getElementById('controls-area');

// 2) Para cada ícone de som, ativar o drag
soundIcons.forEach(icon => {
    icon.addEventListener('dragstart', ev => {
        // Guarda o caminho do som nos dados de arraste
        ev.dataTransfer.setData('text/plain', icon.dataset.sound);
        // Também pode guardar o nome/imagem para usar depois
        ev.dataTransfer.setData('text/name', icon.querySelector('span').innerText);
        ev.dataTransfer.setData('text/icon', icon.querySelector('img').src);
    });
});

// 3) Prevenir comportamento default para poder largar
canvas.addEventListener('dragover', ev => {
    ev.preventDefault();
    canvas.classList.add('drag-over');
});

// 4) Remover estilo quando sai do canvas
canvas.addEventListener('dragleave', ev => {
    canvas.classList.remove('drag-over');
});

// 5) Ao largar dentro do canvas
canvas.addEventListener('drop', ev => {
    ev.preventDefault();
    canvas.classList.remove('drag-over');

    // Pega informação do ficheiro e nome
    const soundPath = ev.dataTransfer.getData('text/plain');
    const soundName = ev.dataTransfer.getData('text/name');
    const iconSrc = ev.dataTransfer.getData('text/icon');

    // Cria um elemento <audio> e começa a tocar em loop
    const audio = new Audio(soundPath);
    audio.loop = true;
    audio.volume = 0.5;           // volume inicial a meio (0 a 1)
    audio.playbackRate = 1.0;     // velocidade normal
    audio.play();

    // Cria a representação dentro do canvas (pode ser apenas um ícone)
    const droppedIcon = document.createElement('img');
    droppedIcon.src = iconSrc;
    droppedIcon.alt = soundName;
    droppedIcon.classList.add('dropped-sound');
    // Podes posicionar à vontade; aqui vamos só empurrar para o centro
    droppedIcon.style.width = '60px';
    droppedIcon.style.position = 'absolute';
    // Para simplificar, posicionamos no local onde largaste
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left - 30; // 30px metade da largura/altura da imagem
    const y = ev.clientY - rect.top - 30;
    droppedIcon.style.left = `${x}px`;
    droppedIcon.style.top = `${y}px`;
    canvas.appendChild(droppedIcon);

    // 6) Criar painel de controlo por baixo para volume e velocidade
    const panel = document.createElement('div');
    panel.classList.add('control-panel');

    // Ícone e nome à esquerda
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');
    const thumb = document.createElement('img');
    thumb.src = iconSrc;
    thumb.alt = soundName;
    const title = document.createElement('span');
    title.textContent = soundName;
    infoDiv.appendChild(thumb);
    infoDiv.appendChild(title);

    // Grupo de sliders
    const slidersDiv = document.createElement('div');
    slidersDiv.classList.add('slider-group');

    // Slider de volume (0 a 1)
    const labelVol = document.createElement('label');
    labelVol.textContent = 'Volume';
    const sliderVol = document.createElement('input');
    sliderVol.type = 'range';
    sliderVol.min = 0;
    sliderVol.max = 1;
    sliderVol.step = 0.01;
    sliderVol.value = audio.volume; // inicial 0.5
    sliderVol.addEventListener('input', () => {
        audio.volume = parseFloat(sliderVol.value);
    });

    // Slider de velocidade (0.5x a 2x)
    const labelSpeed = document.createElement('label');
    labelSpeed.textContent = 'Velocidade';
    const sliderSpeed = document.createElement('input');
    sliderSpeed.type = 'range';
    sliderSpeed.min = 0.5;
    sliderSpeed.max = 2.0;
    sliderSpeed.step = 0.01;
    sliderSpeed.value = audio.playbackRate; // inicial 1.0
    sliderSpeed.addEventListener('input', () => {
        audio.playbackRate = parseFloat(sliderSpeed.value);
    });

    // Adiciona tudo ao slidersDiv
    slidersDiv.appendChild(labelVol);
    slidersDiv.appendChild(sliderVol);
    slidersDiv.appendChild(labelSpeed);
    slidersDiv.appendChild(sliderSpeed);

    // Botão para parar e remover
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
        audio.pause();
        audio.src = '';
        panel.remove();
        droppedIcon.remove();
    });

    // Monta o painel: info + sliders + remover
    panel.appendChild(infoDiv);
    panel.appendChild(slidersDiv);
    panel.appendChild(removeBtn);

    // Acrescenta o painel à área de controlos
    controlsArea.appendChild(panel);
});
