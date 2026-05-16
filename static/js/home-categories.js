/* ============================================
   StudyNest Home — Categories Section Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('home-categories');
    const grid = document.getElementById('home-cat-grid');
    if (!section || !grid) return;

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
        'science': 'bi-flask',  // Note: Bootstrap Icons doesn't have flask, using mortarboard
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

        // Try to set a better icon based on category name
        const iconEl = card.querySelector('.cat-card-icon i');
        if (iconEl) {
            const cardLink = card.getAttribute('href') || '';
            const slug = cardLink.split('category=')[1] || '';
            const matchedIcon = iconMap[slug];
            if (matchedIcon) {
                iconEl.className = 'bi ' + matchedIcon;
            } else {
                // Default icon if slug doesn't match
                const defaults = ['bi-book', 'bi-lightbulb', 'bi-star', 'bi-grid', 'bi-layers', 'bi-box'];
                iconEl.className = 'bi ' + defaults[i % defaults.length];
            }
        }
    });

    // Section header entrance
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

    // Cards stagger entrance
    if (cards.length) {
        gsap.from(cards, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
            },
        });
    }

    // Subtle icon floating animation
    cards.forEach((card, i) => {
        const icon = card.querySelector('.cat-card-icon i');
        if (icon) {
            gsap.to(icon, {
                y: -2,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: i * 0.4,
            });
        }
    });
});
