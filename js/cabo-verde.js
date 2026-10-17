
/*
 * CABO VERDE — VARIANTES 1 E 2
 *
 * VARIANTE 1:
 * O jogador 2 desmarca-se e recebe o passe.
 *
 * VARIANTE 2:
 * O adversário acompanha o jogador 2.
 * O jogador 1 passa para o jogador 3.
 *
 * VARIANTE 3:
 * Ainda por definir.
 */

// ==========================================
// 1. POSIÇÕES
// ==========================================

const P = {
    // Jogador 1 — cobrança lateral
    p1: { x: 750, y: 18 },

    // Jogador 2
    p2Start: { x: 750, y: 315 },
    p2Near: { x: 750, y: 68 },
    p2Finish: { x: 545, y: 68 },

    // Jogador 3
    p3Start: { x: 760, y: 445 },
    p3Finish: { x: 750, y: 315 },

    // Jogador 4
    p4Start: { x: 550, y: 60 },
    p4Finish: { x: 550, y: 630 },

    // Marcador do jogador 4
    defender4Start: { x: 485, y: 105 },
    defender4Finish: { x: 485, y: 600 },

    // Marcador do jogador 2
    defender2Start: { x: 688, y: 318 },

    // Bola
    ballStart: { x: 750, y: 42 },
    ballAt2: { x: 545, y: 68 },
    ballAt3: { x: 750, y: 315 }
};

// ==========================================
// 2. ETAPAS E VELOCIDADES
// ==========================================

const stages = [
    {
        title: "Jogador 4 leva o marcador",
        duration: 1800
    },
    {
        title: "Jogadores 2 e 3 movimentam-se",
        duration: 2500
    },
    {
        title: "Jogador 2 acelera pela lateral",
        duration: 1000
    },
    {
        title: "Passe do jogador 1",
        duration: 1200
    }
];

// ==========================================
// 3. ELEMENTOS HTML E SVG
// ==========================================

const elements = {
    p1: document.querySelector("#player1"),
    p2: document.querySelector("#player2"),
    p3: document.querySelector("#player3"),
    p4: document.querySelector("#player4"),

    defender2: document.querySelector("#defender2"),
    defender4: document.querySelector("#defender4"),

    ball: document.querySelector("#ball"),
    guides: document.querySelector("#guides"),

    play: document.querySelector("#play"),
    restart: document.querySelector("#restart"),
    previous: document.querySelector("#previous"),
    next: document.querySelector("#next"),

    speed: document.querySelector("#speed"),
    status: document.querySelector("#status"),

    variant: document.querySelector("#variant"),
    variantNotice: document.querySelector("#variantNotice"),

    stepsList: document.querySelector("#steps"),
    attention: document.querySelector("#attention"),

    steps: [
        ...document.querySelectorAll("#steps li")
    ]
};

const guides = {
    move4: document.querySelector("#move4"),
    defender4: document.querySelector("#moveDefender"),

    move2Slow: document.querySelector("#move2Slow"),
    move3: document.querySelector("#move3"),
    move2Sprint: document.querySelector("#move2Sprint"),

    defender2: document.querySelector("#moveDefender2"),
    pass: document.querySelector("#passGuide")
};

const guideNumbers = [
    ...document.querySelectorAll(
        "#guides .guide-number"
    )
];

// ==========================================
// 4. ESTADO DA ANIMAÇÃO
// ==========================================

let currentVariant = "1";
let currentStep = 0;
let progress = 0;
let playing = false;

let frameId = null;
let lastFrame = null;
let runToken = 0;

// ==========================================
// 5. FUNÇÕES AUXILIARES
// ==========================================

function clamp(value) {
    return Math.max(0, Math.min(1, value));
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function between(start, end, t) {
    return {
        x: lerp(start.x, end.x, t),
        y: lerp(start.y, end.y, t)
    };
}

function place(element, position) {
    element.setAttribute(
        "transform",
        `translate(${position.x} ${position.y})`
    );
}

function placeCircle(element, position) {
    element.setAttribute("cx", position.x);
    element.setAttribute("cy", position.y);
}

// Atualiza uma seta SVG.
function setGuide(id, start, end) {
    const path = document.querySelector(`#${id}`);

    if (!path) {
        return;
    }

    path.setAttribute(
        "d",
        `M${start.x} ${start.y} L${end.x} ${end.y}`
    );
}

// ==========================================
// 6. POSIÇÃO DO JOGADOR 2
// ==========================================

function getPlayer2Position(t) {

    // Etapa 1: aguarda.
    if (currentStep === 0) {
        return P.p2Start;
    }

    // Etapa 2: aproximação lenta.
    if (currentStep === 1) {
        return between(
            P.p2Start,
            P.p2Near,
            t
        );
    }

    // Etapa 3: corrida rápida pela lateral.
    if (currentStep === 2) {
        return between(
            P.p2Near,
            P.p2Finish,
            t
        );
    }

    // Etapa 4: posição final.
    return P.p2Finish;
}

// ==========================================
// 7. POSIÇÃO DO JOGADOR 3
// ==========================================

function getPlayer3Position(t) {

    if (currentStep === 0) {
        return P.p3Start;
    }

    if (currentStep === 1) {
        return between(
            P.p3Start,
            P.p3Finish,
            t
        );
    }

    return P.p3Finish;
}

// ==========================================
// 8. POSIÇÃO DO JOGADOR 4
// ==========================================

function getPlayer4Position(t) {

    if (currentStep === 0) {
        return between(
            P.p4Start,
            P.p4Finish,
            t
        );
    }

    return P.p4Finish;
}

// ==========================================
// 9. MARCADOR DO JOGADOR 4
// ==========================================

function getDefender4Position(t) {

    if (currentStep === 0) {
        return between(
            P.defender4Start,
            P.defender4Finish,
            t
        );
    }

    return P.defender4Finish;
}

// ==========================================
// 10. MARCADOR DO JOGADOR 2
// ==========================================

function getDefender2Position(t) {

    // Na Variante 1, fica parado.
    if (currentVariant !== "2") {
        return P.defender2Start;
    }

    // Na primeira etapa, ainda está parado.
    if (currentStep === 0) {
        return P.defender2Start;
    }

    // Na Variante 2, acompanha o jogador 2
    // durante a aproximação e a corrida.
    const playerPosition = getPlayer2Position(t);

    return {
        x: playerPosition.x - 62,
        y: playerPosition.y + 3
    };
}

// ==========================================
// 11. MOVIMENTO DA BOLA
// ==========================================

function getBallPosition(t) {

    // Etapas 1, 2 e 3:
    // o jogador 1 ainda está com a bola.
    if (currentStep < 3) {
        return P.ballStart;
    }

    // VARIANTE 1: passe para o jogador 2.
    if (currentVariant === "1") {
        return between(
            P.ballStart,
            P.ballAt2,
            t
        );
    }

    // VARIANTE 2: passe para o jogador 3.
    if (currentVariant === "2") {
        return between(
            P.ballStart,
            P.ballAt3,
            t
        );
    }

    return P.ballStart;
}

// ==========================================
// 12. SETAS DE MOVIMENTO
// ==========================================

function renderGuides() {

    // Esconde todas as setas.
    Object.values(guides).forEach((path) => {
        if (path) {
            path.style.opacity = "0";
        }
    });

    // Esconde os números.
    guideNumbers.forEach((number) => {
        number.style.opacity = "0";
    });

    // Variante sem animação.
    if (currentVariant === "3") {
        return;
    }

    // ETAPA 1:
    // O jogador 4 afasta o marcador.
    if (currentStep === 0) {
        guides.move4.style.opacity = "1";
        guides.defender4.style.opacity = "1";
    }

    // ETAPA 2:
    // O jogador 2 aproxima-se.
    // O jogador 3 ocupa o espaço deixado.
    if (currentStep === 1) {
        guides.move2Slow.style.opacity = "1";
        guides.move3.style.opacity = "1";

        // Variante 2:
        // o marcador acompanha o jogador 2.
        if (currentVariant === "2" && guides.defender2) {

            const start = P.defender2Start;

            const end = {
                x: P.p2Near.x - 62,
                y: P.p2Near.y + 3
            };

            setGuide("moveDefender2", start, end);

            guides.defender2.style.opacity = "1";
        }
    }

    // ETAPA 3:
    // Corrida rápida do jogador 2.
    if (currentStep === 2) {
        guides.move2Sprint.style.opacity = "1";

        if (currentVariant === "2" && guides.defender2) {

            const start = {
                x: P.p2Near.x - 62,
                y: P.p2Near.y + 3
            };

            const end = {
                x: P.p2Finish.x - 62,
                y: P.p2Finish.y + 3
            };

            setGuide("moveDefender2", start, end);

            guides.defender2.style.opacity = "1";
        }
    }

    // ETAPA 4:
    // Destino do passe depende da variante.
    if (currentStep === 3) {

        const destination =
            currentVariant === "1"
                ? P.ballAt2
                : P.ballAt3;

        setGuide(
            "passGuide",
            P.ballStart,
            destination
        );

        guides.pass.style.opacity = "1";
    }

    // Destaca o número da etapa.
    if (guideNumbers[currentStep]) {
        guideNumbers[currentStep].style.opacity = "1";
    }
}

// ==========================================
// 13. DESENHAR A ANIMAÇÃO
// ==========================================

function render() {
    const t = clamp(progress);

    // Jogador 1 permanece no lateral.
    place(elements.p1, P.p1);

    // Jogadores 2, 3 e 4.
    place(
        elements.p2,
        getPlayer2Position(t)
    );

    place(
        elements.p3,
        getPlayer3Position(t)
    );

    place(
        elements.p4,
        getPlayer4Position(t)
    );

    // Marcador do jogador 4.
    placeCircle(
        elements.defender4,
        getDefender4Position(t)
    );

    // Marcador do jogador 2.
    if (elements.defender2) {
        placeCircle(
            elements.defender2,
            getDefender2Position(t)
        );
    }

    // Bola.
    place(
        elements.ball,
        getBallPosition(t)
    );

    // Setas da etapa.
    elements.guides.setAttribute(
        "class",
        `show-${currentStep}`
    );

    renderGuides();

    // Destaca a etapa no painel.
    elements.steps.forEach((li, index) => {
        li.classList.toggle(
            "active",
            index === currentStep
        );
    });

    // Informações da reprodução.
    elements.status.textContent =
        `${currentStep + 1}/4 · ${stages[currentStep].title}`;

    elements.play.textContent = playing
        ? "⏸ Pausar"
        : "▶ Reproduzir";
}

// ==========================================
// 14. PARAR, REINICIAR E NAVEGAR
// ==========================================

function stop() {
    playing = false;
    runToken++;

    if (frameId !== null) {
        cancelAnimationFrame(frameId);
    }

    frameId = null;
    lastFrame = null;
}

function reset() {
    stop();

    currentStep = 0;
    progress = 0;

    render();
}

function goTo(index) {

    // Permite navegar nas variantes 1 e 2.
    if (currentVariant === "3") {
        return;
    }

    stop();

    currentStep = Math.max(
        0,
        Math.min(stages.length - 1, index)
    );

    progress = 0;

    render();
}

// ==========================================
// 15. MOTOR DA ANIMAÇÃO
// ==========================================

function tick(time, token) {

    if (!playing || token !== runToken) {
        return;
    }

    if (lastFrame === null) {
        lastFrame = time;
    }

    const delta = Math.min(
        time - lastFrame,
        100
    );

    lastFrame = time;

    const speed = Number(elements.speed.value);

    progress +=
        (delta * speed) /
        stages[currentStep].duration;

    // Quando a etapa termina:
    if (progress >= 1) {
        progress = 1;

        render();

        // Se for a última etapa, termina.
        if (currentStep === stages.length - 1) {
            stop();
            render();
            return;
        }

        // Avança para a próxima etapa.
        currentStep++;
        progress = 0;
    }

    render();

    frameId = requestAnimationFrame((nextTime) => {
        tick(nextTime, token);
    });
}

// ==========================================
// 16. REPRODUZIR E PAUSAR
// ==========================================

function togglePlay() {

    if (currentVariant === "3") {
        return;
    }

    if (playing) {
        stop();
        render();
        return;
    }

    // Reinicia se a jogada terminou.
    if (
        currentStep === stages.length - 1 &&
        progress >= 1
    ) {
        currentStep = 0;
        progress = 0;
    }

    playing = true;
    lastFrame = null;

    const token = ++runToken;

    render();

    frameId = requestAnimationFrame((time) => {
        tick(time, token);
    });
}

// ==========================================
// 17. SELEÇÃO DAS VARIANTES
// ==========================================

function changeVariant(value) {
    stop();

    currentVariant = value;
    currentStep = 0;
    progress = 0;

    const available =
        value === "1" || value === "2";

    // Mostra a sequência das variantes disponíveis.
    elements.stepsList.style.display =
        available ? "" : "none";

    elements.attention.style.display =
        available ? "" : "none";

    elements.variantNotice.style.display =
        available ? "none" : "block";

    // Controlos.
    elements.play.disabled = !available;
    elements.restart.disabled = !available;
    elements.previous.disabled = !available;
    elements.next.disabled = !available;

    const finalStep = elements.steps[3];

    const finalTitle =
        finalStep.querySelector("strong");

    const finalDescription =
        finalStep.querySelector("span");

    const attentionText =
        elements.attention.querySelector("p");

    // VARIANTE 1
    if (value === "1") {

        stages[3].title =
            "Passe do jogador 1 para o 2";

        finalTitle.textContent =
            "04 · Passe do jogador 1 para o 2";

        finalDescription.textContent =
            "O jogador 1 passa a bola em profundidade " +
            "para o jogador 2, que se desmarcou " +
            "pela linha lateral em direção " +
            "ao campo adversário.";

        attentionText.textContent =
            "O jogador 4 afasta o seu marcador. " +
            "O jogador 2 aproxima-se devagar " +
            "e depois acelera pela lateral. " +
            "O jogador 3 ocupa a posição deixada " +
            "pelo jogador 2. O passe final " +
            "é feito para o jogador 2.";
    }

    // VARIANTE 2
    if (value === "2") {

        stages[3].title =
            "Passe do jogador 1 para o 3";

        finalTitle.textContent =
            "04 · Passe do jogador 1 para o 3";

        finalDescription.textContent =
            "O adversário acompanha a movimentação " +
            "do jogador 2. Quando o jogador 2 acelera " +
            "pela linha lateral, o jogador 1 passa " +
            "a bola para o jogador 3, que ocupa " +
            "a posição anteriormente deixada pelo 2.";

        attentionText.textContent =
            "O jogador 4 afasta o seu marcador. " +
            "O jogador 2 leva consigo o adversário " +
            "durante a aproximação e a corrida rápida. " +
            "O jogador 3 ocupa o espaço deixado. " +
            "Como o jogador 2 continua marcado, " +
            "o jogador 1 passa para o jogador 3.";
    }

    // VARIANTE 3
    if (value === "3") {
        stages[3].title = "Por definir";
    }

    // Reposição das posições iniciais.
    render();

    if (!available) {
        elements.status.textContent =
            `Variante ${value} · Por definir`;
    }
}

// ==========================================
// 18. EVENTOS DOS BOTÕES
// ==========================================

elements.restart.addEventListener(
    "click",
    reset
);

elements.previous.addEventListener(
    "click",
    () => goTo(currentStep - 1)
);

elements.next.addEventListener(
    "click",
    () => goTo(currentStep + 1)
);

elements.play.addEventListener(
    "click",
    togglePlay
);

// Seleção de etapas no painel direito.
elements.steps.forEach((li, index) => {
    const button = li.querySelector("button");

    button.addEventListener(
        "click",
        () => goTo(index)
    );
});

// Alteração da variante.
elements.variant.addEventListener(
    "change",
    () => changeVariant(elements.variant.value)
);

// ==========================================
// 19. INICIALIZAÇÃO
// ==========================================

changeVariant(elements.variant.value);
