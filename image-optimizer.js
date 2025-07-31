// ===== OPTIMIZADOR DE IMÁGENES Y LAZY LOADING =====
// Sistema avanzado para optimización de carga de imágenes

class ImageOptimizer {
    constructor() {
        this.lazyImages = [];
        this.imageObserver = null;
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupImageErrorHandling();
    }

    // ===== LAZY LOADING AVANZADO =====
    setupLazyLoading() {
        // Verificar soporte para Intersection Observer
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                // Cargar imágenes 50px antes de que sean visibles
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.observeImages();
        } else {
            // Fallback para navegadores sin soporte
            this.loadAllImages();
        }
    }

    observeImages() {
        // Observar todas las imágenes con data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });

        // Observar imágenes en project cards
        const projectImages = document.querySelectorAll('.project-image img[src]');
        projectImages.forEach(img => {
            if (!img.complete) {
                this.imageObserver.observe(img);
            }
        });
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageUrl = img.dataset.src || img.src;
            
            // Crear nueva imagen para precargar
            const newImg = new Image();
            
            newImg.onload = () => {
                // Aplicar la imagen con efecto de fade
                img.src = imageUrl;
                img.classList.add('loaded');
                
                // Remover data-src después de cargar
                if (img.dataset.src) {
                    img.removeAttribute('data-src');
                }
                
                resolve(img);
            };

            newImg.onerror = () => {
                this.handleImageError(img);
                reject(new Error(`Failed to load image: ${imageUrl}`));
            };

            newImg.src = imageUrl;
        });
    }

    // ===== MANEJO DE ERRORES DE IMÁGENES =====
    handleImageError(img) {
        const container = img.closest('.project-image, .member-image, .hero-image');
        
        if (container) {
            // Ocultar imagen y mostrar placeholder
            img.style.display = 'none';
            
            let placeholder = container.querySelector('.image-placeholder');
            if (!placeholder) {
                placeholder = this.createPlaceholder(img);
                container.appendChild(placeholder);
            }
            
            placeholder.style.display = 'flex';
            
            // Agregar clase de error para estilos específicos
            container.classList.add('image-error');
        }
    }

    createPlaceholder(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        
        // Determinar el icono basado en el contexto
        let icon = 'fas fa-image';
        let text = 'Imagen no disponible';
        
        if (img.closest('.project-image')) {
            icon = 'fas fa-building';
            text = 'Proyecto';
        } else if (img.closest('.member-image')) {
            icon = 'fas fa-user';
            text = 'Foto del equipo';
        } else if (img.closest('.hero-image')) {
            icon = 'fas fa-user-tie';
            text = 'Foto del arquitecto';
        }
        
        placeholder.innerHTML = `
            <i class="${icon}"></i>
            <p>${text}</p>
        `;
        
        return placeholder;
    }

    // ===== OPTIMIZACIÓN DE IMÁGENES EXISTENTES =====
    optimizeExistingImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Agregar loading="lazy" nativo para navegadores compatibles
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Optimizar alt text si está vacío
            if (!img.alt || img.alt.trim() === '') {
                img.alt = this.generateAltText(img);
            }
            
            // Agregar decode="async" para mejor rendimiento
            img.setAttribute('decoding', 'async');
        });
    }

    generateAltText(img) {
        const src = img.src || img.dataset.src || '';
        const filename = src.split('/').pop().split('.')[0];
        
        // Generar alt text basado en el contexto
        if (img.closest('.project-image')) {
            return `Imagen del proyecto ${filename}`;
        } else if (img.closest('.member-image')) {
            return `Foto del miembro del equipo`;
        } else if (img.closest('.logo')) {
            return 'Logo de Larq Arquitectura y Construcción';
        }
        
        return `Imagen: ${filename}`;
    }

    // ===== PRELOAD DE IMÁGENES CRÍTICAS =====
    preloadCriticalImages() {
        const criticalImages = [
            'images/Logo_larq.png',
            'images/ArquitectoFoto.png',
            'images/Pagina1.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // ===== RESPONSIVE IMAGES =====
    setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-responsive]');
        
        images.forEach(img => {
            const baseSrc = img.dataset.src || img.src;
            const sizes = img.dataset.sizes || '(max-width: 768px) 100vw, 50vw';
            
            // Crear srcset para diferentes tamaños
            const srcset = this.generateSrcSet(baseSrc);
            
            if (srcset) {
                img.setAttribute('srcset', srcset);
                img.setAttribute('sizes', sizes);
            }
        });
    }

    generateSrcSet(baseSrc) {
        // En un entorno real, tendrías diferentes tamaños de la misma imagen
        // Por ahora, retornamos la imagen original
        return `${baseSrc} 1x`;
    }

    // ===== FALLBACK PARA NAVEGADORES SIN SOPORTE =====
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // ===== CLEANUP =====
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// ===== UTILIDADES DE IMAGEN =====
class ImageUtils {
    // Convertir imagen a WebP si es soportado
    static supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Obtener dimensiones de imagen
    static getImageDimensions(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    aspectRatio: img.naturalWidth / img.naturalHeight
                });
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    // Comprimir imagen (simulado)
    static compressImage(file, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
}

// ===== ESTILOS PARA LAZY LOADING =====
const lazyLoadingStyles = `
    /* Estilos para lazy loading */
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    .image-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        border: 2px dashed #dee2e6;
        border-radius: 8px;
        min-height: 200px;
        color: #6c757d;
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .image-placeholder i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .image-placeholder p {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .image-error .image-placeholder {
        border-color: #ffc107;
        background: #fff3cd;
        color: #856404;
    }
    
    /* Loading skeleton */
    .image-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    /* Responsive images */
    img {
        max-width: 100%;
        height: auto;
        display: block;
    }
    
    /* Performance optimizations */
    img[loading="lazy"] {
        content-visibility: auto;
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = lazyLoadingStyles;
document.head.appendChild(styleSheet);

// Exportar para uso global
window.ImageOptimizer = ImageOptimizer;
window.ImageUtils = ImageUtils;

console.log('🖼️ Image Optimizer cargado correctamente');