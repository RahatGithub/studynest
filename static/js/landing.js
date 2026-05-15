/* ============================================
   StudyNest Landing Page — GSAP Animations
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Utility: Split text into words ---------- */
function splitTextIntoWords(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return [];
    const text = el.textContent.trim();
    el.innerHTML = text
        .split(' ')
        .map(word => `<span class="word">${word}</span>`)
        .join(' ');
    return el.querySelectorAll('.word');
}

/* ---------- Mobile nav toggle ---------- */
(function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function closeMenu() {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        overlay.classList.remove('active');
    }

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            toggle.classList.add('active');
            menu.classList.add('open');
            overlay.classList.add('active');
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Close on nav link click
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
})();

/* ===========================================
   HERO ANIMATIONS
   =========================================== */
(function initHeroAnimations() {
    const words = splitTextIntoWords('hero-title');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Floating orbs fade in
    tl.to('.hero-orb', {
        opacity: 0.6,
        duration: 1.5,
        stagger: 0.2,
    });

    // 2. Overline text
    tl.to('.hero-overline', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=1');

    // Set initial state for overline
    gsap.set('.hero-overline', { y: 25 });

    // 3. Headline words
    if (words.length) {
        tl.to(words, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.7,
            stagger: 0.06,
        }, '-=0.3');

        // Set initial state for words
        gsap.set(words, { y: 50, opacity: 0, rotationX: -15 });
    }

    // 4. Subtitle
    tl.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.3');

    gsap.set('.hero-subtitle', { y: 20 });

    // 5. CTA buttons
    tl.to('.hero-ctas', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.4)',
    }, '-=0.3');

    gsap.set('.hero-ctas', { y: 20 });

    // 6. Scroll indicator
    tl.to('.scroll-indicator', {
        opacity: 1,
        duration: 0.6,
    }, '-=0.2');
})();

/* ---------- Floating orbs — continuous motion ---------- */
(function initFloatingOrbs() {
    document.querySelectorAll('.hero-orb').forEach((orb, i) => {
        const xRange = 60 + i * 20;
        const yRange = 40 + i * 15;
        const duration = 7 + i * 2.5;

        gsap.to(orb, {
            x: `random(-${xRange}, ${xRange})`,
            y: `random(-${yRange}, ${yRange})`,
            duration: duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.8,
        });
    });
})();

/* ---------- Navbar scroll effect ---------- */
ScrollTrigger.create({
    start: 'top -80',
    onEnter: () => document.getElementById('landing-nav').classList.add('scrolled'),
    onLeaveBack: () => document.getElementById('landing-nav').classList.remove('scrolled'),
});

/* ===========================================
   FEATURES SECTION — Advanced Animations
   =========================================== */

/* --- Section header: overline, title chars, underline, subtitle --- */
(function initFeaturesHeader() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#features',
            start: 'top 78%',
            toggleActions: 'play none none none',
        },
    });

    // Overline slides in
    tl.from('#features .section-overline', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
    });

    // Title characters split and stagger
    const titleEl = document.getElementById('features-title');
    if (titleEl) {
        const text = titleEl.textContent.trim();
        titleEl.innerHTML = text
            .split('')
            .map(ch => ch === ' '
                ? ' '
                : `<span class="f-char" style="display:inline-block">${ch}</span>`)
            .join('');
        const chars = titleEl.querySelectorAll('.f-char');
        tl.from(chars, {
            y: 40,
            opacity: 0,
            rotationX: -90,
            duration: 0.6,
            stagger: 0.03,
            ease: 'back.out(1.7)',
        }, '-=0.2');
    }

    // Gradient underline draws in
    tl.to('.title-underline-inner', {
        scaleX: 1,
        duration: 0.7,
        ease: 'power3.inOut',
    }, '-=0.3');

    // Subtitle fades up
    tl.from('#features .section-subtitle', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
    }, '-=0.4');
})();

/* --- Background particles float and pulse --- */
(function initFeatureParticles() {
    gsap.to('.f-particle', {
        scrollTrigger: {
            trigger: '#features',
            start: 'top 80%',
            toggleActions: 'play none none none',
        },
        opacity: 0.5,
        duration: 1,
        stagger: 0.12,
    });

    document.querySelectorAll('.f-particle').forEach((p, i) => {
        gsap.to(p, {
            y: `random(-40, 40)`,
            x: `random(-30, 30)`,
            duration: 4 + i * 1.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.5,
        });
        gsap.to(p, {
            opacity: 'random(0.2, 0.7)',
            duration: 2 + i * 0.6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.3,
        });
    });
})();

/* --- Feature cards: 3D entrance with stagger --- */
(function initFeatureCards() {
    const cards = gsap.utils.toArray('.feature-card');

    // Entrance timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 78%',
            toggleActions: 'play none none none',
        },
    });

    cards.forEach((card, i) => {
        // Card entrance — slide in from left with 3D rotation
        tl.from(card, {
            x: -120,
            y: 40,
            opacity: 0,
            rotationX: -15,
            rotationY: i % 2 === 0 ? -8 : 8,
            scale: 0.9,
            duration: 0.8,
            ease: 'power3.out',
        }, i * 0.15);

        // Icon ring pulse after card lands
        const ring = card.querySelector('.icon-ring');
        if (ring) {
            tl.to(ring, {
                opacity: 0.6,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out',
            }, i * 0.15 + 0.5);

            tl.to(ring, {
                opacity: 0,
                scale: 1.5,
                duration: 0.6,
                ease: 'power1.out',
            }, i * 0.15 + 0.8);
        }

        // Shine sweep across card
        const shine = card.querySelector('.feature-shine');
        if (shine) {
            tl.to(shine, {
                left: '150%',
                duration: 0.8,
                ease: 'power2.inOut',
            }, i * 0.15 + 0.4);
        }
    });

    /* --- Mouse-follow glow + 3D tilt on hover (desktop only) --- */
    if (window.matchMedia('(min-width: 769px) and (hover: hover)').matches) {
        cards.forEach(card => {
            const glow = card.querySelector('.feature-card-glow');
            let borderAngle = 0;
            let borderRaf = null;

            // Rotating border animation
            function animateBorder() {
                borderAngle = (borderAngle + 0.8) % 360;
                card.style.setProperty('--border-angle', borderAngle + 'deg');
                borderRaf = requestAnimationFrame(animateBorder);
            }

            card.addEventListener('mouseenter', () => {
                animateBorder();
            });

            card.addEventListener('mouseleave', () => {
                cancelAnimationFrame(borderRaf);
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // 3D tilt
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.3,
                    ease: 'power1.out',
                    overwrite: 'auto',
                });

                // Glow follows cursor
                if (glow) {
                    gsap.to(glow, {
                        left: x,
                        top: y,
                        duration: 0.3,
                        ease: 'power1.out',
                    });
                }
            });
        });
    }
})();

/* ===========================================
   HOW IT WORKS SECTION
   =========================================== */
gsap.from('#how-it-works .section-header', {
    scrollTrigger: {
        trigger: '#how-it-works',
        start: 'top 80%',
        toggleActions: 'play none none none',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
});

gsap.from('.step-item', {
    scrollTrigger: {
        trigger: '.steps-wrapper',
        start: 'top 80%',
        toggleActions: 'play none none none',
    },
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    ease: 'power2.out',
});

gsap.from('.step-connector', {
    scrollTrigger: {
        trigger: '.steps-wrapper',
        start: 'top 80%',
        toggleActions: 'play none none none',
    },
    scaleX: 0,
    scaleY: 0,
    duration: 0.8,
    stagger: 0.3,
    ease: 'power2.inOut',
    delay: 0.3,
});

/* ===========================================
   DEMO SECTION
   =========================================== */
gsap.from('#demo .section-header', {
    scrollTrigger: {
        trigger: '#demo',
        start: 'top 80%',
        toggleActions: 'play none none none',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
});

gsap.from('.demo-card', {
    scrollTrigger: {
        trigger: '.demo-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
    },
    y: 80,
    opacity: 0,
    rotationY: -10,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
});

/* ===========================================
   FOOTER
   =========================================== */
gsap.from('.footer-content', {
    scrollTrigger: {
        trigger: '.landing-footer',
        start: 'top 90%',
        toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
});

/* ===========================================
   COPY TO CLIPBOARD
   =========================================== */
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        navigator.clipboard.writeText(text).then(() => {
            const icon = btn.querySelector('i');
            icon.classList.replace('bi-clipboard', 'bi-check-lg');
            btn.classList.add('copied');
            setTimeout(() => {
                icon.classList.replace('bi-check-lg', 'bi-clipboard');
                btn.classList.remove('copied');
            }, 1500);
        });
    });
});

/* ===========================================
   RESPONSIVE — reduce animations on mobile
   =========================================== */
ScrollTrigger.matchMedia({
    '(max-width: 768px)': function () {
        // Reduce orb sizes/movement on mobile for performance
        document.querySelectorAll('.hero-orb').forEach(orb => {
            gsap.killTweensOf(orb);
            gsap.set(orb, { x: 0, y: 0 });
            gsap.to(orb, {
                x: 'random(-30, 30)',
                y: 'random(-20, 20)',
                duration: 10,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });
        });
    },
});
