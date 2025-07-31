// ===== GALERÍA DE FOTOS - FUNCIONALIDAD JAVASCRIPT =====

class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.currentImageIndex = 0;
        this.images = [];
        this.isModalOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupModal();
        this.setupLazyLoading();
        this.setupKeyboardNavigation();
        this.collectImages();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Filtros de categoría
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Botones de acción en las tarjetas
        const viewButtons = document.querySelectorAll('.view-btn');
        const zoomButtons = document.querySelectorAll('.zoom-btn');
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewClick(e));
        });
        
        zoomButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleZoomClick(e));
        });

        // Botón cargar más
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreItems());
        }

        // Navegación del hamburger
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    setupModal() {
        const modal = document.getElementById('imageModal');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.querySelector('.modal-overlay');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeModal());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousImage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isModalOpen) return;

            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupIntersectionObserver() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }

    collectImages() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        this.images = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            const title = item.querySelector('.overlay-content h3')?.textContent || 'Proyecto';
            const description = item.querySelector('.overlay-content p')?.textContent || 'Descripción del proyecto';
            const category = item.dataset.category;
            
            return {
                src: img.src.replace('w=800', 'w=1200'),
                title,
                description,
                category,
                element: item
            };
        });
    }

    handleFilterClick(e) {
        const button = e.currentTarget;
        const filter = button.dataset.filter;
        
        // Actualizar botones activos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Aplicar filtro
        this.applyFilter(filter);
        this.currentFilter = filter;
    }

    applyFilter(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.classList.remove('hidden');
                // Animación escalonada
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 100);
            } else {
                item.classList.add('hidden');
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
            }
        });

        // Actualizar colección de imágenes filtradas
        this.updateFilteredImages(filter);
    }

    updateFilteredImages(filter) {
        if (filter === 'all') {
            this.filteredImages = this.images;
        } else {
            this.filteredImages = this.images.filter(img => img.category === filter);
        }
    }

    handleViewClick(e) {
        e.stopPropagation();
        const button = e.currentTarget;
        const imageSrc = button.dataset.image;
        this.openModal(imageSrc);
    }

    handleZoomClick(e) {
        e.stopPropagation();
        const button = e.currentTarget;
        const imageSrc = button.dataset.image;
        this.openModal(imageSrc);
    }

    openModal(imageSrc) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        
        // Encontrar la imagen en la colección
        const currentImages = this.filteredImages || this.images;
        this.currentImageIndex = currentImages.findIndex(img => img.src === imageSrc);
        
        if (this.currentImageIndex === -1) {
            this.currentImageIndex = 0;
        }
        
        const currentImage = currentImages[this.currentImageIndex];
        
        // Actualizar contenido del modal
        modalImage.src = currentImage.src;
        modalImage.alt = currentImage.title;
        modalTitle.textContent = currentImage.title;
        modalDescription.textContent = currentImage.description;
        
        // Mostrar modal
        modal.classList.add('active');
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Precargar imágenes adyacentes
        this.preloadAdjacentImages();
    }

    closeModal() {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('active');
        this.isModalOpen = false;
        document.body.style.overflow = '';
    }

    previousImage() {
        const currentImages = this.filteredImages || this.images;
        this.currentImageIndex = (this.currentImageIndex - 1 + currentImages.length) % currentImages.length;
        this.updateModalImage();
    }

    nextImage() {
        const currentImages = this.filteredImages || this.images;
        this.currentImageIndex = (this.currentImageIndex + 1) % currentImages.length;
        this.updateModalImage();
    }

    updateModalImage() {
        const currentImages = this.filteredImages || this.images;
        const currentImage = currentImages[this.currentImageIndex];
        
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        
        // Efecto de transición
        modalImage.style.opacity = '0';
        
        setTimeout(() => {
            modalImage.src = currentImage.src;
            modalImage.alt = currentImage.title;
            modalTitle.textContent = currentImage.title;
            modalDescription.textContent = currentImage.description;
            modalImage.style.opacity = '1';
        }, 150);
        
        this.preloadAdjacentImages();
    }

    preloadAdjacentImages() {
        const currentImages = this.filteredImages || this.images;
        const prevIndex = (this.currentImageIndex - 1 + currentImages.length) % currentImages.length;
        const nextIndex = (this.currentImageIndex + 1) % currentImages.length;
        
        // Precargar imagen anterior
        const prevImg = new Image();
        prevImg.src = currentImages[prevIndex].src;
        
        // Precargar imagen siguiente
        const nextImg = new Image();
        nextImg.src = currentImages[nextIndex].src;
    }

    loadMoreItems() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        const galleryGrid = document.getElementById('galleryGrid');
        
        // Simular carga
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Cargando...</span>';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // Aquí podrías cargar más elementos desde una API
            this.addMoreGalleryItems();
            
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i><span>Cargar Más Proyectos</span>';
            loadMoreBtn.disabled = false;
        }, 1500);
    }

    addMoreGalleryItems() {
        const galleryGrid = document.getElementById('galleryGrid');
        
        // Datos de ejemplo para nuevos elementos
        const newItems = [
            {
                category: 'residential',
                image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                title: 'Casa Ecológica',
                description: 'Diseño sostenible y eficiente',
                location: 'Barranco, Lima',
                year: '2023',
                tags: ['Residencial', 'Ecológico']
            },
            {
                category: 'commercial',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                title: 'Oficinas Corporativas',
                description: 'Espacios de trabajo modernos',
                location: 'San Isidro, Lima',
                year: '2023',
                tags: ['Comercial', 'Corporativo']
            }
        ];
        
        newItems.forEach((item, index) => {
            const galleryItem = this.createGalleryItem(item);
            galleryGrid.appendChild(galleryItem);
            
            // Animación de entrada
            setTimeout(() => {
                galleryItem.style.opacity = '1';
                galleryItem.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Actualizar colección de imágenes
        this.collectImages();
        this.setupNewItemEvents();
    }

    createGalleryItem(data) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.category = data.category;
        galleryItem.style.opacity = '0';
        galleryItem.style.transform = 'translateY(30px)';
        galleryItem.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        galleryItem.innerHTML = `
            <div class="gallery-card">
                <div class="image-container">
                    <img src="${data.image}" alt="${data.title}" loading="lazy">
                    <div class="image-overlay">
                        <div class="overlay-content">
                            <h3>${data.title}</h3>
                            <p>${data.description}</p>
                            <div class="project-tags">
                                ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <div class="overlay-actions">
                            <button class="action-btn view-btn" data-image="${data.image.replace('w=800', 'w=1200')}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn zoom-btn" data-image="${data.image.replace('w=800', 'w=1200')}">
                                <i class="fas fa-search-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <div class="project-meta">
                        <span class="location"><i class="fas fa-map-marker-alt"></i> ${data.location}</span>
                        <span class="year"><i class="fas fa-calendar"></i> ${data.year}</span>
                    </div>
                </div>
            </div>
        `;
        
        return galleryItem;
    }

    setupNewItemEvents() {
        // Configurar eventos para nuevos elementos
        const newViewButtons = document.querySelectorAll('.view-btn:not([data-setup])');
        const newZoomButtons = document.querySelectorAll('.zoom-btn:not([data-setup])');
        
        newViewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewClick(e));
            btn.dataset.setup = 'true';
        });
        
        newZoomButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleZoomClick(e));
            btn.dataset.setup = 'true';
        });
    }

    // Método para búsqueda (futuro)
    searchProjects(query) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const title = item.querySelector('.overlay-content h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.overlay-content p')?.textContent.toLowerCase() || '';
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const searchText = query.toLowerCase();
            const matches = title.includes(searchText) || 
                          description.includes(searchText) || 
                          tags.some(tag => tag.includes(searchText));
            
            if (matches) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Método para ordenar proyectos
    sortProjects(criteria) {
        const galleryGrid = document.getElementById('galleryGrid');
        const items = Array.from(galleryGrid.children);
        
        items.sort((a, b) => {
            switch (criteria) {
                case 'year':
                    const yearA = a.querySelector('.year').textContent;
                    const yearB = b.querySelector('.year').textContent;
                    return yearB.localeCompare(yearA);
                case 'title':
                    const titleA = a.querySelector('.overlay-content h3').textContent;
                    const titleB = b.querySelector('.overlay-content h3').textContent;
                    return titleA.localeCompare(titleB);
                default:
                    return 0;
            }
        });
        
        // Reordenar elementos en el DOM
        items.forEach(item => galleryGrid.appendChild(item));
    }
}

// Utilidades adicionales
class GalleryUtils {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = progress;
                requestAnimationFrame(animate);
            } else {
                element.style.opacity = 1;
            }
        }
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = startOpacity * (1 - progress);
                requestAnimationFrame(animate);
            } else {
                element.style.opacity = 0;
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new GalleryManager();
    
    // Configurar eventos de scroll suave
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Agregar botón de scroll to top si no existe
    if (!document.querySelector('.scroll-to-top')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #A3BFFA, #7c9df7);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        
        scrollBtn.addEventListener('click', scrollToTop);
        document.body.appendChild(scrollBtn);
        
        // Mostrar/ocultar botón según scroll
        window.addEventListener('scroll', GalleryUtils.throttle(() => {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        }, 100));
    }
    
    // Configurar parallax suave para el hero
    const hero = document.querySelector('.gallery-hero');
    if (hero) {
        window.addEventListener('scroll', GalleryUtils.throttle(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }, 10));
    }
});

// Exportar para uso global si es necesario
window.GalleryManager = GalleryManager;
window.GalleryUtils = GalleryUtils;