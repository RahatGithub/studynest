/* ============================================
   StudyNest App — GSAP Animations
   "Focused Learning" — subtle, helpful, never distracting
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Respect prefers-reduced-motion ---------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(20); // effectively instant
}

/* ---------- Default ScrollTrigger config ---------- */
ScrollTrigger.defaults({
    toggleActions: 'play none none none',
});

/* ---------- Page entrance animation ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.app-main');
    if (main) {
        gsap.to(main, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.05,
        });
    }
});

/* ---------- Reusable: fade-in-up ---------- */
function initFadeUpElements() {
    const elements = gsap.utils.toArray('.gsap-fade-up');
    elements.forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
            },
        });
    });
}

/* ---------- Reusable: stagger grid items ---------- */
function initStaggerGrids() {
    const grids = document.querySelectorAll('.gsap-stagger-grid');
    grids.forEach(grid => {
        const items = grid.children;
        if (!items.length) return;
        gsap.from(items, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
            },
        });
    });
}

/* ---------- Navbar scroll shadow ---------- */
function initNavbarScroll() {
    const navbar = document.getElementById('app-navbar');
    if (!navbar) return;
    ScrollTrigger.create({
        start: 'top -20',
        onEnter: () => navbar.classList.add('scrolled'),
        onLeaveBack: () => navbar.classList.remove('scrolled'),
    });
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
    const toggle = document.getElementById('app-nav-toggle');
    const mobile = document.getElementById('app-nav-mobile');
    if (!toggle || !mobile) return;

    toggle.addEventListener('click', () => {
        const isOpen = mobile.classList.contains('open');
        if (isOpen) {
            mobile.classList.remove('open');
            toggle.querySelector('i').classList.replace('bi-x', 'bi-list');
        } else {
            mobile.classList.add('open');
            toggle.querySelector('i').classList.replace('bi-list', 'bi-x');
        }
    });

    // Close on link click
    mobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobile.classList.remove('open');
            toggle.querySelector('i').classList.replace('bi-x', 'bi-list');
        });
    });
}

/* ---------- Footer scroll entrance ---------- */
function initFooterEntrance() {
    const footer = document.querySelector('.app-footer-grid');
    if (!footer) return;
    const cols = footer.children;
    if (!cols.length) return;
    gsap.from(cols, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: footer, start: 'top 90%' },
    });
}

/* ---------- Init all ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initFadeUpElements();
    initStaggerGrids();
    initNavbarScroll();
    initMobileNav();
    initFooterEntrance();
});
