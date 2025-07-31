#!/usr/bin/python3.10

import sys
import os

# Agregar el directorio del proyecto al path
path = '/home/tuusuario/mysite'  # Cambiar 'tuusuario' por tu nombre de usuario de PythonAnywhere
if path not in sys.path:
    sys.path.append(path)

from app import app as application

if __name__ == "__main__":
    application.run()