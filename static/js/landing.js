/* ============================================
   StudyNest Landing Page — GSAP Animations
   ============================================ */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip, Observer, ScrollToPlugin);

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

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
});

/* ---------- Mobile nav ---------- */
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
        if (menu.classList.contains('open')) closeMenu();
        else { toggle.classList.add('active'); menu.classList.add('open'); overlay.classList.add('active'); }
    });
    overlay.addEventListener('click', closeMenu);
    menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
})();

/* ===========================================
   HERO — Cinematic Entrance
   =========================================== */
(function initHeroAnimations() {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (!heroTitle) return;

    const splitTitle = new SplitText(heroTitle, { type: 'chars,words', charsClass: 'char', wordsClass: 'word' });
    gsap.set(splitTitle.chars, { y: 100, opacity: 0, rotateX: -90, transformOrigin: '50% 50% -50px', filter: 'blur(4px)' });

    let splitSub = null;
    if (heroSubtitle) {
        splitSub = new SplitText(heroSubtitle, { type: 'words', wordsClass: 'sub-word' });
        gsap.set(splitSub.words, { y: 20, opacity: 0 });
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true }, delay: 0.3 });
    tl.to('.hero-orb', { opacity: 1, duration: 2, stagger: 0.3, ease: 'power2.out' });
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.2);
    tl.to(splitTitle.chars, { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 1, stagger: 0.03, ease: 'back.out(1.7)' }, 0.5);
    if (splitSub) tl.to(splitSub.words, { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out' }, 1.2);
    tl.to('.hero-ctas', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }, 1.5);
    tl.to('.hero-stats', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.7);
    gsap.set('.hero-card', { y: 50, opacity: 0, scale: 0.9 });
    tl.to('.hero-card', { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)' }, 1.0);
    tl.to('.scroll-indicator', { opacity: 1, duration: 0.6 }, 2.0);

    tl.call(() => {
        const shine = document.createElement('div');
        shine.style.cssText = 'position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);pointer-events:none;';
        heroTitle.style.position = 'relative';
        heroTitle.style.overflow = 'hidden';
        heroTitle.appendChild(shine);
        gsap.to(shine, { left: '150%', duration: 1.2, ease: 'power2.inOut', onComplete: () => shine.remove() });
    }, null, null, 2.5);
})();

/* --- Floating orbs --- */
(function initFloatingOrbs() {
    const settings = [
        { xRange: 80, yRange: 50, duration: 8, scale: [1, 1.15], rotate: 20 },
        { xRange: 70, yRange: 60, duration: 12, scale: [1, 1.1], rotate: -15 },
        { xRange: 60, yRange: 40, duration: 15, scale: [1, 1.2], rotate: 25 },
        { xRange: 50, yRange: 45, duration: 10, scale: [1, 1.12], rotate: -20 },
    ];
    document.querySelectorAll('.hero-orb').forEach((orb, i) => {
        const s = settings[i] || settings[0];
        gsap.to(orb, { x: `random(-${s.xRange}, ${s.xRange})`, y: `random(-${s.yRange}, ${s.yRange})`, scale: `random(${s.scale[0]}, ${s.scale[1]})`, rotation: s.rotate, duration: s.duration, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.5 });
    });
})();

/* --- Stat counters --- */
(function initStatCounters() {
    document.querySelectorAll('.hero-stat-number').forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const isDecimal = stat.dataset.decimal === 'true';
        const obj = { value: 0 };
        gsap.to(obj, {
            value: target, duration: 2, ease: 'power2.out',
            scrollTrigger: { trigger: stat, start: 'top 90%', toggleActions: 'play none none none' },
            onUpdate: () => { stat.textContent = isDecimal ? obj.value.toFixed(1) : Math.round(obj.value).toLocaleString(); },
            onComplete: () => { gsap.fromTo(stat, { scale: 1 }, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }); },
        });
    });
})();

/* --- Card parallax (desktop) --- */
(function initCardParallax() {
    if (!window.matchMedia('(min-width: 769px) and (hover: hover)').matches) return;
    const hero = document.getElementById('hero');
    const cards = document.querySelectorAll('.hero-card');
    if (!hero || !cards.length) return;
    const animators = [];
    cards.forEach((card, i) => {
        const intensity = 0.02 + i * 0.02;
        animators.push({ x: gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' }), y: gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' }), intensity });
    });
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        animators.forEach(a => { a.x(mx * a.intensity); a.y(my * a.intensity); });
    });
    hero.addEventListener('mouseleave', () => animators.forEach(a => { a.x(0); a.y(0); }));
})();

/* --- Magnetic CTA --- */
(function initMagneticButton() {
    if (!window.matchMedia('(min-width: 769px) and (hover: hover)').matches) return;
    const btn = document.getElementById('hero-cta-primary');
    if (!btn) return;
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
    btn.parentElement.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            const pull = (1 - dist / 100) * 20;
            const angle = Math.atan2(dy, dx);
            xTo(Math.cos(angle) * pull); yTo(Math.sin(angle) * pull);
            gsap.to(btn, { scale: 1.05, duration: 0.3, overwrite: 'auto' });
        } else { xTo(0); yTo(0); gsap.to(btn, { scale: 1, duration: 0.3, overwrite: 'auto' }); }
    });
    btn.parentElement.addEventListener('mouseleave', () => { xTo(0); yTo(0); gsap.to(btn, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' }); });
})();

/* --- Scroll indicator bounce --- */
(function () {
    const arrow = document.querySelector('.scroll-arrow');
    if (arrow) gsap.to(arrow, { y: 10, duration: 1.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
})();

/* --- Navbar scroll --- */
ScrollTrigger.create({
    start: 'top -80',
    onEnter: () => document.getElementById('landing-nav').classList.add('scrolled'),
    onLeaveBack: () => document.getElementById('landing-nav').classList.remove('scrolled'),
});

/* ===========================================
   02 — FEATURES: Horizontal Pinned Scroll
   =========================================== */
(function initFeatures() {
    const track = document.querySelector('.features-track');
    const container = document.querySelector('.features-pin-container');
    const cards = gsap.utils.toArray('.fcard');
    const progressFill = document.querySelector('.features-progress-fill');
    const counterEl = document.querySelector('.fc-current');
    if (!track || !container || !cards.length) return;

    // Mobile: skip pin, simple fade-in
    if (window.innerWidth <= 768) {
        cards.forEach(card => {
            gsap.from(card, {
                y: 60, opacity: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
            });
        });
        return;
    }

    // Section title entrance
    const titleEl = document.getElementById('features-title');
    if (titleEl) {
        const splitFeatTitle = new SplitText(titleEl, { type: 'words', wordsClass: 'ft-word' });
        gsap.from(splitFeatTitle.words, {
            y: 30, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: container, start: 'top 80%', toggleActions: 'play none none none' },
        });
    }

    // Horizontal scroll
    const scrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1.5,
            end: () => '+=' + track.scrollWidth,
            onUpdate: (self) => {
                // Progress bar
                if (progressFill) progressFill.style.width = (self.progress * 100) + '%';
                // Counter
                if (counterEl) {
                    const idx = Math.min(Math.floor(self.progress * cards.length), cards.length - 1) + 1;
                    counterEl.textContent = idx;
                }
            },
        },
    });

    // Per-card animations inside horizontal scroll
    cards.forEach((card, i) => {
        const svg = card.querySelector('.fcard-svg');
        const paths = card.querySelectorAll('.svg-draw');

        // Card focus effect
        gsap.fromTo(card,
            { opacity: 0.4, scale: 0.95 },
            {
                opacity: 1, scale: 1, duration: 1,
                scrollTrigger: { trigger: card, containerAnimation: scrollTween, start: 'left 80%', end: 'left 30%', scrub: true },
            }
        );

        // SVG draw-in
        if (paths.length) {
            paths.forEach(path => {
                const len = path.getTotalLength ? path.getTotalLength() : 500;
                gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                gsap.to(path, {
                    strokeDashoffset: 0, duration: 1.5, ease: 'power2.out',
                    scrollTrigger: { trigger: card, containerAnimation: scrollTween, start: 'left 60%', toggleActions: 'play none none none' },
                });
            });
        }

        // Background tint
        const color = card.dataset.color;
        if (color && svg) svg.style.color = color;
    });

    // 3D tilt on hover (desktop)
    if (window.matchMedia('(hover: hover)').matches) {
        cards.forEach(card => {
            const inner = card.querySelector('.fcard-inner');
            if (!inner) return;
            card.addEventListener('mousemove', (e) => {
                const rect = inner.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(inner, { rotateX: y * -10, rotateY: x * 10, duration: 0.3, ease: 'power1.out', overwrite: 'auto' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
            });
        });
    }
})();

/* ===========================================
   03 — PROCESS: Self-Drawing Timeline
   =========================================== */
(function initTimeline() {
    const wrapper = document.querySelector('.timeline-wrapper');
    const svg = document.querySelector('.timeline-svg');
    const steps = gsap.utils.toArray('.tl-step');
    if (!wrapper || !steps.length) return;

    const isMobile = window.innerWidth <= 768;

    // Build SVG path dynamically based on wrapper height
    if (svg && !isMobile) {
        const buildPath = () => {
            const h = wrapper.offsetHeight;
            const w = 100;
            svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
            // Wavy bezier path
            const d = `M50 0 C55 ${h * 0.12}, 42 ${h * 0.18}, 50 ${h * 0.25} C58 ${h * 0.32}, 42 ${h * 0.38}, 50 ${h * 0.5} C58 ${h * 0.62}, 42 ${h * 0.68}, 50 ${h * 0.75} C58 ${h * 0.82}, 45 ${h * 0.92}, 50 ${h}`;
            svg.querySelector('.tl-path-bg').setAttribute('d', d);
            svg.querySelector('.tl-path').setAttribute('d', d);
        };
        buildPath();

        const tlPath = svg.querySelector('.tl-path');
        const pathLen = tlPath.getTotalLength();
        gsap.set(tlPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });

        gsap.to(tlPath, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: wrapper, start: 'top 60%', end: 'bottom 40%', scrub: 1 },
        });
    }

    // Section title
    const processTitle = document.getElementById('process-title');
    if (processTitle) {
        const splitPT = new SplitText(processTitle, { type: 'words', wordsClass: 'pt-word' });
        gsap.from(splitPT.words, {
            y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: processTitle, start: 'top 85%', toggleActions: 'play none none none' },
        });
    }

    // Per-step animations
    steps.forEach((step) => {
        const node = step.querySelector('.tl-node');
        const num = step.querySelector('.tl-num');
        const content = step.querySelector('.tl-content');
        const icon = step.querySelector('.tl-icon');
        const isLeft = step.classList.contains('tl-step-left');

        const tl = gsap.timeline({
            scrollTrigger: { trigger: step, start: 'top 70%', toggleActions: 'play none none none' },
        });

        // Node pops in
        if (node) {
            tl.to(node, { opacity: 1, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            tl.call(() => node.classList.add('active'));
        }

        // Number fades in
        if (num) tl.to(num, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3');

        // Content slides in from side
        if (content) {
            const xDir = isMobile ? 0 : (isLeft ? -80 : 80);
            tl.fromTo(content, { x: xDir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.3');
        }

        // Icon
        if (icon) {
            tl.to(icon, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4');
            // Floating
            gsap.to(icon.querySelector('i'), { y: -5, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: Math.random() * 2 });
        }

        // Node pulse (infinite, after activation)
        if (node) {
            tl.to(node, { scale: 1.1, duration: 0.8, ease: 'sine.inOut', repeat: -1, yoyo: true }, '+=0.2');
        }
    });
})();

/* ===========================================
   04 — DEMO: Pinned Device Showcase
   =========================================== */
(function initDemo() {
    const container = document.querySelector('.demo-pin-container');
    const scenes = gsap.utils.toArray('.demo-scene');
    const dots = gsap.utils.toArray('.demo-dot');
    const labelNum = document.querySelector('.dsl-num');
    const labelText = document.querySelector('.dsl-text');
    const floats = gsap.utils.toArray('.demo-float');
    if (!container || scenes.length < 2) return;

    const sceneLabels = [
        'Track your progress',
        'Join live sessions',
        'Get AI-powered help',
        'Earn certificates',
    ];

    const isMobile = window.innerWidth <= 768;

    // Floating cards animation
    floats.forEach((f, i) => {
        gsap.to(f, { y: `random(-8, 8)`, duration: 3 + i * 0.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.3 });
    });

    // Section title
    const demoTitle = document.getElementById('demo-title');
    if (demoTitle) {
        gsap.from(demoTitle, {
            y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: container, start: 'top 80%', toggleActions: 'play none none none' },
        });
    }

    // Device entrance
    const deviceFrame = document.querySelector('.device-frame');
    if (deviceFrame) {
        gsap.from(deviceFrame, {
            rotateY: 15, rotateX: -10, scale: 0.9, opacity: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: deviceFrame, start: 'top 80%', toggleActions: 'play none none none' },
        });
    }

    // Floating cards entrance
    floats.forEach((f, i) => {
        gsap.to(f, {
            opacity: 1, duration: 0.6, delay: 0.3 + i * 0.15,
            scrollTrigger: { trigger: container, start: 'top 60%', toggleActions: 'play none none none' },
        });
    });

    if (isMobile) {
        // Mobile: simple scroll-triggered scene reveals
        scenes.forEach((scene, i) => {
            scene.style.position = 'relative';
            scene.style.opacity = '1';
            scene.style.display = i === 0 ? 'flex' : 'none';
        });
        // Just show first scene on mobile
        return;
    }

    // Desktop: Pinned scroll with scene transitions
    const numScenes = scenes.length;
    const scrollPerScene = 100; // vh per scene

    function switchScene(index) {
        scenes.forEach((s, i) => {
            if (i === index) {
                gsap.to(s, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5 });
                s.classList.add('scene-active');
            } else {
                gsap.to(s, { opacity: 0, scale: 0.95, filter: 'blur(6px)', duration: 0.4 });
                s.classList.remove('scene-active');
            }
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        if (labelNum) labelNum.textContent = String(index + 1).padStart(2, '0');
        if (labelText) labelText.textContent = sceneLabels[index] || '';
    }

    ScrollTrigger.create({
        trigger: container,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => '+=' + (numScenes * scrollPerScene) + '%',
        onUpdate: (self) => {
            const idx = Math.min(Math.floor(self.progress * numScenes), numScenes - 1);
            switchScene(idx);
        },
    });

    // Dot click navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => switchScene(i));
    });
})();

/* ===========================================
   05 — FOOTER: Curtain Reveal
   =========================================== */
(function initFooter() {
    const footer = document.querySelector('.landing-footer');
    if (!footer) return;

    // Curtain reveal with clip-path
    gsap.to(footer, {
        clipPath: 'inset(0 0 0 0)',
        ease: 'none',
        scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1,
        },
    });

    // Link columns stagger entrance
    gsap.from('.footer-col-title', {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.6,
        scrollTrigger: { trigger: '.footer-columns', start: 'top 85%', toggleActions: 'play none none none' },
    });
    gsap.from('.footer-link', {
        y: 15, opacity: 0, stagger: 0.05, duration: 0.5, delay: 0.2,
        scrollTrigger: { trigger: '.footer-columns', start: 'top 85%', toggleActions: 'play none none none' },
    });

    // Giant wordmark SplitText
    const wordmark = document.getElementById('footer-wordmark');
    if (wordmark) {
        const splitWM = new SplitText(wordmark, { type: 'chars', charsClass: 'wm-char' });
        gsap.set(splitWM.chars, { display: 'inline-block' });
        gsap.from(splitWM.chars, {
            y: '100%', opacity: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: wordmark, start: 'top 90%', toggleActions: 'play none none none' },
        });

        // Breathing animation after entrance
        gsap.to(wordmark, {
            scale: 1.02, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2,
        });

        // Hover: characters follow cursor slightly
        if (window.matchMedia('(hover: hover)').matches) {
            wordmark.addEventListener('mousemove', (e) => {
                const rect = wordmark.getBoundingClientRect();
                const mx = (e.clientX - rect.left) / rect.width - 0.5;
                splitWM.chars.forEach((ch, i) => {
                    const offset = (i / splitWM.chars.length - 0.5);
                    gsap.to(ch, { y: mx * offset * 20, rotation: mx * offset * 5, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                });
            });
            wordmark.addEventListener('mouseleave', () => {
                gsap.to(splitWM.chars, { y: 0, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', stagger: 0.02 });
            });
        }
    }

    // Bottom bar fade in
    gsap.from('.footer-bottom', {
        y: 20, opacity: 0, duration: 0.7,
        scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%', toggleActions: 'play none none none' },
    });

    // Newsletter focus animation
    const nlInput = document.querySelector('.footer-nl-input');
    const nlBtn = document.querySelector('.footer-nl-btn');
    if (nlInput && nlBtn) {
        nlInput.addEventListener('focus', () => {
            gsap.to(nlBtn, { rotation: 0, scale: 1.05, duration: 0.3 });
        });
        nlInput.addEventListener('blur', () => {
            gsap.to(nlBtn, { scale: 1, duration: 0.3 });
        });
    }
})();

/* ===========================================
   SCROLL-TO-TOP BUTTON
   =========================================== */
(function initScrollTop() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;
    const circle = btn.querySelector('.scroll-top-ring circle');
    const circumference = 2 * Math.PI * 26; // r=26

    // Show/hide based on scroll position
    ScrollTrigger.create({
        start: 'top -50%',
        onEnter: () => btn.classList.add('visible'),
        onLeaveBack: () => btn.classList.remove('visible'),
    });

    // Progress ring
    if (circle) {
        gsap.set(circle, { strokeDasharray: circumference, strokeDashoffset: circumference });
        ScrollTrigger.create({
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                circle.style.strokeDashoffset = circumference * (1 - self.progress);
            },
        });
    }

    btn.addEventListener('click', () => {
        if (smoother) {
            smoother.scrollTo(0, true);
        } else {
            gsap.to(window, { scrollTo: 0, duration: 1.5, ease: 'power3.inOut' });
        }
    });
})();

/* ===========================================
   DEMO CREDENTIALS — entrance
   =========================================== */
gsap.from('.demo-creds-section .section-header', {
    scrollTrigger: { trigger: '.demo-creds-section', start: 'top 80%', toggleActions: 'play none none none' },
    y: 40, opacity: 0, duration: 0.8,
});

gsap.from('.demo-card', {
    scrollTrigger: { trigger: '.demo-grid', start: 'top 80%', toggleActions: 'play none none none' },
    y: 80, opacity: 0, rotationY: -10, duration: 0.8, stagger: 0.15, ease: 'power3.out',
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
            setTimeout(() => { icon.classList.replace('bi-check-lg', 'bi-clipboard'); btn.classList.remove('copied'); }, 1500);
        });
    });
});

/* ===========================================
   RESPONSIVE — reduce on mobile
   =========================================== */
ScrollTrigger.matchMedia({
    '(max-width: 768px)': function () {
        document.querySelectorAll('.hero-orb').forEach(orb => {
            gsap.killTweensOf(orb);
            gsap.set(orb, { x: 0, y: 0, scale: 1 });
            gsap.to(orb, { x: 'random(-30, 30)', y: 'random(-20, 20)', duration: 10, ease: 'sine.inOut', repeat: -1, yoyo: true });
        });
    },
});
