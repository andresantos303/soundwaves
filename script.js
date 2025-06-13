// script.js

// 1) Selecionar elementos principais
const soundIcons = document.querySelectorAll('.sound-icon');
const canvas = document.getElementById('canvas-area');
const controlsArea = document.getElementById('controls-area');

// 2) Para cada ícone de som, ativar o drag
soundIcons.forEach(icon => {
    icon.addEventListener('dragstart', ev => {
        ev.dataTransfer.setData('text/plain', icon.dataset.sound);
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

    const soundPath = ev.dataTransfer.getData('text/plain');
    const soundName = ev.dataTransfer.getData('text/name');
    const iconSrc = ev.dataTransfer.getData('text/icon');

    const audio = new Audio(soundPath);
    audio.loop = true;
    audio.volume = 0.5;
    audio.playbackRate = 1.0;
    audio.play();

    const droppedIcon = document.createElement('img');
    droppedIcon.src = iconSrc;
    droppedIcon.alt = soundName;
    droppedIcon.classList.add('dropped-sound');
    droppedIcon.style.width = '60px';
    droppedIcon.style.position = 'absolute';
  const iconSize = 60;
  const padding = 20;
  const existingIcons = canvas.querySelectorAll('.dropped-sound').length;
  const canvasRect = canvas.getBoundingClientRect();
  const canvasWidth = canvasRect.width;
  const canvasHeight = canvasRect.height;
  const columns = Math.floor((canvasWidth - padding) / (iconSize + padding));
  const col = existingIcons % columns;
  const row = Math.floor(existingIcons / columns);
  let x = padding + col * (iconSize + padding);
  let y = padding + row * (iconSize + padding);
  x += Math.floor(Math.random() * 10 - 5);
  y += Math.floor(Math.random() * 10 - 5);
  x = Math.min(x, canvasWidth - iconSize);
  y = Math.min(y, canvasHeight - iconSize);

droppedIcon.style.left = `${x}px`;
droppedIcon.style.top = `${y}px`;


    canvas.appendChild(droppedIcon);
    makeIconDraggable(droppedIcon);

    const panel = document.createElement('div');
    panel.classList.add('control-panel');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');
    const thumb = document.createElement('img');
    thumb.src = iconSrc;
    thumb.alt = soundName;
    const title = document.createElement('span');
    title.textContent = soundName;
    infoDiv.appendChild(thumb);
    infoDiv.appendChild(title);

    const slidersDiv = document.createElement('div');
    slidersDiv.classList.add('slider-group');

    const labelVol = document.createElement('label');
    labelVol.textContent = 'Volume';
    const sliderVol = document.createElement('input');
    sliderVol.type = 'range';
    sliderVol.min = 0;
    sliderVol.max = 1;
    sliderVol.step = 0.01;
    sliderVol.value = audio.volume;
    sliderVol.addEventListener('input', () => {
        audio.volume = parseFloat(sliderVol.value);
    });

    const labelSpeed = document.createElement('label');
    labelSpeed.textContent = 'Velocidade';
    const sliderSpeed = document.createElement('input');
    sliderSpeed.type = 'range';
    sliderSpeed.min = 0.5;
    sliderSpeed.max = 2.0;
    sliderSpeed.step = 0.01;
    sliderSpeed.value = audio.playbackRate;
    sliderSpeed.addEventListener('input', () => {
        audio.playbackRate = parseFloat(sliderSpeed.value);
    });

    slidersDiv.appendChild(labelVol);
    slidersDiv.appendChild(sliderVol);
    slidersDiv.appendChild(labelSpeed);
    slidersDiv.appendChild(sliderSpeed);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
        audio.pause();
        audio.src = '';
        panel.remove();
        droppedIcon.remove();
    });

    panel.appendChild(infoDiv);
    panel.appendChild(slidersDiv);
    panel.appendChild(removeBtn);

    controlsArea.appendChild(panel);
});

const customSoundInput = document.getElementById('customSound');
const soundPalette = document.getElementById('sound-palette');

customSoundInput.addEventListener('change', () => {
  const files = customSoundInput.files;
  if (files.length === 0) return;

  const file = files[0];
  const objectURL = URL.createObjectURL(file);

  const newSoundIcon = document.createElement('div');
  newSoundIcon.classList.add('sound-icon', 'custom-imported');
  newSoundIcon.setAttribute('draggable', 'true');
  newSoundIcon.dataset.sound = objectURL;
  newSoundIcon.style.position = 'relative'; // para o botão remover

  // Nova imagem (ícone de som)
  const img = document.createElement('img');
  img.src = 'https://e7.pngegg.com/pngimages/31/360/png-clipart-loudspeaker-sound-computer-icons-sound-icon-logo-sound-thumbnail.png';
  img.alt = 'Som Importado';
  img.style.width = '60px';          // mesmo tamanho dos outros
  img.style.height = '60px';
  img.style.objectFit = 'contain';
  img.style.display = 'block';
  img.style.margin = '0 auto';       // centralizado horizontalmente
  newSoundIcon.appendChild(img);

  // Não mostrar nome visualmente, só guardar no drag
  const soundName = file.name;

  // Botão remover com estilo igual aos anteriores
  const removeBtn = document.createElement('button');
  removeBtn.textContent = '×';
  removeBtn.title = 'Remover som';

  removeBtn.style.position = 'absolute';
  removeBtn.style.top = '5px';
  removeBtn.style.right = '5px';
  removeBtn.style.backgroundColor = 'rgba(231, 76, 60, 0.85)';
  removeBtn.style.color = '#fff';
  removeBtn.style.border = 'none';
  removeBtn.style.borderRadius = '50%';
  removeBtn.style.width = '24px';
  removeBtn.style.height = '24px';
  removeBtn.style.cursor = 'pointer';
  removeBtn.style.fontWeight = 'bold';
  removeBtn.style.fontSize = '18px';
  removeBtn.style.lineHeight = '22px';
  removeBtn.style.padding = '0';
  removeBtn.style.boxShadow = '0 0 5px rgba(0,0,0,0.4)';
  removeBtn.style.transition = 'background-color 0.3s ease';
  removeBtn.style.zIndex = '10';

  removeBtn.addEventListener('mouseenter', () => {
    removeBtn.style.backgroundColor = 'rgba(192, 57, 43, 1)';
  });
  removeBtn.addEventListener('mouseleave', () => {
    removeBtn.style.backgroundColor = 'rgba(231, 76, 60, 0.85)';
  });

  removeBtn.addEventListener('click', e => {
    e.stopPropagation();
    URL.revokeObjectURL(objectURL);
    newSoundIcon.remove();
  });

  newSoundIcon.appendChild(removeBtn);
  soundPalette.appendChild(newSoundIcon);

  newSoundIcon.addEventListener('dragstart', ev => {
    ev.dataTransfer.setData('text/plain', newSoundIcon.dataset.sound);
    ev.dataTransfer.setData('text/name', soundName);
    ev.dataTransfer.setData('text/icon', img.src);
  });

  customSoundInput.value = '';
});


function makeIconDraggable(iconElement) {
  iconElement.setAttribute('draggable', 'false');

  let isDragging = false;
  let offsetX, offsetY;

  iconElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = iconElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    iconElement.style.zIndex = 1000; 
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const canvasRect = canvas.getBoundingClientRect();

    let x = e.clientX - canvasRect.left - offsetX;
    let y = e.clientY - canvasRect.top - offsetY;

    const maxX = canvas.clientWidth - iconElement.offsetWidth;
    const maxY = canvas.clientHeight - iconElement.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    iconElement.style.left = `${x}px`;
    iconElement.style.top = `${y}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      iconElement.style.zIndex = 1;
    }
  });
}



