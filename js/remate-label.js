
/*
 * PLAYBOOK — JOGADORA DE MELHOR REMATE
 *
 * Canto 1: Jogadora 3
 * Canto 2: Jogadora 4
 * Linha: Jogadora 2
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

    if (!playerNumber) return;

    const player = document.querySelector(
        `#player${playerNumber}`
    );

    if (!player) return;

    const SVG_NS = "http://www.w3.org/2000/svg";

    function createSVG(tag, attributes = {}) {
        const element = document.createElementNS(
            SVG_NS,
            tag
        );

        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, String(value));
        }

        return element;
    }

    // Dimensões da etiqueta
    const width = 218;
    const height = 36;

    // Posicionada acima e à esquerda da jogadora
    const label = createSVG("g", {
        class: "shooter-label",
        transform: `translate(${-width - 12} -52)`,
        "pointer-events": "none"
    });

    // Fundo da etiqueta
    const background = createSVG("rect", {
        x: 0,
        y: 0,
        width: width,
        height: height,
        rx: 9,
        fill: "#101612",
        "fill-opacity": 0.96,
        stroke: "#b9f36b",
        "stroke-width": 1.5
    });

    // Texto — estilos inline têm prioridade
    // sobre os seletores CSS das jogadas.
    const text = createSVG("text", {
        x: width / 2,
        y: height / 2,
        "dominant-baseline": "middle",
        "text-anchor": "middle"
    });

    text.textContent = "★ Jogadora de melhor remate";

    text.style.setProperty(
        "font-size",
        "13px",
        "important"
    );

    text.style.setProperty(
        "font-family",
        "Arial, sans-serif",
        "important"
    );

    text.style.setProperty(
        "font-weight",
        "700",
        "important"
    );

    text.style.setProperty(
        "fill",
        "#b9f36b",
        "important"
    );

    text.style.setProperty(
        "stroke",
        "none",
        "important"
    );

    // Evita deformação por regras de CSS existentes.
    text.style.setProperty(
        "letter-spacing",
        "0px",
        "important"
    );

    label.appendChild(background);
    label.appendChild(text);

    // A etiqueta acompanha a jogadora.
    player.appendChild(label);
})();
