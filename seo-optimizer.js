// ===== SEO OPTIMIZER AVANZADO =====
// Sistema completo de optimización SEO técnico

class SEOOptimizer {
    constructor() {
        this.structuredData = {};
        this.metaTags = {};
        this.socialMedia = {};
        this.init();
    }

    init() {
        this.optimizeMetaTags();
        this.implementStructuredData();
        this.setupSocialMediaTags();
        this.optimizeImages();
        this.setupCanonicalUrls();
        this.implementBreadcrumbs();
        this.optimizePageSpeed();
        this.setupSitemap();
    }

    // ===== OPTIMIZACIÓN DE META TAGS =====
    optimizeMetaTags() {
        const pageData = this.getPageData();
        
        // Meta description optimizada
        this.updateMetaTag('description', pageData.description);
        
        // Keywords relevantes
        this.updateMetaTag('keywords', pageData.keywords);
        
        // Viewport optimizado
        this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
        
        // Robots meta
        this.updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
        
        // Author y publisher
        this.updateMetaTag('author', 'Glenn Landavere - Larq Arquitectura y Construcción');
        this.updateMetaTag('publisher', 'Larq Arquitectura y Construcción');
        
        // Geo tags para SEO local
        this.updateMetaTag('geo.region', 'PE-LIM');
        this.updateMetaTag('geo.placename', 'Lima, Perú');
        this.updateMetaTag('geo.position', '-12.107690;-77.042234');
        this.updateMetaTag('ICBM', '-12.107690, -77.042234');
        
        // Language
        this.updateMetaTag('language', 'es-PE');
        
        console.log('✅ Meta tags optimizados');
    }

    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    getPageData() {
        const path = window.location.pathname;
        const pageData = {
            '/index.html': {
                title: 'Larq Arquitectura y Construcción - Arquitecto Profesional en Lima',
                description: 'Glenn Landavere, arquitecto profesional con 15+ años de experiencia en Lima, Perú. Especialista en diseño contemporáneo, construcción sostenible y proyectos residenciales y comerciales.',
                keywords: 'arquitecto Lima, diseño arquitectónico, construcción Lima, arquitectura contemporánea, Glenn Landavere, proyectos residenciales, arquitectura sostenible'
            },
            '/acerca.html': {
                title: 'Acerca de Glenn Landavere - Arquitecto Profesional | Larq Arquitectura',
                description: 'Conoce la trayectoria profesional de Glenn Landavere, arquitecto con formación en UNI y experiencia en proyectos de gran envergadura. Especialista en BIM y construcción sostenible.',
                keywords: 'Glenn Landavere arquitecto, formación arquitecto, experiencia profesional, UNI arquitectura, BIM certificado, Bovis Lend Lease'
            },
            '/galeria.html': {
                title: 'Proyectos de Arquitectura - Portfolio | Larq Arquitectura y Construcción',
                description: 'Descubre nuestro portfolio de proyectos arquitectónicos: Hotel Tambo del Inka, Edificio Palomas, proyectos residenciales y comerciales en Lima y Cusco.',
                keywords: 'proyectos arquitectura Lima, Hotel Tambo del Inka, Edificio Palomas, portfolio arquitecto, proyectos residenciales, arquitectura comercial'
            },
            '/gente.html': {
                title: 'Nuestro Equipo Profesional - Arquitectos e Ingenieros | Larq',
                description: 'Conoce al equipo multidisciplinario de Larq Arquitectura: arquitectos, ingenieros estructurales, diseñadores de interiores y especialistas en BIM.',
                keywords: 'equipo arquitectos Lima, ingenieros estructurales, diseño interiores, especialistas BIM, equipo multidisciplinario arquitectura'
            },
            '/contacto.html': {
                title: 'Contacto - Consulta Gratuita | Larq Arquitectura y Construcción Lima',
                description: 'Contacta con Larq Arquitectura en Lima. Consulta gratuita para tu proyecto. Oficina en San Isidro, atención personalizada y presupuestos sin compromiso.',
                keywords: 'contacto arquitecto Lima, consulta gratuita arquitectura, oficina San Isidro, presupuesto arquitectura, arquitecto Lima contacto'
            }
        };

        return pageData[path] || pageData['/index.html'];
    }

    // ===== STRUCTURED DATA (JSON-LD) =====
    implementStructuredData() {
        const structuredData = {
            '@context': 'https://schema.org',
            '@graph': [
                this.getOrganizationSchema(),
                this.getPersonSchema(),
                this.getLocalBusinessSchema(),
                this.getWebsiteSchema(),
                this.getBreadcrumbSchema()
            ]
        };

        // Agregar schema específico según la página
        const pageSchema = this.getPageSpecificSchema();
        if (pageSchema) {
            structuredData['@graph'].push(pageSchema);
        }

        this.injectStructuredData(structuredData);
        console.log('✅ Structured Data implementado');
    }

    getOrganizationSchema() {
        return {
            '@type': 'Organization',
            '@id': 'https://larq.net/#organization',
            'name': 'Larq Arquitectura y Construcción',
            'alternateName': 'Larq Arquitectura',
            'url': 'https://larq.net',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://larq.net/images/Logo_larq.png',
                'width': 200,
                'height': 200
            },
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+51-998-616-265',
                'contactType': 'customer service',
                'areaServed': 'PE',
                'availableLanguage': 'Spanish'
            },
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Av. Emilio Cavenecia 389 piso 11',
                'addressLocality': 'San Isidro',
                'addressRegion': 'Lima',
                'postalCode': '15073',
                'addressCountry': 'PE'
            },
            'sameAs': [
                'https://www.linkedin.com/in/glenn-landavere-09aba4a/',
                'https://www.facebook.com/larqarquitecturayconstruccion/',
                'https://www.instagram.com/larq.arquitectura/',
                'https://www.youtube.com/@glennlandavere9719'
            ]
        };
    }

    getPersonSchema() {
        return {
            '@type': 'Person',
            '@id': 'https://larq.net/#person',
            'name': 'Glenn Landavere',
            'jobTitle': 'Arquitecto Profesional',
            'worksFor': {
                '@id': 'https://larq.net/#organization'
            },
            'alumniOf': {
                '@type': 'EducationalOrganization',
                'name': 'Universidad Nacional de Ingeniería',
                'alternateName': 'UNI'
            },
            'knowsAbout': [
                'Arquitectura',
                'Construcción',
                'Diseño Sostenible',
                'BIM',
                'Gestión de Proyectos'
            ],
            'hasCredential': [
                {
                    '@type': 'EducationalOccupationalCredential',
                    'name': 'Arquitecto',
                    'credentialCategory': 'degree'
                },
                {
                    '@type': 'EducationalOccupationalCredential',
                    'name': 'Autodesk Certified Professional',
                    'credentialCategory': 'certification'
                }
            ]
        };
    }

    getLocalBusinessSchema() {
        return {
            '@type': 'ProfessionalService',
            '@id': 'https://larq.net/#localbusiness',
            'name': 'Larq Arquitectura y Construcción',
            'image': 'https://larq.net/images/Logo_larq.png',
            'telephone': '+51-998-616-265',
            'email': 'glenn.ladavere@larq.net',
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Av. Emilio Cavenecia 389 piso 11',
                'addressLocality': 'San Isidro',
                'addressRegion': 'Lima',
                'postalCode': '15073',
                'addressCountry': 'PE'
            },
            'geo': {
                '@type': 'GeoCoordinates',
                'latitude': -12.107690,
                'longitude': -77.042234
            },
            'openingHoursSpecification': [
                {
                    '@type': 'OpeningHoursSpecification',
                    'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    'opens': '09:00',
                    'closes': '18:00'
                },
                {
                    '@type': 'OpeningHoursSpecification',
                    'dayOfWeek': 'Saturday',
                    'opens': '09:00',
                    'closes': '14:00'
                }
            ],
            'serviceArea': {
                '@type': 'GeoCircle',
                'geoMidpoint': {
                    '@type': 'GeoCoordinates',
                    'latitude': -12.107690,
                    'longitude': -77.042234
                },
                'geoRadius': '50000'
            },
            'priceRange': '$$',
            'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': '4.9',
                'reviewCount': '47'
            }
        };
    }

    getWebsiteSchema() {
        return {
            '@type': 'WebSite',
            '@id': 'https://larq.net/#website',
            'url': 'https://larq.net',
            'name': 'Larq Arquitectura y Construcción',
            'description': 'Estudio de arquitectura profesional especializado en diseño contemporáneo y construcción sostenible',
            'publisher': {
                '@id': 'https://larq.net/#organization'
            },
            'potentialAction': [
                {
                    '@type': 'SearchAction',
                    'target': {
                        '@type': 'EntryPoint',
                        'urlTemplate': 'https://larq.net/search?q={search_term_string}'
                    },
                    'query-input': 'required name=search_term_string'
                }
            ]
        };
    }

    getBreadcrumbSchema() {
        const path = window.location.pathname;
        const breadcrumbs = this.generateBreadcrumbs(path);
        
        return {
            '@type': 'BreadcrumbList',
            'itemListElement': breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': crumb.name,
                'item': crumb.url
            }))
        };
    }

    generateBreadcrumbs(path) {
        const breadcrumbMap = {
            '/': [{ name: 'Inicio', url: 'https://larq.net/' }],
            '/index.html': [{ name: 'Inicio', url: 'https://larq.net/' }],
            '/acerca.html': [
                { name: 'Inicio', url: 'https://larq.net/' },
                { name: 'Acerca de', url: 'https://larq.net/acerca.html' }
            ],
            '/proyectos.html': [
                { name: 'Inicio', url: 'https://larq.net/' },
                { name: 'Proyectos', url: 'https://larq.net/proyectos.html' }
            ],
            '/gente.html': [
                { name: 'Inicio', url: 'https://larq.net/' },
                { name: 'Nuestro Equipo', url: 'https://larq.net/gente.html' }
            ],
            '/contacto.html': [
                { name: 'Inicio', url: 'https://larq.net/' },
                { name: 'Contacto', url: 'https://larq.net/contacto.html' }
            ]
        };

        return breadcrumbMap[path] || breadcrumbMap['/'];
    }

    getPageSpecificSchema() {
        const path = window.location.pathname;
        
        if (path.includes('proyectos')) {
            return this.getCreativeWorkSchema();
        } else if (path.includes('contacto')) {
            return this.getContactPageSchema();
        }
        
        return null;
    }

    getCreativeWorkSchema() {
        return {
            '@type': 'CreativeWork',
            'name': 'Portfolio de Proyectos Arquitectónicos',
            'description': 'Colección de proyectos arquitectónicos realizados por Larq Arquitectura',
            'creator': {
                '@id': 'https://larq.net/#person'
            },
            'publisher': {
                '@id': 'https://larq.net/#organization'
            }
        };
    }

    getContactPageSchema() {
        return {
            '@type': 'ContactPage',
            'name': 'Contacto - Larq Arquitectura',
            'description': 'Página de contacto para consultas y presupuestos de proyectos arquitectónicos'
        };
    }

    injectStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
    }

    // ===== SOCIAL MEDIA TAGS =====
    setupSocialMediaTags() {
        const pageData = this.getPageData();
        const baseUrl = 'https://larq.net';
        const currentUrl = baseUrl + window.location.pathname;
        const imageUrl = baseUrl + '/images/og-image.jpg';

        // Open Graph tags
        this.updateMetaProperty('og:type', 'website');
        this.updateMetaProperty('og:title', pageData.title);
        this.updateMetaProperty('og:description', pageData.description);
        this.updateMetaProperty('og:url', currentUrl);
        this.updateMetaProperty('og:image', imageUrl);
        this.updateMetaProperty('og:image:width', '1200');
        this.updateMetaProperty('og:image:height', '630');
        this.updateMetaProperty('og:site_name', 'Larq Arquitectura y Construcción');
        this.updateMetaProperty('og:locale', 'es_PE');

        // Twitter Card tags
        this.updateMetaName('twitter:card', 'summary_large_image');
        this.updateMetaName('twitter:title', pageData.title);
        this.updateMetaName('twitter:description', pageData.description);
        this.updateMetaName('twitter:image', imageUrl);
        this.updateMetaName('twitter:creator', '@larq_arquitectura');

        // LinkedIn tags
        this.updateMetaProperty('linkedin:owner', 'glenn-landavere-09aba4a');

        console.log('✅ Social Media tags configurados');
    }

    updateMetaProperty(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    updateMetaName(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    // ===== OPTIMIZACIÓN DE IMÁGENES PARA SEO =====
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Asegurar que todas las imágenes tengan alt text
            if (!img.alt || img.alt.trim() === '') {
                img.alt = this.generateSEOAltText(img);
            }
            
            // Agregar title para mejor SEO
            if (!img.title) {
                img.title = img.alt;
            }
            
            // Lazy loading para SEO
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });

        console.log('✅ Imágenes optimizadas para SEO');
    }

    generateSEOAltText(img) {
        const src = img.src || img.dataset.src || '';
        const context = img.closest('.project-card, .team-member, .hero-image');
        
        if (context) {
            const title = context.querySelector('h1, h2, h3, h4');
            if (title) {
                return `${title.textContent} - Larq Arquitectura`;
            }
        }
        
        const filename = src.split('/').pop().split('.')[0];
        return `${filename} - Larq Arquitectura y Construcción`;
    }

    // ===== CANONICAL URLS =====
    setupCanonicalUrls() {
        const baseUrl = 'https://larq.net';
        const currentPath = window.location.pathname;
        const canonicalUrl = baseUrl + currentPath;
        
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;

        console.log('✅ Canonical URL configurado:', canonicalUrl);
    }

    // ===== BREADCRUMBS VISUALES =====
    implementBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (!breadcrumbContainer) {
            this.createBreadcrumbContainer();
        }
    }

    createBreadcrumbContainer() {
        const path = window.location.pathname;
        const breadcrumbs = this.generateBreadcrumbs(path);
        
        if (breadcrumbs.length <= 1) return;

        const container = document.createElement('nav');
        container.className = 'breadcrumbs';
        container.setAttribute('aria-label', 'Breadcrumb');
        
        const ol = document.createElement('ol');
        ol.className = 'breadcrumb-list';
        
        breadcrumbs.forEach((crumb, index) => {
            const li = document.createElement('li');
            li.className = 'breadcrumb-item';
            
            if (index === breadcrumbs.length - 1) {
                li.setAttribute('aria-current', 'page');
                li.textContent = crumb.name;
            } else {
                const a = document.createElement('a');
                a.href = crumb.url;
                a.textContent = crumb.name;
                li.appendChild(a);
            }
            
            ol.appendChild(li);
        });
        
        container.appendChild(ol);
        
        // Insertar después del header
        const header = document.querySelector('.header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(container, header.nextSibling);
        }
    }

    // ===== OPTIMIZACIÓN DE VELOCIDAD =====
    optimizePageSpeed() {
        // Preconnect a dominios externos
        this.addPreconnect('https://fonts.googleapis.com');
        this.addPreconnect('https://fonts.gstatic.com');
        this.addPreconnect('https://cdnjs.cloudflare.com');
        
        // DNS prefetch
        this.addDNSPrefetch('https://www.google-analytics.com');
        this.addDNSPrefetch('https://www.googletagmanager.com');
        
        console.log('✅ Optimizaciones de velocidad aplicadas');
    }

    addPreconnect(url) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    addDNSPrefetch(url) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    // ===== SITEMAP DINÁMICO =====
    setupSitemap() {
        // Generar sitemap dinámico
        const sitemap = this.generateSitemap();
        
        // Agregar link al sitemap en el head
        const sitemapLink = document.createElement('link');
        sitemapLink.rel = 'sitemap';
        sitemapLink.type = 'application/xml';
        sitemapLink.href = '/sitemap.xml';
        document.head.appendChild(sitemapLink);
        
        console.log('✅ Sitemap configurado');
    }

    generateSitemap() {
        const baseUrl = 'https://larq.net';
        const pages = [
            { url: '/', priority: '1.0', changefreq: 'weekly' },
            { url: '/acerca.html', priority: '0.8', changefreq: 'monthly' },
            { url: '/proyectos.html', priority: '0.9', changefreq: 'weekly' },
            { url: '/gente.html', priority: '0.7', changefreq: 'monthly' },
            { url: '/contacto.html', priority: '0.8', changefreq: 'monthly' }
        ];

        return pages.map(page => ({
            ...page,
            url: baseUrl + page.url,
            lastmod: new Date().toISOString().split('T')[0]
        }));
    }

    // ===== ANALYTICS Y TRACKING =====
    setupAnalytics() {
        // Google Analytics 4
        this.loadGoogleAnalytics();
        
        // Google Search Console
        this.addSearchConsoleVerification();
        
        console.log('✅ Analytics configurado');
    }

    loadGoogleAnalytics() {
        // Placeholder para Google Analytics
        // En producción, reemplazar con el ID real
        const GA_ID = 'G-XXXXXXXXXX';
        
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
        `;
        document.head.appendChild(script2);
    }

    addSearchConsoleVerification() {
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = 'VERIFICATION_CODE_HERE';
        document.head.appendChild(meta);
    }
}

// ===== ESTILOS PARA BREADCRUMBS =====
const breadcrumbStyles = `
    .breadcrumbs {
        background: #f8f9fa;
        padding: 12px 0;
        border-bottom: 1px solid #e9ecef;
    }
    
    .breadcrumb-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .breadcrumb-item {
        display: flex;
        align-items: center;
    }
    
    .breadcrumb-item:not(:last-child)::after {
        content: '›';
        margin: 0 8px;
        color: #6c757d;
    }
    
    .breadcrumb-item a {
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
    }
    
    .breadcrumb-item a:hover {
        text-decoration: underline;
    }
    
    .breadcrumb-item[aria-current="page"] {
        color: #6c757d;
        font-size: 14px;
    }
    
    @media (max-width: 768px) {
        .breadcrumb-list {
            padding: 0 15px;
        }
        
        .breadcrumb-item {
            font-size: 12px;
        }
    }
`;

// Inyectar estilos
const breadcrumbStyleSheet = document.createElement('style');
breadcrumbStyleSheet.textContent = breadcrumbStyles;
document.head.appendChild(breadcrumbStyleSheet);

// Exportar para uso global
window.SEOOptimizer = SEOOptimizer;

console.log('🔍 SEO Optimizer cargado correctamente');