// ============================================
// AgriSoluciones — Premium JS
// ============================================

const CONFIG = {
    whatsapp: { numero: '50322345678', mensaje: 'Hola%20quisiera%20información%20sobre%20sus%20productos' },
    contacto: { ubicacion: 'Calle Principal 123, San Salvador, El Salvador', telefono: '+503 2234-5678', email: 'info@agrisoluciones.com' }
};

// ============================================
// NAVBAR: transparent → scrolled
// ============================================
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu  = document.getElementById('navMenu');

function updateNavbar() {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu on nav link click
document.querySelectorAll('.nav-link, .btn-nav-cta').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// Close menu on ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ============================================
// SCROLL UP BUTTON
// ============================================
const scrollUpBtn = document.getElementById('scrollUpBtn');

window.addEventListener('scroll', () => {
    if (scrollUpBtn) scrollUpBtn.classList.toggle('show', window.scrollY > 350);
}, { passive: true });

scrollUpBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// SCROLL SPY — Nav Active Links
// ============================================
const spySections = document.querySelectorAll('section[id]');
const spyLinks    = document.querySelectorAll('.nav-link[href^="#"]');

function updateScrollSpy() {
    let current = '';
    spySections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    spyLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}
window.addEventListener('scroll', updateScrollSpy, { passive: true });

// ============================================
// CAROUSEL
// ============================================
class Carousel {
    constructor() {
        this.items      = document.querySelectorAll('.carousel-item');
        this.indicators = document.querySelectorAll('.indicator');
        this.counter    = document.getElementById('currentSlide');
        this.current    = 0;
        this.timer      = null;
        // Guardia: si no hay slides, no hacer nada
        if (!this.items.length) return;
        this.init();
    }

    init() {
        // Click en flechas → cambia slide Y reinicia cuenta regresiva
        document.getElementById('prevBtn')?.addEventListener('click', () => {
            this.prev(); this.resetTimer();
        });
        document.getElementById('nextBtn')?.addEventListener('click', () => {
            this.next(); this.resetTimer();
        });

        // Click en indicadores
        this.indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => { this.goTo(i); this.resetTimer(); });
        });

        // Mostrar slide inicial y arrancar auto-slide
        this.update();
        this.startTimer();
    }

    update() {
        this.items.forEach((item, i) => item.classList.toggle('active', i === this.current));
        this.indicators.forEach((ind, i) => ind.classList.toggle('active', i === this.current));
        if (this.counter) this.counter.textContent = String(this.current + 1).padStart(2, '0');
    }

    // Solo cambian el slide — NO tocan el timer
    next()  { this.current = (this.current + 1) % this.items.length; this.update(); }
    prev()  { this.current = (this.current - 1 + this.items.length) % this.items.length; this.update(); }
    goTo(i) { this.current = i; this.update(); }

    // Gestión del timer completamente separada
    startTimer() {
        // Siempre limpiar antes de crear para evitar duplicados
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.next(), 5500);
    }
    resetTimer() {
        // El usuario interactuó: reinicia la cuenta regresiva desde cero
        this.startTimer();
    }
}

// ============================================
// STATS BAR — Animated Counters
// ============================================
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/\D/g, ''));
    if (isNaN(target)) return;
    let current = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    el.textContent = '0';

    const tick = () => {
        current += step;
        if (current >= target) {
            el.textContent = target.toLocaleString('es');
        } else {
            el.textContent = Math.floor(current).toLocaleString('es');
            requestAnimationFrame(tick);
        }
    };
    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
            entry.target.dataset.done = '1';
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.6 });

// ============================================
// REVEAL ON SCROLL — Cards and Sections
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.12 });

// ============================================
// DOM CONTENT LOADED — Init everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();

    // Observe stats counters
    document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

    // Observe cards / reveal elements
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
        el.style.transitionDelay = (i % 3 * 0.1) + 's';
        revealObserver.observe(el);
    });

    // Update contact data from CONFIG
    const ubicacion = document.getElementById('ubicacion-texto');
    const telefono  = document.getElementById('telefono-texto');
    const email     = document.getElementById('email-texto');
    const waLink    = document.querySelector('.whatsapp-float');

    if (ubicacion) ubicacion.textContent = CONFIG.contacto.ubicacion;
    if (telefono)  telefono.textContent  = CONFIG.contacto.telefono;
    if (email)     email.textContent     = CONFIG.contacto.email;
    if (waLink)    waLink.href = `https://wa.me/${CONFIG.whatsapp.numero}?text=${CONFIG.whatsapp.mensaje}`;
});

// ============================================
// CONTACT FORM
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactoForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nombre  = document.getElementById('nombreContacto')?.value  || '';
        const email   = document.getElementById('emailContacto')?.value   || '';
        const telefono = document.getElementById('telefonoContacto')?.value || '';
        const asunto  = document.getElementById('asuntoContacto')?.value  || '';
        const mensaje = document.getElementById('mensajeContacto')?.value || '';

        const dest = CONFIG.contacto.email;
        const subj = encodeURIComponent(`Nuevo Mensaje: ${asunto}`);
        const body = encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\n\nMensaje:\n${mensaje}`);

        showNotification('Abriendo cliente de correo...', 'success');
        setTimeout(() => { window.location.href = `mailto:${dest}?subject=${subj}&body=${body}`; }, 500);
    });
});

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(msg, type = 'info') {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position:fixed; top:24px; right:24px; z-index:10000;
        display:flex; align-items:center; gap:10px;
        padding:14px 20px; border-radius:10px; color:#fff;
        font-family:'Inter',sans-serif; font-size:.9rem; font-weight:500;
        background:${type === 'success' ? 'linear-gradient(135deg,#2e7d32,#1b5e20)' : 'linear-gradient(135deg,#1565c0,#0d47a1)'};
        box-shadow:0 8px 30px rgba(0,0,0,.2);
        animation: slideIn .3s ease;
    `;
    notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i><span>${msg}</span>`;
    document.body.appendChild(notif);
    setTimeout(() => { notif.style.opacity = '0'; notif.style.transform = 'translateX(50px)'; notif.style.transition = '.3s'; setTimeout(() => notif.remove(), 300); }, 3000);
}

// ============================================
// VALIDATION HELPERS
// ============================================
function validarEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

document.addEventListener('submit', e => {
    const inputs = e.target.querySelectorAll('input[type="email"]');
    let ok = true;
    inputs.forEach(input => {
        if (input.value && !validarEmail(input.value)) { input.style.borderColor = '#e53935'; ok = false; }
        else input.style.borderColor = '';
    });
    if (!ok) { e.preventDefault(); showNotification('Por favor ingresa un email válido', 'error'); }
});

// ============================================
// WORDPRESS / SDK INTEGRATION
// ============================================
window.AgriSoluciones = {
    actualizarConfiguracion(vals) { Object.assign(CONFIG, vals); },
    obtenerConfiguracion()        { return CONFIG; },
    showNotification
};

console.log('AgriSoluciones Premium cargado ✓');
