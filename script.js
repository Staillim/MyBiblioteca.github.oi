document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("modal");
    let countdownElement = document.getElementById("countdown");
    let interval;

    if (!modal || !countdownElement) {
        console.error("Falta el modal o el elemento countdown en el HTML");
        return;
    }

    modal.style.display = "none";

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
            if (tituloElement) {
                let titulo = tituloElement.textContent.toLowerCase();
                card.style.display = titulo.includes(input) ? "block" : "none";
            } else {
                card.style.display = "none";
            }
        });
    }

    let searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filtrarContenido);
    } else {
        console.error("Elemento searchInput no encontrado");
    }
});
