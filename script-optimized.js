// ===== ARQUITECTURA PROFESIONAL - VERSIÓN OPTIMIZADA =====
// Sistema modular y optimizado para mejor rendimiento

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    animation: {
        duration: 300,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    },
    mobile: {
        breakpoint: 768
    }
};

// ===== UTILIDADES =====
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
}

// ===== NAVEGACIÓN MÓVIL =====
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', () => this.toggle());
        this.hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
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
        const isOpen = this.hamburger.classList.contains('active');
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
        
        // Actualizar aria-expanded para accesibilidad
        this.hamburger.setAttribute('aria-expanded', !isOpen);
    }

    close() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        this.hamburger.setAttribute('aria-expanded', 'false');
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
            } else {
                this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.header.style.boxShadow = 'none';
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

// ===== DATOS DE PROYECTOS SIMPLIFICADOS =====
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
        description: "Una residencia unifamiliar que combina la elegancia del diseño minimalista con la funcionalidad moderna.",
        features: [
            "Diseño bioclimático",
            "Materiales sostenibles",
            "Domótica integrada",
            "Jardín vertical"
        ]
    },
    2: {
        title: "Hotel Tambo del Inka",
        subtitle: "Proyecto Ejecutivo Hotelero",
        location: "Urubamba, Cusco, Perú",
        year: "2022",
        area: "2,500 m²",
        client: "Bovis Lend Lease",
        category: "Hotelero",
        status: "Completado",
        description: "Proyecto de gerencia para el prestigioso Hotel Tambo del Inka en el Valle Sagrado de los Incas.",
        features: [
            "Arquitectura andina contemporánea",
            "Materiales locales",
            "Vistas panorámicas",
            "Spa de lujo"
        ]
    },
    3: {
        title: "Villa Ecológica",
        subtitle: "Arquitectura Sostenible Avanzada",
        location: "Valencia, España",
        year: "2023",
        area: "280 m²",
        client: "Fundación EcoVida",
        category: "Sostenible",
        status: "En construcción",
        description: "Una vivienda experimental que demuestra cómo la arquitectura puede ser completamente sostenible.",
        features: [
            "Paneles solares integrados",
            "Sistema de recogida de agua lluvia",
            "Materiales reciclados",
            "Certificación LEED Platinum"
        ]
    },
    4: {
        title: "Edificio Altavista",
        subtitle: "Proyecto de Construcción General",
        location: "Lima, Perú",
        year: "2021",
        area: "1,500 m²",
        client: "JE Construcciones Generales",
        category: "Comercial",
        status: "Completado",
        description: "Proyecto de construcción general para el Edificio Altavista con diseño moderno y funcional.",
        features: [
            "Diseño moderno y funcional",
            "Espacios comerciales flexibles",
            "Sistemas de eficiencia energética",
            "Integración urbana"
        ]
    },
    5: {
        title: "Parque Urbano",
        subtitle: "Regeneración del Espacio Público",
        location: "Bilbao, España",
        year: "2022",
        area: "5,000 m²",
        client: "Gobierno Vasco",
        category: "Paisajismo",
        status: "Completado",
        description: "Un proyecto de regeneración urbana que transforma un área industrial abandonada en un parque público.",
        features: [
            "Senderos accesibles",
            "Zonas de juegos infantiles",
            "Área deportiva",
            "Jardines temáticos"
        ]
    },
    6: {
        title: "Centro de Salud",
        subtitle: "Arquitectura Sanitaria Moderna",
        location: "Zaragoza, España",
        year: "2020",
        area: "1,200 m²",
        client: "Servicio Aragonés de Salud",
        category: "Sanitario",
        status: "Completado",
        description: "Un centro de atención primaria diseñado para optimizar los flujos de pacientes.",
        features: [
            "Consultas especializadas",
            "Laboratorio integrado",
            "Sistema de aire purificado",
            "Tecnología médica avanzada"
        ]
    }
};

// ===== GALERÍA SIMPLIFICADA =====
class SimpleGallery {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.closeBtn = document.querySelector('.close');
        this.projectCards = document.querySelectorAll('.project-card');
        this.currentProject = null;
        this.init();
    }

    init() {
        if (!this.modal || !this.closeBtn || !this.projectCards.length) return;

        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        // Abrir modal
        this.projectCards.forEach(card => {
            card.addEventListener('click', () => {
                this.openProject(card.getAttribute('data-project'));
            });
            
            // Accesibilidad por teclado
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openProject(card.getAttribute('data-project'));
                }
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

            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openProject(projectId) {
        this.currentProject = projectsData[projectId];
        if (!this.currentProject) return;

        this.updateModalContent();
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus en el modal para accesibilidad
        this.modal.focus();
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

        // Actualizar características
        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        // Actualizar imagen
        this.updateImageDisplay();
    }

    updateImageDisplay() {
        const container = document.querySelector('.modal-image-container');
        const project = this.currentProject;
        
        if (project.image) {
            container.innerHTML = `
                <img src="${project.image}" 
                     alt="${project.title}" 
                     class="main-gallery-image"
                     style="width: 100%; height: 100%; object-fit: contain; max-height: 70vh;">
            `;
        } else {
            container.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-image"></i>
                    <p>No hay imágenes disponibles</p>
                </div>
            `;
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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
            field.setAttribute('aria-invalid', 'true');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.style.cssText = `
                color: #ff6b6b;
                font-size: 12px;
                margin-top: 5px;
            `;
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.style.borderColor = '#4ecdc4';
            field.setAttribute('aria-invalid', 'false');
        }
    }

    clearErrors(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
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

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            submitBtn.textContent = 'Mensaje Enviado ✓';
            this.showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                this.form.reset();
                
                // Limpiar estilos de validación
                inputs.forEach(input => {
                    input.style.borderColor = '';
                    input.removeAttribute('aria-invalid');
                    this.clearErrors(input);
                });
            }, 3000);
            
        } catch (error) {
            submitBtn.textContent = 'Error al enviar';
            this.showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            background: ${type === 'success' ? '#4ecdc4' : '#ff6b6b'};
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
}

// ===== ANIMACIONES BÁSICAS =====
class BasicAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const animateElements = document.querySelectorAll(
            '.project-card, .team-member, .contact-item, .value-item, .service-item, .step'
        );
        
        animateElements.forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }
}

// ===== SISTEMA DE OPTIMIZACIÓN AVANZADA =====
class PerformanceOptimizer {
    constructor() {
        this.imageOptimizer = null;
        this.fontOptimizer = null;
        this.serviceWorkerRegistered = false;
        this.init();
    }

    async init() {
        // Registrar Service Worker primero
        await this.registerServiceWorker();
        
        // Inicializar optimizadores
        this.initializeOptimizers();
        
        // Configurar métricas de rendimiento
        this.setupPerformanceMonitoring();
        
        // Preload recursos críticos
        this.preloadCriticalResources();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('✅ Service Worker registrado:', registration.scope);
                this.serviceWorkerRegistered = true;
                
                // Manejar actualizaciones
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.warn('❌ Error registrando Service Worker:', error);
            }
        }
    }

    initializeOptimizers() {
        // Cargar optimizadores dinámicamente
        this.loadScript('/image-optimizer.js').then(() => {
            if (window.ImageOptimizer) {
                this.imageOptimizer = new window.ImageOptimizer();
                console.log('🖼️ Image Optimizer inicializado');
            }
        });

        this.loadScript('/font-optimizer.js').then(() => {
            if (window.FontOptimizer) {
                this.fontOptimizer = new window.FontOptimizer();
                console.log('🔤 Font Optimizer inicializado');
            }
        });

        this.loadScript('/seo-optimizer.js').then(() => {
            if (window.SEOOptimizer) {
                this.seoOptimizer = new window.SEOOptimizer();
                console.log('🔍 SEO Optimizer inicializado');
            }
        });

        // Cargar herramientas de desarrollo en modo dev
        this.loadDevTools();
    }

    loadDevTools() {
        const isDev = window.location.hostname === 'localhost' || 
                      window.location.search.includes('dev=true') ||
                      window.location.search.includes('test=true');
        
        if (isDev) {
            // Cargar Test Suite
            this.loadScript('/test-suite.js').then(() => {
                console.log('🧪 Test Suite cargado');
            });

            // Cargar Error Monitor
            this.loadScript('/error-monitor.js').then(() => {
                console.log('🚨 Error Monitor cargado');
            });

            // Cargar Dev Tools
            this.loadScript('/dev-tools.js').then(() => {
                console.log('🛠️ Dev Tools cargado');
            });
        }
    }

    async loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupPerformanceMonitoring() {
        // Monitorear Core Web Vitals
        if ('web-vital' in window) {
            this.measureWebVitals();
        }

        // Monitorear tiempo de carga
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`⚡ Página cargada en ${Math.round(loadTime)}ms`);
            
            // Reportar métricas
            this.reportPerformanceMetrics();
        });
    }

    measureWebVitals() {
        // Implementar medición de Core Web Vitals
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`📊 ${entry.name}: ${entry.value}ms`);
            }
        });

        observer.observe({ entryTypes: ['measure', 'navigation'] });
    }

    reportPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const metrics = {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcp: navigation.connectEnd - navigation.connectStart,
                request: navigation.responseStart - navigation.requestStart,
                response: navigation.responseEnd - navigation.responseStart,
                dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
                load: navigation.loadEventEnd - navigation.loadEventStart
            };

            console.log('📊 Performance Metrics:', metrics);
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/styles-professional.css',
            '/images/Logo_larq.png'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            
            if (resource.endsWith('.css')) {
                link.as = 'style';
            } else if (resource.includes('/images/')) {
                link.as = 'image';
            }
            
            document.head.appendChild(link);
        });
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.innerHTML = `
            <div>Nueva versión disponible</div>
            <button onclick="window.location.reload()" style="
                background: white;
                color: #4CAF50;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                margin-top: 8px;
                cursor: pointer;
            ">Actualizar</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 10000);
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de optimización
    const performanceOptimizer = new PerformanceOptimizer();
    
    // Inicializar componentes optimizados
    new MobileNavigation();
    new DynamicHeader();
    new SimpleGallery();
    new ContactForm();
    new BasicAnimations();

    // Agregar estilos básicos para animaciones
    const styles = document.createElement('style');
    styles.textContent = `
        .scroll-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .scroll-animate.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .project-card {
            transition: all 0.3s ease;
            cursor: pointer;
            tabindex: 0;
        }
        
        .project-card:hover,
        .project-card:focus {
            transform: translateY(-8px) scale(1.02);
            outline: 2px solid #A3BFFA;
            outline-offset: 2px;
        }
        
        .hamburger:focus {
            outline: 2px solid #A3BFFA;
            outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Estilos para notificaciones de actualización */
        .update-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(styles);

    console.log('🏗️ Sistema Optimizado Avanzado Inicializado');
});