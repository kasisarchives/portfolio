/* ============================================================
   script.js — Kaïs.R Archives
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

if (menuBtn && menuOverlay) {
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
}


/* ─── 3. THEME TOGGLE ──────────────────────────────────────── */

const themeBtn = document.getElementById('themeBtn');
const overlay = document.getElementById('themeOverlay');
let isDark = localStorage.getItem('theme') === 'dark';

if (themeBtn && overlay) {
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
}


/* ─── 4. ANIMATIONS & SCROLL FEATURES ──────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

    // A. BARRE DE PROGRESSION & STICKY NAV
    const progressBar = document.getElementById('scrollProgress');
    const navbar = document.querySelector('nav');
    
    // Fonction mise à jour au scroll
    function updateScrollFeatures(scrollY) {
        // Barre de progression
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = progress + "%";
        }

        // Header Sticky
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    // Branchement sur Lenis pour fluidité max
    lenis.on('scroll', (e) => {
        updateScrollFeatures(e.scroll);
    });


    // B. ANIMATIONS D'INTRODUCTION
    gsap.from("nav", {
        y: -15, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1
    });
    
    // C. SCROLL REVEAL (Intersection Observer)
    const elementsToReveal = document.querySelectorAll(
        '.hero, .content-section, .project-item, .about-intro p, .sidebar-block, .skill-item, .xp-item, .contact-info, .field, .submit-btn, .article-header, .article-body, .article-footer'
    );

    elementsToReveal.forEach(el => el.classList.add('reveal-fade-up'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    elementsToReveal.forEach(el => revealObserver.observe(el));


    // D. FOOTER PARALLAX
    const footerBigText = document.querySelector('.footer-big-text');
    if (footerBigText) {
        lenis.on('scroll', (e) => {
            const scrollY = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const progress = scrollY / docHeight;
            gsap.set(footerBigText, {
                y: (1 - progress) * 80, 
                scale: 1 + (progress * 0.05),
                ease: "none"
            });
        });
    }

// E. VALIDATION FORMULAIRE (Si présent)
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        // On sélectionne tous les champs SAUF le honeypot invisible
        const inputs = document.querySelectorAll('.field input:not(#bot-check), .field textarea, .field select');
        const honeypot = document.getElementById('bot-check');

        // Retire le style rouge dès que l'utilisateur commence à corriger
        inputs.forEach(input => {
            input.addEventListener('input', () => input.parentElement.classList.remove('error'));
            input.addEventListener('change', () => input.parentElement.classList.remove('error')); // Pour le select
        });

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Si le robot a rempli le champ caché, on bloque silencieusement
            if (honeypot && honeypot.value !== "") return; 

            let isValid = true;

            inputs.forEach(input => {
                // 1. Vérifie si le champ est vide
                if (!input.value.trim()) {
                    input.parentElement.classList.add('error');
                    isValid = false;
                }
                // 2. Vérifie si l'email a un format valide
                else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    input.parentElement.classList.add('error');
                    isValid = false;
                }
            });

            if (isValid) {
                // SUCCÈS : Animation verte et envoi
                const originalText = submitBtn.innerHTML;
                submitBtn.classList.add('success');
                submitBtn.innerHTML = 'Envoyé ✓';
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    submitBtn.innerHTML = originalText;
                    inputs.forEach(i => i.value = ''); // Vide les champs
                }, 1500);
            } else {
                // REFUS : Animation de tremblement sur le bouton
                submitBtn.classList.add('shake-animation');
                setTimeout(() => {
                    submitBtn.classList.remove('shake-animation');
                }, 400); // Retire la classe après l'animation
            }
        });
    }

/* ============================================================
   EASTER EGG - Message pour les curieux
   ============================================================ */
console.log(
    "%c👋 Salut, développeur curieux !", 
    "color: #111; font-size: 20px; font-weight: bold; background: #f4f4f4; padding: 10px; border-radius: 5px;"
);
console.log(
    "%cSi tu lis ceci, c'est que tu aimes fouiller sous le capot. Ce portfolio a été conçu à la main, avec un focus sur l'UX minimaliste et la performance Vanilla (zéro framework lourd).\n\nSi mon profil t'intéresse ou si tu as des retours sur le code, n'hésite pas à me contacter : romeukais@gmail.com 🚀", 
    "color: #555; font-size: 14px; line-height: 1.5;"
);
});