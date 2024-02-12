const body = document.body; // Obtén el elemento body del documento;
// Variable para controlar el estado de silencio
let isMuted = false;
// Variable para rastrear si el temporizador está pausado
let isPaused = false;
// Tiempo restante para cada tipo de temporizador
let studyTimeLeft = 1500; // 25 minutos en segundos
let breakTimeLeft = 300; // 5 minutos en segundos
let longBreakTimeLeft = 1200; // 20 minutos en segundos
// Variable para almacenar qué temporizador está activo ('study', 'break', 'longBreak')
let activeTimer;
// Contador de ciclos completados
let cycleCounter = 0;

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const studyTimer = document.getElementById('timer');
    const breakTimer = document.getElementById('breakTime');
    const timerText = document.getElementById('timerText');
    const breakText = document.getElementById('breakText');
    const completedCycles = document.getElementById('completedCycles');
    const studyAudio = document.getElementById('studyAudio');
    const breakAudio = document.getElementById('breakAudio');
    const longBreakAudio = document.getElementById('longBreakAudio');
    const rainAudio = document.getElementById('rainAudio');
    const muteBtn = document.getElementById('muteBtn');
    const modeToggle = document.getElementById('modeToggle');
    let studyIntervalId;
    let breakIntervalId;

    

    // Reproducir el sonido de lluvia al cargar la página
    rainAudio.loop = true;
    rainAudio.volume = 0.5;

    // Event listener para el botón de inicio
    startBtn.addEventListener('click', function() {
        if (!isPaused && !studyIntervalId && !breakIntervalId) {
            startStudyTimer();
            timerText.textContent = 'Tiempo de estudio';
        }
    });

    // Event listener para el botón de detener
    stopBtn.addEventListener('click', function() {
        stopStudyTimer();
        stopBreakTimer();
        studyTimer.textContent = '25:00';
        breakTimer.textContent = '5:00';
        studyTimeLeft = 1500;
        breakTimeLeft = 300;
        isPaused = false;
        pauseBtn.textContent = 'Pausar';
    });

    // Event listener para el botón de pausa
    pauseBtn.addEventListener('click', function() {
        if (isPaused) {
            // Reanudar
            if (activeTimer === 'study') {
                startStudyTimer();
            } else if (activeTimer === 'break') {
                startBreakTimer();
            }
            pauseBtn.textContent = 'Pausar';
            isPaused = false;
        } else {
            // Pausar
            clearInterval(studyIntervalId);
            clearInterval(breakIntervalId);
            pauseBtn.textContent = 'Reanudar';
            isPaused = true;
        }
    });

    // Event listener para el botón de silenciar
    muteBtn.addEventListener('click', function() {
        isMuted = !isMuted;
        rainAudio.muted = isMuted;
        muteBtn.textContent = isMuted ? 'Activar sonido' : 'Silenciar';
    });



    // Función para iniciar el temporizador de estudio
    function startStudyTimer() {
        studyActive = true;
        activeTimer = 'study';
        studyAudio.play();
        rainAudio.play();
        studyIntervalId = setInterval(function() {
            studyTimeLeft--;
            if (studyTimeLeft === 0) {
                clearInterval(studyIntervalId);
                studyTimer.textContent = '25:00';
                cycleCounter++;
                completedCycles.textContent = cycleCounter;
                if (cycleCounter % 4 === 0) {
                    startLongBreakTimer();
                } else {
                    startBreakTimer();
                }
            }
            updateTimerDisplay(studyTimer, studyTimeLeft);
        }, 1000);
    }

    // Función para iniciar el temporizador de descanso
    function startBreakTimer() {
        breakActive = true;
        activeTimer = 'break';
        breakAudio.play();
        breakIntervalId = setInterval(function() {
            breakTimeLeft--;
            if (breakTimeLeft === 0) {
                clearInterval(breakIntervalId);
                breakTimer.textContent = '5:00';
                startStudyTimer();
            }
            updateTimerDisplay(breakTimer, breakTimeLeft);
        }, 1000);
    }

    // Función para detener el temporizador de estudio
    function stopStudyTimer() {
        clearInterval(studyIntervalId);
        studyActive = false;
        activeTimer = null;
        studyIntervalId = null; // Añade esta línea
    }

    // Función para detener el temporizador de descanso
    function stopBreakTimer() {
        clearInterval(breakIntervalId);
        breakActive = false;
        activeTimer = null;
        breakIntervalId = null; // Añade esta línea
    }


    // Función para actualizar la visualización del temporizador
    function updateTimerDisplay(timerElement, timeLeft) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});
    

    modeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            modeToggle.textContent = 'Modo Oscuro';
        } else {
            body.classList.add('dark');
            modeToggle.textContent = 'Modo Claro';
        }
});

