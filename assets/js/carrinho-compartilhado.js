(function() {
    "use strict";

    const STORAGE_KEY = "fran7_cart_v1";
    const LOCATION_KEY = "fran7_cart_location_v1";
    const CITY_KEY = "fran7_cart_city_v1";
    const NOTE_KEY = "fran7_cart_note_v1";
    let items = [];

    function tamanhoAutomatico(nome) {
        return /\b(bon[eé]|chap[eé]u|meias?|socks?)\b/i.test(nome);
    }

    function carregarCarrinho() {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);

            if (!Array.isArray(parsed)) {
                throw new TypeError("O conteúdo guardado para o carrinho não é uma lista.");
            }

            return parsed.filter(function(item) {
                return item &&
                    typeof item.nome === "string" &&
                    typeof item.imagem === "string" &&
                    Number.isFinite(Number(item.preco)) &&
                    Number.isInteger(Number(item.quantidade)) &&
                    Number(item.quantidade) > 0;
            }).map(function(item) {
                return {
                    nome: item.nome,
                    imagem: item.imagem,
                    preco: Number(item.preco),
                    quantidade: Number(item.quantidade),
                    cor: typeof item.cor === "string" ? item.cor : "",
                    tamanho: tamanhoAutomatico(item.nome)
                        ? "X"
                        : (typeof item.tamanho === "string" ? item.tamanho : "")
                };
            });
        } catch (error) {
            console.error("Não foi possível ler o carrinho guardado:", error);
            return [];
        }
    }

    function guardarCarrinho() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        renderizar();
        window.dispatchEvent(new CustomEvent("fran7-cart-updated", {
            detail: { items: items }
        }));
    }

    function formatarPreco(valor) {
        if (!valor) {
            return "Consultar preço";
        }

        return Number(valor).toLocaleString("pt-AO") + " Kz";
    }

    function criarCampo(rotulo, placeholder, valor, aoAlterar) {
        const wrapper = document.createElement("div");
        wrapper.className = "fran7-cart-field";

        const id = "fran7-cart-" + rotulo.toLowerCase() + "-" + Math.random().toString(36).slice(2, 8);
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = rotulo;

        const input = document.createElement("input");
        input.id = id;
        input.type = "text";
        input.placeholder = placeholder;
        input.value = valor || "";
        input.dataset.cartOption = rotulo.toLowerCase();
        if (rotulo === "Tamanho" && input.value === "X") {
            input.disabled = true;
            input.setAttribute("aria-label", "Tamanho X (aplicado automaticamente)");
        }
        input.addEventListener("input", function() {
            aoAlterar(input.value.trim());
        });

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return wrapper;
    }

    function mostrarAviso(mensagem) {
        const notice = document.getElementById("fran7CartNotice");
        const text = document.getElementById("fran7CartNoticeText");
        text.textContent = mensagem;
        notice.hidden = false;
    }

    function focarCampoEmFalta() {
        const itemEmFalta = items.find(function(item) {
            return !item.cor || !item.tamanho;
        });

        if (itemEmFalta) {
            const itemElement = [...document.querySelectorAll(".fran7-cart-item")]
                .find(function(element) {
                    return element.dataset.itemKey === itemEmFalta.nome + "|" + itemEmFalta.imagem;
                });

            if (itemElement) {
                    const option = itemEmFalta.cor ? "tamanho" : "cor";
                    const input = itemElement.querySelector(
                        '[data-cart-option="' + option + '"]'
                    );
                    if (input) {
                    input.focus();
                    input.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
            return;
        }

        const city = document.getElementById("fran7CartCity");
        const location = document.getElementById("fran7CartLocation");
        const field = city && !city.value.trim() ? city : location;
        field.focus();
        field.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function renderizar() {
        const count = document.getElementById("fran7CartCount");
        const list = document.getElementById("fran7CartItems");
        const totalElement = document.getElementById("fran7CartTotal");
        const location = document.getElementById("fran7CartLocation");
        const city = document.getElementById("fran7CartCity");
        const note = document.getElementById("fran7CartNote");

        if (!count || !list || !totalElement) {
            return;
        }

        const totalQuantidade = items.reduce(function(total, item) {
            return total + item.quantidade;
        }, 0);
        const total = items.reduce(function(sum, item) {
            return sum + item.preco * item.quantidade;
        }, 0);

        count.textContent = String(totalQuantidade);
        list.replaceChildren();

        if (items.length === 0) {
            const empty = document.createElement("p");
            empty.className = "fran7-cart-empty";
            empty.textContent = "O teu carrinho está vazio.";
            list.appendChild(empty);
        } else {
            items.forEach(function(item, index) {
                const card = document.createElement("article");
                card.className = "fran7-cart-item";
                card.dataset.itemKey = item.nome + "|" + item.imagem;

                let image;
                if (item.imagem) {
                    image = document.createElement("img");
                    image.className = "fran7-cart-item-image";
                    image.src = item.imagem;
                    image.alt = item.nome;
                } else {
                    image = document.createElement("div");
                    image.className = "fran7-cart-item-image fran7-cart-item-placeholder";
                    image.textContent = "Imagem indisponível";
                    image.setAttribute("aria-label", "Imagem indisponível para " + item.nome);
                }

                const details = document.createElement("div");
                details.className = "fran7-cart-item-content";

                const name = document.createElement("h3");
                name.className = "fran7-cart-item-name";
                name.textContent = item.nome;

                const remove = document.createElement("button");
                remove.type = "button";
                remove.className = "fran7-cart-remove";
                remove.textContent = "×";
                remove.setAttribute("aria-label", "Remover " + item.nome + " da sacola");
                remove.addEventListener("click", function() {
                    items.splice(index, 1);
                    guardarCarrinho();
                });

                const price = document.createElement("p");
                price.className = "fran7-cart-item-price";
                price.textContent = formatarPreco(item.preco);

                const quantity = document.createElement("div");
                quantity.className = "fran7-cart-quantity";

                const decrease = document.createElement("button");
                decrease.type = "button";
                decrease.textContent = "−";
                decrease.setAttribute("aria-label", "Diminuir quantidade");
                decrease.addEventListener("click", function() {
                    if (items[index].quantidade <= 1) {
                        items.splice(index, 1);
                    } else {
                        items[index].quantidade -= 1;
                    }
                    guardarCarrinho();
                });

                const quantityValue = document.createElement("span");
                quantityValue.className = "fran7-cart-item-quantity";
                quantityValue.textContent = String(item.quantidade);

                const increase = document.createElement("button");
                increase.type = "button";
                increase.textContent = "+";
                increase.setAttribute("aria-label", "Aumentar quantidade");
                increase.addEventListener("click", function() {
                    items[index].quantidade += 1;
                    guardarCarrinho();
                });

                quantity.append(decrease, quantityValue, increase);
                details.append(name, price, quantity);

                const options = document.createElement("div");
                options.className = "fran7-cart-item-options";
                options.appendChild(criarCampo("Cor", "Ex.: Preto, branco...", item.cor, function(value) {
                    items[index].cor = value;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                }));
                options.appendChild(criarCampo("Tamanho", "Ex.: M, L, XL...", item.tamanho, function(value) {
                    items[index].tamanho = value;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                }));
                details.appendChild(options);

                card.append(image, details, remove);
                list.appendChild(card);
            });
        }

        totalElement.textContent = formatarPreco(total);
        if (location) {
            location.value = localStorage.getItem(LOCATION_KEY) || "";
        }
        if (city) {
            city.value = localStorage.getItem(CITY_KEY) || "";
        }
        if (note) {
            note.value = localStorage.getItem(NOTE_KEY) || "";
        }
    }

    function abrirCarrinho() {
        const overlay = document.getElementById("fran7CartOverlay");
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        requestAnimationFrame(function() {
            overlay.classList.add("open");
        });
    }

    function fecharCarrinho() {
        const overlay = document.getElementById("fran7CartOverlay");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
        window.setTimeout(function() {
            if (!overlay.classList.contains("open")) {
                overlay.hidden = true;
            }
        }, 300);
    }

    function adicionar(item) {
        const existing = items.find(function(current) {
            return current.nome === item.nome && current.imagem === item.imagem;
        });

        if (existing) {
            existing.quantidade += 1;
            if (!existing.cor && item.cor) {
                existing.cor = item.cor;
            }
        } else {
            const nome = String(item.nome || "");
            items.push({
                nome: nome,
                imagem: item.imagem,
                preco: Number(item.preco) || 0,
                quantidade: 1,
                cor: String(item.cor || ""),
                tamanho: tamanhoAutomatico(nome) ? "X" : ""
            });
        }

        guardarCarrinho();
        abrirCarrinho();
        window.setTimeout(focarCampoEmFalta, 350);
    }

    function enviarPedido() {
        const location = document.getElementById("fran7CartLocation").value.trim();
        const city = document.getElementById("fran7CartCity").value.trim();
        const note = document.getElementById("fran7CartNote").value.trim();
        const itemEmFalta = items.find(function(item) {
            return !item.cor || (!tamanhoAutomatico(item.nome) && !item.tamanho);
        });

        if (items.length === 0) {
            mostrarAviso("Adiciona pelo menos um produto ao carrinho antes de enviar o pedido.");
            return;
        }

        if (itemEmFalta || !city || !location) {
            mostrarAviso(itemEmFalta
                ? "Preenche a cor e o tamanho de cada produto. Chapéus e meias usam tamanho X."
                : (!city ? "Preenche a cidade de entrega." : "Preenche a localização de entrega."));
            return;
        }

        const total = items.reduce(function(sum, item) {
            return sum + item.preco * item.quantidade;
        }, 0);
        const quantity = items.reduce(function(sum, item) {
            return sum + item.quantidade;
        }, 0);
        const summary = items.map(function(item) {
            return item.nome + " x" + item.quantidade +
                " (cor: " + item.cor + ", tamanho: " + item.tamanho + ")";
        }).join(" | ");
        const messageParts = [
            "Olá! Quero finalizar este pedido.",
            "- Produtos: " + summary,
            "- Cidade: " + city,
            "- Localização: " + location,
            "- Quantidade total: " + quantity,
            "- Total indicado: " + formatarPreco(total)
        ];
        if (note) {
            messageParts.push("- Comentário: " + note);
        }
        const message = messageParts.join("\n");

        window.open(
            "https://wa.me/244973560521?text=" + encodeURIComponent(message),
            "_blank",
            "noopener,noreferrer"
        );
    }

    function montarInterface() {
        const header = document.querySelector(".cabecalho, .cabecalho-catalogo");

        if (!header) {
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "fran7-cart-trigger";
        button.setAttribute("aria-label", "Abrir sacola");
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 9h14l1 12H4L5 9Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="fran7-cart-count" id="fran7CartCount">0</span>
        `;
        button.addEventListener("click", abrirCarrinho);

        const backLink = header.querySelector(".voltar, .voltar-loja");
        if (backLink) {
            header.insertBefore(button, backLink);
        } else {
            header.appendChild(button);
        }

        const overlay = document.createElement("div");
        overlay.className = "fran7-cart-overlay";
        overlay.id = "fran7CartOverlay";
        overlay.hidden = true;
        overlay.innerHTML = `
            <section class="fran7-cart-panel" role="dialog" aria-modal="true" aria-labelledby="fran7CartTitle">
                <div class="fran7-cart-header">
                    <h2 class="fran7-cart-title" id="fran7CartTitle">MEU CARRINHO</h2>
                    <button type="button" class="fran7-cart-close" aria-label="Fechar carrinho">×</button>
                </div>
                <div class="fran7-cart-body" id="fran7CartItems"></div>
                <div class="fran7-cart-footer">
                    <div class="fran7-cart-field fran7-cart-location">
                        <label for="fran7CartCity">Cidade <span aria-hidden="true">*</span></label>
                        <input id="fran7CartCity" type="text" placeholder="Ex.: Luanda" autocomplete="address-level2" required>
                    </div>
                    <div class="fran7-cart-field fran7-cart-location">
                        <label for="fran7CartLocation">Bairro / localização <span aria-hidden="true">*</span></label>
                        <input id="fran7CartLocation" type="text" placeholder="Ex.: Benfica, Maianga..." autocomplete="street-address" required>
                    </div>
                    <div class="fran7-cart-field fran7-cart-note">
                        <label for="fran7CartNote">Comentário <span>(opcional)</span></label>
                        <textarea id="fran7CartNote" rows="2" maxlength="300" placeholder="Alguma indicação para o teu pedido?"></textarea>
                    </div>
                    <div class="fran7-cart-notice" id="fran7CartNotice" role="status" hidden>
                        <span id="fran7CartNoticeText"></span>
                        <button type="button" id="fran7CartNoticeAction">Preencher agora</button>
                    </div>
                    <div class="fran7-cart-total">
                        <span class="fran7-cart-total-label">
                            <span>TOTAL INDICADO</span>
                            <span class="fran7-cart-total-note">Estimativa sujeita a confirmação.</span>
                        </span>
                        <span id="fran7CartTotal">0 Kz</span>
                    </div>
                    <button type="button" class="fran7-cart-submit">Enviar pedido pelo WhatsApp</button>
                </div>
            </section>
        `;
        document.body.appendChild(overlay);
        document.getElementById("fran7CartLocation").addEventListener("input", function(event) {
            localStorage.setItem(LOCATION_KEY, event.target.value);
        });
        document.getElementById("fran7CartCity").addEventListener("input", function(event) {
            localStorage.setItem(CITY_KEY, event.target.value);
        });
        document.getElementById("fran7CartNote").addEventListener("input", function(event) {
            localStorage.setItem(NOTE_KEY, event.target.value);
        });

        overlay.querySelector(".fran7-cart-close").addEventListener("click", fecharCarrinho);
        overlay.addEventListener("click", function(event) {
            if (event.target === overlay) {
                fecharCarrinho();
            }
        });
        overlay.querySelector(".fran7-cart-submit").addEventListener("click", enviarPedido);
        overlay.querySelector("#fran7CartNoticeAction").addEventListener("click", focarCampoEmFalta);

        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape" && !overlay.hidden) {
                fecharCarrinho();
            }
        });

        document.addEventListener("click", function(event) {
            const addButton = event.target.closest(".fran7-cart-add");
            if (!addButton) {
                return;
            }

            adicionar({
                nome: addButton.dataset.cartName,
                imagem: addButton.dataset.cartImage,
                preco: addButton.dataset.cartPrice,
                cor: addButton.dataset.cartColor
            });
        });

        renderizar();
    }

    items = carregarCarrinho();

    window.Fran7Cart = {
        add: adicionar,
        open: abrirCarrinho,
        getItems: function() {
            return items.map(function(item) {
                return Object.assign({}, item);
            });
        },
        reload: function() {
            items = carregarCarrinho();
            renderizar();
        },
        storageKey: STORAGE_KEY
    };

    window.addEventListener("storage", function(event) {
        if (event.key === STORAGE_KEY) {
            items = carregarCarrinho();
            renderizar();
        }

        if (event.key === LOCATION_KEY) {
            const location = document.getElementById("fran7CartLocation");
            if (location) {
                location.value = event.newValue || "";
            }
        }
        if (event.key === CITY_KEY) {
            const city = document.getElementById("fran7CartCity");
            if (city) {
                city.value = event.newValue || "";
            }
        }
        if (event.key === NOTE_KEY) {
            const note = document.getElementById("fran7CartNote");
            if (note) {
                note.value = event.newValue || "";
            }
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", montarInterface, { once: true });
    } else {
        montarInterface();
    }
})();
