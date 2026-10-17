
/*
 * CANTO 2 — Jogada corrigida
 *
 * 1. Jogador 1 passa para 2 e corre para a zona do 4.
 * 2. Jogador 2 passa para 3.
 * 3. Jogador 3 passa para 1; jogador 4 finge receber.
 * 4. Jogador 4 avança para o espaço entre os defesas.
 * 5. Jogador 1 passa para o jogador 4.
 * 6. Jogador 4 remata à baliza.
 *
 * SVG: viewBox="0 0 1000 700"
 */

// ============================================
// 1. POSIÇÕES
// ============================================

const P = {
    // Jogador 1
    p1Start: { x: 980, y: 677 },
    p1Receive: { x: 910, y: 90 },

    // Jogador 2
    p2: { x: 635, y: 660 },

    // Jogador 3
    p3: { x: 635, y: 70 },

    // Jogador 4
    p4Start: { x: 920, y: 70 },
    p4Fake: { x: 775, y: 105 },
    p4Receive: { x: 840, y: 240 },

    // Bola
    ballStart: { x: 958, y: 659 },
    ballAt2: { x: 635, y: 660 },
    ballAt3: { x: 635, y: 70 },
    ballAt1: { x: 910, y: 90 },
    ballAt4: { x: 840, y: 240 },

    // Remate
    goal: { x: 979, y: 350 }
};

// ============================================
// 2. ETAPAS E VELOCIDADES
// ============================================

// duration está em milissegundos.
// Podes manter aqui os valores que já ajustaste.

const stages = [
    {
        title: "Passe do jogador 1 para o 2",
        duration: 2500
    },
    {
        title: "Passe do jogador 2 para o 3",
        duration: 2000
    },
    {
        title: "Passe do jogador 3 para o 1",
        duration: 2000
    },
    {
        title: "Movimento do jogador 4",
        duration: 2000
    },
    {
        title: "Passe do jogador 1 para o 4",
        duration: 2000
    },
    {
        title: "Remate do jogador 4",
        duration: 1200
    }
];

// ============================================
// 3. ELEMENTOS HTML E SVG
// ============================================

const elements = {
    p1: document.querySelector("#player1"),
    p2: document.querySelector("#player2"),
    p3: document.querySelector("#player3"),
    p4: document.querySelector("#player4"),

    ball: document.querySelector("#ball"),
    guides: document.querySelector("#guides"),

    play: document.querySelector("#play"),
    speed: document.querySelector("#speed"),
    status: document.querySelector("#status"),

    restart: document.querySelector("#restart"),
    previous: document.querySelector("#previous"),
    next: document.querySelector("#next"),

    steps: [
        ...document.querySelectorAll("#steps li")
    ]
};

// Setas mostradas em cada etapa
const guideIds = [
    ["pass1", "move1"],
    ["pass2"],
    ["pass3"],
    ["move4"],
    ["pass5"],
    ["pass6"]
];

const guidePaths = [
    ...document.querySelectorAll(
        "#guides .movement, #guides .ball-path"
    )
];

const guideNumbers = [
    ...document.querySelectorAll(
        "#guides .guide-number"
    )
];

// ============================================
// 4. ATUALIZAÇÃO DAS SETAS
// ============================================

function linePath(start, end) {
    return (
        `M${start.x} ${start.y} ` +
        `L${end.x} ${end.y}`
    );
}

function setGuide(id, start, end) {
    const path = document.querySelector(`#${id}`);

    if (path) {
        path.setAttribute(
            "d",
            linePath(start, end)
        );
    }
}

// Passe do canto e corrida do jogador 1
setGuide("pass1", P.ballStart, P.ballAt2);
setGuide("move1", P.p1Start, P.p1Receive);

// Passe do 2 para o 3
setGuide("pass2", P.ballAt2, P.ballAt3);

// Passe do 3 para o 1, com finta do 4
setGuide("pass3", P.ballAt3, P.ballAt1);

// Movimento do jogador 4 para os defesas
setGuide("move4", P.p4Fake, P.p4Receive);

// Passe do 1 para o 4
setGuide("pass5", P.ballAt1, P.ballAt4);

// Remate do jogador 4
setGuide("pass6", P.ballAt4, P.goal);

// Cria a seta tracejada da primeira
// movimentação do jogador 4.
const move4Initial = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
);

move4Initial.setAttribute("id", "move4Initial");
move4Initial.setAttribute("class", "movement");

move4Initial.setAttribute(
    "d",
    linePath(P.p4Start, P.p4Fake)
);

move4Initial.setAttribute(
    "marker-end",
    "url(#white-arrow)"
);

elements.guides.appendChild(move4Initial);

// ============================================
// 5. ESTADO DA ANIMAÇÃO
// ============================================

let currentStep = 0;
let progress = 0;
let playing = false;

let frameId = null;
let lastFrame = null;
let runToken = 0;

// ============================================
// 6. FUNÇÕES AUXILIARES
// ============================================

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function between(a, b, t) {
    return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    };
}

function place(element, position) {
    element.setAttribute(
        "transform",
        `translate(${position.x} ${position.y})`
    );
}

// ============================================
// 7. MOVIMENTO DO JOGADOR 1
// ============================================

function getPlayer1Position(t) {

    // Etapa 1:
    // Corre na direção do jogador 4.
    if (currentStep === 0) {
        return between(
            P.p1Start,
            P.p1Receive,
            t
        );
    }

    // Nas etapas seguintes mantém
    // a posição onde recebe do jogador 3.
    return P.p1Receive;
}

// ============================================
// 8. MOVIMENTO DO JOGADOR 4
// ============================================

function getPlayer4Position(t) {

    // Etapa 1:
    // Sai da posição inicial e aproxima-se
    // do espaço entre os jogadores 3 e 1.
    if (currentStep === 0) {
        return between(
            P.p4Start,
            P.p4Fake,
            t
        );
    }

    // Etapa 2:
    // Aguarda o passe para o jogador 3.
    if (currentStep === 1) {
        return P.p4Fake;
    }

    // Etapa 3:
    // Simula a receção, mas não toca na bola.
    if (currentStep === 2) {
        const fakeMovement = Math.sin(t * Math.PI);

        return {
            x: P.p4Fake.x,
            y: P.p4Fake.y - fakeMovement * 15
        };
    }

    // Etapa 4:
    // Avança em direção aos dois adversários.
    if (currentStep === 3) {
        return between(
            P.p4Fake,
            P.p4Receive,
            t
        );
    }

    // Etapas 5 e 6:
    // Fica na posição de receção e remate.
    return P.p4Receive;
}

// ============================================
// 9. MOVIMENTO DA BOLA
// ============================================

function getBallPosition(t) {

    // Etapa 1: jogador 1 -> jogador 2
    if (currentStep === 0) {
        return between(
            P.ballStart,
            P.ballAt2,
            t
        );
    }

    // Etapa 2: jogador 2 -> jogador 3
    if (currentStep === 1) {
        return between(
            P.ballAt2,
            P.ballAt3,
            t
        );
    }

    // Etapa 3: jogador 3 -> jogador 1
    if (currentStep === 2) {
        return between(
            P.ballAt3,
            P.ballAt1,
            t
        );
    }

    // Etapa 4:
    // Jogador 1 segura a bola enquanto
    // o jogador 4 avança.
    if (currentStep === 3) {
        return P.ballAt1;
    }

    // Etapa 5: jogador 1 -> jogador 4
    if (currentStep === 4) {
        return between(
            P.ballAt1,
            P.ballAt4,
            t
        );
    }

    // Etapa 6: jogador 4 remata
    return between(
        P.ballAt4,
        P.goal,
        t
    );
}

// ============================================
// 10. SETAS DA ETAPA ATUAL
// ============================================

function renderGuides() {

    guidePaths.forEach((path) => {
        path.style.opacity = "0";
    });

    move4Initial.style.opacity = "0";

    guideNumbers.forEach((number) => {
        number.style.opacity = "0";
    });

    guideIds[currentStep].forEach((id) => {
        const path = document.querySelector(`#${id}`);

        if (path) {
            path.style.opacity = "1";
        }
    });

    // Mostra a corrida inicial do jogador 4
    // simultaneamente com a do jogador 1.
    if (currentStep === 0) {
        move4Initial.style.opacity = "1";
    }

    if (guideNumbers[currentStep]) {
        guideNumbers[currentStep].style.opacity = "1";
    }
}

// ============================================
// 11. DESENHAR O ESTADO ATUAL
// ============================================

function render() {
    const t = Math.max(
        0,
        Math.min(1, progress)
    );

    // Jogadores 2 e 3 ficam nas posições.
    place(elements.p2, P.p2);
    place(elements.p3, P.p3);

    // Jogadores 1 e 4 movimentam-se.
    place(
        elements.p1,
        getPlayer1Position(t)
    );

    place(
        elements.p4,
        getPlayer4Position(t)
    );

    // Movimento da bola.
    place(
        elements.ball,
        getBallPosition(t)
    );

    // Setas.
    renderGuides();

    elements.guides.setAttribute(
        "class",
        `show-${currentStep}`
    );

    // Destaca a etapa na lateral direita.
    elements.steps.forEach((li, index) => {
        li.classList.toggle(
            "active",
            index === currentStep
        );
    });

    elements.status.textContent =
        `${currentStep + 1}/6 · ${stages[currentStep].title}`;

    elements.play.textContent = playing
        ? "⏸ Pausar"
        : "▶ Reproduzir";
}

// ============================================
// 12. CONTROLOS
// ============================================

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
    stop();

    currentStep = Math.max(
        0,
        Math.min(stages.length - 1, index)
    );

    progress = 0;

    render();
}

// ============================================
// 13. MOTOR DE ANIMAÇÃO
// ============================================

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

        if (currentStep === stages.length - 1) {
            stop();
            render();
            return;
        }

        currentStep++;
        progress = 0;
    }

    render();

    frameId = requestAnimationFrame((nextTime) => {
        tick(nextTime, token);
    });
}

// ============================================
// 14. REPRODUZIR E PAUSAR
// ============================================

function togglePlay() {
    if (playing) {
        stop();
        render();
        return;
    }

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

// ============================================
// 15. EVENTOS
// ============================================

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

elements.steps.forEach((li, index) => {
    li.querySelector("button").addEventListener(
        "click",
        () => goTo(index)
    );
});

// Inicia na primeira etapa.
render();
