
/*
 * CABO VERDE — VARIANTE 1
 *
 * 1. Jogador 4 atravessa o campo e leva o marcador.
 * 2. Jogador 2 aproxima-se devagar do jogador 1.
 *    Jogador 3 ocupa a posição deixada pelo 2.
 * 3. Jogador 2 acelera paralelo à lateral.
 * 4. Jogador 1 passa para os pés do jogador 2.
 *
 * Campo SVG: viewBox="0 0 1000 700".
 */

// =============================================
// 1. COORDENADAS DA JOGADA
// =============================================

const P = {
    // Jogador 1: cobrança lateral
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
    defenderStart: { x: 485, y: 105 },
    defenderFinish: { x: 485, y: 600 },

    // Bola
    ballStart: { x: 750, y: 42 },
    ballFinish: { x: 545, y: 68 }
};

// =============================================
// 2. ETAPAS E DURAÇÕES
// =============================================

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
        title: "Passe do jogador 1 para o 2",
        duration: 1200
    }
];

// =============================================
// 3. ELEMENTOS DA PÁGINA
// =============================================

const elements = {
    p1: document.querySelector("#player1"),
    p2: document.querySelector("#player2"),
    p3: document.querySelector("#player3"),
    p4: document.querySelector("#player4"),

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

// =============================================
// 4. SETAS
// =============================================

const guides = {
    move4: document.querySelector("#move4"),
    defender: document.querySelector("#moveDefender"),
    move2Slow: document.querySelector("#move2Slow"),
    move3: document.querySelector("#move3"),
    move2Sprint: document.querySelector("#move2Sprint"),
    pass: document.querySelector("#passGuide")
};

const guideNumbers = [
    ...document.querySelectorAll(
        "#guides .guide-number"
    )
];

// =============================================
// 5. ESTADO DA ANIMAÇÃO
// =============================================

let currentStep = 0;
let progress = 0;
let playing = false;

let frameId = null;
let lastFrame = null;
let runToken = 0;

// Variante atualmente selecionada
let currentVariant = "1";

// =============================================
// 6. FUNÇÕES AUXILIARES
// =============================================

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

// =============================================
// 7. MOVIMENTAÇÃO DO JOGADOR 4
// =============================================

function getPlayer4Position(t) {

    // Etapa 1: atravessa o campo em linha reta.
    if (currentStep === 0) {
        return between(
            P.p4Start,
            P.p4Finish,
            t
        );
    }

    // Nas etapas seguintes permanece
    // na posição de destino.
    return P.p4Finish;
}

// =============================================
// 8. MOVIMENTAÇÃO DO ADVERSÁRIO
// =============================================

function getDefenderPosition(t) {

    // Acompanha o jogador 4 na primeira etapa.
    if (currentStep === 0) {
        return between(
            P.defenderStart,
            P.defenderFinish,
            t
        );
    }

    return P.defenderFinish;
}

// =============================================
// 9. MOVIMENTAÇÃO DO JOGADOR 2
// =============================================

function getPlayer2Position(t) {

    // Etapa 1: mantém a posição.
    if (currentStep === 0) {
        return P.p2Start;
    }

    // Etapa 2: aproxima-se lentamente
    // do jogador 1 junto à linha lateral.
    if (currentStep === 1) {
        return between(
            P.p2Start,
            P.p2Near,
            t
        );
    }

    // Etapa 3: arranca rapidamente,
    // paralelo à lateral.
    if (currentStep === 2) {
        return between(
            P.p2Near,
            P.p2Finish,
            t
        );
    }

    // Etapa 4: recebe o passe mais à frente.
    return P.p2Finish;
}

// =============================================
// 10. MOVIMENTAÇÃO DO JOGADOR 3
// =============================================

function getPlayer3Position(t) {

    // Aguarda durante a etapa 1.
    if (currentStep === 0) {
        return P.p3Start;
    }

    // Etapa 2: ocupa o espaço deixado
    // pelo jogador 2.
    if (currentStep === 1) {
        return between(
            P.p3Start,
            P.p3Finish,
            t
        );
    }

    // Mantém a posição nas etapas seguintes.
    return P.p3Finish;
}

// =============================================
// 11. MOVIMENTAÇÃO DA BOLA
// =============================================

function getBallPosition(t) {

    // A bola permanece com o jogador 1
    // durante as primeiras três etapas.
    if (currentStep < 3) {
        return P.ballStart;
    }

    // Etapa 4: passe para o jogador 2
    // em direção ao meio-campo adversário.
    return between(
        P.ballStart,
        P.ballFinish,
        t
    );
}

// =============================================
// 12. SETAS E NUMERAÇÃO
// =============================================

function renderGuides() {

    // Esconde todas as setas.
    Object.values(guides).forEach((path) => {
        path.style.opacity = "0";
    });

    // Esconde todos os números.
    guideNumbers.forEach((number) => {
        number.style.opacity = "0";
    });

    // Etapa 1: jogador 4 e adversário.
    if (currentStep === 0) {
        guides.move4.style.opacity = "1";
        guides.defender.style.opacity = "1";
    }

    // Etapa 2: jogadores 2 e 3.
    if (currentStep === 1) {
        guides.move2Slow.style.opacity = "1";
        guides.move3.style.opacity = "1";
    }

    // Etapa 3: arranque do jogador 2.
    if (currentStep === 2) {
        guides.move2Sprint.style.opacity = "1";
    }

    // Etapa 4: passe lateral.
    if (currentStep === 3) {
        guides.pass.style.opacity = "1";
    }

    // Mostra a numeração da etapa.
    if (guideNumbers[currentStep]) {
        guideNumbers[currentStep].style.opacity = "1";
    }
}

// =============================================
// 13. DESENHAR ESTADO ATUAL
// =============================================

function render() {
    const t = clamp(progress);

    // Jogador 1 permanece no lateral.
    place(elements.p1, P.p1);

    // Movimentação dos outros jogadores.
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

    // Movimentação do marcador do jogador 4.
    const defenderPosition = getDefenderPosition(t);

    elements.defender4.setAttribute(
        "cx",
        defenderPosition.x
    );

    elements.defender4.setAttribute(
        "cy",
        defenderPosition.y
    );

    // Bola.
    place(
        elements.ball,
        getBallPosition(t)
    );

    // Setas e etapas.
    elements.guides.setAttribute(
        "class",
        `show-${currentStep}`
    );

    renderGuides();

    elements.steps.forEach((li, index) => {
        li.classList.toggle(
            "active",
            index === currentStep
        );
    });

    elements.status.textContent =
        `${currentStep + 1}/4 · ${stages[currentStep].title}`;

    elements.play.textContent = playing
        ? "⏸ Pausar"
        : "▶ Reproduzir";
}

// =============================================
// 14. PARAR E REINICIAR
// =============================================

function stop() {
    playing = false;
    runToken++;

    cancelAnimationFrame(frameId);

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
    if (currentVariant !== "1") {
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

// =============================================
// 15. MOTOR DE ANIMAÇÃO
// =============================================

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
        (delta * speed) / stages[currentStep].duration;

    if (progress >= 1) {
        progress = 1;
        render();

        // Termina na última etapa.
        if (currentStep === stages.length - 1) {
            stop();
            render();
            return;
        }

        currentStep++;
        progress = 0;
    }

    render();

    frameId = requestAnimationFrame((time) => {
        tick(time, token);
    });
}

// =============================================
// 16. REPRODUZIR E PAUSAR
// =============================================

function togglePlay() {

    if (currentVariant !== "1") {
        return;
    }

    if (playing) {
        stop();
        render();
        return;
    }

    // Reinicia se a jogada já terminou.
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

// =============================================
// 17. SELETOR DE VARIANTES
// =============================================

function changeVariant(value) {
    stop();

    currentVariant = value;

    currentStep = 0;
    progress = 0;

    const available = value === "1";

    // Mostra a sequência apenas para a variante 1.
    elements.stepsList.hidden = !available;
    elements.attention.hidden = !available;

    // Mostra aviso para as variantes futuras.
    elements.variantNotice.hidden = available;

    // Desativa os controlos enquanto a variante
    // ainda não tiver uma animação implementada.
    elements.play.disabled = !available;
    elements.restart.disabled = !available;
    elements.previous.disabled = !available;
    elements.next.disabled = !available;

    if (available) {
        render();
    } else {
        // Mostra o campo sem setas e sem animação.
        Object.values(guides).forEach((path) => {
            path.style.opacity = "0";
        });

        guideNumbers.forEach((number) => {
            number.style.opacity = "0";
        });

        elements.play.textContent = "▶ Reproduzir";

        elements.status.textContent =
            `Variante ${value} · Por definir`;
    }
}

// =============================================
// 18. EVENTOS DOS BOTÕES
// =============================================

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
    li.querySelector("button").addEventListener(
        "click",
        () => goTo(index)
    );
});

// Mudança de variante.
elements.variant.addEventListener(
    "change",
    () => changeVariant(elements.variant.value)
);

// =============================================
// 19. INICIALIZAÇÃO
// =============================================

changeVariant("1");
