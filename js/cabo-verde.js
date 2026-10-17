
/*
 * ==========================================
 * CABO VERDE — VARIANTES 1, 2 E 3
 * ==========================================
 *
 * VARIANTE 1
 * O jogador 2 desmarca-se.
 * O jogador 1 passa para o jogador 2.
 *
 * VARIANTE 2
 * O marcador acompanha o jogador 2.
 * O jogador 1 passa para o jogador 3.
 *
 * VARIANTE 3
 * Os marcadores acompanham os jogadores 2 e 3.
 * O jogador 1 passa para o jogador 4.
 *
 * Campo SVG: viewBox="0 0 1000 700"
 */

// ==========================================
// 1. COORDENADAS DOS JOGADORES
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

    // Marcador do jogador 2
    defender2Start: { x: 688, y: 318 },

    // Marcador do jogador 3
    defender3Start: { x: 692, y: 445 },

    // Marcador do jogador 4
    defender4Start: { x: 485, y: 105 },
    defender4Finish: { x: 485, y: 600 },

    // Bola
    ballStart: { x: 750, y: 42 },
    ballAt2: { x: 545, y: 68 },
    ballAt3: { x: 750, y: 315 },
    ballAt4: { x: 550, y: 630 }
};

// ==========================================
// 2. DURAÇÃO DOS MOVIMENTOS
// ==========================================

// Duração em milissegundos.
// Quanto maior o valor, mais lenta a etapa.

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

    // Jogadores
    p1: document.querySelector("#player1"),
    p2: document.querySelector("#player2"),
    p3: document.querySelector("#player3"),
    p4: document.querySelector("#player4"),

    // Adversários
    defender2: document.querySelector("#defender2"),
    defender3: document.querySelector("#defender3"),
    defender4: document.querySelector("#defender4"),

    // Campo
    ball: document.querySelector("#ball"),
    guides: document.querySelector("#guides"),

    // Controlos
    play: document.querySelector("#play"),
    restart: document.querySelector("#restart"),
    previous: document.querySelector("#previous"),
    next: document.querySelector("#next"),

    // Velocidade e estado
    speed: document.querySelector("#speed"),
    status: document.querySelector("#status"),

    // Seletor de variantes
    variant: document.querySelector("#variant"),
    variantNotice: document.querySelector("#variantNotice"),

    // Instruções
    stepsList: document.querySelector("#steps"),
    attention: document.querySelector("#attention"),

    steps: [
        ...document.querySelectorAll("#steps li")
    ]
};

// ==========================================
// 4. SETAS DOS MOVIMENTOS
// ==========================================

const guides = {

    // Jogador 4 e seu marcador
    move4: document.querySelector("#move4"),
    defender4: document.querySelector("#moveDefender"),

    // Jogadores 2 e 3
    move2Slow: document.querySelector("#move2Slow"),
    move3: document.querySelector("#move3"),
    move2Sprint: document.querySelector("#move2Sprint"),

    // Marcadores dos jogadores 2 e 3
    defender2: document.querySelector("#moveDefender2"),
    defender3: document.querySelector("#moveDefender3"),

    // Passe final
    pass: document.querySelector("#passGuide")
};

// Números que aparecem sobre as setas
const guideNumbers = [
    ...document.querySelectorAll(
        "#guides .guide-number"
    )
];

// ==========================================
// 5. ESTADO DA ANIMAÇÃO
// ==========================================

let currentVariant = "1";
let currentStep = 0;

let progress = 0;
let playing = false;

let frameId = null;
let lastFrame = null;
let runToken = 0;

// ==========================================
// 6. FUNÇÕES AUXILIARES
// ==========================================

// Limita o valor entre 0 e 1.
function clamp(value) {
    return Math.max(0, Math.min(1, value));
}

// Interpolação de valores.
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Calcula uma posição entre dois pontos.
function between(start, end, t) {

    const value = clamp(t);

    return {
        x: lerp(start.x, end.x, value),
        y: lerp(start.y, end.y, value)
    };
}

// Move um jogador ou a bola no SVG.
function place(element, position) {

    if (!element) {
        return;
    }

    element.setAttribute(
        "transform",
        `translate(${position.x} ${position.y})`
    );
}

// Move um círculo de adversário.
function placeCircle(element, position) {

    if (!element) {
        return;
    }

    element.setAttribute("cx", position.x);
    element.setAttribute("cy", position.y);
}

// Atualiza a direção de uma seta.
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

// Mostra uma seta sem alterar as outras.
function showGuide(name) {

    if (guides[name]) {
        guides[name].style.opacity = "1";
    }
}

// ==========================================
// 7. DESTINO DO PASSE POR VARIANTE
// ==========================================

function getPassDestination() {

    switch (currentVariant) {

        case "1":
            return P.ballAt2;

        case "2":
            return P.ballAt3;

        case "3":
            return P.ballAt4;

        default:
            return P.ballStart;
    }
}

// ==========================================
// 8. MOVIMENTAÇÃO DO JOGADOR 4
// ==========================================

function getPlayer4Position(t) {

    // Etapa 1:
    // Atravessa o campo com o marcador.
    if (currentStep === 0) {

        return between(
            P.p4Start,
            P.p4Finish,
            t
        );
    }

    // Aguarda na posição final.
    return P.p4Finish;
}

// ==========================================
// 9. MARCADOR DO JOGADOR 4
// ==========================================

function getDefender4Position(t) {

    // Acompanha o jogador 4 na etapa 1.
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
// 10. MOVIMENTAÇÃO DO JOGADOR 2
// ==========================================

function getPlayer2Position(t) {

    // Etapa 1:
    // Permanece na posição inicial.
    if (currentStep === 0) {
        return P.p2Start;
    }

    // Etapa 2:
    // Aproxima-se lentamente do jogador 1.
    if (currentStep === 1) {

        return between(
            P.p2Start,
            P.p2Near,
            t
        );
    }

    // Etapa 3:
    // Arranca rapidamente pela lateral.
    // Completa 65% do percurso.
    if (currentStep === 2) {

        return between(
            P.p2Near,
            P.p2Finish,
            t * 0.65
        );
    }

    // Etapa 4:
    // Continua a corrida enquanto o jogador 1
    // executa o passe.
    return between(
        P.p2Near,
        P.p2Finish,
        0.65 + t * 0.35
    );
}

// ==========================================
// 11. MOVIMENTAÇÃO DO JOGADOR 3
// ==========================================

function getPlayer3Position(t) {

    // Etapa 1:
    // Aguarda na posição inicial.
    if (currentStep === 0) {
        return P.p3Start;
    }

    // Etapa 2:
    // Ocupa a posição inicial do jogador 2.
    if (currentStep === 1) {

        return between(
            P.p3Start,
            P.p3Finish,
            t
        );
    }

    // Etapas 3 e 4:
    // Permanece na nova posição.
    return P.p3Finish;
}

// ==========================================
// 12. MARCADOR DO JOGADOR 2
// ==========================================

function getDefender2Position(t) {

    // Variante 1:
    // O defensor não acompanha a desmarcação.
    if (currentVariant === "1") {
        return P.defender2Start;
    }

    // Variantes 2 e 3:
    // O defensor acompanha o jogador 2.

    if (currentStep === 0) {
        return P.defender2Start;
    }

    const playerPosition = getPlayer2Position(t);

    // Mantém-se à esquerda do jogador 2.
    return {
        x: playerPosition.x - 62,
        y: playerPosition.y + 3
    };
}

// ==========================================
// 13. MARCADOR DO JOGADOR 3
// ==========================================

function getDefender3Position(t) {

    // Variantes 1 e 2:
    // O marcador fica na posição inicial.
    if (currentVariant !== "3") {
        return P.defender3Start;
    }

    // Variante 3:
    // O adversário acompanha o jogador 3.

    if (currentStep === 0) {
        return P.defender3Start;
    }

    if (currentStep === 1) {

        return between(
            P.defender3Start,
            {
                x: P.p3Finish.x - 68,
                y: P.p3Finish.y
            },
            t
        );
    }

    return {
        x: P.p3Finish.x - 68,
        y: P.p3Finish.y
    };
}

// ==========================================
// 14. MOVIMENTAÇÃO DA BOLA
// ==========================================

function getBallPosition(t) {

    // Durante as primeiras três etapas,
    // a bola permanece com o jogador 1.
    if (currentStep < 3) {
        return P.ballStart;
    }

    // Etapa 4:
    // O destino depende da variante.
    return between(
        P.ballStart,
        getPassDestination(),
        t
    );
}

// ==========================================
// 15. SETAS DE MOVIMENTO
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

    // ETAPA 1:
    // Jogador 4 atravessa a quadra.
    // O seu marcador acompanha-o.
    if (currentStep === 0) {

        showGuide("move4");
        showGuide("defender4");
    }

    // ETAPA 2:
    // Jogador 2 aproxima-se do jogador 1.
    // Jogador 3 ocupa o espaço deixado.
    if (currentStep === 1) {

        showGuide("move2Slow");
        showGuide("move3");

        // Variantes 2 e 3:
        // Marcador acompanha o jogador 2.
        if (currentVariant !== "1") {

            const defender2Near = {
                x: P.p2Near.x - 62,
                y: P.p2Near.y + 3
            };

            setGuide(
                "moveDefender2",
                P.defender2Start,
                defender2Near
            );

            showGuide("defender2");
        }

        // Variante 3:
        // Marcador acompanha o jogador 3.
        if (currentVariant === "3") {

            const defender3Finish = {
                x: P.p3Finish.x - 68,
                y: P.p3Finish.y
            };

            setGuide(
                "moveDefender3",
                P.defender3Start,
                defender3Finish
            );

            showGuide("defender3");
        }
    }

    // ETAPA 3:
    // Jogador 2 inicia a corrida rápida.
    if (currentStep === 2) {

        showGuide("move2Sprint");

        // Variantes 2 e 3:
        // O adversário acompanha a corrida.
        if (currentVariant !== "1") {

            const defender2Near = {
                x: P.p2Near.x - 62,
                y: P.p2Near.y + 3
            };

            const defender2Finish = {
                x: P.p2Finish.x - 62,
                y: P.p2Finish.y + 3
            };

            setGuide(
                "moveDefender2",
                defender2Near,
                defender2Finish
            );

            showGuide("defender2");
        }
    }

    // ETAPA 4:
    // Passe do jogador 1.
    // Jogador 2 termina a corrida.
    if (currentStep === 3) {

        const destination = getPassDestination();

        setGuide(
            "passGuide",
            P.ballStart,
            destination
        );

        showGuide("pass");
        showGuide("move2Sprint");

        if (currentVariant !== "1") {

            const defender2Near = {
                x: P.p2Near.x - 62,
                y: P.p2Near.y + 3
            };

            const defender2Finish = {
                x: P.p2Finish.x - 62,
                y: P.p2Finish.y + 3
            };

            setGuide(
                "moveDefender2",
                defender2Near,
                defender2Finish
            );

            showGuide("defender2");
        }
    }

    // Apresenta o número da etapa atual.
    if (guideNumbers[currentStep]) {
        guideNumbers[currentStep].style.opacity = "1";
    }
}

// ==========================================
// 16. DESENHAR ESTADO ATUAL
// ==========================================

function render() {

    const t = clamp(progress);

    // Jogador 1 permanece na cobrança.
    place(elements.p1, P.p1);

    // Atualiza os outros jogadores.
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
    placeCircle(
        elements.defender2,
        getDefender2Position(t)
    );

    // Marcador do jogador 3.
    placeCircle(
        elements.defender3,
        getDefender3Position(t)
    );

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

    // Destaque no painel lateral.
    elements.steps.forEach((li, index) => {

        li.classList.toggle(
            "active",
            index === currentStep
        );
    });

    // Título da etapa.
    elements.status.textContent =
        `${currentStep + 1}/4 · ${stages[currentStep].title}`;

    // Botão de reprodução.
    elements.play.textContent = playing
        ? "⏸ Pausar"
        : "▶ Reproduzir";
}

// ==========================================
// 17. PARAR A ANIMAÇÃO
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

// ==========================================
// 18. REINICIAR A JOGADA
// ==========================================

function reset() {

    stop();

    currentStep = 0;
    progress = 0;

    render();
}

// ==========================================
// 19. NAVEGAR ENTRE ETAPAS
// ==========================================

function goTo(index) {

    stop();

    currentStep = Math.max(
        0,
        Math.min(stages.length - 1, index)
    );

    progress = 0;

    render();
}

// ==========================================
// 20. MOTOR DE ANIMAÇÃO
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

    // Etapa concluída.
    if (progress >= 1) {

        progress = 1;

        render();

        // Última etapa:
        // termina a reprodução.
        if (currentStep === stages.length - 1) {

            stop();
            render();

            return;
        }

        // Próxima etapa.
        currentStep++;
        progress = 0;
    }

    render();

    frameId = requestAnimationFrame(
        (nextTime) => tick(nextTime, token)
    );
}

// ==========================================
// 21. REPRODUZIR / PAUSAR
// ==========================================

function togglePlay() {

    if (playing) {

        stop();
        render();

        return;
    }

    // Se terminou, reinicia desde o início.
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

    frameId = requestAnimationFrame(
        (time) => tick(time, token)
    );
}

// ==========================================
// 22. TEXTOS DAS VARIANTES
// ==========================================

const variantDescriptions = {

    "1": {
        title: "Passe do jogador 1 para o 2",

        stepTitle: "04 · Passe do jogador 1 para o 2",

        description:
            "O jogador 1 passa a bola em profundidade " +
            "para o jogador 2, que se desmarcou pela " +
            "linha lateral em direção ao campo adversário.",

        attention:
            "O jogador 4 afasta o seu marcador. " +
            "O jogador 2 aproxima-se devagar e depois " +
            "acelera pela lateral. O jogador 3 ocupa " +
            "o espaço deixado pelo jogador 2. " +
            "O passe final é feito para o jogador 2."
    },

    "2": {
        title: "Passe do jogador 1 para o 3",

        stepTitle: "04 · Passe do jogador 1 para o 3",

        description:
            "O adversário acompanha a movimentação " +
            "do jogador 2. Quando o jogador 2 acelera " +
            "pela lateral, o jogador 1 passa para o " +
            "jogador 3, que ocupa a posição deixada " +
            "pelo jogador 2.",

        attention:
            "O jogador 4 afasta o seu marcador. " +
            "O adversário acompanha o jogador 2 " +
            "durante a aproximação e a corrida rápida. " +
            "O jogador 3 fica disponível e recebe " +
            "o passe do jogador 1."
    },

    "3": {
        title: "Passe do jogador 1 para o 4",

        stepTitle: "04 · Passe do jogador 1 para o 4",

        description:
            "Os adversários acompanham os jogadores " +
            "2 e 3. O jogador 1 identifica que ambos " +
            "continuam marcados e faz o passe para " +
            "o jogador 4, que se deslocou para o " +
            "outro lado do campo.",

        attention:
            "O jogador 4 atravessa o campo levando " +
            "o seu marcador. O jogador 2 aproxima-se " +
            "e acelera, mas continua acompanhado. " +
            "O jogador 3 ocupa o espaço deixado " +
            "pelo 2, porém o seu marcador também " +
            "o acompanha. O jogador 1 procura " +
            "o jogador 4 com um passe longo."
    }
};

// ==========================================
// 23. TROCAR DE VARIANTE
// ==========================================

function changeVariant(value) {

    stop();

    currentVariant = value;
    currentStep = 0;
    progress = 0;

    const variantData = variantDescriptions[value];

    // Todas as três variantes estão disponíveis.
    const available = Boolean(variantData);

    // Mostra as informações.
    elements.stepsList.hidden = !available;
    elements.attention.hidden = !available;

    elements.variantNotice.hidden = available;

    // Ativa ou desativa os botões.
    elements.play.disabled = !available;
    elements.restart.disabled = !available;
    elements.previous.disabled = !available;
    elements.next.disabled = !available;

    if (!available) {

        render();

        elements.status.textContent =
            "Variante ainda não definida";

        return;
    }

    // Atualiza o título da última etapa.
    stages[3].title = variantData.title;

    const finalStep = elements.steps[3];

    const finalTitle =
        finalStep.querySelector("strong");

    const finalDescription =
        finalStep.querySelector("span");

    const attentionText =
        elements.attention.querySelector("p");

    finalTitle.textContent =
        variantData.stepTitle;

    finalDescription.textContent =
        variantData.description;

    attentionText.textContent =
        variantData.attention;

    // Reinicia as posições ao trocar de variante.
    render();
}

// ==========================================
// 24. EVENTOS DOS BOTÕES
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

// Seleção direta das etapas.
elements.steps.forEach((li, index) => {

    const button = li.querySelector("button");

    button.addEventListener(
        "click",
        () => goTo(index)
    );
});

// Trocar de variante.
elements.variant.addEventListener(
    "change",
    () => changeVariant(elements.variant.value)
);

// ==========================================
// 25. INICIALIZAÇÃO
// ==========================================

changeVariant(elements.variant.value);
