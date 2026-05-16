/* ============================================
   StudyNest Home — Instructor CTA Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('home-instructor');
    if (!section) return;

    // Left content entrance
    const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
    });

    tl.from('.home-inst-eyebrow', { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' });
    tl.from('.home-inst-title', { opacity: 0, y: 15, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    tl.from('.home-inst-body', { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' }, '-=0.2');

    // Checklist stagger
    const checks = gsap.utils.toArray('.home-inst-checks li');
    if (checks.length) {
        tl.from(checks, { opacity: 0, x: -15, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.1');
    }

    // CTA
    tl.from('.home-inst-ctas', { opacity: 0, y: 10, scale: 0.96, duration: 0.4, ease: 'power2.out' }, '-=0.1');

    // Right column: Avatar collage
    const visual = document.getElementById('inst-visual');
    if (!visual) return;

    const avatars = visual.querySelectorAll('.inst-avatar');
    const statBadge = visual.querySelector('.inst-stat-badge');

    // Avatars entrance
    gsap.to(avatars, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' },
    });

    // Set initial state for avatars
    gsap.set(avatars, { opacity: 0, y: 10, scale: 0.9 });

    // Stat badge last
    if (statBadge) {
        gsap.to(statBadge, {
            opacity: 1,
            duration: 0.5,
            delay: 0.8,
            scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' },
        });
    }

    // Floating animation for avatars (subtle, infinite)
    avatars.forEach((av, i) => {
        const duration = 3 + (i % 4) * 0.7;
        gsap.to(av, {
            y: -4,
            duration: duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.4,
        });
    });
});
