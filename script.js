document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("modal");
    let countdownElement = document.getElementById("countdown");
    let interval;

    modal.style.display = "none";

    // 📌 Función para mostrar la información en el modal
    function mostrarInfo(element, esSerie) {
        let titulo = element.querySelector('.title').textContent;
        let imagen = element.querySelector('img').src;
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

            // Guardar datos de la serie en localStorage
            localStorage.setItem("tituloSerie", titulo);
            localStorage.setItem("imagenSerie", imagen);
            localStorage.setItem("enlacesSerie", JSON.stringify(enlaces));

            destino = "./series.html";
        } else {
            let link = element.querySelector('.link').textContent;

            // Guardar datos de la película en localStorage
            localStorage.setItem("tituloPelicula", titulo);
            localStorage.setItem("imagenPelicula", imagen);
            localStorage.setItem("linkPelicula", link);

            destino = "./entrada.html";
        }

        modal.style.display = "flex";
        iniciarCuentaRegresiva(destino);
    }

    // ⏳ Función para iniciar la cuenta regresiva y redirigir
    function iniciarCuentaRegresiva(redireccion) {
        let tiempo = 5;
        clearInterval(interval);

        countdownElement.textContent = tiempo;

        interval = setInterval(function () {
            tiempo--;
            countdownElement.textContent = tiempo;

            if (tiempo === 0) {
                clearInterval(interval);
                window.location.href = redireccion;
            }
        }, 1000);
    }

    // ❌ Cerrar modal al hacer clic en el botón
    document.getElementById("closeModal").addEventListener("click", function () {
        modal.style.display = "none";
        clearInterval(interval);
    });

    // ❌ Cerrar modal al hacer clic fuera de él
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            clearInterval(interval);
        }
    });

    // 🎬 Agregar evento de clic a cada tarjeta (película o serie)
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function () {
            let esSerie = card.classList.contains("serie-card");
            mostrarInfo(this, esSerie);
        });
    });

    // 🔍 Función para manejar la búsqueda
    function filtrarContenido() {
        let input = document.getElementById("searchInput").value.toLowerCase();
        let tarjetas = document.querySelectorAll(".card");

        // Si NO estamos en index.html, redirigir a index con la búsqueda guardada
        if (!window.location.pathname.includes("index.html") && window.location.pathname !== "/") {
            localStorage.setItem("busqueda", input);
            window.location.href = "index.html"; // Redirigir a index.html con la búsqueda guardada
            return;
        }

        // Filtrar en index.html
        tarjetas.forEach(card => {
            let titulo = card.querySelector(".title").textContent.toLowerCase();
            card.style.display = titulo.includes(input) ? "block" : "none";
        });
    }

    // 🛠 Aplicar búsqueda si hay un término guardado en localStorage (cuando se entra a index.html)
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        let busquedaGuardada = localStorage.getItem("busqueda");
        if (busquedaGuardada) {
            document.getElementById("searchInput").value = busquedaGuardada;
            filtrarContenido(); // Ejecuta la búsqueda con el valor guardado
            localStorage.removeItem("busqueda"); // Limpia el término de búsqueda después de aplicarlo
        }
    }

    // 🔥 Ejecutar búsqueda en tiempo real
    document.getElementById("searchInput").addEventListener("input", filtrarContenido);
});

