(function() {
    "use strict";

    const STORAGE_KEY = "fran7_site_entered_v1";
    const SKIP_CLASS = "fran7-entrada-ja-feita";
    const root = document.documentElement;

    let enteredBefore = false;

    try {
        enteredBefore = sessionStorage.getItem(STORAGE_KEY) === "1";
        if (!enteredBefore) {
            sessionStorage.setItem(STORAGE_KEY, "1");
        }
    } catch (error) {
        console.error("Não foi possível guardar o estado de entrada FRAN7:", error);
    }

    if (enteredBefore) {
        root.classList.add(SKIP_CLASS);
    }

    window.addEventListener("pageshow", function(event) {
        if (event.persisted) {
            root.classList.add(SKIP_CLASS);
        }
    });
})();
