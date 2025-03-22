
document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("modal");
    let countdownElement = document.getElementById("countdown");
    let interval;

    if (!modal || !countdownElement) {
        console.error("Falta el modal o el elemento countdown en el HTML");
        return;
    }

    // Asegurar que el modal esté oculto al cargar la página
    modal.style.display = "none";

    // Limpiar el intervalo al cargar la página para evitar temporizadores residuales
    clearInterval(interval);

    // Nueva función para actualizar los contadores de categorías
    function actualizarContadores() {
        const categoriasContadas = {
            'anime': 0,
            'acción': 0,
            'aventura': 0,
            'ciencia ficción': 0,
            'comedia': 0,
            'drama': 0,
            'terror': 0,
            '': 0 // Para "Todas"
        };

        // Contar tarjetas por categoría (múltiples categorías con data-categorias)
        document.querySelectorAll('.card').forEach(card => {
            const categorias = card.getAttribute('data-categorias')?.split(', ') || [];
            categorias.forEach(categoria => {
                if (categoriasContadas.hasOwnProperty(categoria)) {
                    categoriasContadas[categoria]++;
                }
            });
            categoriasContadas['']++; // Incrementar "Todas" por cada tarjeta
        });

        // Actualizar los contadores en el menú
        for (const [cat, count] of Object.entries(categoriasContadas)) {
            const spanId = cat === '' ? 'count-todas' : `count-${cat}`;
            const span = document.getElementById(spanId);
            if (span) {
                span.textContent = count;
            }
        }
    }

    function mostrarInfo(element, esSerie) {
        let tituloElement = element.querySelector('.card-title');
        let imagenElement = element.querySelector('img');
        if (!tituloElement || !imagenElement) {
            console.error("Falta título o imagen en la tarjeta:", element);
            return;
        }
        let titulo = tituloElement.textContent;
        let imagen = imagenElement.src;
        let destino;

        document.getElementById("modal-title").textContent = titulo;
        document.getElementById("modal-logo").src = imagen;

        if (esSerie) {
            let enlaces = [];
            element.querySelectorAll(".links-capitulos span").forEach(enlace => {
                enlaces.push({
                    temporada: enlace.getAttribute("data-temporada"),
                    capitulo: enlace.getAttribute("data-capitulo"),
                    server1: enlace.getAttribute("data-server1") || ""
                });
            });
            localStorage.setItem("tituloSerie", titulo);
            localStorage.setItem("imagenSerie", imagen);
            localStorage.setItem("enlacesSerie", JSON.stringify(enlaces));
            destino = "./series.html";
        } else {
            let linkElement = element.querySelector('.link');
            let server1Element = element.querySelector('.server1');
            let server2Element = element.querySelector('.server2');
            let descriptionElement = element.querySelector('.description');

            if (!linkElement) {
                console.error("Falta enlace en la tarjeta de película:", element);
                return;
            }
            let link = linkElement.textContent;
            let server1 = server1Element ? server1Element.textContent : "";
            let server2 = server2Element ? server2Element.textContent : "";
            let descripcion = descriptionElement ? descriptionElement.textContent : "";

            localStorage.setItem("tituloPelicula", titulo);
            localStorage.setItem("imagenPelicula", imagen);
            localStorage.setItem("linkPelicula", link);
            localStorage.setItem("server1", server1);
            localStorage.setItem("server2", server2);
            localStorage.setItem("descripcionPelicula", descripcion);
            destino = "./entrada.html";
        }

        modal.style.display = "flex";
        iniciarCuentaRegresiva(destino);
    }

    function iniciarCuentaRegresiva(redireccion) {
        let tiempo = 10;
        clearInterval(interval);

        countdownElement.textContent = tiempo;

        interval = setInterval(function () {
            tiempo--;
            countdownElement.textContent = tiempo;

            if (tiempo <= 0) {
                clearInterval(interval);
                modal.style.display = "none";
                window.location.href = redireccion;
            }
        }, 1000);
    }

    let closeModal = document.getElementById("closeModal");
    if (closeModal) {
        closeModal.addEventListener("click", function () {
            modal.style.display = "none";
            clearInterval(interval);
        });
    } else {
        console.error("Elemento closeModal no encontrado");
    }

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            clearInterval(interval);
        }
    });

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function () {
            let esSerie = card.classList.contains("serie-card");
            mostrarInfo(this, esSerie);
        });
    });

    // Filtrar por texto del buscador
    function buscarTarjetas() {
        let input = document.getElementById("searchInput").value.toLowerCase();
        let tarjetas = document.querySelectorAll(".card");

        tarjetas.forEach(card => {
            let tituloElement = card.querySelector(".card-title");
            let categorias = card.getAttribute("data-categorias")?.split(', ') || [];
            if (tituloElement) {
                let titulo = tituloElement.textContent.toLowerCase();
                let categoriasLower = categorias.map(cat => cat.toLowerCase()).join(' ');
                card.style.display = (titulo.includes(input) || categoriasLower.includes(input)) ? "block" : "none";
            } else {
                card.style.display = "none";
            }
        });
        actualizarContadores(); // Actualizar contadores después de filtrar
    }

    // Filtrar por categoría del menú
    function filtrarPorCategoria(categoria) {
        let tarjetas = document.querySelectorAll(".card");
        let navMenu = document.getElementById("navMenu");
        if (navMenu) navMenu.classList.remove("active");

        let categoriaFiltro = categoria.toLowerCase();
        tarjetas.forEach(card => {
            let categorias = card.getAttribute("data-categorias")?.split(', ') || [];
            let categoriasLower = categorias.map(cat => cat.toLowerCase());
            card.style.display = (categoriaFiltro === "" || categoriasLower.includes(categoriaFiltro)) ? "block" : "none";
        });

        let searchInput = document.getElementById("searchInput");
        if (searchInput) searchInput.value = "";
        actualizarContadores(); // Actualizar contadores después de filtrar
    }

    // Mostrar u ocultar el menú hamburguesa
    function toggleMenu() {
        let navMenu = document.getElementById("navMenu");
        navMenu.classList.toggle("active");
    }

    // Volver al inicio
    function volverInicio() {
        filtrarPorCategoria('');
        document.getElementById("searchInput").value = '';
        actualizarContadores();
    }

    let searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", buscarTarjetas);
    } else {
        console.error("Elemento searchInput no encontrado");
    }

    let categoriaFiltro = localStorage.getItem("categoriaFiltro");
    if (categoriaFiltro && window.location.pathname.includes("index.html")) {
        filtrarPorCategoria(categoriaFiltro);
        localStorage.removeItem("categoriaFiltro");
    }

    window.filtrarPorCategoria = filtrarPorCategoria;

    // Manejar el retroceso (popstate) para ocultar el modal
    window.addEventListener("popstate", function () {
        modal.style.display = "none";
        clearInterval(interval);
    });

    // Actualizar contadores al cargar la página
    actualizarContadores();
});

// Cerrar menú al hacer clic fuera
document.addEventListener("click", function (event) {
    let menu = document.getElementById("navMenu");
    let hamburger = document.querySelector(".hamburger");
    if (menu && menu.classList.contains("active") && !menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.classList.remove("active");
    }
});
