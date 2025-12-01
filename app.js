/*Diseño*/
const scrollTopBtn = document.querySelector('.scroll-top-btn');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const servicesCards = document.querySelectorAll('.services-card');
servicesCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        document.title = '¡Vuelve pronto!';
    } else {
        document.title = 'Ultratec AI';
    }
});

window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
});
/*Diseño*/



/*registro*/
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
    mostrarMensaje('Por favor, completa todos los campos.');
    return;
    }

    try {
    const res = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

const data = await res.text();
if (res.ok) {
    mostrarMensaje(data); 
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000); 
} else {
    mostrarMensaje(data || 'Error al registrar');
}
} catch (err) {
    console.error(err);
    mostrarMensaje('No se pudo conectar al servidor.');
    }
});
});
/*aca termina el registro*/


/*login*/
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
        mostrarMensaje('Completa usuario y contraseña.');
        return;
        }

        try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.text();
        if (res.ok) {
            localStorage.setItem('usuario', username);
            let perfil = JSON.parse(localStorage.getItem(`perfil_${username}`));
            if (!perfil) {
            perfil = {
                correo: '',
                foto: '',
                fechaRegistro: new Date().toLocaleDateString(),
                serviciosUsados: [],
                mensajesEnviados: 0,
                ultimoLogin: new Date().toLocaleDateString()
            };
            } else {
            perfil.ultimoLogin = new Date().toLocaleDateString();
            }
            localStorage.setItem(`perfil_${username}`, JSON.stringify(perfil));
            mostrarMensaje(data); 
            window.location.href = 'index.html';
        } else {
            mostrarMensaje(data || 'Error al iniciar sesión');
        }
        } catch (err) {
        console.error(err);
        mostrarMensaje('No se pudo conectar al servidor.');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuario');
    const saludo = document.getElementById('saludo');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');

    if (usuario) {
        if (saludo) saludo.textContent = `Bienvenido, ${usuario}`;
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        } else {
            if (saludo) saludo.textContent = '';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loginLink) loginLink.style.display = 'inline-block';
            if (registerLink) registerLink.style.display = 'inline-block';
        }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('usuario');
            window.location.href = 'login.html';
        });
    }
});

/*login*/

/*ocultar header al hacer scroll*/

document.addEventListener('DOMContentLoaded', () => {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (!header) return;

        if (window.scrollY > lastScrollY && window.scrollY > 50) {
        header.classList.add('header-hidden');
        } else {
        header.classList.remove('header-hidden');
        }

        lastScrollY = window.scrollY;
    });
});
/*ocultar header al hacer scroll*/

/*carousel de servicios*/
document.addEventListener('DOMContentLoaded', () => {
    let usuario = localStorage.getItem('usuario');

    const track = document.querySelector('.carousel-track');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');

    if (track) {
        const slides = Array.from(track.children);

        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        track.appendChild(firstClone);
        track.insertBefore(lastClone, slides[0]);

        let index = 1; 
        const allSlides = Array.from(track.children);

        track.style.transition = "transform 0.5s ease-in-out";

        function updateCarousel() {
            const slideWidth = allSlides[0].getBoundingClientRect().width + 20;
            const viewportWidth = track.parentElement.offsetWidth;
            const offset = (viewportWidth / 2) - (slideWidth / 2);

            track.style.transform = `translateX(${offset - index * slideWidth}px)`;

            allSlides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) slide.classList.add('active');
            });
        }

        function moveNext() {
            index++;
            updateCarousel();

            if (index === allSlides.length - 1) {
                track.addEventListener('transitionend', () => {
                    track.style.transition = "none";
                    index = 1; 
                    updateCarousel();
                    setTimeout(() => {
                        track.style.transition = "transform 0.5s ease-in-out";
                    }, 50);
                }, { once: true });
            }
        }

        function movePrev() {
            index--;
            updateCarousel();

            if (index === 0) {
                track.addEventListener('transitionend', () => {
                    track.style.transition = "none";
                    index = allSlides.length - 2; 
                    updateCarousel();
                    setTimeout(() => {
                        track.style.transition = "transform 0.5s ease-in-out";
                    }, 50);
                }, { once: true });
            }
        }

        if (leftBtn && rightBtn) {
            leftBtn.addEventListener('click', movePrev);
            rightBtn.addEventListener('click', moveNext);
        }

        updateCarousel();
        setInterval(moveNext, 3000);
    }

// --- Carrusel de servicios ---

    // --- Perfil y sesión ---
    const perfilHeader = document.querySelector('.perfil-header');
    const perfilLink = document.getElementById('perfilLink');
    const fotoPerfilHeader = document.getElementById('fotoPerfil');
    const fotoPerfilPerfil = document.getElementById('fotoPerfilPerfil');
    const nombreUsuario = document.getElementById('nombreUsuario');
    const correoUsuario = document.getElementById('correoUsuario');
    const fechaRegistro = document.getElementById('fechaRegistro');
    const fotoInput = document.getElementById('fotoInput');
    const guardarFotoBtn = document.getElementById('guardarFotoBtn');
    const editarBtn = document.getElementById('editarPerfilBtn');
    const contenedorEditar = document.getElementById('editarPerfilForm');
    const formEditarPerfil = document.getElementById('formEditarPerfil');
    const correoLabel = document.querySelector('label[for="nuevoCorreo"]');
    const cancelarEditarBtn = document.getElementById('cancelarEditarBtn');
    const menuPerfil = document.getElementById('menuPerfil');
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');

    if (!usuario) {
        if (perfilHeader) perfilHeader.style.display = 'none';
        if (perfilLink) perfilLink.style.display = 'none';
        return;
    }

    let perfil = JSON.parse(localStorage.getItem(`perfil_${usuario}`)) || {};

    if (!perfil.fechaRegistro) {
        perfil.fechaRegistro = new Date().toLocaleDateString();
        localStorage.setItem(`perfil_${usuario}`, JSON.stringify(perfil));
    }

    if (perfilLink) perfilLink.style.display = 'inline-block';
    if (nombreUsuario) nombreUsuario.textContent = usuario;
    if (correoUsuario) {
        if (perfil.correo && perfil.correo.trim() !== '') {
            correoUsuario.textContent = perfil.correo;
        } else {
            correoUsuario.innerHTML = `<button class="agregar-correo-btn" id="agregarCorreoBtn">Agregar correo</button>`;
            const agregarCorreoBtn = document.getElementById('agregarCorreoBtn');
            if (agregarCorreoBtn) {
                agregarCorreoBtn.addEventListener('click', () => {
                    if (!contenedorEditar.classList.contains('visible')) {
                        editarBtn.click();
                    }
                });
            }
        }
    }
    if (fechaRegistro) fechaRegistro.textContent = perfil.fechaRegistro;
    if (fotoPerfilHeader) fotoPerfilHeader.src = perfil.foto || 'default.png';
    if (fotoPerfilPerfil) fotoPerfilPerfil.src = perfil.foto || 'default.png';

    if (editarBtn && contenedorEditar) {
        editarBtn.addEventListener('click', () => {
            const nuevoUsuarioInput = document.getElementById('nuevoUsuario');
            const nuevoCorreoInput = document.getElementById('nuevoCorreo');

            if (nuevoUsuarioInput) nuevoUsuarioInput.value = usuario;
            if (nuevoCorreoInput) nuevoCorreoInput.value = perfil.correo || '';

            if (correoLabel) {
                correoLabel.textContent = perfil.correo?.trim() ? 'Modificar correo:' : 'Agregar correo:';
            }

            contenedorEditar.classList.toggle('visible');
            contenedorEditar.classList.toggle('animar');
        });
    }

    if (cancelarEditarBtn) {
        cancelarEditarBtn.addEventListener('click', () => {
            contenedorEditar.classList.remove('visible', 'animar');
        });
    }

    if (formEditarPerfil) {
        formEditarPerfil.addEventListener('submit', (e) => {
            e.preventDefault();

            const nuevoUsuario = document.getElementById('nuevoUsuario').value.trim();
            const nuevoCorreo = document.getElementById('nuevoCorreo').value.trim();

            if (nuevoCorreo) {
                perfil.correo = nuevoCorreo;
                if (correoUsuario) correoUsuario.textContent = nuevoCorreo;
                mostrarMensaje('Correo actualizado ✅');
            }

            if (nuevoUsuario && nuevoUsuario !== usuario) {
                localStorage.removeItem(`perfil_${usuario}`);
                localStorage.setItem(`perfil_${nuevoUsuario}`, JSON.stringify(perfil));
                localStorage.setItem('usuario', nuevoUsuario);
                usuario = nuevoUsuario;
                if (nombreUsuario) nombreUsuario.textContent = nuevoUsuario;
                mostrarMensaje('Usuario actualizado ✅');
            } else {
                localStorage.setItem(`perfil_${usuario}`, JSON.stringify(perfil));
            }

            contenedorEditar.classList.remove('visible', 'animar');
        });
    }

    if (fotoInput) {
        fotoInput.addEventListener('change', () => {
            const file = fotoInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result;
                fotoPerfilPerfil.src = base64;
                guardarFotoBtn.style.display = 'inline-block';
                perfil.foto = base64;
            };
            reader.readAsDataURL(file);
        });
    }

    if (guardarFotoBtn) {
        guardarFotoBtn.addEventListener('click', () => {
            if (!perfil.foto) return mostrarMensaje('Selecciona una imagen primero.');
            localStorage.setItem(`perfil_${usuario}`, JSON.stringify(perfil));
            fotoPerfilHeader.src = perfil.foto;
            fotoPerfilPerfil.src = perfil.foto;
            guardarFotoBtn.style.display = 'none';
            mostrarMensaje('Foto actualizada ✅');
        });
    }

    if (fotoPerfilHeader && menuPerfil) {
        fotoPerfilHeader.addEventListener('click', () => {
            menuPerfil.style.display = menuPerfil.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!menuPerfil.contains(e.target) && e.target !== fotoPerfilHeader) {
                menuPerfil.style.display = 'none';
            }
        });
    }

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            localStorage.removeItem('usuario');
            window.location.href = 'login.html';
        });
    }
});

///perfil y sesión///

/*mensajes emergentes*/
function mostrarMensaje(texto, duracion = 3000) {
    const mensaje = document.getElementById('mensajeEmergente');
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.classList.add('mostrar');
    setTimeout(() => mensaje.classList.remove('mostrar'), duracion);
}


/*tarea del buscador*/
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const suggestionsBox = document.getElementById("searchSuggestions");

    const suggestions = [
        "Básico",
        "Estándar",
        "Premium",
        "SEO",
        "Chatbot",
        "Diseño gráfico",
        "Mantenimiento",
        "Marketing digital"
    ];

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        suggestionsBox.innerHTML = "";

        if (query.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        const filtered = suggestions.filter(item =>
            item.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
            filtered.forEach(item => {
                const div = document.createElement("div");
                div.textContent = item;
                div.addEventListener("click", () => {
                    searchInput.value = item;
                    suggestionsBox.style.display = "none";
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();

        if (query === "basico" || query === "básico") {
            window.location.href = "basic.html";
        } else if (query === "estandar" || query === "estándar") {
            window.location.href = "standard.html";
        } else if (query === "premium") {
            window.location.href = "premium.html";
        } else if (query.includes("seo")) {
            window.location.href = "standard.html";
        } else if (query.includes("chatbot")) {
            window.location.href = "standard.html";
        } else if (query.includes("gráfico") || query.includes("grafico")) {
            window.location.href = "basic.html";
        } else if (query.includes("mantenimiento")) {
            window.location.href = "premium.html";
        } else if (query.includes("marketing") || query.includes("redes")) {
            window.location.href = "premium.html";
        } else {
            showToast("No se encontró ningún resultado para: " + query);
        }
    });


    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });

    
    function showToast(message) {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
});


/*carousel de planes*/
document.addEventListener("DOMContentLoaded", () => {
    const trackPlans = document.querySelector('.carousel1-track');

if (trackPlans) {
    const slides = Array.from(trackPlans.children);

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    trackPlans.appendChild(firstClone);
    trackPlans.insertBefore(lastClone, slides[0]);

    let index = 1; 
    const allSlides = Array.from(trackPlans.children);

    trackPlans.style.transition = "transform 0.8s ease-in-out";

    function updateCarousel() {
        const slideWidth = allSlides[0].getBoundingClientRect().width + -5; 
        trackPlans.style.transform = `translateX(-${index * slideWidth}px)`;

        allSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) slide.classList.add('active');
        });
    }

    function moveNext() {
        index++;
        updateCarousel();

        if (index === allSlides.length - 1) {
            trackPlans.addEventListener('transitionend', () => {
                trackPlans.style.transition = "none";
                index = 1; 
                updateCarousel();
                setTimeout(() => {
                    trackPlans.style.transition = "transform 0.8s ease-in-out";
                }, 50);
            }, { once: true });
        }
    }

    function movePrev() {
        index--;
        updateCarousel();

        if (index === 0) {
            trackPlans.addEventListener('transitionend', () => {
                trackPlans.style.transition = "none";
                index = allSlides.length - 2; 
                updateCarousel();
                setTimeout(() => {
                    trackPlans.style.transition = "transform 0.8s ease-in-out";
                }, 50);
            }, { once: true });
        }
    }

    setInterval(moveNext, 5000); 
    updateCarousel();
}

});

