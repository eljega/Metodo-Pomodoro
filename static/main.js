const body = document.body; 
let isMuted = false;
let isPaused = false;
let studyTimeLeft = 1500;
let breakTimeLeft = 300;
let longBreakTimeLeft = 1200;
let activeTimer;
let cycleCounter = 0;
let studyIntervalId;
let breakIntervalId;

// Variables para controlar el estado del temporizador
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
    const checkboxInput = document.getElementById('checkboxInput');

    
    checkboxInput.addEventListener('change', function() {
        rainAudio.muted = this.checked;
    });

    // Reproducir el audio de lluvia automáticamente
    rainAudio.muted = checkboxInput.checked;
    if (!rainAudio.muted) {
        rainAudio.play().catch(e => console.error("Error al intentar reproducir el audio automáticamente:", e));
    }


    rainAudio.loop = true;// Reproducir la lluvia de fondo en bucle
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
        if ((studyActive || breakActive) && !isPaused) {
            clearInterval(studyIntervalId);
            clearInterval(breakIntervalId);
            pauseBtn.textContent = 'Reanudar';
            isPaused = true;
        } else if (isPaused) {
            if (activeTimer === 'study') {
                startStudyTimer();
            } else if (activeTimer === 'break') {
                startBreakTimer();
            } else if (activeTimer === 'longBreak') {
                startLongBreakTimer();
            }
            pauseBtn.textContent = 'Pausar';
            isPaused = false;
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
        timerText.textContent = 'Tiempo de estudio';
        breakText.style.display = 'none';
        studyAudio.play();
        rainAudio.play();
        studyIntervalId = setInterval(function() {
            studyTimeLeft--;
            updateTimerDisplay(studyTimer, studyTimeLeft);
            if (studyTimeLeft <= 0) {
                clearInterval(studyIntervalId);
                studyTimer.textContent = '25:00';
                studyTimeLeft = 1500;
                cycleCounter++;
                completedCycles.textContent = cycleCounter;
                if (cycleCounter % 4 === 0) {
                    startLongBreakTimer();
                } else {
                    startBreakTimer();
                }
            }
        }, 1000);
    }


    // Función para iniciar el temporizador de descanso
    function startBreakTimer() {
        breakActive = true;
        activeTimer = 'break';
        timerText.textContent = '';
        breakText.style.display = 'block';
        breakAudio.play();
        breakIntervalId = setInterval(function() {
            breakTimeLeft--;
            if (breakTimeLeft <= 0) {
                clearInterval(breakIntervalId);
                breakTimer.textContent = '5:00';
                breakTimeLeft = 300;
                startStudyTimer(timerText, breakText);
            }
            updateTimerDisplay(breakTimer, breakTimeLeft);
        }, 1000);
    }

    // Función para iniciar el descanso largo de 20 minutos
    function startLongBreakTimer() {
        breakActive = true;
        activeTimer = 'longBreak';
        timerText.textContent = 'Descanso Largo';
        breakText.style.display = 'block';
        longBreakAudio.play();
        breakIntervalId = setInterval(function() {
            longBreakTimeLeft--;
            if (longBreakTimeLeft <= 0) {
                clearInterval(breakIntervalId);
                breakTimer.textContent = '20:00';
                longBreakTimeLeft = 1200;
                startStudyTimer();
            }
            updateTimerDisplay(breakTimer, longBreakTimeLeft);
        }, 1000);
    }


    // Función para detener el temporizador de estudio
    function stopStudyTimer() {
        clearInterval(studyIntervalId);
        studyActive = false;
        activeTimer = null;
        studyIntervalId = null;
    }


    // Función para detener el temporizador de descanso
    function stopBreakTimer() {
        clearInterval(breakIntervalId);
        breakActive = false;
        activeTimer = null;
        breakIntervalId = null;
    }

});

// Función para actualizar el temporizador
function updateTimerDisplay(timerElement, timeLeft) {
    if (timeLeft < 0) {
        timeLeft = 0;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}


// Event listener para el botón de alternar modo
    modeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
        } else {
            body.classList.add('dark');
        }
});

