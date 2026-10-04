const bpmOriginalInput = document.getElementById('bpm-original');
const bpmRemixInput = document.getElementById('bpm-remix');
const calcularBtn = document.getElementById('calcular');
const resultadoDiv = document.getElementById('resultado');
const instruccionesDiv = document.getElementById('instrucciones');
const programaInputs = document.querySelectorAll('input[name="programa"]');

function obtenerProgramaSeleccionado() {
    for (const input of programaInputs) {
        if (input.checked) {
            return input.value;
        }
    }
    return 'premiere';
}

function calcular() {
    const bpmOriginal = parseFloat(bpmOriginalInput.value);
    const bpmRemix = parseFloat(bpmRemixInput.value);
    const programa = obtenerProgramaSeleccionado();

    if (isNaN(bpmOriginal) || isNaN(bpmRemix)) {
        mostrarResultado('Ingresa ambos valores de BPM.', 'error');
        ocultarInstrucciones();
        return;
    }

    if (bpmOriginal <= 0) {
        mostrarResultado('El BPM original debe ser mayor que 0.', 'error');
        ocultarInstrucciones();
        return;
    }

    const ratio = bpmRemix / bpmOriginal;

    if (programa === 'premiere') {
        const porcentaje = ratio * 100;
        mostrarResultado(`Pon ${porcentaje.toFixed(4)}% de velocidad en Premiere`, 'exito');
        mostrarInstruccionesPremiere();
    } else {
        const playbackRate = ratio;
        mostrarResultado(`Pon ${playbackRate.toFixed(4)} en Playback rate de Vegas`, 'exito');
        mostrarInstruccionesVegas();
    }
}

function mostrarResultado(mensaje, tipo) {
    resultadoDiv.textContent = mensaje;
    resultadoDiv.className = 'resultado ' + tipo;
}

function mostrarInstruccionesPremiere() {
    instruccionesDiv.innerHTML = `
        <h3>Cómo ingresarlo en Adobe Premiere</h3>
        <ol>
            <li>Selecciona el clip de audio o video en la timeline.</li>
            <li>Presiona <strong>Ctrl + R</strong> para abrir <strong>Speed / Duration</strong>.</li>
            <li>Ingresa el porcentaje calculado en el campo <strong>Speed</strong>.</li>
        </ol>
        <p class="nota"><strong>Atajo extra:</strong> presiona la tecla <strong>R</strong> para activar la herramienta <strong>Rate Stretch</strong> y estirar el clip directamente con el mouse.</p>
        <p class="nota">Premiere mantiene el pitch por defecto si tienes activada la opción "Maintain Audio Pitch".</p>
    `;
    instruccionesDiv.classList.add('visible');
}

function mostrarInstruccionesVegas() {
    instruccionesDiv.innerHTML = `
        <h3>Cómo ingresarlo en Sony Vegas</h3>
        <ol>
            <li>Haz clic derecho sobre el evento de audio o video.</li>
            <li>Selecciona <strong>Properties</strong>.</li>
            <li>Busca el campo <strong>Playback rate</strong>.</li>
            <li>Ingresa el valor decimal calculado (1.000 = velocidad normal).</li>
        </ol>
        <p class="nota"><strong>Atajo extra:</strong> mantén presionada la tecla <strong>Ctrl</strong> y arrastra el borde derecho del evento para hacer time stretch sin abrir menús.</p>
        <p class="nota">En Vegas el pitch cambia al modificar la velocidad. Si quieres mantener el tono original, aplica un plugin de pitch shift aparte.</p>
    `;
    instruccionesDiv.classList.add('visible');
}

function ocultarInstrucciones() {
    instruccionesDiv.classList.remove('visible');
}

calcularBtn.addEventListener('click', calcular);

for (const input of programaInputs) {
    input.addEventListener('change', function () {
        if (resultadoDiv.classList.contains('exito')) {
            calcular();
        }
    });
}

bpmOriginalInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        bpmRemixInput.focus();
    }
});

bpmRemixInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        calcular();
    }
});

mostrarResultado('El resultado aparecerá aquí', 'vacio');
