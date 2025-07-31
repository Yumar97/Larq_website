// ===== SERVICE WORKER PARA LARQ ARQUITECTURA =====
// Sistema de cache inteligente para mejor rendimiento

const CACHE_NAME = 'larq-arquitectura-v1.0.0';
const STATIC_CACHE = 'larq-static-v1.0.0';
const DYNAMIC_CACHE = 'larq-dynamic-v1.0.0';
const IMAGE_CACHE = 'larq-images-v1.0.0';

// Recursos críticos para cache inmediato
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/acerca.html',
    '/galeria.html',
    '/gente.html',
    '/contacto.html',
    '/styles-professional.css',
    '/script-optimized.js',
    '/image-optimizer.js',
    '/font-optimizer.js',
    '/images/Logo_larq.png',
    '/images/ArquitectoFoto.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Recursos que se pueden cachear dinámicamente
const DYNAMIC_ASSETS = [
    '/images/',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/'
];

// Configuración de cache por tipo de recurso
const CACHE_STRATEGIES = {
    html: 'networkFirst',
    css: 'staleWhileRevalidate',
    js: 'staleWhileRevalidate',
    images: 'cacheFirst',
    fonts: 'cacheFirst',
    api: 'networkFirst'
};

// ===== INSTALACIÓN DEL SERVICE WORKER =====
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Instalando...');
    
    event.waitUntil(
        Promise.all([
            // Cache de recursos estáticos
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Cacheando recursos estáticos...');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // Preparar cache dinámico
            caches.open(DYNAMIC_CACHE),
            caches.open(IMAGE_CACHE)
        ]).then(() => {
            console.log('✅ Service Worker instalado correctamente');
            // Forzar activación inmediata
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ Error instalando Service Worker:', error);
        })
    );
});

// ===== ACTIVACIÓN DEL SERVICE WORKER =====
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activando...');
    
    event.waitUntil(
        Promise.all([
            // Limpiar caches antiguos
            cleanOldCaches(),
            
            // Tomar control inmediato
            self.clients.claim()
        ]).then(() => {
            console.log('✅ Service Worker activado y controlando');
        })
    );
});

// ===== INTERCEPTAR REQUESTS =====
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Solo manejar requests GET
    if (request.method !== 'GET') return;
    
    // Ignorar requests de extensiones del navegador
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
        return;
    }
    
    // Determinar estrategia de cache
    const strategy = determineStrategy(request);
    
    event.respondWith(
        handleRequest(request, strategy)
    );
});

// ===== ESTRATEGIAS DE CACHE =====

// Network First - Intenta red primero, fallback a cache
async function networkFirst(request, cacheName = DYNAMIC_CACHE) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback para páginas HTML
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Cache First - Intenta cache primero, fallback a red
async function cacheFirst(request, cacheName = STATIC_CACHE) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Failed to fetch:', request.url, error);
        
        // Fallback para imágenes
        if (request.destination === 'image') {
            return createImageFallback();
        }
        
        throw error;
    }
}

// Stale While Revalidate - Devuelve cache y actualiza en background
async function staleWhileRevalidate(request, cacheName = DYNAMIC_CACHE) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Fetch en background para actualizar cache
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.log('🔄 Background update failed:', request.url);
    });
    
    // Devolver cache inmediatamente si existe, sino esperar network
    return cachedResponse || fetchPromise;
}

// ===== UTILIDADES =====

function determineStrategy(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const destination = request.destination;
    
    // Páginas HTML
    if (destination === 'document' || pathname.endsWith('.html')) {
        return 'networkFirst';
    }
    
    // CSS y JavaScript
    if (destination === 'style' || destination === 'script' || 
        pathname.endsWith('.css') || pathname.endsWith('.js')) {
        return 'staleWhileRevalidate';
    }
    
    // Imágenes
    if (destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname)) {
        return 'cacheFirst';
    }
    
    // Fuentes
    if (destination === 'font' || /\.(woff|woff2|ttf|eot)$/i.test(pathname) ||
        url.hostname === 'fonts.gstatic.com') {
        return 'cacheFirst';
    }
    
    // Google Fonts CSS
    if (url.hostname === 'fonts.googleapis.com') {
        return 'staleWhileRevalidate';
    }
    
    // Font Awesome
    if (url.hostname === 'cdnjs.cloudflare.com') {
        return 'cacheFirst';
    }
    
    // Default
    return 'networkFirst';
}

async function handleRequest(request, strategy) {
    const url = new URL(request.url);
    
    switch (strategy) {
        case 'networkFirst':
            return networkFirst(request);
        
        case 'cacheFirst':
            // Usar cache específico para imágenes
            if (request.destination === 'image') {
                return cacheFirst(request, IMAGE_CACHE);
            }
            return cacheFirst(request);
        
        case 'staleWhileRevalidate':
            return staleWhileRevalidate(request);
        
        default:
            return fetch(request);
    }
}

async function cleanOldCaches() {
    const cacheNames = await caches.keys();
    const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
    
    const deletePromises = cacheNames
        .filter(cacheName => !validCaches.includes(cacheName))
        .map(cacheName => {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
        });
    
    return Promise.all(deletePromises);
}

function createImageFallback() {
    // Crear una imagen SVG de fallback
    const svg = `
        <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="150" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
            <text x="100" y="75" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="14">
                Imagen no disponible
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache'
        }
    });
}

// ===== MANEJO DE MENSAJES =====
self.addEventListener('message', event => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage(status);
            });
            break;
            
        case 'CLEAR_CACHE':
            clearSpecificCache(payload.cacheName).then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'PRELOAD_ROUTES':
            preloadRoutes(payload.routes);
            break;
    }
});

async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        status[cacheName] = keys.length;
    }
    
    return status;
}

async function clearSpecificCache(cacheName) {
    return caches.delete(cacheName);
}

async function preloadRoutes(routes) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    const preloadPromises = routes.map(route => {
        return fetch(route).then(response => {
            if (response.ok) {
                return cache.put(route, response);
            }
        }).catch(error => {
            console.log('❌ Failed to preload:', route);
        });
    });
    
    return Promise.allSettled(preloadPromises);
}

// ===== SYNC EN BACKGROUND =====
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    console.log('🔄 Ejecutando sincronización en background...');
    
    // Aquí puedes agregar lógica para sincronizar datos
    // Por ejemplo, enviar formularios pendientes, actualizar cache, etc.
    
    try {
        // Actualizar recursos críticos
        const cache = await caches.open(STATIC_CACHE);
        const criticalResources = ['/styles-professional.css', '/script-optimized.js'];
        
        for (const resource of criticalResources) {
            try {
                const response = await fetch(resource);
                if (response.ok) {
                    await cache.put(resource, response);
                }
            } catch (error) {
                console.log('❌ Failed to update:', resource);
            }
        }
        
        console.log('✅ Background sync completado');
    } catch (error) {
        console.error('❌ Error en background sync:', error);
    }
}

console.log('🔧 Service Worker cargado correctamente');