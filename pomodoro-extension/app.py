from flask import Flask, jsonify, render_template
import time
from flask_cors import CORS  # Importa Flask-CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para toda la aplicación


# Variables para controlar el temporizador Pomodoro
pomodoro_active = False
pomodoro_start_time = 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_pomodoro')
def start_pomodoro():
    global pomodoro_active, pomodoro_start_time
    if not pomodoro_active:
        pomodoro_active = True
        pomodoro_start_time = time.time()
        return jsonify({'message': 'Pomodoro started'})
    else:
        return jsonify({'message': 'Pomodoro is already active'})

@app.route('/stop_pomodoro')
def stop_pomodoro():
    global pomodoro_active
    if pomodoro_active:
        pomodoro_active = False
        elapsed_time = time.time() - pomodoro_start_time
        # Puedes hacer más aquí, como registrar el tiempo transcurrido
        return jsonify({'message': f'Pomodoro stopped. Elapsed time: {elapsed_time:.2f} seconds'})
    else:
        return jsonify({'message': 'No active Pomodoro to stop'})

if __name__ == '__main__':
    app.run(debug=True)

