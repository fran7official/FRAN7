(function() {
    "use strict";

    if (document.getElementById("fran7AiOpen")) return;

    const widget = document.createElement("div");
    widget.id = "fran7-ai";
    widget.innerHTML = `
        <button class="fran7-ai-button" id="fran7AiOpen" type="button" aria-label="Abrir assistente FRAN7" aria-controls="fran7AiWindow" aria-expanded="false">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-5.2A7.5 7.5 0 1 1 20 11.5Z"/>
                <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/>
            </svg>
        </button>
        <section class="fran7-ai-window" id="fran7AiWindow" role="dialog" aria-modal="false" aria-labelledby="fran7AiTitle" hidden>
            <header class="fran7-ai-header">
                <div class="fran7-ai-brand">
                    <div class="fran7-ai-logo" aria-hidden="true">
                        <span class="fran7-ai-avatar">
                            <span class="fran7-ai-avatar-hand fran7-ai-avatar-hand-left"></span>
                            <span class="fran7-ai-avatar-hand fran7-ai-avatar-hand-right"></span>
                            <span class="fran7-ai-avatar-face"><span></span><span></span></span>
                        </span>
                    </div>
                    <div class="fran7-ai-title">
                        <strong id="fran7AiTitle">FRAN7 AI</strong>
                        <span class="fran7-ai-status"><span class="fran7-ai-status-dot"></span>Assistente FRAN7</span>
                    </div>
                </div>
                <button class="fran7-ai-close" id="fran7AiClose" type="button" aria-label="Fechar assistente">×</button>
            </header>
            <div class="fran7-ai-messages" id="fran7AiMessages" aria-live="polite">
                <div class="fran7-ai-message bot">Olá! Sou a FRAN7 AI. Posso ajudar com dúvidas sobre a loja ou responder a outras perguntas.</div>
            </div>
            <div class="fran7-ai-quick" aria-label="Perguntas rápidas">
                <button type="button" data-assistant-prompt="Quero ver os produtos">Produtos</button>
                <button type="button" data-assistant-prompt="Apresenta todos os produtos do catálogo FRAN7">Catálogo completo</button>
                <button type="button" data-assistant-prompt="Quais são os tamanhos?">Tamanhos</button>
                <button type="button" data-assistant-prompt="Como funcionam as entregas?">Entregas</button>
            </div>
            <form class="fran7-ai-input-area" id="fran7AiForm">
                <input type="text" id="fran7AiInput" class="fran7-ai-input" placeholder="Escreve uma mensagem..." autocomplete="off" aria-label="Mensagem para o assistente">
                <button class="fran7-ai-send" id="fran7AiSend" type="submit" aria-label="Enviar mensagem">↑</button>
            </form>
        </section>
    `;
    document.body.appendChild(widget);
})();
