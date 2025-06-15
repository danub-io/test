document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const mainHeader = document.getElementById('main-header');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const allLinks = document.querySelectorAll('a[href^="#"]');
    const pages = document.querySelectorAll('.page');
    const yearSpan = document.getElementById('current-year');

    // Atualiza o ano no rodapé
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Função para controlar o menu móvel
    const toggleMenu = (open) => {
        if (open) {
            mobileMenu.classList.add('open');
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('open');
            menuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (menuBtn && closeMenuBtn && mobileMenu && menuOverlay) {
        menuBtn.addEventListener('click', () => toggleMenu(true));
        closeMenuBtn.addEventListener('click', () => toggleMenu(false));
        menuOverlay.addEventListener('click', () => toggleMenu(false));
    }

    // Efeito de sombra no header ao rolar a página
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('header-scrolled');
        } else {
            mainHeader.classList.remove('header-scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // Botão de voltar ao topo
    const handleScrollToTopVisibility = () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    };
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', handleScrollToTopVisibility);
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        handleScrollToTopVisibility();
    }

    // Navegação e exibição de páginas
    const showPage = (pageId) => {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        const newPage = document.getElementById(pageId);
        if (newPage) {
            newPage.classList.add('active');
            updateActiveNavLink(pageId);
        }
    };

    const updateActiveNavLink = (activePageId) => {
        const navLinks = document.querySelectorAll('#main-nav .nav-link, #mobile-menu .mobile-menu-link');
        navLinks.forEach(link => {
            // Usa href para corresponder, pois é mais confiável que data attributes
            if (link.getAttribute('href') === `#${activePageId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    allLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            
            // Verifica se é um link de âncora para uma seção na mesma página
            if (href.startsWith('#') && href.length > 1) {
                const targetId = href.substring(1);
                
                // Se o link aponta para uma página, muda a página
                if (targetId.startsWith('page-')) {
                    event.preventDefault();
                    showPage(targetId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    toggleMenu(false);
                } else {
                    // Se for uma âncora para uma seção, deixa o comportamento padrão ou adiciona rolagem suave
                    const targetElement = document.getElementById(targetId);
                    if (targetElement && document.querySelector('.page.active').contains(targetElement)) {
                        event.preventDefault();
                        const headerOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
						const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
						const offsetPosition = elementPosition - headerOffset - 20;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        toggleMenu(false);
                    }
                }
            }
        });
    });

    // Mostra a página inicial ao carregar
    showPage('page-index');
});
