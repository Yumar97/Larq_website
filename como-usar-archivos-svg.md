# Cómo Usar Archivos SVG desde la Carpeta Icons

He creado una carpeta `icons/` con archivos SVG individuales para cada red social. Aquí te explico las diferentes formas de usarlos.

## Estructura de Archivos Creada

```
Larq_Web/
├── icons/
│   ├── linkedin.svg
│   ├── facebook.svg
│   ├── instagram.svg
│   ├── youtube.svg
│   └── email.svg
└── index.html
```

## Método 1: Usar `<img>` tag (Más Simple)

### Ventajas:
- ✅ Muy fácil de implementar
- ✅ Funciona como cualquier imagen
- ✅ Fácil de mantener

### Desventajas:
- ❌ No puedes cambiar el color con CSS
- ❌ Menos control sobre el estilo

### Código HTML:
```html
<div class="social-links">
    <a href="https://www.linkedin.com/in/glenn-landavere-09aba4a/" target="_blank" class="social-link linkedin">
        <img src="icons/linkedin.svg" alt="LinkedIn" width="24" height="24">
    </a>
    <a href="https://www.facebook.com/larqarquitecturayconstruccion/?locale=es_LA" target="_blank" class="social-link facebook">
        <img src="icons/facebook.svg" alt="Facebook" width="24" height="24">
    </a>
    <a href="https://www.instagram.com/larq.arquitectura/?hl=es-la" target="_blank" class="social-link instagram">
        <img src="icons/instagram.svg" alt="Instagram" width="24" height="24">
    </a>
    <a href="https://www.youtube.com/@glennlandavere9719" target="_blank" class="social-link youtube">
        <img src="icons/youtube.svg" alt="YouTube" width="24" height="24">
    </a>
    <a href="mailto:glenn.ladavere@larq.net" class="social-link email">
        <img src="icons/email.svg" alt="Email" width="24" height="24">
    </a>
</div>
```

### CSS para Método 1:
```css
.social-links {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #f8f9fa;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.social-link:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.social-link.linkedin:hover {
    background: #0077b5;
}

.social-link.facebook:hover {
    background: #1877f2;
}

.social-link.instagram:hover {
    background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045);
}

.social-link.youtube:hover {
    background: #ff0000;
}

.social-link.email:hover {
    background: #28a745;
}

/* Estilos para las imágenes SVG */
.social-link img {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
    filter: brightness(0) saturate(100%) invert(50%);
}

.social-link:hover img {
    filter: brightness(0) saturate(100%) invert(100%);
    transform: scale(1.1);
}
```

## Método 2: Usar `object` tag (Recomendado)

### Ventajas:
- ✅ Puedes cambiar colores con CSS
- ✅ Mejor control sobre el estilo
- ✅ Mantiene la escalabilidad

### Código HTML:
```html
<div class="social-links">
    <a href="https://www.linkedin.com/in/glenn-landavere-09aba4a/" target="_blank" class="social-link linkedin">
        <object data="icons/linkedin.svg" type="image/svg+xml" width="24" height="24" aria-label="LinkedIn"></object>
    </a>
    <a href="https://www.facebook.com/larqarquitecturayconstruccion/?locale=es_LA" target="_blank" class="social-link facebook">
        <object data="icons/facebook.svg" type="image/svg+xml" width="24" height="24" aria-label="Facebook"></object>
    </a>
    <a href="https://www.instagram.com/larq.arquitectura/?hl=es-la" target="_blank" class="social-link instagram">
        <object data="icons/instagram.svg" type="image/svg+xml" width="24" height="24" aria-label="Instagram"></object>
    </a>
    <a href="https://www.youtube.com/@glennlandavere9719" target="_blank" class="social-link youtube">
        <object data="icons/youtube.svg" type="image/svg+xml" width="24" height="24" aria-label="YouTube"></object>
    </a>
    <a href="mailto:glenn.ladavere@larq.net" class="social-link email">
        <object data="icons/email.svg" type="image/svg+xml" width="24" height="24" aria-label="Email"></object>
    </a>
</div>
```

## Método 3: CSS Background (Muy Limpio)

### Ventajas:
- ✅ HTML muy limpio
- ✅ Fácil de mantener
- ✅ Buen rendimiento

### Código HTML:
```html
<div class="social-links">
    <a href="https://www.linkedin.com/in/glenn-landavere-09aba4a/" target="_blank" class="social-link linkedin" aria-label="LinkedIn"></a>
    <a href="https://www.facebook.com/larqarquitecturayconstruccion/?locale=es_LA" target="_blank" class="social-link facebook" aria-label="Facebook"></a>
    <a href="https://www.instagram.com/larq.arquitectura/?hl=es-la" target="_blank" class="social-link instagram" aria-label="Instagram"></a>
    <a href="https://www.youtube.com/@glennlandavere9719" target="_blank" class="social-link youtube" aria-label="YouTube"></a>
    <a href="mailto:glenn.ladavere@larq.net" class="social-link email" aria-label="Email"></a>
</div>
```

### CSS para Método 3:
```css
.social-links {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.social-link {
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f8f9fa;
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.social-link:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Iconos específicos */
.social-link.linkedin {
    background-image: url('icons/linkedin.svg');
}

.social-link.facebook {
    background-image: url('icons/facebook.svg');
}

.social-link.instagram {
    background-image: url('icons/instagram.svg');
}

.social-link.youtube {
    background-image: url('icons/youtube.svg');
}

.social-link.email {
    background-image: url('icons/email.svg');
}

/* Hover effects */
.social-link.linkedin:hover {
    background-color: #0077b5;
}

.social-link.facebook:hover {
    background-color: #1877f2;
}

.social-link.instagram:hover {
    background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045);
}

.social-link.youtube:hover {
    background-color: #ff0000;
}

.social-link.email:hover {
    background-color: #28a745;
}
```

## Método 4: Cargar SVG con JavaScript (Avanzado)

### Ventajas:
- ✅ Control total sobre el SVG
- ✅ Puedes modificar el SVG dinámicamente
- ✅ Mejor para animaciones

### JavaScript:
```javascript
// Función para cargar SVG
async function loadSVG(url, container) {
    try {
        const response = await fetch(url);
        const svgText = await response.text();
        container.innerHTML = svgText;
    } catch (error) {
        console.error('Error loading SVG:', error);
    }
}

// Cargar todos los iconos
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        const iconType = link.classList[1]; // linkedin, facebook, etc.
        const iconContainer = link.querySelector('.icon-container');
        
        if (iconContainer) {
            loadSVG(`icons/${iconType}.svg`, iconContainer);
        }
    });
});
```

### HTML para Método 4:
```html
<div class="social-links">
    <a href="https://www.linkedin.com/in/glenn-landavere-09aba4a/" target="_blank" class="social-link linkedin">
        <div class="icon-container"></div>
    </a>
    <a href="https://www.facebook.com/larqarquitecturayconstruccion/?locale=es_LA" target="_blank" class="social-link facebook">
        <div class="icon-container"></div>
    </a>
    <!-- etc... -->
</div>
```

## Recomendación

**Para tu caso, recomiendo el Método 1 (img tag)** porque:
- Es el más simple de implementar
- Funciona perfectamente para iconos estáticos
- Es fácil de mantener
- Tiene buen soporte en todos los navegadores

## Cómo Reemplazar tus Iconos Actuales

1. **Abre tu archivo `index.html`**
2. **Busca la sección de social-links**
3. **Reemplaza el código actual** con cualquiera de los métodos de arriba
4. **Actualiza tu CSS** según el método elegido

## Agregar Nuevos Iconos

Para agregar un nuevo icono:
1. **Guarda el archivo SVG** en la carpeta `icons/`
2. **Nómbralo descriptivamente** (ej: `whatsapp.svg`)
3. **Agrega el HTML** correspondiente
4. **Actualiza el CSS** si es necesario

## Personalizar los Iconos SVG

Si quieres personalizar los iconos que creé, puedes:
1. **Reemplazar los archivos** en la carpeta `icons/`
2. **Mantener los mismos nombres** para que el código siga funcionando
3. **Asegurarte** de que tengan `fill="currentColor"` para control de color con CSS

Los archivos SVG que creé ya están optimizados y listos para usar. Puedes reemplazarlos con tus propios iconos manteniendo los mismos nombres de archivo.