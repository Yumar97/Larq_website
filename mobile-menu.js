// ===== MENÚ MÓVIL MEJORADO PARA PROYECTOS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Inicializando menú móvil mejorado...');
    
    // Elementos del DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const socialLinks = document.querySelector('.social-links');
    let overlay = document.querySelector('.nav-overlay');
    
    // Verificar que los elementos existen
    if (!hamburger || !navMenu) {
        console.error('❌ Elementos de navegación no encontrados');
        return;
    }
    
    // Crear overlay si no existe
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }
    
    // Función para verificar si es móvil
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Función para asegurar visibilidad en móvil
    function ensureMobileVisibility() {
        if (isMobile()) {
            // Forzar estilos del hamburger
            hamburger.style.display = 'flex';
            hamburger.style.flexDirection = 'column';
            hamburger.style.justifyContent = 'center';
            hamburger.style.alignItems = 'center';
            hamburger.style.width = '44px';
            hamburger.style.height = '44px';
            hamburger.style.zIndex = '1001';
            hamburger.style.position = 'relative';
            hamburger.style.cursor = 'pointer';
            hamburger.style.padding = '8px';
            hamburger.style.borderRadius = '8px';
            hamburger.style.transition = 'all 0.3s ease';
            
            // Asegurar que los spans sean visibles
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.style.display = 'block';
                span.style.width = '20px';
                span.style.height = '2px';
                span.style.backgroundColor = 'var(--primary-700, #384142)';
                span.style.margin = '2px 0';
                span.style.transition = 'all 0.3s ease';
                span.style.borderRadius = '1px';
            });
            
            // Mostrar iconos sociales en el centro
            if (socialLinks) {
                socialLinks.style.display = 'flex';
                socialLinks.style.order = '2';
                socialLinks.style.flex = '1';
                socialLinks.style.justifyContent = 'center';
                socialLinks.style.maxWidth = '200px';
                socialLinks.style.margin = '0 auto';
                socialLinks.style.gap = '0.5rem';
                
                // Ajustar tamaño de iconos sociales
                const socialIcons = socialLinks.querySelectorAll('.social-link');
                socialIcons.forEach(icon => {
                    icon.style.width = '35px';
                    icon.style.height = '35px';
                    icon.style.fontSize = '0.9rem';
                    icon.style.borderRadius = '8px';
                });
            }
            
            console.log('📱 Visibilidad móvil asegurada');
        }
    }
    
    // Función para abrir el menú
    function openMenu() {
        console.log('📱 Abriendo menú móvil');
        
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('nav-open');
        overlay.classList.add('active');
        
        // Animaciones del hamburger
        const spans = hamburger.querySelectorAll('span');
        if (spans.length >= 3) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[0].style.backgroundColor = 'var(--accent-600, #7c9df7)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            spans[2].style.backgroundColor = 'var(--accent-600, #7c9df7)';
        }
        
        hamburger.style.backgroundColor = 'var(--accent-100, #efeffe)';
        
        // Animar elementos del menú
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100 + 100);
        });
        
        // Accesibilidad
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Cerrar menú de navegación');
        
        // Focus en el primer enlace
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        console.log('📱 Cerrando menú móvil');
        
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        overlay.classList.remove('active');
        
        // Resetear animaciones del hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.backgroundColor = 'var(--primary-700, #384142)';
            span.style.opacity = '1';
        });
        
        hamburger.style.backgroundColor = '';
        
        // Resetear elementos del menú
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.opacity = '';
            item.style.transform = '';
            item.style.transition = '';
        });
        
        // Accesibilidad
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
    }
    
    // Función para alternar el menú
    function toggleMenu() {
        if (hamburger.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Event listeners
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Touch events para móvil
    hamburger.addEventListener('touchstart', function(e) {
        e.preventDefault();
        toggleMenu();
    }, { passive: false });
    
    // Cerrar menú al hacer clic en enlaces
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Cerrar menú al hacer clic en el overlay
    overlay.addEventListener('click', closeMenu);
    overlay.addEventListener('touchstart', closeMenu);
    
    // Navegación por teclado
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Manejar cambios de tamaño de ventana
    function handleResize() {
        if (window.innerWidth > 768 && hamburger.classList.contains('active')) {
            closeMenu();
        }
        ensureMobileVisibility();
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', function() {
        setTimeout(handleResize, 100);
    });
    
    // Prevenir scroll cuando el menú está abierto
    document.addEventListener('touchmove', function(e) {
        if (hamburger.classList.contains('active') && !navMenu.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Configurar atributos de accesibilidad
    hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'nav-menu');
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    navMenu.setAttribute('id', 'nav-menu');
    
    // Inicializar visibilidad móvil
    ensureMobileVisibility();
    
    // Verificar cada segundo si los elementos están visibles (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
        setInterval(function() {
            if (isMobile() && hamburger.style.display !== 'flex') {
                console.warn('⚠️ Hamburger no visible, corrigiendo...');
                ensureMobileVisibility();
            }
        }, 1000);
    }
    
    console.log('✅ Menú móvil inicializado correctamente');
    
    // Exponer funciones globalmente para debugging
    window.mobileMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        isOpen: () => hamburger.classList.contains('active'),
        ensureVisibility: ensureMobileVisibility
    };
});