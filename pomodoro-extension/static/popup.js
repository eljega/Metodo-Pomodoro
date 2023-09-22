let isMuted = false; // Variable para controlar el estado de silencio
const body = document.body; // Obtén el elemento body del documento;

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
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
    
    

    // Reproducir el sonido de lluvia al cargar la página
    rainAudio.loop = true; // Reproducir en bucle
    rainAudio.volume = 0.5; // Ajusta el volumen (opcional)


    

    
    let studyActive = false;
    let breakActive = false;
    let studyIntervalId;
    let breakIntervalId;
    let cycleCounter = 0;

    startBtn.addEventListener('click', function() {
        console.log('Start button clicked');
        if (!studyActive && !breakActive) {
            // Iniciar el contador largo (25 minutos) si ninguno está activo
            startStudyTimer(studyTimer, timerText, breakText);
            studyActive = true;
            timerText.textContent = 'Tiempo de estudio';
        } else if (studyActive) {
            // Si el contador largo está activo, detenerlo
            stopStudyTimer();
            studyActive = false;
            if (!breakActive) {
                // Si el contador corto no está activo, reiniciar el contador largo
                startStudyTimer(studyTimer, timerText, breakText);
                studyActive = true;
                timerText.textContent = 'Tiempo de estudio';
            }
        } else if (breakActive) {
            // Si el contador corto está activo, detenerlo
            stopBreakTimer();
            breakActive = false;
            if (!studyActive) {
                // Si el contador largo no está activo, reiniciar el contador corto
                startBreakTimer(breakTimer, timerText, breakText);
                breakActive = true;
                timerText.textContent = 'Tiempo del break';
            }
        }
    });

    stopBtn.addEventListener('click', function() {
        if (studyActive) {
            // Detener el contador largo
            stopStudyTimer();
            studyActive = false;
        } else if (breakActive) {
            // Detener el contador corto
            stopBreakTimer();
            breakActive = false;
        }
    });

    function startStudyTimer(timerElement, timerText, breakText) {
        let seconds = 0;
        studyAudio.play(); // Reproducir el sonido de estudio
        rainAudio.play();
        studyIntervalId = setInterval(function() {
            
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            if (seconds >= 1500) { // 1500 segundos = 25 minutos
                clearInterval(studyIntervalId); // Detener el contador largo
                timerElement.textContent = '25:00';
                cycleCounter++;
                completedCycles.textContent = cycleCounter;

                if (cycleCounter % 4 === 0) {
                    // Cada 4 ciclos, activar el descanso largo (20 minutos)
                    breakText.style.display = 'block';
                    timerText.style.display = 'none';
                    startLongBreakTimer(studyTimer, timerText, breakText);
                } else {
                    // Iniciar el contador corto (5 minutos)
                    startBreakTimer(breakTimer, timerText, breakText);
                }
            }
        }, 1000);
    }

    function stopStudyTimer() {
        clearInterval(studyIntervalId);
    }

    function startBreakTimer(timerElement, timerText, breakText) {
        let seconds = 0;
        breakAudio.play(); // Reproducir el sonido de break
        breakIntervalId = setInterval(function() {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            if (seconds >= 300) { // 300 segundos = 5 minutos (descanso)
                clearInterval(breakIntervalId); // Detener el contador corto
                timerElement.textContent = '05:00';
                // Iniciar el contador largo nuevamente (25 minutos)
                timerText.style.display = 'block'; // Mostrar el texto de "Tiempo de estudio"
                breakText.style.display = 'none'; // Ocultar el texto de "Descansa"
                startStudyTimer(studyTimer, timerText, breakText);
                studyActive = true;
            }
        }, 1000);
    }

    function stopBreakTimer() {
        clearInterval(breakIntervalId);
    }

    function startLongBreakTimer(timerElement, timerText, breakText) {
        let seconds = 0;
        longBreakAudio.play(); // Reproducir el sonido de descanso largo
        studyIntervalId = setInterval(function() {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            if (seconds >= 120) { // 1200 segundos = 20 minutos (descanso largo)
                clearInterval(studyIntervalId); // Detener el contador largo
                timerElement.textContent = '20:00';
                // Reiniciar el ciclo (volvemos a los 25 minutos)
                timerText.style.display = 'block';
                breakText.style.display = 'none';
                startStudyTimer(studyTimer, timerText, breakText);
                studyActive = true;
            }
        }, 1000);
    }
});

    // Agrega un controlador de eventos al botón de mute/desmute
    muteBtn.addEventListener('click', function() {
        if (isMuted) {
            rainAudio.muted = false;
            muteBtn.textContent = 'Mute';
        } else {
            rainAudio.muted = true;
            muteBtn.textContent = 'Unmute';
        }
        isMuted = !isMuted;
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
