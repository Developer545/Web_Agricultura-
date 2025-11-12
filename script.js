// ============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ============================================

// Objeto con datos editables para WordPress
const CONFIG = {
    whatsapp: {
        numero: '50322345678',
        mensaje: 'Hola%20quisiera%20información%20sobre%20sus%20productos'
    },
    contacto: {
        ubicacion: 'Calle Principal 123, San Salvador, El Salvador',
        telefono: '+503 2234-5678',
        email: 'info@agrisoluciones.com'
    },
    empresa: {
        nombre: 'AgriSoluciones',
        slogan: 'Soluciones sostenibles para tu negocio'
    }
};

// Carrito temporal
let carrito = [];

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================

class Carousel {
    constructor() {
        this.items = document.querySelectorAll('.carousel-item');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.autoSlideTimer = null;
        this.preloadImages();
        this.init();
    }

    preloadImages() {
        // Precargar todas las imágenes del carrusel
        this.items.forEach(item => {
            const backgroundImage = window.getComputedStyle(item).backgroundImage;
            if (backgroundImage && backgroundImage !== 'none') {
                const url = backgroundImage.slice(5, -2); // Extrae URL de url('...')
                const img = new Image();
                img.src = url;
            }
        });
    }

    init() {
        // Event listeners para botones
        document.getElementById('prevBtn')?.addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn')?.addEventListener('click', () => this.nextSlide());

        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-slide cada 6 segundos
        this.startAutoSlide();

        // Pausar auto-slide al pasar mouse
        document.querySelector('.carousel-container')?.addEventListener('mouseenter', () => this.stopAutoSlide());
        document.querySelector('.carousel-container')?.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    updateCarousel() {
        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSlide);
        });

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.items.length;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.items.length) % this.items.length;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    startAutoSlide() {
        this.autoSlideTimer = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }

    stopAutoSlide() {
        if (this.autoSlideTimer) {
            clearInterval(this.autoSlideTimer);
        }
    }

    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// Inicializar carousel
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

// ============================================
// NAVBAR RESPONSIVE
// ============================================

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', setupMobileMenu);

// ============================================
// SCROLL UP BUTTON
// ============================================

const scrollUpBtn = document.getElementById('scrollUpBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollUpBtn.classList.add('show');
    } else {
        scrollUpBtn.classList.remove('show');
    }
});

if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ============================================
// FORMULARIO DE CONTACTO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const contactoForm = document.getElementById('contactoForm');

    if (contactoForm) {
        contactoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombreContacto').value;
            const email = document.getElementById('emailContacto').value;
            const telefono = document.getElementById('telefonoContacto').value;
            const asunto = document.getElementById('asuntoContacto').value;
            const mensaje = document.getElementById('mensajeContacto').value;

            // Crear mailto link
            const destinatario = CONFIG.contacto.email;
            const asuntoEmail = `Nuevo Mensaje de Contacto: ${asunto}`;
            const cuerpo = `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\n\nMensaje:\n${mensaje}`;
            const urlMail = `mailto:${destinatario}?subject=${encodeURIComponent(asuntoEmail)}&body=${encodeURIComponent(cuerpo)}`;

            showNotification('Abriendo cliente de correo...', 'success');

            setTimeout(() => {
                window.location.href = urlMail;
            }, 500);
        });
    }
});

// ============================================
// ACTUALIZAR DATOS DE CONTACTO
// ============================================

function actualizarDatosContacto() {
    const ubicacionTexto = document.getElementById('ubicacion-texto');
    const telefonoTexto = document.getElementById('telefono-texto');
    const emailTexto = document.getElementById('email-texto');
    const whatsappLink = document.querySelector('.whatsapp-float');

    if (ubicacionTexto) {
        ubicacionTexto.textContent = CONFIG.contacto.ubicacion;
    }
    if (telefonoTexto) {
        telefonoTexto.textContent = CONFIG.contacto.telefono;
    }
    if (emailTexto) {
        emailTexto.textContent = CONFIG.contacto.email;
    }
    if (whatsappLink) {
        const numero = CONFIG.whatsapp.numero;
        const mensaje = CONFIG.whatsapp.mensaje;
        whatsappLink.href = `https://wa.me/${numero}?text=${mensaje}`;
    }
}

document.addEventListener('DOMContentLoaded', actualizarDatosContacto);

// ============================================
// FUNCIONES PARA CARRITO
// ============================================

function agregarCarrito(producto) {
    carrito.push(producto);
    showNotification(`${producto} agregado al carrito`, 'success');
    console.log('Carrito actualizado:', carrito);
}

// ============================================
// NOTIFICACIONES
// ============================================

function showNotification(mensaje, tipo = 'info') {
    const notif = document.createElement('div');
    notif.className = `notification notification-${tipo}`;
    notif.innerHTML = `
        <div class="notification-content">
            ${tipo === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-info-circle"></i>'}
            <span>${mensaje}</span>
        </div>
    `;

    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .notification-success {
                background: linear-gradient(135deg, #2ecc71, #27ae60);
                color: white;
                border-left: 4px solid white;
            }

            .notification-info {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                border-left: 4px solid white;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notif);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ============================================
// SMOOTH SCROLL Y OBSERVADOR DE ELEMENTOS
// ============================================

// Intersection Observer para animaciones al scroll
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Aplicar observer a elementos animables
document.addEventListener('DOMContentLoaded', () => {
    const elementos = document.querySelectorAll('.producto-card, .proyecto-card, .info-item');
    elementos.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observador.observe(el);
    });
});

// ============================================
// CONTADOR ANIMADO PARA ESTADÍSTICAS
// ============================================

function animar_contador(elemento, final) {
    let actual = 0;
    const incremento = final / 50;
    const intervalo = setInterval(() => {
        actual += incremento;
        if (actual >= final) {
            elemento.textContent = final;
            clearInterval(intervalo);
        } else {
            elemento.textContent = Math.floor(actual);
        }
    }, 20);
}

// Aplicar animación a contadores cuando sean visibles
const observadorContadores = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animado) {
            entry.target.dataset.animado = 'true';
            const texto = entry.target.textContent;
            const numero = parseInt(texto.replace(/\D/g, ''));
            if (!isNaN(numero)) {
                animar_contador(entry.target, numero);
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-item h4');
    stats.forEach(stat => observadorContadores.observe(stat));
});

// ============================================
// FUNCIONES AUXILIARES PARA WORDPRESS
// ============================================

// Función para actualizar configuración desde WordPress
function actualizarConfiguracion(nuevosValores) {
    Object.assign(CONFIG, nuevosValores);
    actualizarDatosContacto();
}

// Obtener configuración actual
function obtenerConfiguracion() {
    return CONFIG;
}

// Función para exportar datos del carrito
function exportarCarrito() {
    return {
        carrito: carrito,
        timestamp: new Date().toISOString(),
        total: carrito.length
    };
}

// Limpiar carrito
function limpiarCarrito() {
    carrito = [];
    showNotification('Carrito vaciado', 'info');
}

// ============================================
// VALIDACIÓN DE FORMULARIOS
// ============================================

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefono(telefono) {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(telefono) && telefono.length >= 7;
}

// ============================================
// EVENT DELEGATION PARA FORMULARIOS
// ============================================

document.addEventListener('submit', (e) => {
    const form = e.target;

    // Validar emails
    const emailInputs = form.querySelectorAll('input[type="email"]');
    let emailValido = true;
    emailInputs.forEach(input => {
        if (input.value && !validarEmail(input.value)) {
            input.style.borderColor = '#e74c3c';
            emailValido = false;
        } else {
            input.style.borderColor = '';
        }
    });

    if (!emailValido) {
        e.preventDefault();
        showNotification('Por favor ingresa un email válido', 'error');
    }
});

// ============================================
// LAZY LOADING DE IMÁGENES
// ============================================

function setupLazyLoading() {
    const imagenes = document.querySelectorAll('img[src]');

    const observadorImagenes = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.transition = 'opacity 0.5s ease';

                // Si la imagen ya está cargada (caché del navegador)
                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    // Si aún no está cargada, esperar al evento load
                    img.style.opacity = '0';
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                }
                observadorImagenes.unobserve(img);
            }
        });
    });

    imagenes.forEach(img => observadorImagenes.observe(img));
}

document.addEventListener('DOMContentLoaded', setupLazyLoading);

// ============================================
// ACCESIBILIDAD: NAVEGACIÓN CON TECLADO
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Cerrar menú móvil si está abierto
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
    }
});

// ============================================
// MÉTODOS DE INTEGRACIÓN PARA WORDPRESS
// ============================================

// Objeto para integración con WordPress
window.AgriSoluciones = {
    actualizarConfiguracion,
    obtenerConfiguracion,
    exportarCarrito,
    limpiarCarrito,
    showNotification,
    carousel: null,
    
    // Método para obtener datos de formularios
    obtenerDatosFormulario(idFormulario) {
        const form = document.getElementById(idFormulario);
        if (!form) return null;
        
        const formData = new FormData(form);
        return Object.fromEntries(formData);
    },

    // Método para actualizar producto
    actualizarProducto(indice, nuevosDatos) {
        const productCards = document.querySelectorAll('.producto-card');
        if (productCards[indice]) {
            const card = productCards[indice];
            if (nuevosDatos.nombre) {
                card.querySelector('.producto-info h3').textContent = nuevosDatos.nombre;
            }
            if (nuevosDatos.precio) {
                card.querySelector('.producto-precio').textContent = nuevosDatos.precio;
            }
            if (nuevosDatos.descripcion) {
                card.querySelector('.producto-info p').textContent = nuevosDatos.descripcion;
            }
        }
    },

    // Método para obtener estadísticas
    obtenerEstadisticas() {
        const stats = {};
        document.querySelectorAll('.stat-item').forEach((item, index) => {
            const valor = item.querySelector('h4').textContent;
            const label = item.querySelector('p').textContent;
            stats[`stat_${index}`] = { valor, label };
        });
        return stats;
    }
};

// Hacer disponible en consola para debugging
console.log('AgriSoluciones SDK cargado. Usa window.AgriSoluciones para acceder a los métodos.');

// ============================================
// INICIALIZACIÓN GENERAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Landing page cargada correctamente');
    console.log('Configuración actual:', CONFIG);
});