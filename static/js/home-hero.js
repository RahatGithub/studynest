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
       Right column: Fan deck (left-to-right cascade)
       =========================================== */
    if (visual) {
        const cards = gsap.utils.toArray(visual.querySelectorAll('.preview-card'));
        if (cards.length >= 2) {
            initFanDeck(cards);
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
   Fan Deck — left-to-right cascade, hover only
   =========================================== */
function initFanDeck(cards) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = cards.length;

    // Left-to-right fan: card 0 is front/left, card n-1 is back/right
    const baseRotation = -10;
    const rotationStep = 10;
    const deckPositions = cards.map((_, i) => ({
        rotation: baseRotation + i * rotationStep,
        x: 0,
        y: 0,
        zIndex: n - i, // card 0 highest
    }));

    // Set initial fan positions
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

    // Entrance: stagger fade in
    gsap.from(cards, {
        opacity: 0,
        y: '+=40',
        scale: 0.85,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
    });

    // --- Hover: lift + glow + z-index raise ---
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
            if (!prefersReduced) {
                gsap.to(card, { y: -20, scale: 1.05, zIndex: n + 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
            }
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
            const i = cards.indexOf(card);
            const pos = deckPositions[i];
            if (!prefersReduced) {
                gsap.to(card, { y: pos.y, scale: 1, zIndex: pos.zIndex, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
            }
        });
    });
}
