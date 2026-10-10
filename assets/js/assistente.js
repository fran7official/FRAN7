(function() {
    "use strict";

    const PRODUTOS_FRAN7 = [
        {name: "Modelo FRAN7 01", price: "11.000 Kz", image: "assets/images/1.png", aliases: ["modelo 01", "modelo 1", "modelo fran7 01"]},
        {name: "Modelo FRAN7 02", price: "7.000 Kz", image: "assets/images/2.png", aliases: ["modelo 02", "modelo 2", "modelo fran7 02"]},
        {name: "Modelo FRAN7 03", price: "7.000 Kz", image: "assets/images/3.png", aliases: ["modelo 03", "modelo 3", "modelo fran7 03"]},
        {name: "Modelo FRAN7 04", price: "8.500 Kz", image: "assets/images/4.png", aliases: ["modelo 04", "modelo 4", "modelo fran7 04"]},
        {name: "Modelo FRAN7 05", price: "Consultar preço", image: "assets/images/mulheres,%20conjunto.jpg", aliases: ["modelo 05", "modelo 5", "modelo fran7 05"]},
        {name: "Meias FRAN7", price: "Consultar preço", image: "assets/images/meias.jpg", aliases: ["meias", "meias fran7"]},
        {name: "Modelo FRAN7 07", price: "Consultar preço", image: "assets/images/a1.jpeg", aliases: ["modelo 07", "modelo 7", "modelo fran7 07"]},
        {name: "Modelo FRAN7 08", price: "Consultar preço", image: "assets/images/a2.jpeg", aliases: ["modelo 08", "modelo 8", "modelo fran7 08"]},
        {name: "Modelo FRAN7 09", price: "Consultar preço", image: "assets/images/a3.jpeg", aliases: ["modelo 09", "modelo 9", "modelo fran7 09"]},
        {name: "Modelo FRAN7 10", price: "Consultar preço", image: "assets/images/WhatsApp%20Image%202026-10-04%20at%202.24.22%20PM.jpeg", aliases: ["modelo 10", "modelo fran7 10"]},
        {name: "Modelo FRAN7 11", price: "Consultar preço", image: "assets/images/WhatsApp%20Image%202026-10-04%20at%202.24.23%20PM.jpeg", aliases: ["modelo 11", "modelo fran7 11"]},
        {name: "Modelo FRAN7 12", price: "Consultar preço", image: "assets/images/WhatsApp%20Image%202026-10-04%20at%202.24.24%20PM.jpeg", aliases: ["modelo 12", "modelo fran7 12"]},
        {name: "T-shirt FRAN7 Tribal", price: "11.000 Kz", image: "assets/images/1.png", aliases: ["t shirt fran7 tribal", "camisola tribal"]},
        {name: "T-shirt FRAN7", price: "7.000 Kz", image: "assets/images/3.png", aliases: ["t shirt fran7"]},
        {name: "Boné FRAN7 Modelo 2", price: "Consultar preço", image: "assets/images/CASTANHO.MODELO2.jpeg", images: ["assets/images/CINZA.MODELO2.jpeg"], colors: ["Castanho", "Cinza"], aliases: ["bone modelo 2", "bone modelo 02", "chapeu modelo 2", "chapeu modelo 02", "bone fran7 modelo 2"]},
        {name: "Boné FRAN7", price: "7.000 Kz", image: "assets/images/2.png", aliases: ["bone fran7"]},
        {name: "Boné FRAN7", price: "Consultar preço", image: "assets/images/4.png", aliases: ["bone fran7"]},
        {name: "FRAN7 Performance", price: "Consultar preço", image: "assets/images/WhatsApp%20Image%202026-10-04%20at%202.24.22%20PM.jpeg", aliases: ["fran7 performance"]},
        {name: "Conjunto Feminino FRAN7", price: "Consultar preço", image: "assets/images/mulheres,%20conjunto.jpg", aliases: ["conjunto feminino", "conjunto feminino fran7"]},
        {name: "T-shirt FRAN7 Crianças", price: "Consultar tamanho e preço", image: "assets/images/1.png", aliases: ["t shirt fran7 criancas", "camisola infantil"]},
        {name: "Boné FRAN7 Crianças", price: "Consultar tamanho e preço", image: "assets/images/2.png", aliases: ["bone fran7 criancas", "bone infantil"]}
    ];
    const MAX_HISTORICO = 6;
    const historico = [];
    const openButton = document.getElementById("fran7AiOpen");
    const closeButton = document.getElementById("fran7AiClose");
    const chatWindow = document.getElementById("fran7AiWindow");
    const input = document.getElementById("fran7AiInput");
    const sendButton = document.getElementById("fran7AiSend");
    const messages = document.getElementById("fran7AiMessages");
    const form = document.getElementById("fran7AiForm");

    if (!openButton || !closeButton || !chatWindow || !input || !sendButton || !messages || !form) {
        throw new Error("Não foi possível iniciar o assistente FRAN7: faltam elementos da interface.");
    }

    function adicionarMensagem(texto, tipo) {
        const message = document.createElement("div");
        message.className = "fran7-ai-message " + tipo;
        message.textContent = texto;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        return message;
    }

    function normalizar(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim();
    }

    function pedeTodosOsProdutos(texto) {
        return /\b(catalogo|todos|todas|lista completa|quais produtos|que produtos|que modelos|quais modelos|o que vende|o que tem na fran7|produtos da fran7|tudo que sabes|tudo o que sabes|tudo do site|apresenta tudo|tudo sobre a fran7)\b/.test(normalizar(texto));
    }

    function obterSugestoes(resposta) {
        const texto = normalizar(resposta);
        const pedeTodos = pedeTodosOsProdutos(resposta);
        const pageProducts = Array.from(document.querySelectorAll(".produto, .modelo, .favorito-card"));

        return PRODUTOS_FRAN7.map(function(product) {
            const article = pageProducts.find(function(candidate) {
                const candidateName = normalizar(candidate.dataset.productName ||
                    candidate.querySelector("h2, h3")?.textContent.trim() ||
                    candidate.querySelector("img")?.alt ||
                    "");
                const candidateImage = candidate.querySelector(
                    ".produto-imagem img, .modelo-imagem img, .favorito-card > img"
                )?.getAttribute("src");
                return candidateName === normalizar(product.name) &&
                    (!candidateImage || candidateImage === product.image);
            });
            const aliases = [product.name].concat(product.aliases || []).map(normalizar);
            const matched = aliases.some(function(alias) {
                return alias.length > 4 && texto.includes(alias);
            });
            return {
                article: article || criarArtigoProduto(product),
                name: product.name,
                image: product.image,
                price: product.price,
                aliases: aliases,
                matched: matched
            };
        }).filter(function(product) {
            return pedeTodos || product.matched;
        }).slice(0, pedeTodos ? PRODUTOS_FRAN7.length : 4);
    }

    function criarArtigoProduto(product) {
        const article = document.createElement("article");
        article.className = "produto";
        article.dataset.productName = product.name;
        article.dataset.productPrice = product.price;
        article.dataset.productDescription = "Modelo apresentado no catálogo FRAN7. Confirma cor, tamanho e disponibilidade com a equipa.";
        article.dataset.galleryImages = (product.images || []).join("|");
        article.dataset.galleryColors = (product.colors || []).join("|");
        if (localStorage.getItem("sessaoFRAN7") !== "true") {
            article.dataset.protegido = "true";
        }
        const imageContainer = document.createElement("div");
        imageContainer.className = "produto-imagem";
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        imageContainer.appendChild(image);
        article.appendChild(imageContainer);
        return article;
    }

    function mostrarSugestoes(message, resposta) {
        const products = obterSugestoes(resposta);
        if (!products.length) return;

        const list = document.createElement("div");
        list.className = "fran7-ai-product-suggestions";
        list.setAttribute("aria-label", "Modelos sugeridos pela FRAN7 AI");

        products.forEach(function(product) {
            const card = document.createElement("article");
            card.className = "fran7-ai-product-card";
            card.setAttribute("aria-label", product.name + ", " + product.price);

            if (product.image) {
                const image = document.createElement("img");
                image.src = product.image;
                image.alt = product.name;
                image.loading = "lazy";
                card.appendChild(image);
            }

            const details = document.createElement("div");
            details.className = "fran7-ai-product-details";
            const name = document.createElement("strong");
            name.textContent = product.name;
            const price = document.createElement("span");
            price.textContent = product.price;
            const open = document.createElement("button");
            open.type = "button";
            open.className = "fran7-ai-product-open";
            open.textContent = "Ver modelo";
            open.addEventListener("click", function() {
                if (localStorage.getItem("sessaoFRAN7") !== "true") {
                    if (typeof window.mostrarAviso === "function") {
                        window.mostrarAviso();
                        return;
                    }
                    if (typeof window.mostrarNotificacao === "function" &&
                        typeof window.mostrarFormularioLogin === "function") {
                        window.mostrarNotificacao(
                            "Registo ou início de sessão",
                            "Para ver este modelo, primeiro cadastre-se ou inicie a sua sessão neste site.",
                            "INICIAR SESSÃO",
                            function() {
                                window.mostrarFormularioLogin();
                            },
                            true
                        );
                        return;
                    }
                    window.location.href = "registo.html?modo=login";
                    return;
                }

                if (!window.Fran7ProductDetail ||
                    typeof window.Fran7ProductDetail.open !== "function") {
                    console.error("FRAN7 AI: o detalhe do produto não está disponível nesta página.");
                    return;
                }

                chatWindow.hidden = true;
                openButton.setAttribute("aria-expanded", "false");
                window.Fran7ProductDetail.open(product.article);
            });
            details.append(name, price, open);
            card.appendChild(details);
            list.appendChild(card);
        });

        message.appendChild(list);
        messages.scrollTop = messages.scrollHeight;
    }

    function responderLocalmente(question) {
        const texto = normalizar(question);
        const cumprimento = /^(ola|oi|bom dia|boa tarde|boa noite|tudo bem|como estas|como esta|ola como estas|ola como esta|oi tudo bem|ola tudo bem)$/.test(texto);

        if (cumprimento) {
            return "Olá! Estou bem, obrigada por perguntares. Como posso ajudar-te hoje com a FRAN7?";
        }

        if (/^(obrigad[oa]s?|muito obrigad[oa])$/.test(texto)) {
            return "De nada! Se precisares de ajuda com um produto ou com o site, estou por aqui.";
        }

        if (pedeTodosOsProdutos(question)) {
            return "Claro! Estes são os artigos registados no catálogo FRAN7. Os preços indicados para consulta, cores, tamanhos e disponibilidade devem ser confirmados com a equipa.";
        }

        const productMatches = PRODUTOS_FRAN7.filter(function(product) {
            return [product.name].concat(product.aliases || []).some(function(alias) {
                const normalizedAlias = normalizar(alias);
                return normalizedAlias.length > 3 && texto.includes(normalizedAlias);
            });
        });

        if (productMatches.length) {
            const selected = productMatches[0];
            const duplicateName = productMatches.filter(function(product) {
                return product.name === selected.name;
            });
            if (duplicateName.length > 1) {
                return "Temos modelos de " + selected.name + " com preços diferentes ou por confirmar. Diz-me qual imagem ou modelo procuras, ou confirma com a equipa pelo WhatsApp: https://wa.me/244973560521.";
            }
            return selected.name + ": " + selected.price + ". Não consigo confirmar o stock, as cores ou os tamanhos deste modelo pelo site. Posso mostrar-te o modelo para veres a imagem.";
        }

        if (/\b(tem|tens|vende|vendem|existe|ha|disponivel|stock|estoque|preco|custa|procuro|quero comprar|queria comprar)\b/.test(texto) &&
            /\b(roupa|camisola|camisa|t shirt|tshirt|moletom|sweatshirt|calca|calcas|vestido|saia|casaco|tenis|sapato|cor|tamanho)\b/.test(texto)) {
            return "Não consigo confirmar esse artigo ou a disponibilidade pelo catálogo. A FRAN7 pode ter opções que não estão listadas no site. Diz-me o modelo, a cor ou o tamanho que procuras e confirma com a equipa pelo WhatsApp: https://wa.me/244973560521.";
        }

        if (/\b(sacola|carrinho|pedido|pedidos|comprar|compra)\b/.test(texto)) {
            return "Na FRAN7, podes adicionar o artigo à sacola, escolher as opções disponíveis e preencher os dados pedidos. O envio do pedido abre o WhatsApp para confirmação com a equipa.";
        }

        if (/\b(favoritos|favorito|coracao)\b/.test(texto)) {
            return "O botão de favoritos guarda os modelos que queres consultar mais tarde. Podes abrir a página de favoritos pelo ícone de coração no topo.";
        }

        if (/\b(registo|registar|cadastro|cadastrar|conta|login|entrar|perfil)\b/.test(texto)) {
            return "Podes criar uma conta ou iniciar sessão na página Registo. Depois, os dados da tua conta ficam disponíveis no perfil.";
        }

        if (/\b(entrega|entregas|envio|encomenda|pagamento|pagar)\b/.test(texto)) {
            return "O site não confirma prazos, zonas de entrega ou formas de pagamento. A equipa confirma esses detalhes quando enviares o pedido pelo WhatsApp: https://wa.me/244973560521.";
        }

        if (/\b(empreendedorismo|empreender|negocio|negocios|vendas|vender|clientes|cliente|marketing|divulgacao)\b/.test(texto)) {
            return "Uma forma simples de começar é: identifica quem precisa do que vendes, apresenta claramente o benefício e facilita o próximo passo para comprar. Regista as dúvidas dos clientes e usa-as para melhorar a oferta. Se me disseres o que vendes, posso sugerir ideias mais específicas.";
        }

        if (/\b(ajuda|site|loja|fran7|catalogo|modelos|produtos)\b/.test(texto)) {
            return "Posso ajudar com o catálogo, preços publicados, sacola, favoritos, registo e informações sobre a FRAN7. Também posso dar orientações básicas sobre vendas e atendimento. O que gostarias de saber?";
        }

        return "Ainda sou uma assistente básica e não percebi bem a pergunta. Posso ajudar com produtos FRAN7, preços publicados, sacola, favoritos, registo, entregas ou ideias básicas de vendas. Podes explicar de outra forma?";
    }

    async function enviar(texto) {
        const question = (texto || input.value).trim();
        if (!question || sendButton.disabled) return;

        adicionarMensagem(question, "user");
        input.value = "";
        input.disabled = true;
        sendButton.disabled = true;

        const typing = document.createElement("div");
        typing.className = "fran7-ai-message bot";
        typing.textContent = "A FRAN7 AI está a pensar...";
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        try {
            await new Promise(function(resolve) {
                window.setTimeout(resolve, 250);
            });
            let reply = responderLocalmente(question);
            const pedeTodos = pedeTodosOsProdutos(question);
            typing.remove();
            const replyMessage = adicionarMensagem(reply, "bot");
            mostrarSugestoes(replyMessage, pedeTodos ? "todos os produtos da FRAN7" : reply);
            historico.push(
                {tipo: "user", texto: question},
                {tipo: "assistant", texto: reply}
            );
            if (historico.length > MAX_HISTORICO) {
                historico.splice(0, historico.length - MAX_HISTORICO);
            }
        } catch (error) {
            console.error("FRAN7 AI:", error);
            typing.remove();
            adicionarMensagem(
                "Não foi possível obter uma resposta da FRAN7 AI. " +
                    (error instanceof Error ? error.message : "Tenta novamente mais tarde."),
                "bot"
            );
        } finally {
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    }

    openButton.addEventListener("click", function() {
        chatWindow.hidden = false;
        openButton.setAttribute("aria-expanded", "true");
        input.focus();
    });

    closeButton.addEventListener("click", function() {
        chatWindow.hidden = true;
        openButton.setAttribute("aria-expanded", "false");
        openButton.focus();
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        enviar();
    });

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    document.querySelectorAll("[data-assistant-prompt]").forEach(function(button) {
        button.addEventListener("click", function() {
            enviar(button.dataset.assistantPrompt);
        });
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && !chatWindow.hidden) {
            chatWindow.hidden = true;
            openButton.setAttribute("aria-expanded", "false");
            openButton.focus();
        }
    });
})();
