/* ============================================
   StudyNest Home — Categories Carousel
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('home-categories');
    const carousel = document.getElementById('cat-carousel');
    if (!section || !carousel) return;

    const cards = gsap.utils.toArray('.cat-card');
    const accents = ['indigo', 'sage', 'amber', 'rose', 'teal', 'violet'];

    // Icon mapping based on common category slugs
    const iconMap = {
        'programming': 'bi-code-slash',
        'development': 'bi-code-slash',
        'web-development': 'bi-globe',
        'design': 'bi-palette',
        'business': 'bi-briefcase',
        'marketing': 'bi-graph-up-arrow',
        'language': 'bi-translate',
        'languages': 'bi-translate',
        'science': 'bi-flask',
        'math': 'bi-calculator',
        'mathematics': 'bi-calculator',
        'music': 'bi-music-note-beamed',
        'art': 'bi-brush',
        'photography': 'bi-camera',
        'health': 'bi-heart-pulse',
        'fitness': 'bi-activity',
        'finance': 'bi-currency-dollar',
        'data-science': 'bi-bar-chart-line',
        'ai': 'bi-robot',
        'machine-learning': 'bi-cpu',
    };

    // Assign accent colors and fix icons
    cards.forEach((card, i) => {
        const accent = accents[i % accents.length];
        card.setAttribute('data-accent', accent);

        const iconEl = card.querySelector('.cat-card-icon i');
        if (iconEl) {
            const cardLink = card.getAttribute('href') || '';
            const slug = cardLink.split('category=')[1] || '';
            const matchedIcon = iconMap[slug];
            if (matchedIcon) {
                iconEl.className = 'bi ' + matchedIcon;
            } else {
                const defaults = ['bi-book', 'bi-lightbulb', 'bi-star', 'bi-grid', 'bi-layers', 'bi-box'];
                iconEl.className = 'bi ' + defaults[i % defaults.length];
            }
        }
    });

    // --- Carousel navigation arrows ---
    const btnLeft = section.querySelector('.cat-carousel-btn-left');
    const btnRight = section.querySelector('.cat-carousel-btn-right');

    function updateArrows() {
        if (!btnLeft || !btnRight) return;
        const { scrollLeft, scrollWidth, clientWidth } = carousel;
        btnLeft.classList.toggle('visible', scrollLeft > 10);
        btnRight.classList.toggle('visible', scrollLeft < scrollWidth - clientWidth - 10);
    }

    if (btnLeft && btnRight) {
        btnLeft.addEventListener('click', () => {
            carousel.scrollBy({ left: -280, behavior: 'smooth' });
        });
        btnRight.addEventListener('click', () => {
            carousel.scrollBy({ left: 280, behavior: 'smooth' });
        });
        carousel.addEventListener('scroll', updateArrows, { passive: true });
        updateArrows();
    }

    // --- Scroll-into-view entrance animation ---
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && cards.length) {
        gsap.from(cards, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: carousel,
                start: 'top 85%',
            },
        });
    }

    // Section header entrance
    if (!prefersReduced) {
        gsap.from('.home-cat-eyebrow', {
            opacity: 0, y: 10, duration: 0.4,
            scrollTrigger: { trigger: section, start: 'top 80%' },
        });
        gsap.from('.home-cat-title', {
            opacity: 0, y: 15, duration: 0.5, delay: 0.1,
            scrollTrigger: { trigger: section, start: 'top 80%' },
        });
        gsap.from('.home-cat-sub', {
            opacity: 0, y: 10, duration: 0.4, delay: 0.2,
            scrollTrigger: { trigger: section, start: 'top 80%' },
        });
        gsap.from('.home-cat-viewall', {
            opacity: 0, x: -10, duration: 0.4, delay: 0.3,
            scrollTrigger: { trigger: section, start: 'top 80%' },
        });
    }
});
