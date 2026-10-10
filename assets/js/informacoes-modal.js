(function() {
    "use strict";

    const pages = {
        informacoes: {
            kicker: "Apoio ao cliente",
            title: "Informações",
            content: `
                <p>Encontra aqui os passos para escolher um artigo e enviar o teu pedido à FRAN7.</p>
                <h2>Como comprar</h2>
                <ul>
                    <li>Explora os produtos, o catálogo ou a coleção que procuras.</li>
                    <li>Adiciona os artigos à sacola e indica a cor, o tamanho, a quantidade e a localização.</li>
                    <li>Envia o pedido pelo WhatsApp para confirmar disponibilidade e combinar os detalhes.</li>
                </ul>
                <h2>Disponibilidade e preços</h2>
                <p>Os tamanhos, cores e disponibilidade podem variar. Quando o preço estiver indicado como “Consultar”, confirma-o com a equipa antes de concluir o pedido.</p>
                <h2>Privacidade e apoio</h2>
                <p>A sacola fica guardada neste navegador. Os dados do pedido só são incluídos na mensagem do WhatsApp quando escolhes enviá-la.</p>
                <div class="fran7-info-actions">
                    <a class="fran7-info-button" href="#" data-info-page="privacidade">Política de privacidade</a>
                    <a class="fran7-info-button" href="https://wa.me/244973560521" target="_blank" rel="noopener noreferrer">Contactar a FRAN7</a>
                    <a class="fran7-info-button" href="#" data-info-page="feedback">Enviar feedback</a>
                </div>`
        },
        termos: {
            kicker: "Informações FRAN7",
            title: "Termos e condições",
            content: `
                <p class="fran7-info-note">Informação provisória — confirma os detalhes de cada pedido diretamente com a FRAN7.</p>
                <p>Os modelos, tamanhos, cores, preços e disponibilidade podem variar. Os preços assinalados como “Consultar” devem ser confirmados antes do pedido.</p>
                <p>O envio do pedido pelo WhatsApp serve para combinar a disponibilidade, a entrega e o pagamento com a equipa FRAN7. O total apresentado na sacola é indicativo até essa confirmação.</p>
                <p>Para esclarecer uma questão, contacta <a href="mailto:fran7officiall@gmail.com">fran7officiall@gmail.com</a> ou <a href="https://wa.me/244973560521" target="_blank" rel="noopener noreferrer">WhatsApp FRAN7</a>.</p>`
        },
        privacidade: {
            kicker: "Informações FRAN7",
            title: "Privacidade",
            content: `
                <p class="fran7-info-note">Versão provisória — sujeita a validação pela marca antes da publicação.</p>
                <p>A FRAN7 valoriza a privacidade dos seus clientes e visitantes. Esta política explica que dados podem ser recolhidos, como são utilizados e quais são os direitos dos utilizadores.</p>
                <h2>Dados que recolhemos</h2>
                <p>Podemos recolher e-mail, telefone, dia e mês de nascimento, informações fornecidas voluntariamente nos formulários e dados técnicos necessários ao funcionamento do website.</p>
                <h2>Utilização e partilha</h2>
                <p>Os dados podem ser utilizados para gerir o cadastro, responder a pedidos, comunicar novidades quando autorizado, melhorar o website e cumprir obrigações legais. A FRAN7 não vende dados pessoais; a partilha ocorre apenas quando necessária ao serviço ou exigida por lei.</p>
                <h2>Consentimento, segurança e conservação</h2>
                <p>Os dados são tratados para as finalidades indicadas no cadastro e conservados pelo período necessário. São adotadas medidas técnicas e organizativas adequadas à sua proteção.</p>
                <h2>Direitos do utilizador</h2>
                <p>Podes pedir acesso, correção, atualização ou eliminação dos teus dados, bem como exercer os restantes direitos previstos na legislação aplicável.</p>
                <h2>Armazenamento no navegador e serviços externos</h2>
                <p>A sacola e os favoritos ficam guardados neste navegador. Os comentários e o nome escolhido para publicar são guardados na base de dados e ficam visíveis na loja. O registo e a entrada podem usar e-mail e palavra-passe ou Google; a entrada Google usa autenticação Google. WhatsApp, Instagram e YouTube são serviços externos com políticas próprias.</p>
                <h2>Contacto</h2>
                <p>Para esclarecer o tratamento dos teus dados ou solicitar uma remoção, escreve para <a href="mailto:fran7officiall@gmail.com">fran7officiall@gmail.com</a>.</p>`
        },
        sobre: {
            kicker: "Build your legacy",
            title: "Sobre a FRAN7",
            content: `
                <p>A FRAN7 é uma marca ligada ao desporto, ao estilo e à vontade de construir o próprio caminho.</p>
                <h2>A nossa identidade</h2>
                <p>Criamos uma experiência de vestuário desportivo para quem quer expressar a sua energia dentro e fora do campo. A nossa mensagem é simples: o próximo ponto começa contigo.</p>
                <h2>A nossa comunidade</h2>
                <p>A FRAN7 cresce com as pessoas que usam, acompanham e recomendam a marca. Procuramos ouvir o feedback dos clientes e continuar a apresentar modelos para diferentes estilos e idades.</p>
                <div class="fran7-info-actions">
                    <a class="fran7-info-button" href="#" data-info-page="feedback">Enviar feedback</a>
                    <a class="fran7-info-button" href="#" data-info-page="parcerias">Conhecer parcerias</a>
                </div>`
        },
        parcerias: {
            kicker: "Juntos, damos mais voz às ideias",
            title: "Parcerias",
            content: `
                <p>A FRAN7 valoriza projetos que partilham energia, criatividade e vontade de inspirar.</p>
                <h2>Parceiro FRAN7 — Vozes Visionárias Podcast</h2>
                <p>Conhece o podcast e acompanha as conversas no canal oficial do YouTube.</p>
                <div class="fran7-info-actions">
                    <a class="fran7-info-button" href="https://youtube.com/@adelinosabino-ez5zp?si=zctakTPyO9j1VUCS" target="_blank" rel="noopener noreferrer">Ver no YouTube</a>
                </div>
                <h2>Queres propor uma parceria?</h2>
                <p>Envia a tua proposta à equipa FRAN7 para conversarmos sobre a ideia.</p>
                <a class="fran7-info-button" href="https://wa.me/244973560521?text=Ol%C3%A1%20FRAN7!%20Gostaria%20de%20apresentar%20uma%20proposta%20de%20parceria." target="_blank" rel="noopener noreferrer">Falar com a FRAN7</a>`
        },
        feedback: {
            kicker: "A tua opinião conta",
            title: "Feedback",
            content: `
                <p>Ajuda-nos a melhorar a FRAN7. Envia uma sugestão, partilha a tua experiência ou conta-nos o que gostarias de ver na loja.</p>
                <form class="fran7-info-form" id="fran7FeedbackForm">
                    <label>Nome (opcional)<input name="nome" type="text" autocomplete="name" placeholder="Como te chamas?"></label>
                    <label>A tua mensagem<textarea name="mensagem" required placeholder="Escreve aqui o teu feedback..."></textarea></label>
                    <p>Ao continuar, o WhatsApp abre com a mensagem pronta para reveres e enviares à FRAN7.</p>
                    <button type="submit">Enviar feedback</button>
                </form>`
        }
    };

    const overlay = document.createElement("div");
    overlay.className = "fran7-info-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
        <section class="fran7-info-dialog" role="dialog" aria-modal="true" aria-labelledby="fran7InfoTitle">
            <button class="fran7-info-close" type="button" aria-label="Fechar informações">×</button>
            <p class="fran7-info-kicker"></p>
            <h2 class="fran7-info-title" id="fran7InfoTitle"></h2>
            <div class="fran7-info-content"></div>
        </section>`;
    document.body.appendChild(overlay);

    const dialog = overlay.querySelector(".fran7-info-dialog");
    const closeButton = overlay.querySelector(".fran7-info-close");
    const kicker = overlay.querySelector(".fran7-info-kicker");
    const title = overlay.querySelector(".fran7-info-title");
    const content = overlay.querySelector(".fran7-info-content");
    let previousFocus = null;

    function openPage(key, opener) {
        const page = pages[key];
        if (!page) {
            console.error("Não existe conteúdo para a informação FRAN7:", key);
            return;
        }

        if (overlay.hidden) {
            previousFocus = opener || document.activeElement;
        }
        kicker.textContent = page.kicker;
        title.textContent = page.title;
        content.innerHTML = page.content;
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        dialog.scrollTop = 0;
        closeButton.focus();
    }

    function closePage() {
        overlay.hidden = true;
        document.body.style.overflow = "";
        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    document.addEventListener("click", function(event) {
        const link = event.target.closest("[data-info-page]");
        if (!link) return;

        const key = link.dataset.infoPage;
        if (!pages[key]) return;
        event.preventDefault();
        openPage(key, link);
    });

    content.addEventListener("submit", function(event) {
        const form = event.target.closest("#fran7FeedbackForm");
        if (!form) return;
        event.preventDefault();

        const nome = form.elements.nome.value.trim();
        const mensagem = form.elements.mensagem.value.trim();
        if (!mensagem) {
            form.elements.mensagem.focus();
            return;
        }

        const texto = [
            "Olá FRAN7! Quero deixar o meu feedback.",
            nome ? "- Nome: " + nome : "",
            "- Mensagem: " + mensagem
        ].filter(Boolean).join("\n");

        window.open(
            "https://wa.me/244973560521?text=" + encodeURIComponent(texto),
            "_blank",
            "noopener,noreferrer"
        );
    });

    closeButton.addEventListener("click", closePage);
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) closePage();
    });
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && !overlay.hidden) closePage();
    });
})();
