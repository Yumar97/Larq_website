// ===== SUITE DE TESTING AUTOMATIZADO =====
// Sistema completo de testing para validar optimizaciones

class TestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.startTime = null;
        this.init();
    }

    init() {
        this.setupTestEnvironment();
        this.registerTests();
        this.createTestUI();
    }

    // ===== CONFIGURACIÓN DEL ENTORNO DE TESTING =====
    setupTestEnvironment() {
        // Crear contenedor para resultados de tests
        this.testContainer = document.createElement('div');
        this.testContainer.id = 'test-suite-container';
        this.testContainer.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            overflow-y: auto;
            display: none;
        `;
        document.body.appendChild(this.testContainer);

        // Agregar botón para mostrar/ocultar tests
        this.createToggleButton();
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.textContent = '🧪 Tests';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 50px;
            cursor: pointer;
            z-index: 10001;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        `;
        
        button.addEventListener('click', () => {
            const isVisible = this.testContainer.style.display !== 'none';
            this.testContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                this.runAllTests();
            }
        });
        
        document.body.appendChild(button);
    }

    // ===== REGISTRO DE TESTS =====
    registerTests() {
        // Tests de rendimiento
        this.addTest('Performance - First Contentful Paint', this.testFCP.bind(this));
        this.addTest('Performance - Largest Contentful Paint', this.testLCP.bind(this));
        this.addTest('Performance - Cumulative Layout Shift', this.testCLS.bind(this));
        
        // Tests de SEO
        this.addTest('SEO - Meta Description', this.testMetaDescription.bind(this));
        this.addTest('SEO - Title Tag', this.testTitleTag.bind(this));
        this.addTest('SEO - Structured Data', this.testStructuredData.bind(this));
        this.addTest('SEO - Open Graph', this.testOpenGraph.bind(this));
        
        // Tests de accesibilidad
        this.addTest('Accessibility - Alt Text', this.testAltText.bind(this));
        this.addTest('Accessibility - ARIA Labels', this.testAriaLabels.bind(this));
        this.addTest('Accessibility - Color Contrast', this.testColorContrast.bind(this));
        
        // Tests de optimización
        this.addTest('Optimization - Service Worker', this.testServiceWorker.bind(this));
        this.addTest('Optimization - Lazy Loading', this.testLazyLoading.bind(this));
        this.addTest('Optimization - Font Loading', this.testFontLoading.bind(this));
        
        // Tests de funcionalidad
        this.addTest('Functionality - Navigation', this.testNavigation.bind(this));
        this.addTest('Functionality - Forms', this.testForms.bind(this));
        this.addTest('Functionality - Modal', this.testModal.bind(this));
    }

    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    // ===== TESTS DE RENDIMIENTO =====
    async testFCP() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
                    if (fcpEntry) {
                        const fcp = fcpEntry.startTime;
                        observer.disconnect();
                        resolve({
                            passed: fcp < 1800, // 1.8 segundos
                            value: `${Math.round(fcp)}ms`,
                            expected: '< 1800ms'
                        });
                    }
                });
                observer.observe({ entryTypes: ['paint'] });
                
                // Timeout después de 5 segundos
                setTimeout(() => {
                    observer.disconnect();
                    resolve({ passed: false, value: 'Timeout', expected: '< 1800ms' });
                }, 5000);
            } else {
                resolve({ passed: false, value: 'Not supported', expected: 'PerformanceObserver support' });
            }
        });
    }

    async testLCP() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    if (lastEntry) {
                        const lcp = lastEntry.startTime;
                        resolve({
                            passed: lcp < 2500, // 2.5 segundos
                            value: `${Math.round(lcp)}ms`,
                            expected: '< 2500ms'
                        });
                    }
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
                
                setTimeout(() => {
                    observer.disconnect();
                    resolve({ passed: false, value: 'Timeout', expected: '< 2500ms' });
                }, 5000);
            } else {
                resolve({ passed: false, value: 'Not supported', expected: 'PerformanceObserver support' });
            }
        });
    }

    async testCLS() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                });
                observer.observe({ entryTypes: ['layout-shift'] });
                
                setTimeout(() => {
                    observer.disconnect();
                    resolve({
                        passed: clsValue < 0.1,
                        value: clsValue.toFixed(3),
                        expected: '< 0.1'
                    });
                }, 3000);
            } else {
                resolve({ passed: false, value: 'Not supported', expected: 'PerformanceObserver support' });
            }
        });
    }

    // ===== TESTS DE SEO =====
    async testMetaDescription() {
        const metaDesc = document.querySelector('meta[name="description"]');
        const content = metaDesc ? metaDesc.content : '';
        
        return {
            passed: content.length >= 120 && content.length <= 160,
            value: `${content.length} chars`,
            expected: '120-160 chars',
            details: content.substring(0, 50) + '...'
        };
    }

    async testTitleTag() {
        const title = document.title;
        
        return {
            passed: title.length >= 30 && title.length <= 60,
            value: `${title.length} chars`,
            expected: '30-60 chars',
            details: title
        };
    }

    async testStructuredData() {
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        let validStructuredData = 0;
        
        jsonLdScripts.forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                if (data['@context'] && data['@type']) {
                    validStructuredData++;
                }
            } catch (e) {
                // Invalid JSON
            }
        });
        
        return {
            passed: validStructuredData > 0,
            value: `${validStructuredData} schemas`,
            expected: '> 0 schemas'
        };
    }

    async testOpenGraph() {
        const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
        const foundTags = ogTags.filter(tag => 
            document.querySelector(`meta[property="${tag}"]`)
        );
        
        return {
            passed: foundTags.length === ogTags.length,
            value: `${foundTags.length}/${ogTags.length} tags`,
            expected: '4/4 tags'
        };
    }

    // ===== TESTS DE ACCESIBILIDAD =====
    async testAltText() {
        const images = document.querySelectorAll('img');
        const imagesWithAlt = Array.from(images).filter(img => 
            img.alt && img.alt.trim() !== ''
        );
        
        return {
            passed: imagesWithAlt.length === images.length,
            value: `${imagesWithAlt.length}/${images.length} images`,
            expected: 'All images with alt text'
        };
    }

    async testAriaLabels() {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        const elementsWithAria = Array.from(interactiveElements).filter(el => 
            el.getAttribute('aria-label') || 
            el.getAttribute('aria-labelledby') || 
            el.textContent.trim() !== ''
        );
        
        return {
            passed: elementsWithAria.length >= interactiveElements.length * 0.9, // 90% threshold
            value: `${elementsWithAria.length}/${interactiveElements.length} elements`,
            expected: '90%+ with labels'
        };
    }

    async testColorContrast() {
        // Simplified contrast test - checks for common good practices
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        // Basic check - if background is light and text is dark (or vice versa)
        const hasGoodContrast = (backgroundColor.includes('255') && color.includes('0')) ||
                               (backgroundColor.includes('0') && color.includes('255'));
        
        return {
            passed: hasGoodContrast,
            value: `bg: ${backgroundColor}, text: ${color}`,
            expected: 'Good contrast ratio'
        };
    }

    // ===== TESTS DE OPTIMIZACIÓN =====
    async testServiceWorker() {
        const swRegistered = 'serviceWorker' in navigator && 
                           navigator.serviceWorker.controller;
        
        return {
            passed: swRegistered,
            value: swRegistered ? 'Active' : 'Not active',
            expected: 'Service Worker active'
        };
    }

    async testLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const totalImages = document.querySelectorAll('img').length;
        
        return {
            passed: lazyImages.length > 0,
            value: `${lazyImages.length}/${totalImages} images`,
            expected: 'Lazy loading implemented'
        };
    }

    async testFontLoading() {
        const preloadFonts = document.querySelectorAll('link[rel="preload"][as="font"]');
        const fontDisplaySwap = document.fonts ? document.fonts.size > 0 : false;
        
        return {
            passed: preloadFonts.length > 0 || fontDisplaySwap,
            value: `${preloadFonts.length} preloaded`,
            expected: 'Font optimization active'
        };
    }

    // ===== TESTS DE FUNCIONALIDAD =====
    async testNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const hamburger = document.querySelector('.hamburger');
        
        return {
            passed: navLinks.length > 0 && hamburger !== null,
            value: `${navLinks.length} links, hamburger: ${hamburger ? 'Yes' : 'No'}`,
            expected: 'Navigation functional'
        };
    }

    async testForms() {
        const forms = document.querySelectorAll('form');
        const formInputs = document.querySelectorAll('form input, form textarea, form select');
        
        return {
            passed: forms.length > 0 && formInputs.length > 0,
            value: `${forms.length} forms, ${formInputs.length} inputs`,
            expected: 'Forms present and functional'
        };
    }

    async testModal() {
        const modal = document.getElementById('projectModal');
        const modalTriggers = document.querySelectorAll('[data-project]');
        
        return {
            passed: modal !== null && modalTriggers.length > 0,
            value: `Modal: ${modal ? 'Yes' : 'No'}, Triggers: ${modalTriggers.length}`,
            expected: 'Modal system functional'
        };
    }

    // ===== EJECUCIÓN DE TESTS =====
    async runAllTests() {
        this.startTime = performance.now();
        this.results = [];
        
        this.updateUI('🧪 Ejecutando tests...', 'info');
        
        for (const test of this.tests) {
            try {
                const result = await test.testFunction();
                this.results.push({
                    name: test.name,
                    ...result,
                    status: result.passed ? 'PASS' : 'FAIL'
                });
                
                this.updateTestResult(test.name, result);
            } catch (error) {
                this.results.push({
                    name: test.name,
                    passed: false,
                    status: 'ERROR',
                    value: error.message,
                    expected: 'No errors'
                });
                
                this.updateTestResult(test.name, { passed: false, value: error.message });
            }
        }
        
        this.showSummary();
    }

    updateTestResult(testName, result) {
        const status = result.passed ? '✅' : '❌';
        const color = result.passed ? '#28a745' : '#dc3545';
        
        this.updateUI(`${status} ${testName}: ${result.value}`, 'result', color);
    }

    showSummary() {
        const endTime = performance.now();
        const duration = Math.round(endTime - this.startTime);
        
        const passed = this.results.filter(r => r.passed).length;
        const total = this.results.length;
        const percentage = Math.round((passed / total) * 100);
        
        const summaryColor = percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545';
        
        this.updateUI(`\n📊 RESUMEN: ${passed}/${total} tests pasaron (${percentage}%)`, 'summary', summaryColor);
        this.updateUI(`⏱️ Tiempo total: ${duration}ms`, 'info');
        
        // Generar reporte detallado
        this.generateDetailedReport();
    }

    generateDetailedReport() {
        const report = {
            timestamp: new Date().toISOString(),
            duration: Math.round(performance.now() - this.startTime),
            results: this.results,
            summary: {
                total: this.results.length,
                passed: this.results.filter(r => r.passed).length,
                failed: this.results.filter(r => !r.passed).length,
                percentage: Math.round((this.results.filter(r => r.passed).length / this.results.length) * 100)
            }
        };
        
        // Guardar en localStorage para debugging
        localStorage.setItem('larq-test-report', JSON.stringify(report, null, 2));
        
        console.log('📊 Test Report:', report);
    }

    // ===== UI HELPERS =====
    createTestUI() {
        this.testContainer.innerHTML = `
            <div style="padding: 15px; border-bottom: 2px solid #007bff; background: #f8f9fa;">
                <h3 style="margin: 0; color: #007bff;">🧪 Test Suite - Larq Arquitectura</h3>
                <small style="color: #6c757d;">Validación automática de optimizaciones</small>
            </div>
            <div id="test-results" style="padding: 10px; max-height: 400px; overflow-y: auto;">
                <p style="color: #6c757d; font-style: italic;">Haz clic en "🧪 Tests" para ejecutar la suite completa</p>
            </div>
            <div style="padding: 10px; border-top: 1px solid #dee2e6; background: #f8f9fa; text-align: center;">
                <button onclick="window.testSuite.runAllTests()" style="
                    background: #007bff; color: white; border: none; 
                    padding: 8px 16px; border-radius: 4px; cursor: pointer;
                ">▶️ Ejecutar Tests</button>
                <button onclick="window.testSuite.exportReport()" style="
                    background: #28a745; color: white; border: none; 
                    padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 8px;
                ">📄 Exportar Reporte</button>
            </div>
        `;
    }

    updateUI(message, type = 'info', color = '#333') {
        const resultsContainer = document.getElementById('test-results');
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            margin: 5px 0;
            padding: 5px;
            border-radius: 3px;
            color: ${color};
            background: ${type === 'summary' ? '#f8f9fa' : 'transparent'};
            border-left: ${type === 'result' ? '3px solid ' + color : 'none'};
            padding-left: ${type === 'result' ? '10px' : '5px'};
            font-weight: ${type === 'summary' ? 'bold' : 'normal'};
        `;
        messageElement.textContent = message;
        resultsContainer.appendChild(messageElement);
        
        // Auto-scroll to bottom
        resultsContainer.scrollTop = resultsContainer.scrollHeight;
    }

    exportReport() {
        const report = localStorage.getItem('larq-test-report');
        if (report) {
            const blob = new Blob([report], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `larq-test-report-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', () => {
    // Solo cargar en desarrollo o cuando se solicite específicamente
    const urlParams = new URLSearchParams(window.location.search);
    const isDev = urlParams.has('test') || window.location.hostname === 'localhost';
    
    if (isDev) {
        window.testSuite = new TestSuite();
        console.log('🧪 Test Suite cargado. Usa el botón flotante para ejecutar tests.');
    }
});

// Exportar para uso global
window.TestSuite = TestSuite;

console.log('🧪 Test Suite disponible');