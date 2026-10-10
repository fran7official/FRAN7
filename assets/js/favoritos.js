(function() {
    "use strict";

    const STORAGE_KEY = "fran7_favorites_v1";

    function carregarFavoritos() {
        try {
            const favoritos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(favoritos)) {
                throw new TypeError("Os favoritos guardados não são uma lista.");
            }
            return favoritos.filter(function(item) {
                return item &&
                    typeof item.nome === "string" &&
                    typeof item.imagem === "string" &&
                    Number.isFinite(Number(item.preco));
            });
        } catch (error) {
            console.error("Não foi possível ler os favoritos guardados:", error);
            return [];
        }
    }

    function atualizarInterface() {
        const favoritos = carregarFavoritos();
        const contador = document.getElementById("contadorFavoritos");
        const sharedCount = document.getElementById("fran7FavoritesCount");
        const icone = document.getElementById("iconeCoracaoTopo");

        if (sharedCount) {
            sharedCount.textContent = String(favoritos.length);
            sharedCount.hidden = favoritos.length === 0;
        }
        if (contador) {
            contador.textContent = String(favoritos.length);
            contador.classList.toggle("visivel", favoritos.length > 0);
        }
        if (icone) {
            icone.textContent = favoritos.length > 0 ? "♥" : "♡";
        }

        document.querySelectorAll("[data-favorite-name]").forEach(function(button) {
            const isFavorite = favoritos.some(function(item) {
                return item.nome === button.dataset.favoriteName &&
                    item.imagem === button.dataset.favoriteImage;
            });
            button.classList.toggle("ativo", isFavorite);
            button.setAttribute("aria-pressed", String(isFavorite));
            button.setAttribute(
                "aria-label",
                isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            );
            const heart = button.querySelector(".coracao");
            if (heart) {
                heart.textContent = isFavorite ? "♥" : "♡";
            }
        });
    }

    function alternarFavorito(button) {
        const article = button.closest(".produto, .modelo");
        const item = {
            nome: button.dataset.favoriteName,
            imagem: button.dataset.favoriteImage,
            preco: Number(button.dataset.favoritePrice) || 0,
            reservar: button.dataset.favoriteReserve === "true" || article?.dataset.productReserve === "true",
            imagensExtra: (button.dataset.favoriteImages || article?.dataset.galleryImages || "")
                .split("|")
                .filter(Boolean),
            cores: (button.dataset.favoriteColors || article?.dataset.galleryColors || "")
                .split("|")
                .filter(Boolean)
        };
        const favoritos = carregarFavoritos();
        const index = favoritos.findIndex(function(current) {
            return current.nome === item.nome && current.imagem === item.imagem;
        });

        if (index === -1) {
            favoritos.push(item);
        } else {
            favoritos.splice(index, 1);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
        atualizarInterface();
        window.dispatchEvent(new CustomEvent("fran7-favorites-updated", {
            detail: { items: favoritos }
        }));
    }

    function montarBotaoCabecalho() {
        const header = document.querySelector(".cabecalho, .cabecalho-catalogo");
        if (!header || document.getElementById("fran7FavoritesTrigger")) {
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.id = "fran7FavoritesTrigger";
        button.className = "fran7-favorites-trigger";
        button.setAttribute("aria-label", "Abrir favoritos");
        button.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.8 8.8c0 5.2-8.8 10.3-8.8 10.3S3.2 14 3.2 8.8A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.8 2.5Z"/>
            </svg>
            <span class="fran7-favorites-count" id="fran7FavoritesCount">0</span>
        `;
        button.addEventListener("click", function() {
            window.location.href = "favoritos.html";
        });

        const backLink = header.querySelector(".voltar, .voltar-loja");
        if (backLink) {
            header.insertBefore(button, backLink);
        } else {
            header.appendChild(button);
        }
    }

    document.addEventListener("click", function(event) {
        const button = event.target.closest("[data-favorite-name]");
        if (button) {
            alternarFavorito(button);
        }
    });

    window.addEventListener("storage", function(event) {
        if (event.key === STORAGE_KEY) {
            atualizarInterface();
        }
    });
    window.addEventListener("fran7-favorites-updated", function() {
        atualizarInterface();
    });

    function iniciar() {
        montarBotaoCabecalho();
        atualizarInterface();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
