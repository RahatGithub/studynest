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
            initCardCarousel(cards);
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
   DOM nodes move between positions; data rides along.
   =========================================== */
function initCardCarousel(cards) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Three target states: front (index 0), middle (1), back (2)
    const positions = [
        { zIndex: 3, scale: 1,    y: 0,   x: 0,  opacity: 1    }, // front
        { zIndex: 2, scale: 0.92, y: -12, x: 15,  opacity: 0.7  }, // middle
        { zIndex: 1, scale: 0.85, y: -22, x: 28,  opacity: 0.45 }, // back
    ];

    // State array: slot[posIndex] = card element
    // Initially card0=front, card1=middle, card2=back
    let slots = [cards[0], cards[1], cards[2]];

    // --- Entrance: stagger into initial positions ---
    const entranceTl = gsap.timeline({ delay: 0.3 });
    cards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, scale: 0.85, y: 30 });
        entranceTl.to(card, {
            ...positions[i],
            duration: 0.7,
            ease: 'power3.out',
        }, i * 0.15);
    });

    if (prefersReduced) return;

    // --- Cycle: back card rises to front, others shift down ---
    function cycle() {
        const rising   = slots[2]; // back  → will become front
        const toMiddle = slots[0]; // front → will become middle
        const toBack   = slots[1]; // middle → will become back

        // Rotate the state array
        slots = [rising, toMiddle, toBack];

        const tl = gsap.timeline({
            defaults: { duration: 1.2, ease: 'power2.inOut' },
            onComplete: () => gsap.delayedCall(1.5, cycle),
        });

        // Rising card: lift up past the stack, scale to full, land at front
        tl.to(rising, {
            keyframes: [
                { y: -40, scale: 1.0, x: 0, opacity: 1, duration: 0.6, ease: 'power2.in' },
                { y: 0, duration: 0.6, ease: 'power2.out' },
            ],
        }, 0);
        // Flip z-index to top at the halfway mark
        tl.set(rising, { zIndex: positions[0].zIndex }, 0.6);

        // Previous front → middle
        tl.to(toMiddle, {
            ...positions[1],
            duration: 1.2,
        }, 0);
        tl.set(toMiddle, { zIndex: positions[1].zIndex }, 0.6);

        // Previous middle → back
        tl.to(toBack, {
            ...positions[2],
            duration: 1.2,
        }, 0);
        tl.set(toBack, { zIndex: positions[2].zIndex }, 0);
    }

    // Start cycling after entrance completes
    entranceTl.call(() => gsap.delayedCall(1.5, cycle));
}
