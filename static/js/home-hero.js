/* ============================================
   StudyNest Home — Hero Section Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const eyebrow = document.getElementById('hero-eyebrow');
    const headline = document.getElementById('hero-headline');
    const sub = document.getElementById('hero-sub');
    const search = document.getElementById('hero-search');
    const proof = document.getElementById('hero-proof');
    const ctas = document.getElementById('hero-ctas');
    const visual = document.getElementById('hero-visual');

    if (!headline) return;

    /* --- Left column entrance timeline --- */
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.15 });

    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5 });
    if (headline) tl.to(headline, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');
    if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25');
    if (search) tl.to(search, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, '-=0.2');
    if (proof) tl.to(proof, { opacity: 1, y: 0, duration: 0.5 }, '-=0.15');
    if (ctas) tl.to(ctas, { opacity: 1, y: 0, duration: 0.5 }, '-=0.15');

    /* ===========================================
       Right column: Messy Deck with Flip Expand
       =========================================== */
    if (visual) {
        const cards = gsap.utils.toArray(visual.querySelectorAll('.preview-card'));
        if (cards.length >= 3) {
            initMessyDeck(cards, visual);
        }
    }

    /* --- Avatar stack entrance --- */
    const avatars = document.querySelectorAll('.avatar-circle');
    if (avatars.length) {
        gsap.from(avatars, {
            opacity: 0, scale: 0.5, stagger: 0.06, duration: 0.35,
            ease: 'back.out(1.5)', delay: 1.2,
        });
    }

    /* --- Avatar stack hover: spread out --- */
    const stack = document.querySelector('.avatar-stack');
    if (stack && avatars.length) {
        stack.addEventListener('mouseenter', () => {
            avatars.forEach((av, i) => {
                gsap.to(av, { x: i * 4, duration: 0.3, ease: 'power2.out' });
            });
        });
        stack.addEventListener('mouseleave', () => {
            gsap.to(avatars, { x: 0, duration: 0.3, ease: 'power2.out' });
        });
    }
});

/* ===========================================
   Messy Deck — static tilted stack + Flip expand
   =========================================== */
function initMessyDeck(cards, container) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const flipDuration = prefersReduced ? 0.01 : 0.6;

    // Messy deck positions (tilted same direction, offset to peek)
    const deckPositions = [
        { rotation: 4,  x: 0,  y: 0,  zIndex: 3 }, // top
        { rotation: 7,  x: 35, y: 20, zIndex: 2 }, // middle (peeks right/bottom)
        { rotation: 10, x: 65, y: 40, zIndex: 1 }, // bottom (peeks more)
    ];

    // Set initial deck positions
    cards.forEach((card, i) => {
        const pos = deckPositions[i];
        gsap.set(card, {
            rotation: pos.rotation,
            x: pos.x,
            y: pos.y,
            zIndex: pos.zIndex,
            opacity: 1,
        });
    });

    // Entrance: stagger fade in from slight offset
    gsap.from(cards, {
        opacity: 0,
        y: '+=30',
        scale: 0.9,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
    });

    // Track expanded state
    let expandedCard = null;

    // --- Hover: glow + lift ---
    if (!prefersReduced) {
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (expandedCard) return;
                gsap.to(card, { scale: 1.02, y: '-=4', duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
            });
            card.addEventListener('mouseleave', () => {
                if (expandedCard) return;
                const i = cards.indexOf(card);
                gsap.to(card, {
                    scale: 1,
                    y: deckPositions[i].y,
                    duration: 0.25,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
        });
    }

    // --- Click to expand (GSAP Flip) ---
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If already expanded, do nothing (only close button collapses)
            if (expandedCard) return;
            // Don't expand if clicking the close button
            if (e.target.closest('.preview-card-close')) return;

            expandCard(card);
        });
    });

    // Close buttons
    cards.forEach(card => {
        const closeBtn = card.querySelector('.preview-card-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (expandedCard === card) {
                    collapseCard(card);
                }
            });
        }
    });

    function expandCard(card) {
        expandedCard = card;
        const otherCards = cards.filter(c => c !== card);

        // Capture state before changes
        const state = Flip.getState(card);

        // Add expanded class
        card.classList.add('expanded');

        // Animate with Flip
        const flipTl = Flip.from(state, {
            duration: flipDuration,
            ease: 'power2.inOut',
            absolute: true,
        });

        // Fade out other cards simultaneously
        gsap.to(otherCards, {
            opacity: 0,
            scale: 0.9,
            duration: flipDuration,
            ease: 'power2.inOut',
        });

        // Fade in expanded content after Flip lands
        const expandedContent = card.querySelector('.card-expanded-content');
        if (expandedContent && !prefersReduced) {
            gsap.from(expandedContent, {
                opacity: 0,
                y: 15,
                duration: 0.4,
                ease: 'power2.out',
                delay: flipDuration * 0.5,
            });
        }
    }

    function collapseCard(card) {
        const otherCards = cards.filter(c => c !== card);

        // Capture expanded state
        const state = Flip.getState(card);

        // Remove expanded class
        card.classList.remove('expanded');

        // Restore deck position
        const i = cards.indexOf(card);
        const pos = deckPositions[i];
        gsap.set(card, {
            rotation: pos.rotation,
            x: pos.x,
            y: pos.y,
            zIndex: pos.zIndex,
        });

        // Animate back with Flip
        Flip.from(state, {
            duration: flipDuration,
            ease: 'power2.inOut',
            absolute: true,
        });

        // Fade other cards back in
        otherCards.forEach((c, idx) => {
            const otherIdx = cards.indexOf(c);
            const otherPos = deckPositions[otherIdx];
            gsap.to(c, {
                opacity: 1,
                scale: 1,
                rotation: otherPos.rotation,
                x: otherPos.x,
                y: otherPos.y,
                zIndex: otherPos.zIndex,
                duration: flipDuration,
                ease: 'power2.inOut',
            });
        });

        expandedCard = null;
    }
}
