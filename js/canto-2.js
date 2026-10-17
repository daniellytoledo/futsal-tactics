
/*
 * CANTO 2 — Playbook
 *
 * Mesmo motor de animação do Canto 1.
 * Campo SVG: 1000 × 700.
 *
 * 1. Passe 1 -> 2 + corrida do 1
 * 2. Passe 2 -> 3
 * 3. Passe 3 -> 4 + finta do 1
 * 4. Corrida do 1 para o espaço livre
 * 5. Passe 4 -> 1
 * 6. Remate do jogador 1
 */

// POSIÇÕES DA JOGADA
const P = {
    // Jogador 1
    p1Start: { x: 980, y: 677 },
    p1Fake: { x: 820, y: 85 },
    p1Gap: { x: 840, y: 240 },

    // Jogadores 2, 3 e 4
    p2: { x: 635, y: 660 },
    p3: { x: 635, y: 70 },
    p4: { x: 920, y: 70 },

    // Bola
    ballStart: { x: 958, y: 659 },
    ballAt2: { x: 635, y: 660 },
    ballAt3: { x: 635, y: 70 },
    ballAt4: { x: 920, y: 70 },
    ballAt1: { x: 840, y: 240 },

    // Baliza
    goal: { x: 979, y: 350 }
};

// ETAPAS — mesmas unidades e velocidades do Canto 1
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
        title: "Passe do jogador 3 para o 4",
        duration: 2000
    },
    {
        title: "Movimento do jogador 1",
        duration: 2000
    },
    {
        title: "Passe do jogador 4 para o 1",
        duration: 2000
    },
    {
        title: "Remate do jogador 1",
        duration: 1200
    }
];

// ELEMENTOS HTML E SVG
const elements = {
    p1: document.querySelector("#player1"),
    p2: document.querySelector("#player2"),
    p3: document.querySelector("#player3"),
    p4: document.querySelector("#player4"),

    ball: document.querySelector("#ball"),
    guides: document.querySelector("#guides"),

    play: document.querySelector("#play"),
    status: document.querySelector("#status"),
    speed: document.querySelector("#speed"),

    restart: document.querySelector("#restart"),
    previous: document.querySelector("#previous"),
    next: document.querySelector("#next"),

    steps: [
        ...document.querySelectorAll("#steps li")
    ]
};

// LIGA CADA ETAPA À SUA SETA
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

// ALINHA AS SETAS COM AS COORDENADAS DA ANIMAÇÃO
function linePath(start, end) {
    return (
        `M${start.x} ${start.y} ` +
        `L${end.x} ${end.y}`
    );
}

function setGuide(id, start, end) {
    document
        .querySelector(`#${id}`)
        .setAttribute("d", linePath(start, end));
}

setGuide("pass1", P.ballStart, P.ballAt2);
setGuide("move1", P.p1Start, P.p1Fake);
setGuide("pass2", P.ballAt2, P.ballAt3);
setGuide("pass3", P.ballAt3, P.ballAt4);
setGuide("move4", P.p1Fake, P.p1Gap);
setGuide("pass5", P.ballAt4, P.ballAt1);
setGuide("pass6", P.ballAt1, P.goal);

// ESTADO DA REPRODUÇÃO
let currentStep = 0;
let progress = 0;
let playing = false;

let frameId = null;
let lastFrame = null;
let runToken = 0;

// INTERPOLAÇÃO DE COORDENADAS
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function between(a, b, t) {
    return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    };
}

// POSICIONAMENTO DE ELEMENTOS SVG
function place(element, position) {
    element.setAttribute(
        "transform",
        `translate(${position.x} ${position.y})`
    );
}

// MOVIMENTAÇÃO DO JOGADOR 1
function getPlayer1Position(t) {

    // Etapa 1: corre para o meio dos jogadores 3 e 4.
    if (currentStep === 0) {
        return between(P.p1Start, P.p1Fake, t);
    }

    // Etapa 2: mantém a posição.
    if (currentStep === 1) {
        return P.p1Fake;
    }

    // Etapa 3: finge receber a bola.
    // Faz um pequeno movimento e volta à posição.
    if (currentStep === 2) {
        const feint = Math.sin(t * Math.PI);

        return {
            x: P.p1Fake.x,
            y: P.p1Fake.y + feint * 16
        };
    }

    // Etapa 4: entra no espaço entre os defesas.
    if (currentStep === 3) {
        return between(P.p1Fake, P.p1Gap, t);
    }

    // Etapas 5 e 6: posição de receção e remate.
    return P.p1Gap;
}

// MOVIMENTAÇÃO DA BOLA
function getBallPosition(t) {

    // 1. Canto: jogador 1 -> jogador 2
    if (currentStep === 0) {
        return between(
            P.ballStart,
            P.ballAt2,
            t
        );
    }

    // 2. Jogador 2 -> jogador 3
    if (currentStep === 1) {
        return between(
            P.ballAt2,
            P.ballAt3,
            t
        );
    }

    // 3. Jogador 3 -> jogador 4
    if (currentStep === 2) {
        return between(
            P.ballAt3,
            P.ballAt4,
            t
        );
    }

    // 4. Jogador 1 corre; bola fica com jogador 4.
    if (currentStep === 3) {
        return P.ballAt4;
    }

    // 5. Jogador 4 -> jogador 1
    if (currentStep === 4) {
        return between(
            P.ballAt4,
            P.ballAt1,
            t
        );
    }

    // 6. Remate à baliza
    return between(
        P.ballAt1,
        P.goal,
        t
    );
}

// MOSTRA AS SETAS DA ETAPA ATUAL
function renderGuides() {

    // Esconde todas as setas inicialmente.
    guidePaths.forEach((path) => {
        path.style.opacity = "0";
    });

    guideNumbers.forEach((number) => {
        number.style.opacity = "0";
    });

    // Mostra apenas as setas desta etapa.
    guideIds[currentStep].forEach((id) => {
        document.querySelector(`#${id}`).style.opacity = "1";
    });

    // Destaca a numeração correta.
    if (guideNumbers[currentStep]) {
        guideNumbers[currentStep].style.opacity = "1";
    }
}

// DESENHA O ESTADO ATUAL
function render() {
    const t = Math.max(
        0,
        Math.min(1, progress)
    );

    // Jogadores 2, 3 e 4 permanecem nas suas posições.
    place(elements.p2, P.p2);
    place(elements.p3, P.p3);
    place(elements.p4, P.p4);

    // Movimento do jogador 1.
    place(
        elements.p1,
        getPlayer1Position(t)
    );

    // Movimento da bola.
    place(
        elements.ball,
        getBallPosition(t)
    );

    // Setas.
    renderGuides();

    // Mantém a mesma classe de etapa do Canto 1.
    elements.guides.setAttribute(
        "class",
        `show-${currentStep}`
    );

    // Destaca a etapa no painel lateral.
    elements.steps.forEach((li, index) => {
        li.classList.toggle(
            "active",
            index === currentStep
        );
    });

    // Estado da jogada.
    elements.status.textContent =
        `${currentStep + 1}/6 · ${stages[currentStep].title}`;

    // Botão de reprodução.
    elements.play.textContent = playing
        ? "⏸ Pausar"
        : "▶ Reproduzir";
}

// PARA A REPRODUÇÃO
function stop() {
    playing = false;
    runToken++;

    cancelAnimationFrame(frameId);

    frameId = null;
    lastFrame = null;
}

// REINICIA
function reset() {
    stop();

    currentStep = 0;
    progress = 0;

    render();
}

// NAVEGA PARA UMA ETAPA
function goTo(index) {
    stop();

    currentStep = Math.max(
        0,
        Math.min(stages.length - 1, index)
    );

    progress = 0;

    render();
}

// MOTOR DE ANIMAÇÃO — IGUAL AO CANTO 1
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

    // Avança para a próxima etapa.
    if (progress >= 1) {
        progress = 1;
        render();

        // Termina depois do remate.
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

// REPRODUZ OU PAUSA
function togglePlay() {
    if (playing) {
        stop();
        render();
        return;
    }

    // Se terminou, volta ao início.
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

// EVENTOS DOS CONTROLOS
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

// CLICAR DIRETAMENTE NAS ETAPAS
elements.steps.forEach((li, index) => {
    li.querySelector("button").addEventListener(
        "click",
        () => goTo(index)
    );
});

// ESTADO INICIAL
render();
