/* ============================================
   StudyNest Home — Hero Section Animations
   Subtle, focused, not cinematic
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
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.2 });

    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.4 });
    if (headline) tl.to(headline, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
    if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.4 }, '-=0.25');
    if (search) tl.to(search, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, '-=0.25');
    if (proof) tl.to(proof, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');
    if (ctas) tl.to(ctas, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

    /* --- Right column: preview card stack --- */
    if (visual) {
        const cards = visual.querySelectorAll('.preview-card');
        // Cards enter: back card first, front card last (reverse order in DOM)
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            delay: 0.5,
        });
    }

    /* --- Avatar stack entrance --- */
    const avatars = document.querySelectorAll('.avatar-circle');
    if (avatars.length) {
        gsap.from(avatars, {
            opacity: 0,
            scale: 0.5,
            stagger: 0.05,
            duration: 0.3,
            ease: 'back.out(1.5)',
            delay: 1.0,
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
