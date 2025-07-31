 // ===== ARQUITECTURA PROFESIONAL - GALERÍA AVANZADA =====
// Sistema de galería de imágenes profesional para arquitectos
// Características: Zoom, transiciones cinematográficas, navegación avanzada

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    animation: {
        duration: 400,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        stagger: 100
    },
    gallery: {
        autoplay: false,
        autoplayDelay: 5000,
        enableZoom: true,
        enableFullscreen: true,
        showThumbnails: true
    },
    mobile: {
        breakpoint: 768,
        reducedAnimations: true
    }
};

// ===== UTILIDADES AVANZADAS =====
class Utils {
    static isMobile() {
        return window.innerWidth <= CONFIG.mobile.breakpoint;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    static createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// ===== NAVEGACIÓN MÓVIL MEJORADA =====
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', (e) => {
            Utils.createRippleEffect(this.hamburger, e);
            this.toggle();
        });

        // Cerrar menú al hacer clic en enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }

    close() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
}

// ===== HEADER DINÁMICO =====
class DynamicHeader {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        if (!this.header) return;

        const handleScroll = Utils.debounce(() => {
            const currentScrollY = window.scrollY;
            
            // Cambiar estilo según scroll
            if (currentScrollY > 100) {
                this.header.style.background = 'rgba(255, 255, 255, 0.98)';
                this.header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                this.header.style.backdropFilter = 'blur(20px) saturate(180%)';
            } else {
                this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.header.style.boxShadow = 'none';
                this.header.style.backdropFilter = 'blur(20px) saturate(180%)';
            }

            // Ocultar/mostrar header en scroll
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }

            this.lastScrollY = currentScrollY;
        }, 10);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== DATOS DE PROYECTOS MEJORADOS =====
const projectsData = {
    1: {
        title: "Edificio Palomas",
        subtitle: "Arquitectura Residencial Contemporánea",
        image: "images/Pagina1.png",
        location: "C. Las Palomas 349, Surquillo 15047",
        year: "2023",
        area: "350 m²",
        client: "Familia González",
        category: "Residencial",
        status: "Completado",
        description: "Una residencia unifamiliar que combina la elegancia del diseño minimalista con la funcionalidad moderna. El proyecto se caracteriza por sus líneas limpias, espacios abiertos y una perfecta integración con el entorno natural. La casa cuenta con amplios ventanales que permiten la entrada de luz natural y crean una conexión visual con el jardín.",
        features: [
            "Diseño bioclimático",
            "Materiales sostenibles",
            "Domótica integrada",
            "Jardín vertical",
            "Piscina infinity",
            "Garaje subterráneo"
        ],
        tags: ["Minimalista", "Sostenible", "Contemporáneo"]
    },
    2: {
        title: "Complejo Comercial Urbano",
        subtitle: "Hotel Tambo del Inka - Proyecto Ejecutivo",
        image: "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease.jpg",
        images: [
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease.jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (1).jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (2).jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (3).jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (4).jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (5).jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (6).jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (7).jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (8).jpg",
            "images/Hotel Tambo del Inka, Urubamba, Cusco/Hotel Tambo del InkaGerencia de ProyectoEmpresa- Bovis Lend Lease (9).jpg"
        ],
        location: "Urubamba, Cusco, Perú",
        year: "2022",
        area: "2,500 m²",
        client: "Bovis Lend Lease",
        category: "Hotelero",
        status: "Completado",
        description: "Proyecto de gerencia para el prestigioso Hotel Tambo del Inka en el Valle Sagrado de los Incas. Un desarrollo hotelero de lujo que respeta la arquitectura tradicional andina mientras incorpora amenidades modernas de clase mundial. El proyecto incluye habitaciones, spa, restaurantes y espacios de eventos con vistas espectaculares a las montañas.",
        features: [
            "Arquitectura andina contemporánea",
            "Materiales locales",
            "Vistas panorámicas",
            "Spa de lujo",
            "Restaurantes gourmet",
            "Espacios para eventos"
        ],
        tags: ["Hotelero", "Lujo", "Cultural", "Paisajístico"]
    },
    3: {
        title: "Villa Ecológica",
        subtitle: "Arquitectura Sostenible Avanzada",
        image: "images/Imagen3.jpg",
        images: [
            "images/Imagen3.jpg",
            "images/Imagen4.jpg",
            "images/Imagen5.jpg"
        ],
        location: "Valencia, España",
        year: "2023",
        area: "280 m²",
        client: "Fundación EcoVida",
        category: "Sostenible",
        status: "En construcción",
        description: "Una vivienda experimental que demuestra cómo la arquitectura puede ser completamente sostenible sin sacrificar el confort o la estética. La villa incorpora tecnologías renovables, materiales reciclados y sistemas de gestión inteligente del agua y la energía. Es un ejemplo de construcción con huella de carbono negativa.",
        features: [
            "Paneles solares integrados",
            "Sistema de recogida de agua lluvia",
            "Materiales reciclados",
            "Aislamiento natural",
            "Huerto urbano",
            "Certificación LEED Platinum"
        ],
        tags: ["Ecológico", "Innovador", "LEED", "Experimental"]
    },
    4: {
        title: "Edificio Altavista",
        subtitle: "Proyecto de Construcción General",
        image: "images/Edificio Altavista/Edificio AltavistaContratista GeneralEmpresa- JE Construcciones Generales.jpg",
        images: [
            "images/Edificio Altavista/Edificio AltavistaContratista GeneralEmpresa- JE Construcciones Generales.jpg"
        ],
        location: "Lima, Perú",
        year: "2021",
        area: "1,500 m²",
        client: "JE Construcciones Generales",
        category: "Comercial",
        status: "Completado",
        description: "Proyecto de construcción general para el Edificio Altavista, desarrollado con diseño moderno y funcional. El edificio combina espacios comerciales y oficinas con una arquitectura contemporánea que se integra armoniosamente con el entorno urbano. La estructura cuenta con sistemas de eficiencia energética y materiales de alta calidad.",
        features: [
            "Diseño moderno y funcional",
            "Espacios comerciales flexibles",
            "Oficinas corporativas",
            "Sistemas de eficiencia energética",
            "Materiales de alta calidad",
            "Integración urbana"
        ],
        tags: ["Comercial", "Moderno", "Urbano", "Eficiente"]
    },
    5: {
        title: "Parque Urbano",
        subtitle: "Regeneración del Espacio Público",
        image: "images/Imagen8.jpg",
        location: "Bilbao, España",
        year: "2022",
        area: "5,000 m²",
        client: "Gobierno Vasco",
        category: "Paisajismo",
        status: "Completado",
        description: "Un proyecto de regeneración urbana que transforma un área industrial abandonada en un parque público multifuncional. El diseño integra zonas de recreo, senderos peatonales, áreas deportivas y espacios para eventos culturales. La topografía artificial crea diferentes niveles y perspectivas, mientras que la vegetación autóctona refuerza la identidad local.",
        features: [
            "Senderos accesibles",
            "Zonas de juegos infantiles",
            "Área deportiva",
            "Anfiteatro natural",
            "Jardines temáticos",
            "Sistema de riego inteligente"
        ],
        tags: ["Paisajismo", "Urbano", "Regeneración", "Público"]
    },
    6: {
        title: "Centro de Salud",
        subtitle: "Arquitectura Sanitaria Moderna",
        image: "images/Imagen1.jpg",
        images: [
            "images/Imagen1.jpg",
            "images/Imagen2.jpg"
        ],
        location: "Zaragoza, España",
        year: "2020",
        area: "1,200 m²",
        client: "Servicio Aragonés de Salud",
        category: "Sanitario",
        status: "Completado",
        description: "Un centro de atención primaria diseñado para optimizar los flujos de pacientes y crear un ambiente sanador. La arquitectura utiliza la luz natural como elemento terapéutico, mientras que los materiales y colores están seleccionados para reducir el estrés. El edificio incorpora tecnologías avanzadas para la gestión eficiente de los recursos.",
        features: [
            "Consultas especializadas",
            "Laboratorio integrado",
            "Farmacia interna",
            "Salas de espera diferenciadas",
            "Sistema de aire purificado",
            "Tecnología médica avanzada"
        ],
        tags: ["Sanitario", "Funcional", "Terapéutico", "Tecnológico"]
    }
};

// ===== GALERÍA PROFESIONAL AVANZADA =====
class ArchitecturalGallery {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.closeBtn = document.querySelector('.close');
        this.projectCards = document.querySelectorAll('.project-card');
        
        this.currentProject = null;
        this.currentImageIndex = 0;
        this.isZoomed = false;
        this.zoomLevel = 1;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        
        this.preloadedImages = new Map();
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        // Variables para el ajuste automático de imagen
        this.imageSection = null;
        this.infoSection = null;
        this.originalImageHeight = 70; // 70vh inicial
        this.minImageHeight = 35; // 35vh mínimo para ver el título completo
        this.isScrollAdjustmentActive = false;
        
        this.init();
    }

    init() {
        if (!this.modal || !this.closeBtn || !this.projectCards.length) return;

        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.addLoadingAnimation();
    }

    setupEventListeners() {
        // Abrir modal
        this.projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                Utils.createRippleEffect(card, e);
                this.openProject(card.getAttribute('data-project'));
            });
        });

        // Cerrar modal
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // Cerrar al hacer clic en el fondo
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display !== 'block') return;

            switch(e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImage();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleZoom();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    setupTouchNavigation() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.modal.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.modal.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            // Swipe horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextImage();
                } else {
                    this.previousImage();
                }
            }

            touchStartX = 0;
            touchStartY = 0;
        });
    }

    addLoadingAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .gallery-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
            }
            
            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .image-transition {
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .zoom-controls {
                position: absolute;
                top: 20px;
                left: 20px;
                display: flex;
                gap: 10px;
                z-index: 1001;
            }
            
            .zoom-btn {
                width: 50px;
                height: 50px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .zoom-btn:hover {
                background: rgba(0, 0, 0, 0.9);
                transform: scale(1.1);
            }
            
            .thumbnail-strip {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 25px;
                backdrop-filter: blur(20px);
                max-width: 80%;
                overflow-x: auto;
            }
            
            .thumbnail {
                width: 60px;
                height: 40px;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
                flex-shrink: 0;
            }
            
            .thumbnail:hover {
                transform: scale(1.1);
            }
            
            .thumbnail.active {
                border-color: #fff;
                transform: scale(1.1);
            }
            
            .thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .project-status {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .status-completed {
                background: #e6f7f6;
                color: #4ecdc4;
            }
            
            .status-construction {
                background: #fff3e0;
                color: #ffa726;
            }
            
            .project-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 15px;
            }
            
            .project-tag {
                background: rgba(124, 157, 247, 0.1);
                color: #7c9df7;
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: 500;
                border: 1px solid rgba(124, 157, 247, 0.2);
            }
            
            .image-title-overlay {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 20px;
                border-radius: 15px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 1002;
                max-width: 300px;
                transition: all 0.3s ease;
            }
            
            .image-title-overlay h3 {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 700;
                color: white;
                line-height: 1.3;
            }
            
            .image-title-overlay p {
                margin: 0;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.4;
            }
            
            .image-title-overlay .image-meta {
                display: flex;
                gap: 15px;
                margin-top: 10px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
            }
            
            .image-title-overlay .image-meta span {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .image-title-overlay:hover {
                background: rgba(0, 0, 0, 0.9);
                transform: scale(1.02);
            }
            
            .modal-blur-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                z-index: 9998;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                pointer-events: none;
            }
            
            .modal-blur-overlay.active {
                opacity: 1;
                visibility: visible;
                pointer-events: none;
            }
            
            .zoom-mode {
                z-index: 9999 !important;
                position: relative;
            }
            
            .zoom-mode .modal-content-fullscreen {
                background: rgba(25, 25, 25, 0.95);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 20px;
                margin: 20px;
                box-shadow: 
                    0 25px 50px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transform: scale(1.01);
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .zoom-mode .modal-image-section {
                background: rgba(15, 15, 15, 0.9);
                border-radius: 15px 15px 0 0;
                padding: 20px;
                position: relative;
            }
            
            .zoom-mode .modal-image-container {
                background: rgba(10, 10, 10, 0.8);
                border-radius: 15px;
                padding: 20px;
                box-shadow: 
                    inset 0 1px 0 rgba(255, 255, 255, 0.05),
                    0 15px 30px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .zoom-mode .main-gallery-image {
                border-radius: 10px;
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
                filter: contrast(1.05) saturate(1.05) brightness(1.05);
                transition: all 0.3s ease;
            }
            
            .zoom-mode .modal-info-section {
                background: rgba(20, 20, 20, 0.9);
                border-radius: 0 0 15px 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .zoom-mode .zoom-controls {
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border-radius: 12px;
                padding: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .zoom-mode .zoom-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }
            
            .zoom-mode .zoom-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    }

    async openProject(projectId) {
        this.currentProject = projectsData[projectId];
        this.currentImageIndex = 0;
        this.resetZoom();

        if (!this.currentProject) return;

        // Mostrar modal con loading
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Precargar imágenes
        await this.preloadProjectImages();
        
        // Actualizar contenido
        this.updateModalContent();
        this.updateImageDisplay();
        
        // Configurar ajuste automático de imagen
        this.setupScrollAdjustment();
        
        // Animación de entrada
        this.modal.style.opacity = '0';
        this.modal.style.transform = 'scale(0.9)';
        
        requestAnimationFrame(() => {
            this.modal.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.modal.style.opacity = '1';
            this.modal.style.transform = 'scale(1)';
        });
    }

    async preloadProjectImages() {
        if (!this.currentProject.images) return;

        const loadPromises = this.currentProject.images.map(async (src) => {
            if (!this.preloadedImages.has(src)) {
                try {
                    const img = await Utils.preloadImage(src);
                    this.preloadedImages.set(src, img);
                } catch (error) {
                    console.warn(`Failed to preload image: ${src}`);
                }
            }
        });

        await Promise.all(loadPromises);
    }

    updateModalContent() {
        const project = this.currentProject;
        
        // Actualizar información del proyecto
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalLocation').textContent = project.location;
        document.getElementById('modalYear').textContent = project.year;
        document.getElementById('modalArea').textContent = project.area;
        document.getElementById('modalClient').textContent = project.client;
        document.getElementById('modalDescription').textContent = project.description;

        // Agregar subtítulo si existe
        const titleElement = document.getElementById('modalTitle');
        if (project.subtitle) {
            titleElement.innerHTML = `
                ${project.title}
                <div style="font-size: 18px; font-weight: 400; color: #7c9df7; margin-top: 8px;">
                    ${project.subtitle}
                </div>
            `;
        }

        // Agregar estado del proyecto
        const metaContainer = document.querySelector('.project-meta');
        if (metaContainer && project.status) {
            const statusClass = project.status === 'Completado' ? 'status-completed' : 'status-construction';
            const statusElement = document.createElement('span');
            statusElement.className = `meta-item project-status ${statusClass}`;
            statusElement.textContent = project.status;
            metaContainer.appendChild(statusElement);
        }

        // Actualizar características
        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        // Agregar tags si existen
        if (project.tags) {
            const featuresContainer = document.querySelector('.project-features');
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'project-tags';
            
            project.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'project-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
            
            featuresContainer.appendChild(tagsContainer);
        }
    }

    updateImageDisplay() {
        const container = document.querySelector('.modal-image-container');
        const project = this.currentProject;
        
        if (project.images && project.images.length > 1) {
            this.createGalleryInterface(container, project);
        } else if (project.image) {
            this.createSingleImageInterface(container, project);
        } else {
            this.createPlaceholderInterface(container);
        }
    }

    createGalleryInterface(container, project) {
        const currentImage = project.images[this.currentImageIndex];
        
        container.innerHTML = `
            <div class="gallery-loading" style="display: none;">
                <div class="loading-spinner"></div>
            </div>
            
            <img src="${currentImage}" 
                 alt="${project.title}" 
                 class="main-gallery-image image-transition"
                 style="width: 100%; height: 100%; object-fit: contain; max-height: 70vh;">
            
            <div class="image-navigation">
                <button class="nav-btn prev-btn" id="prevImage" ${this.currentImageIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="nav-btn next-btn" id="nextImage" ${this.currentImageIndex === project.images.length - 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="image-counter">
                    <span>${this.currentImageIndex + 1}</span> / <span>${project.images.length}</span>
                </div>
            </div>
            
            ${this.createThumbnailStrip(project)}
        `;

        this.setupNavigationButtons();
        this.setupThumbnails();
    }

    createSingleImageInterface(container, project) {
        container.innerHTML = `
            <img src="${project.image}" 
                 alt="${project.title}" 
                 class="main-gallery-image image-transition"
                 style="width: 100%; height: 100%; object-fit: contain; max-height: 70vh;">
        `;
    }

    createPlaceholderInterface(container) {
        container.innerHTML = `
            <div class="image-placeholder">
                <i class="fas fa-image"></i>
                <p>No hay imágenes disponibles</p>
            </div>
        `;
    }

    createImageTitleOverlay(project) {
        return `
            <div class="image-title-overlay">
                <h3>${project.title}</h3>
                <p>${project.subtitle || project.category}</p>
                <div class="image-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${project.location}</span>
                    <span><i class="fas fa-calendar"></i> ${project.year}</span>
                </div>
            </div>
        `;
    }

    createThumbnailStrip(project) {
        if (!project.images || project.images.length <= 1) return '';

        const thumbnails = project.images.map((src, index) => `
            <div class="thumbnail ${index === this.currentImageIndex ? 'active' : ''}" 
                 data-index="${index}">
                <img src="${src}" alt="Thumbnail ${index + 1}">
            </div>
        `).join('');

        return `
            <div class="thumbnail-strip">
                ${thumbnails}
            </div>
        `;
    }

    setupImageInteractions(container) {
        const image = container.querySelector('.main-gallery-image');
        if (!image) return;

        // Zoom con rueda del mouse
        image.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.adjustZoom(delta);
        });

        // Arrastrar imagen cuando está zoomeada
        let isDragging = false;
        let startX, startY, initialX, initialY;

        image.addEventListener('mousedown', (e) => {
            if (this.zoomLevel > 1) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = this.translateX;
                initialY = this.translateY;
                image.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && this.zoomLevel > 1) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                this.translateX = initialX + deltaX;
                this.translateY = initialY + deltaY;
                this.updateImageTransform(image);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                image.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
            }
        });

        // Doble clic para zoom
        image.addEventListener('dblclick', () => {
            this.toggleZoom();
        });
    }

    setupNavigationButtons() {
        const prevBtn = document.getElementById('prevImage');
        const nextBtn = document.getElementById('nextImage');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                Utils.createRippleEffect(prevBtn, e);
                this.previousImage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                Utils.createRippleEffect(nextBtn, e);
                this.nextImage();
            });
        }
    }

    setupZoomControls() {
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        const resetZoom = document.getElementById('resetZoom');
        const fullscreen = document.getElementById('fullscreen');

        if (zoomIn) zoomIn.addEventListener('click', () => this.adjustZoom(0.2));
        if (zoomOut) zoomOut.addEventListener('click', () => this.adjustZoom(-0.2));
        if (resetZoom) resetZoom.addEventListener('click', () => this.resetZoom());
        if (fullscreen) fullscreen.addEventListener('click', () => this.toggleFullscreen());
    }

    setupThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.updateImageDisplay();
            });
        });
    }

    previousImage() {
        if (!this.currentProject.images || this.currentImageIndex <= 0) return;
        
        this.currentImageIndex--;
        this.resetZoom();
        this.animateImageTransition(() => this.updateImageDisplay());
    }

    nextImage() {
        if (!this.currentProject.images || this.currentImageIndex >= this.currentProject.images.length - 1) return;
        
        this.currentImageIndex++;
        this.resetZoom();
        this.animateImageTransition(() => this.updateImageDisplay());
    }

    animateImageTransition(callback) {
        const image = document.querySelector('.main-gallery-image');
        if (!image) return callback();

        image.style.opacity = '0';
        image.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            callback();
            requestAnimationFrame(() => {
                const newImage = document.querySelector('.main-gallery-image');
                if (newImage) {
                    newImage.style.opacity = '1';
                    newImage.style.transform = 'scale(1)';
                }
            });
        }, 200);
    }

    adjustZoom(delta) {
        const newZoom = Math.max(1, Math.min(3, this.zoomLevel + delta));
        this.zoomLevel = newZoom;
        
        const image = document.querySelector('.main-gallery-image');
        if (image) {
            if (this.zoomLevel === 1) {
                this.translateX = 0;
                this.translateY = 0;
                image.style.cursor = 'default';
                this.deactivateZoomMode();
            } else {
                image.style.cursor = 'grab';
                this.activateZoomMode();
            }
            this.updateImageTransform(image);
        }
    }
    
    activateZoomMode() {
        // Simplemente agregar clase al modal para cambiar su apariencia
        this.modal.classList.add('zoom-mode');
        
        // Aplicar blur al fondo (todo excepto el modal)
        const allElements = document.querySelectorAll('body > *:not(#projectModal)');
        allElements.forEach(element => {
            element.style.filter = 'blur(8px)';
            element.style.transition = 'filter 0.3s ease';
        });
        
        // Desactivar el ajuste automático de scroll cuando está en zoom
        this.isScrollAdjustmentActive = false;
        
        console.log('🔍 Modo zoom activado');
    }
    
    deactivateZoomMode() {
        // Remover clase del modal
        this.modal.classList.remove('zoom-mode');
        
        // Quitar blur del fondo
        const allElements = document.querySelectorAll('body > *:not(#projectModal)');
        allElements.forEach(element => {
            element.style.filter = 'none';
        });
        
        // Reactivar el ajuste automático de scroll
        this.isScrollAdjustmentActive = true;
        
        console.log('🔍 Modo zoom desactivado');
    }

    toggleZoom() {
        if (this.zoomLevel > 1) {
            this.resetZoom();
        } else {
            this.adjustZoom(1);
        }
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.translateX = 0;
        this.translateY = 0;
        
        const image = document.querySelector('.main-gallery-image');
        if (image) {
            image.style.cursor = 'default';
            this.updateImageTransform(image);
        }
    }

    updateImageTransform(image) {
        image.style.transform = `scale(${this.zoomLevel}) translate(${this.translateX}px, ${this.translateY}px)`;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.modal.requestFullscreen?.() || 
            this.modal.webkitRequestFullscreen?.() || 
            this.modal.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || 
            document.webkitExitFullscreen?.() || 
            document.msExitFullscreen?.();
        }
    }

    setupScrollAdjustment() {
        // Obtener referencias a las secciones
        this.imageSection = document.querySelector('.modal-image-section');
        this.infoSection = document.querySelector('.modal-info-section');
        
        if (!this.imageSection || !this.infoSection) return;
        
        // Activar el ajuste automático
        this.isScrollAdjustmentActive = true;
        
        // Configurar el scroll handler con debounce para mejor rendimiento
        const handleModalScroll = Utils.debounce((e) => {
            if (!this.isScrollAdjustmentActive) return;
            
            const scrollContainer = e.target;
            const scrollTop = scrollContainer.scrollTop;
            const scrollHeight = scrollContainer.scrollHeight;
            const clientHeight = scrollContainer.clientHeight;
            
            // Calcular el porcentaje de scroll (0 a 1)
            const scrollPercentage = Math.min(scrollTop / (scrollHeight - clientHeight), 1);
            
            // Calcular la nueva altura de imagen basada en el scroll
            const heightRange = this.originalImageHeight - this.minImageHeight;
            const newImageHeight = this.originalImageHeight - (heightRange * scrollPercentage);
            
            // Aplicar la nueva altura con transición suave
            this.adjustImageHeight(newImageHeight);
            
        }, 16); // 60fps para scroll suave
        
        // Agregar el event listener al contenedor del modal
        const modalContent = document.querySelector('.modal-content-fullscreen');
        if (modalContent) {
            modalContent.addEventListener('scroll', handleModalScroll);
            
            // Guardar referencia para poder removerlo después
            this.scrollHandler = handleModalScroll;
            this.scrollContainer = modalContent;
        }
        
        // También detectar scroll en la sección de información
        if (this.infoSection) {
            this.infoSection.addEventListener('scroll', handleModalScroll);
        }
    }
    
    adjustImageHeight(newHeight) {
        if (!this.imageSection) return;
        
        // Asegurar que la altura esté dentro de los límites
        const clampedHeight = Math.max(this.minImageHeight, Math.min(this.originalImageHeight, newHeight));
        
        // Aplicar la nueva altura con transición suave
        this.imageSection.style.transition = 'min-height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.imageSection.style.minHeight = `${clampedHeight}vh`;
        
        // Ajustar también la altura máxima de la imagen
        const mainImage = document.querySelector('.main-gallery-image');
        if (mainImage) {
            mainImage.style.transition = 'max-height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            mainImage.style.maxHeight = `${clampedHeight}vh`;
        }
        
        // Ajustar la altura de la sección de información para compensar
        const infoHeight = 100 - clampedHeight;
        if (this.infoSection) {
            this.infoSection.style.transition = 'max-height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.infoSection.style.maxHeight = `${Math.max(30, infoHeight)}vh`;
        }
    }
    
    resetImageSize() {
        // Resetear a tamaños originales
        if (this.imageSection) {
            this.imageSection.style.minHeight = `${this.originalImageHeight}vh`;
        }
        
        const mainImage = document.querySelector('.main-gallery-image');
        if (mainImage) {
            mainImage.style.maxHeight = `${this.originalImageHeight}vh`;
        }
        
        if (this.infoSection) {
            this.infoSection.style.maxHeight = '30vh';
        }
    }
    
    cleanupScrollAdjustment() {
        // Desactivar el ajuste automático
        this.isScrollAdjustmentActive = false;
        
        // Remover event listeners
        if (this.scrollContainer && this.scrollHandler) {
            this.scrollContainer.removeEventListener('scroll', this.scrollHandler);
        }
        
        if (this.infoSection && this.scrollHandler) {
            this.infoSection.removeEventListener('scroll', this.scrollHandler);
        }
        
        // Resetear tamaños
        this.resetImageSize();
        
        // Limpiar referencias
        this.scrollHandler = null;
        this.scrollContainer = null;
    }

    closeModal() {
        // Limpiar el ajuste de scroll antes de cerrar
        this.cleanupScrollAdjustment();
        
        // Animación de salida
        this.modal.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.modal.style.opacity = '0';
        this.modal.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.modal.style.transition = '';
            document.body.style.overflow = 'auto';
            this.resetZoom();
        }, 300);
    }
}

// ===== ANIMACIONES AVANZADAS =====
class AdvancedAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSkillsAnimation();
        this.setupStatsAnimation();
        this.setupParallaxEffects();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * CONFIG.animation.stagger);
                }
            });
        }, this.observerOptions);

        const animateElements = document.querySelectorAll(
            '.project-card, .team-member, .contact-item, .value-item, .service-item, .step'
        );
        
        animateElements.forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }

    setupSkillsAnimation() {
        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach((bar, index) => {
                        setTimeout(() => {
                            const width = bar.style.width;
                            bar.style.width = '0%';
                            setTimeout(() => {
                                bar.style.width = width;
                            }, 100);
                        }, index * 200);
                    });
                }
            });
        }, this.observerOptions);

        observer.observe(skillsSection);
    }

    setupStatsAnimation() {
        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-item h3');
                    statNumbers.forEach((stat, index) => {
                        setTimeout(() => {
                            this.animateNumber(stat);
                        }, index * 300);
                    });
                }
            });
        }, this.observerOptions);

        observer.observe(statsSection);
    }

    animateNumber(element) {
        const finalNumber = element.textContent;
        const isPercentage = finalNumber.includes('%');
        const number = parseInt(finalNumber.replace(/\D/g, ''));
        
        let current = 0;
        const increment = number / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (isPercentage ? '%' : '+');
        }, 16);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        const handleScroll = Utils.debounce(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 10);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== FORMULARIO DE CONTACTO MEJORADO =====
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Validación en tiempo real
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch(field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = 'Por favor, introduce un email válido';
                break;
            case 'tel':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
                isValid = phoneRegex.test(value);
                message = 'Por favor, introduce un teléfono válido';
                break;
            default:
                isValid = value.length >= 2;
                message = 'Este campo es requerido';
        }

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Este campo es requerido';
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();

        if (!isValid) {
            field.style.borderColor = '#ff6b6b';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = `
                color: #ff6b6b;
                font-size: 12px;
                margin-top: 5px;
                animation: fadeIn 0.3s ease;
            `;
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.style.borderColor = '#4ecdc4';
        }
    }

    clearErrors(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        field.style.borderColor = '';
    }

    async handleSubmit() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Validar todos los campos
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        // Simular envío
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.background = '#7c9df7';

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            submitBtn.textContent = 'Mensaje Enviado ✓';
            submitBtn.style.background = '#4ecdc4';
            
            this.showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                this.form.reset();
                
                // Limpiar estilos de validación
                inputs.forEach(input => {
                    input.style.borderColor = '';
                    this.clearErrors(input);
                });
            }, 3000);
            
        } catch (error) {
            submitBtn.textContent = 'Error al enviar';
            submitBtn.style.background = '#ff6b6b';
            this.showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;
        
        notification.style.background = type === 'success' ? '#4ecdc4' : '#ff6b6b';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ===== OPTIMIZACIÓN PARA MÓVILES =====
class MobileOptimization {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeForDevice();
        this.setupResizeHandler();
        this.optimizeAnimations();
    }

    optimizeForDevice() {
        if (Utils.isMobile()) {
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
            
            // Reducir efectos visuales en móviles
            const heavyAnimations = document.querySelectorAll('.parallax, .complex-animation');
            heavyAnimations.forEach(el => el.style.animation = 'none');
        }
    }

    setupResizeHandler() {
        const handleResize = Utils.debounce(() => {
            this.optimizeForDevice();
        }, 250);

        window.addEventListener('resize', handleResize);
    }

    optimizeAnimations() {
        // Detectar si el usuario prefiere animaciones reducidas
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01s');
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los componentes
    new MobileNavigation();
    new DynamicHeader();
    new ArchitecturalGallery();
    new AdvancedAnimations();
    new ContactForm();
    new MobileOptimization();

    // Agregar estilos adicionales para animaciones
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .scroll-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .project-card {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .project-card:hover {
            transform: translateY(-8px) scale(1.02);
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(additionalStyles);

    console.log('🏗️ Galería Arquitectónica Profesional Inicializada');
});