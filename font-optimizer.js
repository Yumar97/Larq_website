// ===== OPTIMIZADOR DE FUENTES WEB =====
// Sistema para optimizar la carga y rendimiento de fuentes

class FontOptimizer {
    constructor() {
        this.loadedFonts = new Set();
        this.fontLoadPromises = new Map();
        this.init();
    }

    init() {
        this.preloadCriticalFonts();
        this.setupFontDisplay();
        this.optimizeGoogleFonts();
        this.setupFontLoadingStrategy();
    }

    // ===== PRELOAD DE FUENTES CRÍTICAS =====
    preloadCriticalFonts() {
        const criticalFonts = [
            {
                family: 'Inter',
                weights: ['400', '500', '600', '700'],
                display: 'swap'
            },
            {
                family: 'Poppins',
                weights: ['400', '500', '600', '700'],
                display: 'swap'
            }
        ];

        criticalFonts.forEach(font => {
            font.weights.forEach(weight => {
                this.preloadFont(font.family, weight, font.display);
            });
        });
    }

    preloadFont(family, weight = '400', display = 'swap') {
        // Crear link de preload
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        
        // URL optimizada para Google Fonts
        const fontUrl = this.generateOptimizedFontUrl(family, weight);
        link.href = fontUrl;
        
        document.head.appendChild(link);
    }

    generateOptimizedFontUrl(family, weight) {
        // Generar URL optimizada para Google Fonts con subsets latinos
        const baseUrl = 'https://fonts.gstatic.com/s/';
        const familySlug = family.toLowerCase().replace(/\s+/g, '');
        
        // En un entorno real, necesitarías las URLs exactas de Google Fonts
        // Por ahora, retornamos una URL de ejemplo
        return `${baseUrl}${familySlug}/v1/${familySlug}-${weight}.woff2`;
    }

    // ===== OPTIMIZACIÓN DE GOOGLE FONTS =====
    optimizeGoogleFonts() {
        // Reemplazar enlaces de Google Fonts existentes con versiones optimizadas
        const existingLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        
        existingLinks.forEach(link => {
            const optimizedLink = this.createOptimizedGoogleFontLink(link.href);
            if (optimizedLink) {
                link.parentNode.replaceChild(optimizedLink, link);
            }
        });
    }

    createOptimizedGoogleFontLink(originalHref) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.media = 'print';
        link.onload = function() { this.media = 'all'; };
        
        // Optimizar URL de Google Fonts
        let optimizedHref = originalHref;
        
        // Agregar font-display=swap si no está presente
        if (!optimizedHref.includes('display=')) {
            const separator = optimizedHref.includes('?') ? '&' : '?';
            optimizedHref += `${separator}display=swap`;
        }
        
        // Agregar subset latino para mejor rendimiento
        if (!optimizedHref.includes('subset=')) {
            const separator = optimizedHref.includes('?') ? '&' : '?';
            optimizedHref += `${separator}subset=latin,latin-ext`;
        }
        
        link.href = optimizedHref;
        return link;
    }

    // ===== ESTRATEGIA DE CARGA DE FUENTES =====
    setupFontLoadingStrategy() {
        // Usar Font Loading API si está disponible
        if ('fonts' in document) {
            this.useFontLoadingAPI();
        } else {
            this.useFallbackStrategy();
        }
    }

    useFontLoadingAPI() {
        const fontsToLoad = [
            { family: 'Inter', weight: '400' },
            { family: 'Inter', weight: '500' },
            { family: 'Inter', weight: '600' },
            { family: 'Inter', weight: '700' },
            { family: 'Poppins', weight: '400' },
            { family: 'Poppins', weight: '500' },
            { family: 'Poppins', weight: '600' },
            { family: 'Poppins', weight: '700' }
        ];

        fontsToLoad.forEach(font => {
            const fontFace = new FontFace(
                font.family,
                `url(${this.generateOptimizedFontUrl(font.family, font.weight)})`,
                { weight: font.weight, display: 'swap' }
            );

            const loadPromise = fontFace.load().then(loadedFont => {
                document.fonts.add(loadedFont);
                this.loadedFonts.add(`${font.family}-${font.weight}`);
                this.onFontLoaded(font.family, font.weight);
                return loadedFont;
            }).catch(error => {
                console.warn(`Failed to load font ${font.family} ${font.weight}:`, error);
                this.onFontError(font.family, font.weight);
            });

            this.fontLoadPromises.set(`${font.family}-${font.weight}`, loadPromise);
        });

        // Esperar a que se carguen las fuentes críticas
        this.waitForCriticalFonts();
    }

    useFallbackStrategy() {
        // Estrategia de fallback para navegadores sin Font Loading API
        const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const fallbackFont = 'monospace';
        const testSize = '72px';

        const fontsToTest = ['Inter', 'Poppins'];

        fontsToTest.forEach(fontFamily => {
            this.testFontLoad(fontFamily, fallbackFont, testString, testSize);
        });
    }

    testFontLoad(fontFamily, fallbackFont, testString, testSize) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Medir ancho con fuente de fallback
        context.font = `${testSize} ${fallbackFont}`;
        const fallbackWidth = context.measureText(testString).width;
        
        // Función para verificar si la fuente se cargó
        const checkFont = () => {
            context.font = `${testSize} ${fontFamily}, ${fallbackFont}`;
            const currentWidth = context.measureText(testString).width;
            
            if (currentWidth !== fallbackWidth) {
                this.onFontLoaded(fontFamily, '400');
                return true;
            }
            return false;
        };

        // Verificar inmediatamente
        if (!checkFont()) {
            // Si no se cargó, verificar periódicamente
            let attempts = 0;
            const maxAttempts = 50; // 5 segundos máximo
            
            const interval = setInterval(() => {
                attempts++;
                if (checkFont() || attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (attempts >= maxAttempts) {
                        this.onFontError(fontFamily, '400');
                    }
                }
            }, 100);
        }
    }

    // ===== CALLBACKS DE CARGA =====
    onFontLoaded(family, weight) {
        console.log(`✅ Font loaded: ${family} ${weight}`);
        
        // Agregar clase al body para indicar que la fuente se cargó
        document.body.classList.add(`font-${family.toLowerCase()}-loaded`);
        
        // Disparar evento personalizado
        const event = new CustomEvent('fontLoaded', {
            detail: { family, weight }
        });
        document.dispatchEvent(event);
    }

    onFontError(family, weight) {
        console.warn(`❌ Font failed to load: ${family} ${weight}`);
        
        // Agregar clase de error
        document.body.classList.add(`font-${family.toLowerCase()}-error`);
        
        // Usar fuente de fallback
        this.applyFallbackFont(family);
    }

    applyFallbackFont(family) {
        const fallbackFonts = {
            'Inter': 'system-ui, -apple-system, sans-serif',
            'Poppins': 'system-ui, -apple-system, sans-serif'
        };

        const fallback = fallbackFonts[family] || 'sans-serif';
        
        // Crear regla CSS de fallback
        const style = document.createElement('style');
        style.textContent = `
            * {
                font-family: ${fallback} !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== ESPERAR FUENTES CRÍTICAS =====
    async waitForCriticalFonts() {
        const criticalFonts = ['Inter-400', 'Inter-600', 'Poppins-400'];
        const criticalPromises = criticalFonts
            .map(font => this.fontLoadPromises.get(font))
            .filter(promise => promise);

        try {
            await Promise.allSettled(criticalPromises);
            document.body.classList.add('critical-fonts-loaded');
            
            // Remover skeleton loading si existe
            const skeletons = document.querySelectorAll('.font-skeleton');
            skeletons.forEach(skeleton => {
                skeleton.classList.remove('font-skeleton');
            });
            
        } catch (error) {
            console.warn('Some critical fonts failed to load:', error);
        }
    }

    // ===== FONT DISPLAY OPTIMIZATION =====
    setupFontDisplay() {
        // Agregar font-display: swap a todas las fuentes
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== UTILIDADES =====
    isFontLoaded(family, weight = '400') {
        return this.loadedFonts.has(`${family}-${weight}`);
    }

    async waitForFont(family, weight = '400') {
        const key = `${family}-${weight}`;
        if (this.fontLoadPromises.has(key)) {
            return await this.fontLoadPromises.get(key);
        }
        return null;
    }

    // ===== CLEANUP =====
    destroy() {
        this.loadedFonts.clear();
        this.fontLoadPromises.clear();
    }
}

// ===== ESTILOS PARA OPTIMIZACIÓN DE FUENTES =====
const fontOptimizationStyles = `
    /* Font loading optimization */
    body {
        font-display: swap;
    }
    
    /* Skeleton loading para texto */
    .font-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: fontLoading 1.5s infinite;
        color: transparent !important;
        border-radius: 4px;
    }
    
    @keyframes fontLoading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    /* Fallback fonts */
    .font-inter-error * {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    
    .font-poppins-error * {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    
    /* Optimización de renderizado */
    * {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    /* Prevenir FOIT (Flash of Invisible Text) */
    .critical-fonts-loaded h1,
    .critical-fonts-loaded h2,
    .critical-fonts-loaded h3,
    .critical-fonts-loaded .nav-link {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    /* Mientras se cargan las fuentes críticas */
    body:not(.critical-fonts-loaded) h1,
    body:not(.critical-fonts-loaded) h2,
    body:not(.critical-fonts-loaded) h3,
    body:not(.critical-fonts-loaded) .nav-link {
        opacity: 0.8;
        font-family: system-ui, sans-serif;
    }
`;

// Inyectar estilos
const fontStyleSheet = document.createElement('style');
fontStyleSheet.textContent = fontOptimizationStyles;
document.head.appendChild(fontStyleSheet);

// Exportar para uso global
window.FontOptimizer = FontOptimizer;

console.log('🔤 Font Optimizer cargado correctamente');