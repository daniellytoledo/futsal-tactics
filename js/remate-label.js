
/*
 * ==========================================
 * PLAYBOOK — MELHOR REMATADORA
 * ==========================================
 *
 * Adiciona uma etiqueta à jogadora
 * responsável pelo remate.
 *
 * Não altera os JavaScripts das animações.
 */

(() => {
    const page = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const shooters = {
        "canto-1.html": 3,
        "canto-2.html": 4,
        "linha.html": 2
    };

    const playerNumber = shooters[page];

    if (!playerNumber) {
        return;
    }

    const player = document.querySelector(
        `#player${playerNumber}`
    );

    if (!player) {
        return;
    }

    const SVG_NS = "http://www.w3.org/2000/svg";

    function createSVG(tag, attributes) {
        const element = document.createElementNS(
            SVG_NS,
            tag
        );

        Object.entries(attributes).forEach(
            ([key, value]) => {
                element.setAttribute(key, String(value));
            }
        );

        return element;
    }

    // A etiqueta fica à esquerda da jogadora
    // para evitar sair do campo junto à baliza.
    const label = createSVG("g", {
        class: "shooter-label",
        transform: "translate(-214 -49)",
        "pointer-events": "none"
    });

    const background = createSVG("rect", {
        x: 0,
        y: 0,
        width: 205,
        height: 31,
        rx: 8,
        fill: "#101612",
        "fill-opacity": 0.94,
        stroke: "#b9f36b",
        "stroke-width": 1.2
    });

    const text = createSVG("text", {
        x: 102.5,
        y: 20,
        "text-anchor": "middle",
        "font-family": "Arial, sans-serif",
        "font-size": 13,
        "font-weight": 700,
        fill: "#b9f36b",
        stroke: "none"
    });

    text.textContent =
        "★ Jogadora de melhor remate";

    label.appendChild(background);
    label.appendChild(text);

    // Colocar a etiqueta dentro do grupo
    // da jogadora faz com que acompanhe
    // automaticamente todas as animações.
    player.appendChild(label);
})();
