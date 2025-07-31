from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='.', template_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/galeria')
@app.route('/galeria.html')
def galeria():
    return send_from_directory('.', 'galeria.html')

@app.route('/gente')
@app.route('/gente.html')
def gente():
    return send_from_directory('.', 'gente.html')

@app.route('/contacto')
@app.route('/contacto.html')
def contacto():
    return send_from_directory('.', 'contacto.html')

@app.route('/proyectos')
@app.route('/proyectos.html')
def proyectos():
    return send_from_directory('.', 'galeria.html')

# Rutas para archivos estáticos
@app.route('/styles/<path:filename>')
def styles(filename):
    return send_from_directory('styles', filename)

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)

@app.route('/js/<path:filename>')
def js(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(debug=True)