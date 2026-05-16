/* ============================================
   StudyNest Home — Categories Bento Grid
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('cat-bento');
    if (!grid) return;

    const cards = grid.querySelectorAll('.cat-card');
    const accents = ['amber', 'sage', 'rose', 'red', 'teal', 'indigo'];

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
});
