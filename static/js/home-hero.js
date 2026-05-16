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
        if (cards.length >= 2) {
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

    // Fan positions: rotation around bottom-center pivot (transform-origin: 50% 180% in CSS)
    const n = cards.length;
    const mid = (n - 1) / 2;
    const spread = 16; // degrees between cards → -32, -16, 0, 16, 32
    const deckPositions = cards.map((_, i) => {
        const offset = i - mid; // -2, -1, 0, 1, 2 for 5 cards
        return {
            rotation: offset * spread,
            x: 0,
            y: 0,
            zIndex: n - Math.abs(Math.round(offset)), // center highest
        };
    });

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

    // Track expanded state
    let expandedCard = null;

    // --- Hover: lift + glow + z-index raise ---
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (expandedCard) return;
            card.classList.add('hovered');
            if (!prefersReduced) {
                gsap.to(card, { y: -20, scale: 1.05, zIndex: n + 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
            }
        });
        card.addEventListener('mouseleave', () => {
            if (expandedCard) return;
            card.classList.remove('hovered');
            const i = cards.indexOf(card);
            const pos = deckPositions[i];
            if (!prefersReduced) {
                gsap.to(card, { y: pos.y, scale: 1, zIndex: pos.zIndex, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
            }
        });
    });

    // Elements
    const heroSection = document.getElementById('home-hero');
    const backdrop = document.getElementById('card-modal-backdrop');

    // --- Click to expand ---
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (expandedCard) return;
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
                if (expandedCard === card) collapseCard(card);
            });
        }
    });

    // Backdrop click closes
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            if (expandedCard) collapseCard(expandedCard);
        });
    }

    // Escape key closes
    function onEscape(e) {
        if (e.key === 'Escape' && expandedCard) {
            collapseCard(expandedCard);
        }
    }

    function expandCard(card) {
        expandedCard = card;
        const otherCards = cards.filter(c => c !== card);

        // Capture state before DOM changes
        const state = Flip.getState(card);

        // Move card to hero section root so it can center over everything
        heroSection.appendChild(card);

        // Add expanded class (CSS positions it at top:50% left:50%)
        card.classList.add('expanded');

        // GSAP centers it (avoids CSS transform conflict with Flip)
        gsap.set(card, { xPercent: -50, yPercent: -50, rotation: 0 });

        // Animate with Flip
        Flip.from(state, {
            duration: flipDuration,
            ease: 'power2.inOut',
            absolute: true,
        });

        // Show backdrop
        if (backdrop) {
            backdrop.classList.add('active');
            gsap.to(backdrop, { opacity: 1, duration: flipDuration, ease: 'power2.inOut' });
        }

        // Fade out other cards
        gsap.to(otherCards, { opacity: 0, scale: 0.9, duration: flipDuration, ease: 'power2.inOut' });

        // Fade in expanded content
        const expandedContent = card.querySelector('.card-expanded-content');
        if (expandedContent && !prefersReduced) {
            gsap.from(expandedContent, { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out', delay: flipDuration * 0.5 });
        }

        // Lock body scroll + listen for Escape
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onEscape);
    }

    function collapseCard(card) {
        const otherCards = cards.filter(c => c !== card);

        // Capture expanded state
        const state = Flip.getState(card);

        // Remove expanded class and centering
        card.classList.remove('expanded');
        gsap.set(card, { clearProps: 'xPercent,yPercent' });

        // Move card back into the visual container
        container.appendChild(card);

        // Restore deck position
        const i = cards.indexOf(card);
        const pos = deckPositions[i];
        gsap.set(card, { rotation: pos.rotation, x: pos.x, y: pos.y, zIndex: pos.zIndex });

        // Animate back with Flip
        Flip.from(state, { duration: flipDuration, ease: 'power2.inOut', absolute: true });

        // Hide backdrop
        if (backdrop) {
            gsap.to(backdrop, {
                opacity: 0, duration: flipDuration, ease: 'power2.inOut',
                onComplete: () => backdrop.classList.remove('active'),
            });
        }

        // Fade other cards back in
        otherCards.forEach(c => {
            const otherIdx = cards.indexOf(c);
            const otherPos = deckPositions[otherIdx];
            gsap.to(c, {
                opacity: 1, scale: 1,
                rotation: otherPos.rotation, x: otherPos.x, y: otherPos.y, zIndex: otherPos.zIndex,
                duration: flipDuration, ease: 'power2.inOut',
            });
        });

        // Unlock body scroll + remove Escape listener
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onEscape);

        expandedCard = null;
    }
}
