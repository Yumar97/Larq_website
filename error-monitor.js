// ===== SISTEMA DE MONITOREO DE ERRORES =====
// Detección y reporte automático de errores en tiempo real

class ErrorMonitor {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.performance = [];
        this.maxErrors = 50;
        this.isEnabled = true;
        this.init();
    }

    init() {
        this.setupErrorHandlers();
        this.setupPerformanceMonitoring();
        this.setupConsoleOverride();
        this.createErrorUI();
        this.startHealthCheck();
    }

    // ===== MANEJO DE ERRORES =====
    setupErrorHandlers() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error ? event.error.stack : null,
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
        });

        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'Unhandled Promise Rejection',
                message: event.reason ? event.reason.toString() : 'Unknown promise rejection',
                stack: event.reason ? event.reason.stack : null,
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.logError({
                    type: 'Resource Loading Error',
                    message: `Failed to load: ${event.target.src || event.target.href}`,
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                });
            }
        }, true);

        // Network errors
        this.monitorNetworkErrors();
    }

    monitorNetworkErrors() {
        // Override fetch to monitor network errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                if (!response.ok) {
                    this.logError({
                        type: 'Network Error',
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        url: args[0],
                        status: response.status,
                        timestamp: new Date().toISOString()
                    });
                }
                
                return response;
            } catch (error) {
                this.logError({
                    type: 'Network Error',
                    message: error.message,
                    url: args[0],
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        };
    }

    // ===== MONITOREO DE RENDIMIENTO =====
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Monitor memory usage
        this.monitorMemoryUsage();
    }

    monitorCoreWebVitals() {
        if ('PerformanceObserver' in window) {
            // First Contentful Paint
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.logPerformance({
                            metric: 'First Contentful Paint',
                            value: Math.round(entry.startTime),
                            threshold: 1800,
                            status: entry.startTime < 1800 ? 'good' : 'poor',
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }).observe({ entryTypes: ['paint'] });

            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.logPerformance({
                    metric: 'Largest Contentful Paint',
                    value: Math.round(lastEntry.startTime),
                    threshold: 2500,
                    status: lastEntry.startTime < 2500 ? 'good' : 'poor',
                    timestamp: new Date().toISOString()
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // Cumulative Layout Shift
            let clsValue = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                this.logPerformance({
                    metric: 'Cumulative Layout Shift',
                    value: parseFloat(clsValue.toFixed(3)),
                    threshold: 0.1,
                    status: clsValue < 0.1 ? 'good' : 'poor',
                    timestamp: new Date().toISOString()
                });
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    monitorResourceLoading() {
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 3000) { // Resources taking more than 3 seconds
                        this.logWarning({
                            type: 'Slow Resource',
                            message: `Slow loading resource: ${entry.name}`,
                            duration: Math.round(entry.duration),
                            size: entry.transferSize || 'unknown',
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }).observe({ entryTypes: ['resource'] });
        }
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
                
                if (usedPercent > 80) {
                    this.logWarning({
                        type: 'High Memory Usage',
                        message: `Memory usage at ${usedPercent.toFixed(1)}%`,
                        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
                        timestamp: new Date().toISOString()
                    });
                }
            }, 30000); // Check every 30 seconds
        }
    }

    // ===== OVERRIDE DE CONSOLE =====
    setupConsoleOverride() {
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = (...args) => {
            this.logError({
                type: 'Console Error',
                message: args.join(' '),
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            this.logWarning({
                type: 'Console Warning',
                message: args.join(' '),
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
            originalWarn.apply(console, args);
        };
    }

    // ===== LOGGING =====
    logError(error) {
        if (!this.isEnabled) return;

        this.errors.unshift(error);
        if (this.errors.length > this.maxErrors) {
            this.errors.pop();
        }

        // Update UI
        this.updateErrorCount();
        
        // Store in localStorage for persistence
        this.saveToStorage();
        
        // Send to analytics (if configured)
        this.sendToAnalytics('error', error);
        
        console.group('🚨 Error Monitor');
        console.error('Error detected:', error);
        console.groupEnd();
    }

    logWarning(warning) {
        if (!this.isEnabled) return;

        this.warnings.unshift(warning);
        if (this.warnings.length > this.maxErrors) {
            this.warnings.pop();
        }

        this.updateErrorCount();
        this.saveToStorage();
        
        console.group('⚠️ Warning Monitor');
        console.warn('Warning detected:', warning);
        console.groupEnd();
    }

    logPerformance(metric) {
        this.performance.unshift(metric);
        if (this.performance.length > this.maxErrors) {
            this.performance.pop();
        }

        this.saveToStorage();
        
        if (metric.status === 'poor') {
            console.group('📊 Performance Monitor');
            console.warn(`Poor performance detected: ${metric.metric} = ${metric.value}ms (threshold: ${metric.threshold}ms)`);
            console.groupEnd();
        }
    }

    // ===== UI =====
    createErrorUI() {
        // Create floating error indicator
        this.errorIndicator = document.createElement('div');
        this.errorIndicator.id = 'error-monitor-indicator';
        this.errorIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #28a745;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10000;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        this.errorIndicator.innerHTML = '✅ 0 errors';
        
        this.errorIndicator.addEventListener('click', () => {
            this.showErrorPanel();
        });
        
        document.body.appendChild(this.errorIndicator);

        // Create error panel
        this.createErrorPanel();
    }

    createErrorPanel() {
        this.errorPanel = document.createElement('div');
        this.errorPanel.id = 'error-monitor-panel';
        this.errorPanel.style.cssText = `
            position: fixed;
            top: 60px;
            left: 20px;
            width: 500px;
            max-height: 70vh;
            background: white;
            border: 2px solid #dc3545;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            display: none;
            overflow: hidden;
        `;

        this.errorPanel.innerHTML = `
            <div style="padding: 15px; background: #dc3545; color: white; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">🚨 Error Monitor</h3>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="
                    background: none; border: none; color: white; font-size: 18px; cursor: pointer;
                ">×</button>
            </div>
            <div style="display: flex; border-bottom: 1px solid #dee2e6;">
                <button class="tab-btn active" onclick="window.errorMonitor.showTab('errors')" style="
                    flex: 1; padding: 10px; border: none; background: #f8f9fa; cursor: pointer;
                ">Errors (<span id="error-count">0</span>)</button>
                <button class="tab-btn" onclick="window.errorMonitor.showTab('warnings')" style="
                    flex: 1; padding: 10px; border: none; background: white; cursor: pointer;
                ">Warnings (<span id="warning-count">0</span>)</button>
                <button class="tab-btn" onclick="window.errorMonitor.showTab('performance')" style="
                    flex: 1; padding: 10px; border: none; background: white; cursor: pointer;
                ">Performance (<span id="performance-count">0</span>)</button>
            </div>
            <div id="error-content" style="padding: 10px; max-height: 400px; overflow-y: auto;">
                <p style="color: #6c757d; font-style: italic;">No errors detected</p>
            </div>
            <div style="padding: 10px; border-top: 1px solid #dee2e6; background: #f8f9fa; text-align: center;">
                <button onclick="window.errorMonitor.clearAll()" style="
                    background: #6c757d; color: white; border: none; 
                    padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;
                ">Clear All</button>
                <button onclick="window.errorMonitor.exportErrors()" style="
                    background: #007bff; color: white; border: none; 
                    padding: 6px 12px; border-radius: 4px; cursor: pointer;
                ">Export Report</button>
            </div>
        `;

        document.body.appendChild(this.errorPanel);
    }

    updateErrorCount() {
        const totalErrors = this.errors.length;
        const totalWarnings = this.warnings.length;
        const total = totalErrors + totalWarnings;

        // Update indicator
        if (total === 0) {
            this.errorIndicator.style.background = '#28a745';
            this.errorIndicator.innerHTML = '✅ 0 errors';
        } else if (totalErrors > 0) {
            this.errorIndicator.style.background = '#dc3545';
            this.errorIndicator.innerHTML = `🚨 ${totalErrors} errors`;
        } else {
            this.errorIndicator.style.background = '#ffc107';
            this.errorIndicator.innerHTML = `⚠️ ${totalWarnings} warnings`;
        }

        // Update panel counts
        const errorCount = document.getElementById('error-count');
        const warningCount = document.getElementById('warning-count');
        const performanceCount = document.getElementById('performance-count');

        if (errorCount) errorCount.textContent = this.errors.length;
        if (warningCount) warningCount.textContent = this.warnings.length;
        if (performanceCount) performanceCount.textContent = this.performance.length;
    }

    showErrorPanel() {
        this.errorPanel.style.display = 'block';
        this.showTab('errors');
    }

    showTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.style.background = 'white';
            btn.classList.remove('active');
        });
        event.target.style.background = '#f8f9fa';
        event.target.classList.add('active');

        // Show content
        const content = document.getElementById('error-content');
        let items = [];

        switch (tab) {
            case 'errors':
                items = this.errors;
                break;
            case 'warnings':
                items = this.warnings;
                break;
            case 'performance':
                items = this.performance;
                break;
        }

        if (items.length === 0) {
            content.innerHTML = `<p style="color: #6c757d; font-style: italic;">No ${tab} detected</p>`;
        } else {
            content.innerHTML = items.map(item => this.formatItem(item, tab)).join('');
        }
    }

    formatItem(item, type) {
        const time = new Date(item.timestamp).toLocaleTimeString();
        let content = '';

        if (type === 'performance') {
            const statusColor = item.status === 'good' ? '#28a745' : '#dc3545';
            content = `
                <div style="border: 1px solid #dee2e6; border-radius: 4px; padding: 8px; margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong style="color: ${statusColor};">${item.metric}</strong>
                        <small style="color: #6c757d;">${time}</small>
                    </div>
                    <div>Value: ${item.value}ms (threshold: ${item.threshold}ms)</div>
                    <div style="color: ${statusColor};">Status: ${item.status}</div>
                </div>
            `;
        } else {
            content = `
                <div style="border: 1px solid #dee2e6; border-radius: 4px; padding: 8px; margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${item.type}</strong>
                        <small style="color: #6c757d;">${time}</small>
                    </div>
                    <div style="margin: 4px 0;">${item.message}</div>
                    ${item.filename ? `<div style="font-size: 10px; color: #6c757d;">File: ${item.filename}:${item.line}</div>` : ''}
                    ${item.stack ? `<details style="margin-top: 4px;"><summary style="cursor: pointer;">Stack Trace</summary><pre style="font-size: 10px; margin: 4px 0; white-space: pre-wrap;">${item.stack}</pre></details>` : ''}
                </div>
            `;
        }

        return content;
    }

    // ===== UTILIDADES =====
    clearAll() {
        this.errors = [];
        this.warnings = [];
        this.performance = [];
        this.updateErrorCount();
        this.saveToStorage();
        this.showTab('errors');
    }

    exportErrors() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            errors: this.errors,
            warnings: this.warnings,
            performance: this.performance,
            summary: {
                totalErrors: this.errors.length,
                totalWarnings: this.warnings.length,
                totalPerformanceIssues: this.performance.filter(p => p.status === 'poor').length
            }
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    saveToStorage() {
        try {
            localStorage.setItem('larq-error-monitor', JSON.stringify({
                errors: this.errors.slice(0, 10), // Save only last 10
                warnings: this.warnings.slice(0, 10),
                performance: this.performance.slice(0, 10)
            }));
        } catch (e) {
            // Storage full or not available
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('larq-error-monitor');
            if (data) {
                const parsed = JSON.parse(data);
                this.errors = parsed.errors || [];
                this.warnings = parsed.warnings || [];
                this.performance = parsed.performance || [];
                this.updateErrorCount();
            }
        } catch (e) {
            // Invalid data
        }
    }

    sendToAnalytics(type, data) {
        // Placeholder for analytics integration
        // In production, send to your analytics service
        if (window.gtag) {
            gtag('event', 'exception', {
                description: data.message,
                fatal: type === 'error'
            });
        }
    }

    // ===== HEALTH CHECK =====
    startHealthCheck() {
        setInterval(() => {
            this.performHealthCheck();
        }, 60000); // Every minute
    }

    performHealthCheck() {
        const checks = {
            serviceWorker: 'serviceWorker' in navigator && navigator.serviceWorker.controller,
            localStorage: this.testLocalStorage(),
            performance: 'performance' in window,
            fetch: 'fetch' in window,
            intersectionObserver: 'IntersectionObserver' in window
        };

        const failedChecks = Object.entries(checks).filter(([key, value]) => !value);
        
        if (failedChecks.length > 0) {
            this.logWarning({
                type: 'Health Check Failed',
                message: `Failed checks: ${failedChecks.map(([key]) => key).join(', ')}`,
                timestamp: new Date().toISOString()
            });
        }
    }

    testLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    // ===== CONTROL =====
    enable() {
        this.isEnabled = true;
        this.errorIndicator.style.display = 'block';
    }

    disable() {
        this.isEnabled = false;
        this.errorIndicator.style.display = 'none';
        this.errorPanel.style.display = 'none';
    }
}

// ===== INICIALIZACI��N =====
document.addEventListener('DOMContentLoaded', () => {
    window.errorMonitor = new ErrorMonitor();
    window.errorMonitor.loadFromStorage();
    
    console.log('🚨 Error Monitor activo. Haz clic en el indicador para ver detalles.');
});

// Exportar para uso global
window.ErrorMonitor = ErrorMonitor;

console.log('🚨 Error Monitor cargado correctamente');