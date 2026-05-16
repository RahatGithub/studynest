/* ============================================
   StudyNest Landing Page — GSAP Animations
   Premium plugins: ScrollSmoother, SplitText, Flip, Observer
   ============================================ */

/* ---------- Register all GSAP plugins ---------- */
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip, Observer);

/* ---------- Performance config ---------- */
gsap.ticker.lagSmoothing(1000, 16);

/* ---------- ScrollSmoother (desktop only) ---------- */
let smoother = null;
if (window.matchMedia('(min-width: 769px)').matches) {
    smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
        smoothTouch: 0.1,
    });
}

/* ---------- Resize handler ---------- */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

/* ---------- Mobile nav toggle ---------- */
(function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

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
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
})();

/* ===========================================
   HERO ANIMATIONS — Cinematic Entrance
   =========================================== */
(function initHeroAnimations() {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (!heroTitle) return;

    /* --- 1. SplitText headline — character-by-character reveal --- */
    const splitTitle = new SplitText(heroTitle, {
        type: 'chars,words',
        charsClass: 'char',
        wordsClass: 'word',
    });

    // Set initial state for characters
    gsap.set(splitTitle.chars, {
        y: 100,
        opacity: 0,
        rotateX: -90,
        transformOrigin: '50% 50% -50px',
        filter: 'blur(4px)',
    });

    /* --- 2. SplitText subtitle — word-by-word reveal --- */
    let splitSub = null;
    if (heroSubtitle) {
        splitSub = new SplitText(heroSubtitle, {
            type: 'words',
            wordsClass: 'sub-word',
        });
        gsap.set(splitSub.words, { y: 20, opacity: 0 });
    }

    /* --- Master timeline --- */
    const tl = gsap.timeline({
        defaults: { ease: 'power3.out', force3D: true },
        delay: 0.3,
    });

    // Background orbs fade in
    tl.to('.hero-orb', {
        opacity: 1,
        duration: 2,
        stagger: 0.3,
        ease: 'power2.out',
    });

    // Eyebrow text
    tl.to('.hero-eyebrow', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, 0.2);

    // HEADLINE: characters rotate in from below with 3D effect
    tl.to(splitTitle.chars, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.03,
        ease: 'back.out(1.7)',
    }, 0.5);

    // Subtitle words
    if (splitSub) {
        tl.to(splitSub.words, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: 'power2.out',
        }, 1.2);
    }

    // CTAs
    tl.to('.hero-ctas', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'back.out(1.4)',
    }, 1.5);

    // Stats row
    tl.to('.hero-stats', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
    }, 1.7);

    // Floating cards entrance (staggered)
    tl.to('.hero-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.5)',
    }, 1.0);

    // Set cards initial state
    gsap.set('.hero-card', { y: 50, opacity: 0, scale: 0.9 });

    // Scroll indicator
    tl.to('.scroll-indicator', {
        opacity: 1,
        duration: 0.6,
    }, 2.0);

    /* --- 3. Headline shine sweep (1s after headline completes) --- */
    tl.call(() => {
        // Create a shine element over the headline
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
            pointer-events: none;
        `;
        heroTitle.style.position = 'relative';
        heroTitle.style.overflow = 'hidden';
        heroTitle.appendChild(shine);

        gsap.to(shine, {
            left: '150%',
            duration: 1.2,
            ease: 'power2.inOut',
            onComplete: () => shine.remove(),
        });
    }, null, null, 2.5);
})();

/* ===========================================
   ANIMATED BACKGROUND ORBS — Continuous
   =========================================== */
(function initFloatingOrbs() {
    const orbs = document.querySelectorAll('.hero-orb');
    const settings = [
        { xRange: 80, yRange: 50, duration: 8, scale: [1, 1.15], rotate: 20 },
        { xRange: 70, yRange: 60, duration: 12, scale: [1, 1.1], rotate: -15 },
        { xRange: 60, yRange: 40, duration: 15, scale: [1, 1.2], rotate: 25 },
        { xRange: 50, yRange: 45, duration: 10, scale: [1, 1.12], rotate: -20 },
    ];

    orbs.forEach((orb, i) => {
        const s = settings[i] || settings[0];
        gsap.to(orb, {
            x: `random(-${s.xRange}, ${s.xRange})`,
            y: `random(-${s.yRange}, ${s.yRange})`,
            scale: `random(${s.scale[0]}, ${s.scale[1]})`,
            rotation: s.rotate,
            duration: s.duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.5,
        });
    });
})();

/* ===========================================
   STAT COUNTERS — Count up animation
   =========================================== */
(function initStatCounters() {
    const stats = document.querySelectorAll('.hero-stat-number');
    if (!stats.length) return;

    stats.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const isDecimal = stat.dataset.decimal === 'true';
        const obj = { value: 0 };

        gsap.to(obj, {
            value: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            onUpdate: () => {
                if (isDecimal) {
                    stat.textContent = obj.value.toFixed(1);
                } else {
                    stat.textContent = Math.round(obj.value).toLocaleString();
                }
            },
            onComplete: () => {
                // Subtle bounce on completion
                gsap.fromTo(stat, { scale: 1 }, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut',
                });
            },
        });
    });
})();

/* ===========================================
   FLOATING CARDS — Mouse Parallax (desktop)
   =========================================== */
(function initCardParallax() {
    if (!window.matchMedia('(min-width: 769px) and (hover: hover)').matches) return;

    const hero = document.getElementById('hero');
    const cards = document.querySelectorAll('.hero-card');
    if (!hero || !cards.length) return;

    // Use quickTo for performance
    const cardAnimators = [];
    cards.forEach((card, i) => {
        const intensity = 0.02 + i * 0.02; // 0.02, 0.04, 0.06
        cardAnimators.push({
            x: gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' }),
            y: gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' }),
            intensity,
        });
    });

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;

        cardAnimators.forEach(animator => {
            animator.x(mouseX * animator.intensity);
            animator.y(mouseY * animator.intensity);
        });
    });

    hero.addEventListener('mouseleave', () => {
        cardAnimators.forEach(animator => {
            animator.x(0);
            animator.y(0);
        });
    });
})();

/* ===========================================
   MAGNETIC CTA BUTTON
   =========================================== */
(function initMagneticButton() {
    if (!window.matchMedia('(min-width: 769px) and (hover: hover)').matches) return;

    const btn = document.getElementById('hero-cta-primary');
    if (!btn) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

    const magneticDistance = 100; // px
    const maxPull = 20; // px

    btn.parentElement.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const distX = e.clientX - btnCenterX;
        const distY = e.clientY - btnCenterY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < magneticDistance) {
            const pull = (1 - dist / magneticDistance) * maxPull;
            const angle = Math.atan2(distY, distX);
            xTo(Math.cos(angle) * pull);
            yTo(Math.sin(angle) * pull);
            gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        } else {
            xTo(0);
            yTo(0);
            gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        }
    });

    btn.parentElement.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
        gsap.to(btn, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    });
})();

/* ===========================================
   SCROLL INDICATOR — Bounce animation
   =========================================== */
(function initScrollIndicator() {
    const arrow = document.querySelector('.scroll-arrow');
    if (!arrow) return;

    gsap.to(arrow, {
        y: 10,
        duration: 1.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
    });
})();

/* ===========================================
   NAVBAR — scroll effect
   =========================================== */
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

    tl.from('#features .section-overline', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
    });

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

    tl.to('.title-underline-inner', {
        scaleX: 1,
        duration: 0.7,
        ease: 'power3.inOut',
    }, '-=0.3');

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

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 78%',
            toggleActions: 'play none none none',
        },
    });

    cards.forEach((card, i) => {
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

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.3,
                    ease: 'power1.out',
                    overwrite: 'auto',
                });

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
        document.querySelectorAll('.hero-orb').forEach(orb => {
            gsap.killTweensOf(orb);
            gsap.set(orb, { x: 0, y: 0, scale: 1 });
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
