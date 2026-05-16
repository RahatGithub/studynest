/* ============================================
   StudyNest Home — Categories Carousel
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('home-categories');
    const carousel = document.getElementById('cat-carousel');
    if (!section || !carousel) return;

    const cards = carousel.querySelectorAll('.cat-card');
    const accents = ['amber', 'sage', 'rose', 'red', 'teal', 'indigo'];

    // Icon mapping
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
        'music': 'bi-music-note-beamed',
        'photography': 'bi-camera',
        'health': 'bi-heart-pulse',
        'finance': 'bi-currency-dollar',
        'data-science': 'bi-bar-chart-line',
        'ai': 'bi-robot',
        'machine-learning': 'bi-cpu',
    };

    // Assign accents and icons
    cards.forEach((card, i) => {
        card.setAttribute('data-accent', accents[i % accents.length]);

        const iconEl = card.querySelector('.cat-card-icon i');
        if (iconEl) {
            const href = card.getAttribute('href') || '';
            const slug = href.split('category=')[1] || '';
            const matched = iconMap[slug];
            if (matched) {
                iconEl.className = 'bi ' + matched;
            } else {
                const defaults = ['bi-book', 'bi-lightbulb', 'bi-star', 'bi-grid', 'bi-layers', 'bi-box'];
                iconEl.className = 'bi ' + defaults[i % defaults.length];
            }
        }
    });

    // Arrow navigation
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
            carousel.scrollBy({ left: -260, behavior: 'smooth' });
        });
        btnRight.addEventListener('click', () => {
            carousel.scrollBy({ left: 260, behavior: 'smooth' });
        });
        carousel.addEventListener('scroll', updateArrows, { passive: true });
        updateArrows();
    }
});
