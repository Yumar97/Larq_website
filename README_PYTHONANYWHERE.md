# Instrucciones para Subir a PythonAnywhere

## Pasos para Desplegar en PythonAnywhere:

### 1. Crear cuenta en PythonAnywhere
- Ve a https://www.pythonanywhere.com/
- Crea una cuenta gratuita o de pago

### 2. Subir archivos
Opción A - Usando Git (Recomendado):
```bash
cd ~
git clone https://github.com/Yumar97/Larq_website.git mysite
```

Opción B - Subir archivos manualmente:
- Usa el File Manager de PythonAnywhere
- Sube todos los archivos a la carpeta `/home/tuusuario/mysite/`

### 3. Instalar dependencias
En la consola Bash de PythonAnywhere:
```bash
cd ~/mysite
pip3.10 install --user -r requirements.txt
```

### 4. Configurar Web App
1. Ve a la pestaña "Web" en tu dashboard
2. Crea una nueva web app
3. Selecciona "Manual configuration"
4. Selecciona Python 3.10
5. En "Code" section:
   - Source code: `/home/tuusuario/mysite`
   - Working directory: `/home/tuusuario/mysite`
   - WSGI configuration file: `/var/www/tuusuario_pythonanywhere_com_wsgi.py`

### 5. Editar archivo WSGI
Edita el archivo WSGI y reemplaza su contenido con:
```python
#!/usr/bin/python3.10

import sys
import os

# Cambiar 'tuusuario' por tu nombre de usuario real
path = '/home/tuusuario/mysite'
if path not in sys.path:
    sys.path.append(path)

from app import app as application

if __name__ == "__main__":
    application.run()
```

### 6. Configurar archivos estáticos (Opcional)
En la sección "Static files":
- URL: `/images/`
- Directory: `/home/tuusuario/mysite/images/`
- URL: `/styles/`
- Directory: `/home/tuusuario/mysite/styles/`

### 7. Recargar la aplicación
- Haz clic en "Reload" en la pestaña Web
- Tu sitio estará disponible en: `https://tuusuario.pythonanywhere.com`

## Notas Importantes:
- Reemplaza 'tuusuario' con tu nombre de usuario real de PythonAnywhere
- La cuenta gratuita tiene limitaciones de CPU y tráfico
- Para dominios personalizados necesitas una cuenta de pago
- Los archivos se actualizan automáticamente si usas Git

## Solución de Problemas:
- Si hay errores, revisa los logs en la pestaña "Web" → "Error log"
- Asegúrate de que todas las rutas en wsgi.py sean correctas
- Verifica que Flask esté instalado correctamente