@echo off
echo Organizando imagenes del proyecto...

REM Mover imagenes a las carpetas correspondientes
if exist "images\Imagen1.jpg" move "images\Imagen1.jpg" "images\proyectos\proyecto1.jpg"
if exist "images\Imagen2.jpg" move "images\Imagen2.jpg" "images\proyectos\proyecto2.jpg"
if exist "images\Imagen3.jpg" move "images\Imagen3.jpg" "images\proyectos\proyecto3.jpg"
if exist "images\Imagen4.jpg" move "images\Imagen4.jpg" "images\galeria\galeria1.jpg"
if exist "images\Imagen5.jpg" move "images\Imagen5.jpg" "images\galeria\galeria2.jpg"
if exist "images\Imagen6.jpg" move "images\Imagen6.jpg" "images\galeria\galeria3.jpg"
if exist "images\Imagen7.jpg" move "images\Imagen7.jpg" "images\galeria\galeria4.jpg"
if exist "images\Imagen8.jpg" move "images\Imagen8.jpg" "images\galeria\galeria5.jpg"

echo Imagenes organizadas correctamente!
echo.
echo Estructura de carpetas:
echo - images/proyectos/ (para tarjetas de proyectos)
echo - images/galeria/ (para galeria circular 3D)
echo - images/perfil/ (para fotos del arquitecto)
echo - images/iconos/ (para logos e iconos)
echo.
pause