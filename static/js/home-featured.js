/* ============================================
   StudyNest Home — Featured Courses Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('home-featured');
    const grid = document.getElementById('home-feat-grid');
    if (!section || !grid) return;

    const cards = gsap.utils.toArray('.course-card');

    // Section header entrance
    gsap.from('.home-feat-eyebrow', {
        opacity: 0, y: 10, duration: 0.4,
        scrollTrigger: { trigger: section, start: 'top 80%' },
    });
    gsap.from('.home-feat-title', {
        opacity: 0, y: 15, duration: 0.5, delay: 0.1,
        scrollTrigger: { trigger: section, start: 'top 80%' },
    });
    gsap.from('.home-feat-sub', {
        opacity: 0, y: 10, duration: 0.4, delay: 0.2,
        scrollTrigger: { trigger: section, start: 'top 80%' },
    });
    gsap.from('.home-feat-viewall', {
        opacity: 0, x: -10, duration: 0.4, delay: 0.3,
        scrollTrigger: { trigger: section, start: 'top 80%' },
    });

    // Cards stagger entrance
    if (cards.length) {
        gsap.from(cards, {
            opacity: 0,
            y: 30,
            scale: 0.97,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 75%',
            },
        });
    }

    // Free badge subtle pulse
    const freeBadges = document.querySelectorAll('.course-card-price-free');
    freeBadges.forEach((badge, i) => {
        gsap.to(badge, {
            scale: 1.05,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.5,
        });
    });
});
