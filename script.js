/* ==============================
   PRELOADER E INICIALIZAÇÃO
============================== */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initPreloader();
    initMobileMenu();
    initSmoothScroll();
    initCarousel();
    initScrollAnimations();
    initHeaderScroll();
    initWhatsAppButton();
});

/* ==============================
   PRELOADER
============================== */
function initPreloader() {
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000); // Reduzido para 1 segundo
        }

        // Iniciar animações após o preloader
        setTimeout(initAnimations, 100);
    });
}

/* ==============================
   MENU MOBILE
============================== */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/* ==============================
   SCROLL SUAVE
============================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar links que não são para seções do site
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==============================
   HEADER SCROLL EFFECT
============================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Adicionar sombra e reduzir tamanho ao rolar
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Esconder/mostrar header baseado na direção do scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

/* ==============================
   CARROSSEL QUEM SOMOS
============================== */
function initCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;

    const items = Array.from(carouselTrack.children);
    const prevButton = document.querySelector('.carousel-button-prev');
    const nextButton = document.querySelector('.carousel-button-next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    const totalItems = items.length;
    let autoPlayInterval;

    // Função para atualizar carrossel
    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Próximo slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    // Slide anterior
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    // Event listeners para botões
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    if (prevButton) prevButton.addEventListener('click', prevSlide);

    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            resetAutoPlay();
        });
    });

    // Autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Pausar autoplay ao interagir
    carouselTrack.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    carouselTrack.addEventListener('mouseleave', () => {
        startAutoPlay();
    });

    // Iniciar autoplay
    startAutoPlay();

    // Swipe para mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carouselTrack.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoPlay();
        }
    }
}

/* ==============================
   ANIMAÇÕES AO SCROLL
============================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animações específicas para cards
                if (entry.target.classList.contains('card')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, entry.target.dataset.delay || 0);
                }
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.fade-in, .card, .servicos .card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.dataset.delay = index * 100;
        observer.observe(el);
    });
}

/* ==============================
   ANIMAÇÃO DE CARDS PROGRESSIVA
============================== */
function initAnimations() {
    const cards = document.querySelectorAll('.card, .servicos .card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/* ==============================
   BOTÃO WHATSAPP FLUTUANTE
============================== */
function initWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-float');
    
    if (whatsappButton) {
        // Mostrar/ocultar botão baseado no scroll
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Ocultar no topo da página
            if (scrollPosition < 100) {
                whatsappButton.style.opacity = '0';
                whatsappButton.style.pointerEvents = 'none';
            } 
            // Ocultar no final da página (footer)
            else if (scrollPosition + windowHeight > documentHeight - 200) {
                whatsappButton.style.opacity = '0';
                whatsappButton.style.pointerEvents = 'none';
            }
            // Mostrar no meio da página
            else {
                whatsappButton.style.opacity = '1';
                whatsappButton.style.pointerEvents = 'auto';
            }
        });
    }
}

/* ==============================
   CONTADOR DE ESTATÍSTICAS (OPCIONAL)
============================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function startCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }
}

/* ==============================
   FORMULÁRIO DE CONTATO (PARA FUTURAS IMPLEMENTAÇÕES)
============================== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envio (substituir por API real)
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

/* ==============================
   LAZY LOADING PARA IMAGENS
============================== */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/* ==============================
   RESIZE OBSERVER PARA RESPONSIVIDADE
============================== */
function initResizeObserver() {
    const header = document.getElementById('header');
    
    if (header && 'ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                // Ajustar altura do hero baseado no header
                const headerHeight = entry.contentRect.height;
                document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
            }
        });

        resizeObserver.observe(header);
    }
}

/* ==============================
   TRATAMENTO DE ERROS GLOBAIS
============================== */
window.addEventListener('error', function(e) {
    console.error('Erro JavaScript:', e.error);
});

/* ==============================
   INICIALIZAÇÕES ADICIONAIS
============================== */
// Inicializar funcionalidades extras quando necessário
setTimeout(() => {
    initCounters();
    initContactForm();
    initLazyLoading();
    initResizeObserver();
}, 1000);

/* ==============================
   ATUALIZAR ANO NO FOOTER
============================== */
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Inicializar no DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentYear();
    // ... resto das inicializações
});
