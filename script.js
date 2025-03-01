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

    function mostrarInfo(element, esSerie) {
        let tituloElement = element.querySelector('.title');
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
                    link: enlace.textContent
                });
            });
            localStorage.setItem("tituloSerie", titulo);
            localStorage.setItem("imagenSerie", imagen);
            localStorage.setItem("enlacesSerie", JSON.stringify(enlaces));
            destino = "./series.html";
        } else {
            let linkElement = element.querySelector('.link');
            if (!linkElement) {
                console.error("Falta enlace en la tarjeta de película:", element);
                return;
            }
            let link = linkElement.textContent;
            localStorage.setItem("tituloPelicula", titulo);
            localStorage.setItem("imagenPelicula", imagen);
            localStorage.setItem("linkPelicula", link);
            destino = "./entrada.html";
        }

        modal.style.display = "flex";
        iniciarCuentaRegresiva(destino);
    }

    function iniciarCuentaRegresiva(redireccion) {
        let tiempo = 5;
        clearInterval(interval); // Limpiar cualquier intervalo previo

        countdownElement.textContent = tiempo;

        interval = setInterval(function () {
            tiempo--;
            countdownElement.textContent = tiempo;

            if (tiempo <= 0) {
                clearInterval(interval);
                modal.style.display = "none"; // Cerrar el modal antes de redirigir
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
    function filtrarContenido() {
        let searchInput = document.getElementById("searchInput");
        if (!searchInput) {
            console.error("Elemento searchInput no encontrado");
            return;
        }
        let input = searchInput.value.toLowerCase();
        let tarjetas = document.querySelectorAll(".card");

        tarjetas.forEach(card => {
            let tituloElement = card.querySelector(".title");
            let categoria = card.getAttribute("data-categoria") || "";
            if (tituloElement) {
                let titulo = tituloElement.textContent.toLowerCase();
                let categoriaLower = categoria.toLowerCase();
                card.style.display = (titulo.includes(input) || categoriaLower.includes(input)) ? "block" : "none";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Filtrar por categoría del menú
    function filtrarPorCategoria(categoria) {
        let tarjetas = document.querySelectorAll(".card");
        let navMenu = document.getElementById("navMenu");
        if (navMenu) navMenu.classList.remove("active");

        let categoriaFiltro = categoria.toLowerCase();
        tarjetas.forEach(card => {
            let cardCategoria = (card.getAttribute("data-categoria") || "").toLowerCase();
            console.log(`Comparando: filtro="${categoriaFiltro}" vs tarjeta="${cardCategoria}"`);
            card.style.display = (categoriaFiltro === "" || cardCategoria === categoriaFiltro) ? "block" : "none";
        });

        let searchInput = document.getElementById("searchInput");
        if (searchInput) searchInput.value = "";
    }

    let searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filtrarContenido);
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
});

// Cerrar menú al hacer clic fuera
document.addEventListener("click", function (event) {
    let menu = document.getElementById("navMenu");
    let hamburger = document.querySelector(".hamburger");
    if (menu && menu.classList.contains("active") && !menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.classList.remove("active");
    }
});