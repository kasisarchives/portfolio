/* ============================================================
   script.js — Kaïs.R Portfolio
   Partagé par : index.html, projects.html, about.html, contact.html
   ============================================================ */

/* ─── 1. SMOOTH SCROLL (LENIS) ─────────────────────────────── */

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


/* ─── 2. MENU ──────────────────────────────────────────────── */

const menuBtn = document.getElementById('menuBtn') || document.querySelector('.menu-btn');
const menuOverlay = document.getElementById('menuOverlay') || document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');
let isMenuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!isMenuOpen) {
        menuOverlay.classList.add('active');
        menuBtn.textContent = 'Close';
        document.body.style.overflow = 'hidden';
        gsap.to(menuLinks, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.3
        });
    } else {
        menuOverlay.classList.remove('active');
        menuBtn.textContent = 'Menu';
        document.body.style.overflow = '';
        gsap.to(menuLinks, {
            y: "100%",
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
        });
    }
    isMenuOpen = !isMenuOpen;
});


/* ─── 3. THEME TOGGLE ──────────────────────────────────────── */

const themeBtn = document.getElementById('themeBtn');
const overlay = document.getElementById('themeOverlay');
let isDark = localStorage.getItem('theme') === 'dark';

themeBtn.addEventListener('click', () => {
    const rect = themeBtn.getBoundingClientRect();
    overlay.style.setProperty('--ox', (rect.left + rect.width / 2) + 'px');
    overlay.style.setProperty('--oy', (rect.top + rect.height / 2) + 'px');
    overlay.classList.add('expanding');
    setTimeout(() => {
        isDark = !isDark;
        const newTheme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }, 0);
    setTimeout(() => {
        overlay.classList.remove('expanding');
    }, 0);
});
