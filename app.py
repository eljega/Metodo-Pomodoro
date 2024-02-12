from flask import Flask, jsonify, render_template
import time
from flask_cors import CORS  # Importa Flask-CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para toda la aplicación



@app.route('/')
def index():
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)

