// Initialized Lucide Icons
function initLucide() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Splash Screen Logic
function handleSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    // Solo mostrar la pantalla de carga la primera vez que se entra (por sesión)
    if (!sessionStorage.getItem('splashShown')) {
        sessionStorage.setItem('splashShown', 'true');
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500); // Transición de 0.5s
        }, 1500); // 1.5s de carga + 0.5s fade = 2 segundos totales
    } else {
        // Ocultar inmediatamente si ya se mostró
        splash.style.display = 'none';
    }
}

// Modal Toggle Functions
function openNotifications() {
    const panel = document.getElementById('notifications-panel');
    if (panel) panel.classList.remove('hidden');
}

function closeNotifications() {
    const panel = document.getElementById('notifications-panel');
    if (panel) panel.classList.add('hidden');
}

function openSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const input = document.getElementById('search-input');
        if (input) input.focus();
    }
}

function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.add('hidden');
}

// Copy to Clipboard Utility
function copyToClipboard(textId) {
    const codeEl = document.getElementById(textId);
    if (!codeEl) return;
    
    const code = codeEl.textContent;
    const el = document.createElement('textarea');
    el.value = code;
    document.body.appendChild(el);
    el.select();
    try {
        document.execCommand('copy');
        alert('¡Código copiado!');
    } catch (err) {
        alert('Error al copiar. Por favor, copia manualmente.');
    }
    document.body.removeChild(el);
}

// Filter Logic Utility
function filterItems(inputId, listId, itemClass) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const filter = input.value.toLowerCase();
    const list = document.getElementById(listId);
    if (!list) return;
    
    const items = list.getElementsByClassName(itemClass);
    for (let i = 0; i < items.length; i++) {
        let title = items[i].dataset.title ? items[i].dataset.title.toLowerCase() : '';
        items[i].style.display = title.includes(filter) ? "" : "none";
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    handleSplashScreen();
    initAuth();
    initLucide();
});

// --- Auth System Logic ---
let isLoginMode = true;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuqYXRy642LLRC9vVLeIq0-LJI1xjUU1G0bVLFzaZIsiWIDon3V7tiicjbm2V3t97Z/exec';

function initAuth() {
    const authModalHTML = `
    <!-- Modal de Login/Registro -->
    <div id="auth-modal" class="hidden fixed inset-0 z-[100] modal-bg flex items-center justify-center p-4 fade-in">
        <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg w-full max-w-sm mx-auto p-6 relative max-h-[90vh] overflow-y-auto">
            <button onclick="closeLoginModal()" class="absolute top-3 right-3 text-gray-500 hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            
            <h2 id="auth-title" class="text-2xl font-bold text-white mb-4 text-center tracking-tight">Iniciar Sesión</h2>
            
            <form id="auth-form" onsubmit="handleAuth(event)">
                <input type="text" id="auth-fortnite" placeholder="Usuario de Fortnite" class="hidden w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 border border-gray-700 outline-none focus:border-pink-500 transition">
                <input type="email" id="auth-email" placeholder="Correo Electrónico" required class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 border border-gray-700 outline-none focus:border-pink-500 transition">
                <input type="password" id="auth-password" placeholder="Contraseña" required class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 border border-gray-700 outline-none focus:border-pink-500 transition">
                
                <button type="submit" id="auth-submit-btn" class="w-full text-center rgb-bg-anim text-white font-bold py-3 rounded-lg hover:opacity-90 transition">Entrar</button>
            </form>
            
            <p class="text-center text-gray-400 mt-4 text-sm">
                <span id="auth-toggle-text">¿No tienes cuenta?</span> 
                <button id="auth-toggle-btn" type="button" onclick="toggleAuthMode()" class="text-pink-500 font-bold ml-1 hover:underline">Regístrate</button>
            </p>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', authModalHTML);
    // Reiniciar los íconos de Lucide para el modal recién inyectado
    initLucide();

    // Check user login state
    const token = localStorage.getItem('userToken');
    if (token) {
        updateAuthBtn(true, token);
    }
}

function openLoginModal() {
    const token = localStorage.getItem('userToken');
    if (token) {
        // Log out confirmation
        if (confirm("¿Deseas cerrar sesión?")) {
            localStorage.removeItem('userToken');
            updateAuthBtn(false);
            window.location.reload();
        }
        return;
    }
    // Reset to login mode whenever we open the modal
    isLoginMode = true;
    updateAuthUI();
    document.getElementById('auth-modal').classList.remove('hidden');
}

function updateAuthUI() {
    document.getElementById('auth-title').innerText = isLoginMode ? "Iniciar Sesión" : "Crear Cuenta";
    document.getElementById('auth-submit-btn').innerText = isLoginMode ? "Entrar" : "Registrarse";
    document.getElementById('auth-toggle-text').innerText = isLoginMode ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?";
    const toggleBtn = document.getElementById('auth-toggle-btn');
    if (toggleBtn) {
        toggleBtn.innerText = isLoginMode ? "Regístrate" : "Inicia Sesión";
    }
    
    // Mostrar u ocultar campo de usuario de Fortnite
    const fortniteInput = document.getElementById('auth-fortnite');
    if (fortniteInput) {
        if(isLoginMode) {
            fortniteInput.classList.add('hidden');
            fortniteInput.removeAttribute('required');
        } else {
            fortniteInput.classList.remove('hidden');
            fortniteInput.setAttribute('required', 'true');
        }
    }
}

function closeLoginModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    updateAuthUI();
}

function updateAuthBtn(isLoggedIn, token = "") {
    const btn = document.getElementById('nav-auth-btn');
    if (btn) {
        if(isLoggedIn) {
            let email = "Usuario";
            try {
                email = atob(token).split('@')[0];
            } catch (e) {}
            
            btn.innerHTML = `<i data-lucide="user" class="w-4 h-4 inline-block -mt-1 mr-1"></i> ${email}`;
            btn.classList.remove('bg-pink-600', 'hover:bg-pink-500');
            btn.classList.add('bg-gray-800', 'hover:bg-gray-700', 'border', 'border-gray-700');
            initLucide();
        } else {
            btn.innerText = 'Entrar';
            btn.classList.add('bg-pink-600', 'hover:bg-pink-500');
            btn.classList.remove('bg-gray-800', 'hover:bg-gray-700', 'border', 'border-gray-700');
        }
    }
}

async function handleAuth(event) {
    event.preventDefault();
    const btn = document.getElementById('auth-submit-btn');
    const originalText = btn.innerText;
    
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const fortniteUser = document.getElementById('auth-fortnite').value;

    btn.innerText = "Verificando...";
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    btn.disabled = true;

    const payload = {
        action: isLoginMode ? 'login' : 'register',
        email: email,
        password: password,
        fortniteUser: fortniteUser
    };

    try {
        // Volvemos al método seguro para poder leer la respuesta (éxito/fallo)
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        // Google Apps Script devuelve un JSON que debemos procesar
        const result = await response.json();
        
        if (result.success) {
            if (isLoginMode) {
                localStorage.setItem('userToken', result.token);
                updateAuthBtn(true, result.token);
                closeLoginModal();
                alert("¡Bienvenido de nuevo!");
            } else {
                alert("¡Registro exitoso! Por favor inicia sesión.");
                isLoginMode = true;
                updateAuthUI();
            }
        } else {
            // Si el servidor dice que los datos son incorrectos, mostramos el error y NO dejamos entrar
            alert(result.message);
        }
    } catch (error) {
        console.error("Auth Error:", error);
        // Si hay un error de red o de Google, avisamos al usuario
        alert("Error de validación. Asegúrate de que tus datos sean correctos.");
    } finally {
        btn.innerText = originalText;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.disabled = false;
    }
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker Registrado: ', reg.scope))
            .catch(err => console.log('Error al registrar Service Worker: ', err));
    });
}

// Lógica para el botón de Instalación PWA (App)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir que aparezca el banner por defecto (mini-infobar)
    e.preventDefault();
    // Guardar el evento para dispararlo luego
    deferredPrompt = e;
    
    // Crear el banner bonito si no existe
    if (!document.getElementById('pwa-install-banner')) {
        const pwaBanner = document.createElement('div');
        pwaBanner.id = 'pwa-install-banner';
        // Diseño de botón flotante atractivo por encima de la barra inferior (bottom-20)
        pwaBanner.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-5 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform w-[90%] max-w-sm justify-between border border-pink-400/50';
        pwaBanner.innerHTML = `
            <div class="flex items-center gap-3">
                <i data-lucide="smartphone" class="w-6 h-6 animate-pulse"></i>
                <div class="flex flex-col">
                    <span class="font-bold text-sm leading-tight">Instalar Unite League</span>
                    <span class="text-xs text-white/80">Acceso rápido y sin navegador</span>
                </div>
            </div>
            <button id="pwa-close-btn" class="p-2 hover:bg-white/20 rounded-full transition-colors">
                <i data-lucide="x" class="w-4 h-4 text-white"></i>
            </button>
        `;
        
        document.body.appendChild(pwaBanner);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        // Manejar el clic para instalar o cerrar
        pwaBanner.addEventListener('click', async (event) => {
            if (event.target.closest('#pwa-close-btn')) {
                // Si tocó la 'X', ocultamos el banner
                pwaBanner.style.display = 'none';
                return;
            }
            
            // Si tocó el resto del banner, preguntamos si quiere instalar
            if (deferredPrompt) {
                pwaBanner.style.display = 'none';
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('El usuario aceptó instalar la App');
                }
                deferredPrompt = null;
            }
        });
    }
});

// Evento cuando la app ya se instaló exitosamente
window.addEventListener('appinstalled', (evt) => {
    console.log('App de Unite League fue instalada!');
    const banner = document.getElementById('pwa-install-banner');
    if(banner) banner.style.display = 'none';
});
