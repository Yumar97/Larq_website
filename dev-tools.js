// ===== HERRAMIENTAS DE DESARROLLO =====
// Panel de desarrollo para debugging y optimización

class DevTools {
    constructor() {
        this.isOpen = false;
        this.activeTab = 'performance';
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.createDevPanel();
        this.setupKeyboardShortcuts();
        this.startMonitoring();
    }

    // ===== PANEL DE DESARROLLO =====
    createDevPanel() {
        this.devPanel = document.createElement('div');
        this.devPanel.id = 'dev-tools-panel';
        this.devPanel.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 400px;
            background: #1e1e1e;
            color: #d4d4d4;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            border-top: 3px solid #007acc;
            z-index: 10000;
            transform: translateY(100%);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
        `;

        this.devPanel.innerHTML = `
            <div class="dev-header" style="
                background: #2d2d30;
                padding: 10px 15px;
                border-bottom: 1px solid #3e3e42;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div class="dev-tabs" style="display: flex; gap: 10px;">
                    <button class="dev-tab active" data-tab="performance">📊 Performance</button>
                    <button class="dev-tab" data-tab="network">🌐 Network</button>
                    <button class="dev-tab" data-tab="storage">💾 Storage</button>
                    <button class="dev-tab" data-tab="console">🖥️ Console</button>
                    <button class="dev-tab" data-tab="seo">🔍 SEO</button>
                </div>
                <div class="dev-controls" style="display: flex; gap: 10px; align-items: center;">
                    <button id="clear-dev-data" style="
                        background: #dc3545; color: white; border: none; 
                        padding: 4px 8px; border-radius: 3px; cursor: pointer;
                    ">Clear</button>
                    <button id="export-dev-data" style="
                        background: #28a745; color: white; border: none; 
                        padding: 4px 8px; border-radius: 3px; cursor: pointer;
                    ">Export</button>
                    <button id="close-dev-tools" style="
                        background: none; border: none; color: #d4d4d4; 
                        font-size: 16px; cursor: pointer;
                    ">×</button>
                </div>
            </div>
            <div class="dev-content" style="
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            ">
                <div id="dev-tab-performance" class="dev-tab-content">
                    <div class="metrics-grid" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 15px;
                        margin-bottom: 20px;
                    ">
                        <div class="metric-card">
                            <h4 style="margin: 0 0 8px 0; color: #569cd6;">Core Web Vitals</h4>
                            <div id="cwv-metrics"></div>
                        </div>
                        <div class="metric-card">
                            <h4 style="margin: 0 0 8px 0; color: #569cd6;">Resource Timing</h4>
                            <div id="resource-metrics"></div>
                        </div>
                        <div class="metric-card">
                            <h4 style="margin: 0 0 8px 0; color: #569cd6;">Memory Usage</h4>
                            <div id="memory-metrics"></div>
                        </div>
                    </div>
                    <div class="performance-chart">
                        <h4 style="color: #569cd6;">Performance Timeline</h4>
                        <div id="performance-timeline" style="
                            background: #252526;
                            padding: 10px;
                            border-radius: 4px;
                            min-height: 100px;
                        "></div>
                    </div>
                </div>
                
                <div id="dev-tab-network" class="dev-tab-content" style="display: none;">
                    <div class="network-summary" style="margin-bottom: 15px;">
                        <h4 style="color: #569cd6;">Network Summary</h4>
                        <div id="network-summary"></div>
                    </div>
                    <div class="network-requests">
                        <h4 style="color: #569cd6;">Recent Requests</h4>
                        <div id="network-requests" style="
                            background: #252526;
                            padding: 10px;
                            border-radius: 4px;
                            max-height: 200px;
                            overflow-y: auto;
                        "></div>
                    </div>
                </div>
                
                <div id="dev-tab-storage" class="dev-tab-content" style="display: none;">
                    <div class="storage-grid" style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                    ">
                        <div>
                            <h4 style="color: #569cd6;">LocalStorage</h4>
                            <div id="localStorage-content" style="
                                background: #252526;
                                padding: 10px;
                                border-radius: 4px;
                                max-height: 150px;
                                overflow-y: auto;
                            "></div>
                        </div>
                        <div>
                            <h4 style="color: #569cd6;">SessionStorage</h4>
                            <div id="sessionStorage-content" style="
                                background: #252526;
                                padding: 10px;
                                border-radius: 4px;
                                max-height: 150px;
                                overflow-y: auto;
                            "></div>
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <h4 style="color: #569cd6;">Cache Status</h4>
                        <div id="cache-status" style="
                            background: #252526;
                            padding: 10px;
                            border-radius: 4px;
                        "></div>
                    </div>
                </div>
                
                <div id="dev-tab-console" class="dev-tab-content" style="display: none;">
                    <div class="console-controls" style="margin-bottom: 10px;">
                        <button id="clear-console" style="
                            background: #6c757d; color: white; border: none; 
                            padding: 4px 8px; border-radius: 3px; cursor: pointer;
                        ">Clear Console</button>
                    </div>
                    <div id="console-output" style="
                        background: #252526;
                        padding: 10px;
                        border-radius: 4px;
                        height: 250px;
                        overflow-y: auto;
                        font-family: 'Courier New', monospace;
                    "></div>
                </div>
                
                <div id="dev-tab-seo" class="dev-tab-content" style="display: none;">
                    <div class="seo-grid" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 15px;
                    ">
                        <div class="seo-card">
                            <h4 style="margin: 0 0 8px 0; color: #569cd6;">Meta Tags</h4>
                            <div id="seo-meta"></div>
                        </div>
                        <div class="seo-card">
                            <h4 style="margin: 0 0 8px 0; color: #569cd6;">Structured Data</h4>
                            <div id="seo-structured"></div>
                        </div>
                        <div class="seo-card">
                            <h4 style="margin: 0 0 8px 0; color: #569cd6;">Images</h4>
                            <div id="seo-images"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.devPanel);
        this.setupDevPanelEvents();
    }

    setupDevPanelEvents() {
        // Tab switching
        this.devPanel.querySelectorAll('.dev-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Controls
        document.getElementById('close-dev-tools').addEventListener('click', () => {
            this.toggle();
        });

        document.getElementById('clear-dev-data').addEventListener('click', () => {
            this.clearData();
        });

        document.getElementById('export-dev-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('clear-console').addEventListener('click', () => {
            document.getElementById('console-output').innerHTML = '';
        });
    }

    // ===== ATAJOS DE TECLADO =====
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // F12 or Ctrl+Shift+I
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                this.toggle();
            }
            
            // Ctrl+Shift+C for console
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.toggle();
                this.switchTab('console');
            }
        });
    }

    // ===== MONITOREO =====
    startMonitoring() {
        this.monitorPerformance();
        this.monitorNetwork();
        this.monitorStorage();
        this.monitorConsole();
        this.monitorSEO();
    }

    monitorPerformance() {
        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            // FCP
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.updateMetric('fcp', Math.round(entry.startTime));
                    }
                }
            }).observe({ entryTypes: ['paint'] });

            // LCP
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.updateMetric('lcp', Math.round(lastEntry.startTime));
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Memory monitoring
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.updateMemoryMetrics(memory);
            }, 5000);
        }
    }

    monitorNetwork() {
        // Override fetch to monitor requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                this.logNetworkRequest({
                    url: args[0],
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    duration: Math.round(endTime - startTime),
                    timestamp: new Date().toISOString()
                });
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                this.logNetworkRequest({
                    url: args[0],
                    method: args[1]?.method || 'GET',
                    status: 'Error',
                    duration: Math.round(endTime - startTime),
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        };
    }

    monitorStorage() {
        // Monitor localStorage changes
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            originalSetItem.call(this, key, value);
            if (window.devTools) {
                window.devTools.updateStorageDisplay();
            }
        };
    }

    monitorConsole() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            this.addConsoleMessage('log', args.join(' '));
            originalLog.apply(console, args);
        };

        console.error = (...args) => {
            this.addConsoleMessage('error', args.join(' '));
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            this.addConsoleMessage('warn', args.join(' '));
            originalWarn.apply(console, args);
        };
    }

    monitorSEO() {
        // Monitor SEO elements
        setInterval(() => {
            this.updateSEOMetrics();
        }, 10000); // Every 10 seconds
    }

    // ===== ACTUALIZACIONES DE UI =====
    updateMetric(metric, value) {
        const cwvContainer = document.getElementById('cwv-metrics');
        if (!cwvContainer) return;

        const metricNames = {
            fcp: 'First Contentful Paint',
            lcp: 'Largest Contentful Paint',
            cls: 'Cumulative Layout Shift'
        };

        const thresholds = {
            fcp: 1800,
            lcp: 2500,
            cls: 0.1
        };

        const status = value < thresholds[metric] ? 'good' : 'poor';
        const color = status === 'good' ? '#28a745' : '#dc3545';

        const existingMetric = cwvContainer.querySelector(`[data-metric="${metric}"]`);
        if (existingMetric) {
            existingMetric.innerHTML = `
                <span style="color: ${color};">${metricNames[metric]}: ${value}${metric === 'cls' ? '' : 'ms'}</span>
            `;
        } else {
            const metricDiv = document.createElement('div');
            metricDiv.setAttribute('data-metric', metric);
            metricDiv.innerHTML = `
                <span style="color: ${color};">${metricNames[metric]}: ${value}${metric === 'cls' ? '' : 'ms'}</span>
            `;
            cwvContainer.appendChild(metricDiv);
        }
    }

    updateMemoryMetrics(memory) {
        const memoryContainer = document.getElementById('memory-metrics');
        if (!memoryContainer) return;

        const used = Math.round(memory.usedJSHeapSize / 1048576); // MB
        const total = Math.round(memory.totalJSHeapSize / 1048576); // MB
        const limit = Math.round(memory.jsHeapSizeLimit / 1048576); // MB
        const percentage = Math.round((used / limit) * 100);

        const color = percentage > 80 ? '#dc3545' : percentage > 60 ? '#ffc107' : '#28a745';

        memoryContainer.innerHTML = `
            <div style="color: ${color};">Used: ${used} MB (${percentage}%)</div>
            <div>Total: ${total} MB</div>
            <div>Limit: ${limit} MB</div>
        `;
    }

    logNetworkRequest(request) {
        const networkContainer = document.getElementById('network-requests');
        if (!networkContainer) return;

        const statusColor = request.status >= 400 ? '#dc3545' : 
                           request.status >= 300 ? '#ffc107' : '#28a745';

        const requestDiv = document.createElement('div');
        requestDiv.style.cssText = `
            padding: 5px 0;
            border-bottom: 1px solid #3e3e42;
            font-size: 11px;
        `;
        
        requestDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <span>${request.method} ${request.url}</span>
                <span style="color: ${statusColor};">${request.status} (${request.duration}ms)</span>
            </div>
        `;

        networkContainer.insertBefore(requestDiv, networkContainer.firstChild);

        // Keep only last 20 requests
        while (networkContainer.children.length > 20) {
            networkContainer.removeChild(networkContainer.lastChild);
        }
    }

    updateStorageDisplay() {
        // LocalStorage
        const localStorageContainer = document.getElementById('localStorage-content');
        if (localStorageContainer) {
            const items = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                items.push(`<div><strong>${key}:</strong> ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}</div>`);
            }
            localStorageContainer.innerHTML = items.length ? items.join('') : '<em>Empty</em>';
        }

        // SessionStorage
        const sessionStorageContainer = document.getElementById('sessionStorage-content');
        if (sessionStorageContainer) {
            const items = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                const value = sessionStorage.getItem(key);
                items.push(`<div><strong>${key}:</strong> ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}</div>`);
            }
            sessionStorageContainer.innerHTML = items.length ? items.join('') : '<em>Empty</em>';
        }

        // Cache status
        this.updateCacheStatus();
    }

    async updateCacheStatus() {
        const cacheContainer = document.getElementById('cache-status');
        if (!cacheContainer) return;

        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                const cacheInfo = [];
                
                for (const cacheName of cacheNames) {
                    const cache = await caches.open(cacheName);
                    const keys = await cache.keys();
                    cacheInfo.push(`<div><strong>${cacheName}:</strong> ${keys.length} items</div>`);
                }
                
                cacheContainer.innerHTML = cacheInfo.length ? cacheInfo.join('') : '<em>No caches</em>';
            } catch (error) {
                cacheContainer.innerHTML = '<em>Error reading caches</em>';
            }
        } else {
            cacheContainer.innerHTML = '<em>Cache API not supported</em>';
        }
    }

    addConsoleMessage(type, message) {
        const consoleContainer = document.getElementById('console-output');
        if (!consoleContainer) return;

        const colors = {
            log: '#d4d4d4',
            error: '#f14c4c',
            warn: '#ffcc02'
        };

        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            color: ${colors[type]};
            margin: 2px 0;
            font-size: 11px;
        `;
        
        const timestamp = new Date().toLocaleTimeString();
        messageDiv.innerHTML = `<span style="color: #6a9955;">[${timestamp}]</span> ${message}`;
        
        consoleContainer.appendChild(messageDiv);
        consoleContainer.scrollTop = consoleContainer.scrollHeight;

        // Keep only last 100 messages
        while (consoleContainer.children.length > 100) {
            consoleContainer.removeChild(consoleContainer.firstChild);
        }
    }

    updateSEOMetrics() {
        // Meta tags
        const metaContainer = document.getElementById('seo-meta');
        if (metaContainer) {
            const title = document.title;
            const description = document.querySelector('meta[name="description"]')?.content || 'Missing';
            const keywords = document.querySelector('meta[name="keywords"]')?.content || 'Missing';
            
            metaContainer.innerHTML = `
                <div>Title: ${title.length} chars</div>
                <div>Description: ${description === 'Missing' ? description : description.length + ' chars'}</div>
                <div>Keywords: ${keywords === 'Missing' ? keywords : 'Present'}</div>
            `;
        }

        // Structured data
        const structuredContainer = document.getElementById('seo-structured');
        if (structuredContainer) {
            const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
            structuredContainer.innerHTML = `
                <div>JSON-LD scripts: ${jsonLdScripts.length}</div>
                <div>Open Graph: ${document.querySelectorAll('meta[property^="og:"]').length} tags</div>
                <div>Twitter Cards: ${document.querySelectorAll('meta[name^="twitter:"]').length} tags</div>
            `;
        }

        // Images
        const imagesContainer = document.getElementById('seo-images');
        if (imagesContainer) {
            const images = document.querySelectorAll('img');
            const imagesWithAlt = document.querySelectorAll('img[alt]');
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            
            imagesContainer.innerHTML = `
                <div>Total images: ${images.length}</div>
                <div>With alt text: ${imagesWithAlt.length}</div>
                <div>Lazy loading: ${lazyImages.length}</div>
            `;
        }
    }

    // ===== CONTROLES =====
    toggle() {
        this.isOpen = !this.isOpen;
        this.devPanel.style.transform = this.isOpen ? 'translateY(0)' : 'translateY(100%)';
        
        if (this.isOpen) {
            this.refreshData();
            this.refreshInterval = setInterval(() => this.refreshData(), 5000);
        } else {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        this.devPanel.querySelectorAll('.dev-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        this.devPanel.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show/hide content
        this.devPanel.querySelectorAll('.dev-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`dev-tab-${tabName}`).style.display = 'block';

        this.activeTab = tabName;
        this.refreshData();
    }

    refreshData() {
        switch (this.activeTab) {
            case 'storage':
                this.updateStorageDisplay();
                break;
            case 'seo':
                this.updateSEOMetrics();
                break;
        }
    }

    clearData() {
        switch (this.activeTab) {
            case 'console':
                document.getElementById('console-output').innerHTML = '';
                break;
            case 'network':
                document.getElementById('network-requests').innerHTML = '';
                break;
            case 'storage':
                if (confirm('Clear all localStorage data?')) {
                    localStorage.clear();
                    this.updateStorageDisplay();
                }
                break;
        }
    }

    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            performance: this.getPerformanceData(),
            storage: this.getStorageData(),
            seo: this.getSEOData()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dev-tools-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    getPerformanceData() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
            navigation: navigation ? {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                domInteractive: navigation.domInteractive - navigation.navigationStart
            } : null,
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }

    getStorageData() {
        const localStorage = {};
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            localStorage[key] = window.localStorage.getItem(key);
        }

        const sessionStorage = {};
        for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            sessionStorage[key] = window.sessionStorage.getItem(key);
        }

        return { localStorage, sessionStorage };
    }

    getSEOData() {
        return {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content,
            keywords: document.querySelector('meta[name="keywords"]')?.content,
            openGraph: Array.from(document.querySelectorAll('meta[property^="og:"]')).map(meta => ({
                property: meta.getAttribute('property'),
                content: meta.getAttribute('content')
            })),
            structuredData: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(script => {
                try {
                    return JSON.parse(script.textContent);
                } catch (e) {
                    return null;
                }
            }).filter(Boolean)
        };
    }
}

// ===== ESTILOS ADICIONALES =====
const devToolsStyles = `
    .dev-tab {
        background: none;
        border: none;
        color: #cccccc;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px 4px 0 0;
        transition: all 0.2s ease;
    }
    
    .dev-tab:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .dev-tab.active {
        background: #007acc;
        color: white;
    }
    
    .metric-card {
        background: #252526;
        padding: 10px;
        border-radius: 4px;
        border-left: 3px solid #007acc;
    }
    
    .seo-card {
        background: #252526;
        padding: 10px;
        border-radius: 4px;
        border-left: 3px solid #28a745;
    }
`;

// Inyectar estilos
const devStyleSheet = document.createElement('style');
devStyleSheet.textContent = devToolsStyles;
document.head.appendChild(devStyleSheet);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Solo cargar en desarrollo
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.search.includes('dev=true') ||
                  window.location.hash.includes('dev');
    
    if (isDev) {
        window.devTools = new DevTools();
        console.log('🛠️ Dev Tools cargado. Presiona F12 para abrir.');
    }
});

// Exportar para uso global
window.DevTools = DevTools;

console.log('🛠️ Dev Tools disponible');