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
       Right column: Rotating Card Stack Carousel
       =========================================== */
    if (visual) {
        const cards = gsap.utils.toArray(visual.querySelectorAll('.preview-card'));

        if (cards.length >= 3) {
            initCardCarousel(cards, visual);
        } else {
            // Fallback: simple entrance for fewer cards
            gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
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
   Card Carousel Logic
   =========================================== */
function initCardCarousel(cards, container) {
    // Skip carousel entirely for reduced-motion users
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3 stack positions: front, middle, back
    const positions = [
        { zIndex: 3, scale: 1,    y: 0,   x: 0,  opacity: 1    }, // front
        { zIndex: 2, scale: 0.92, y: -12, x: 15,  opacity: 0.7  }, // middle
        { zIndex: 1, scale: 0.85, y: -22, x: 28,  opacity: 0.45 }, // back
    ];

    // order[positionIndex] = cardIndex
    // Initially: card0=front, card1=middle, card2=back
    let order = [0, 1, 2];

    // Set a card to a position (animated or instant)
    function setPosition(card, posIndex, animated) {
        const pos = positions[posIndex];
        const props = {
            zIndex: pos.zIndex,
            scale: pos.scale,
            y: pos.y,
            x: pos.x,
            opacity: pos.opacity,
            ease: 'power2.inOut',
            overwrite: 'auto',
        };
        if (animated) {
            props.duration = 0.8;
            return gsap.to(card, props);
        } else {
            gsap.set(card, props);
        }
    }

    // Entrance: stagger cards into their initial positions
    const entranceTl = gsap.timeline({ delay: 0.3 });
    cards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, scale: 0.85, y: 30 });
        entranceTl.to(card, {
            ...positions[i],
            duration: 0.7,
            ease: 'power3.out',
        }, i * 0.15);
    });

    if (prefersReduced) return; // No cycling for reduced-motion

    // Rotate the stack: front → back, everyone else moves forward
    function rotateStack() {
        // [front, middle, back] → [back, front, middle]
        // i.e. the card that was at front goes to back
        order = [order[2], order[0], order[1]];

        order.forEach((cardIdx, posIdx) => {
            setPosition(cards[cardIdx], posIdx, true);
        });

        scheduleNext();
    }

    // Schedule next rotation using gsap.delayedCall (respects global timeline)
    let nextCall = null;
    function scheduleNext() {
        nextCall = gsap.delayedCall(4, rotateStack);
    }

    // Start cycling after entrance animation completes
    entranceTl.call(scheduleNext);

    // Pause on hover
    container.addEventListener('mouseenter', () => {
        if (nextCall) nextCall.pause();
    });
    container.addEventListener('mouseleave', () => {
        if (nextCall) nextCall.resume();
    });
}
