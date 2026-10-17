/*
 * CANTO 2 — Animação da jogada
 *
 * Sequência:
 * 1. Jogador 1 passa para o jogador 2 e corre para o meio entre 3 e 4.
 * 2. Jogador 2 passa para o jogador 3.
 * 3. Jogador 3 passa para o jogador 4. O jogador 1 finge receber e deixa passar.
 * 4. Jogador 1 ataca o espaço entre os dois adversários mais próximos.
 * 5. Jogador 4 passa para o jogador 1.
 * 6. Jogador 1 remata à baliza.
 */

const P = {
    // jogador 1
    p1Start: { x: 948, y: 650 },
    p1Fake: { x: 812, y: 208 },
    p1Gap: { x: 812, y: 330 },

    // outros jogadores
    p2: { x: 720, y: 650 },
    p3: { x: 720, y: 155 },
    p4: { x: 905, y: 155 },

    // bola
    ballStart: { x: 935, y: 636 },
    ballAt2: { x: 720, y: 650 },
    ballAt3: { x: 720, y: 155 },
    ballAt4: { x: 905, y: 155 },
    ballAt1: { x: 812, y: 330 },
    ballGoal: { x: 950, y: 350 }
};

const stages = [
    {
        title: "Passe do jogador 1 para o jogador 2",
        duration: 1150
    },
    {
        title: "Passe do jogador 2 para o jogador 3",
        duration: 950
    },
    {
        title: "Passe do jogador 3 para o jogador 4",
        duration: 950
    },
    {
        title: "Ataque ao espaço do jogador 1",
        duration: 900
    },
    {
        title: "Passe do jogador 4 para o jogador 1",
        duration: 950
    },
    {
        title: "Remate do jogador 1",
        duration: 850
    }
];

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

    steps: [...document.querySelectorAll("#steps li")]
};

let currentStep = 0;
let progress = 0;
let playing = false;
let frameId = null;
let lastFrame = null;
let runToken = 0;

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function between(a, b, t) {
    return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    };
}

function place(el, pos) {
    el.setAttribute("transform", `translate(${pos.x} ${pos.y})`);
}

function getPlayer1Position() {
    // etapa 1: corre para o centro entre 3 e 4
    if (currentStep === 0) {
        return between(P.p1Start, P.p1Fake, progress);
    }

    // etapa 2 e 3: já está no meio entre 3 e 4
    if (currentStep === 1 || currentStep === 2) {
        return P.p1Fake;
    }

    // etapa 4: ataca o espaço vazio
    if (currentStep === 3) {
        return between(P.p1Fake, P.p1Gap, progress);
    }

    // etapas 5 e 6: fica na zona de receção/remate
    return P.p1Gap;
}

function getBallPosition() {
    if (currentStep === 0) {
        return between(P.ballStart, P.ballAt2, progress);
    }

    if (currentStep === 1) {
        return between(P.ballAt2, P.ballAt3, progress);
    }

    if (currentStep === 2) {
        return between(P.ballAt3, P.ballAt4, progress);
    }

    if (currentStep === 3) {
        return P.ballAt4;
    }

    if (currentStep === 4) {
        return between(P.ballAt4, P.ballAt1, progress);
    }

    return between(P.ballAt1, P.ballGoal, progress);
}

function render() {
    const t = Math.max(0, Math.min(1, progress));

    // Jogadores fixos
    place(elements.p2, P.p2);
    place(elements.p3, P.p3);
    place(elements.p4, P.p4);

    // Jogador 1
    place(elements.p1, getPlayer1Position());

    // Bola
    place(elements.ball, getBallPosition());

    // Mostrar setas da etapa atual
    elements.guides.setAttribute("class", `show-${currentStep}`);

    // Destacar etapa atual
    elements.steps.forEach((li, index) => {
        li.classList.toggle("active", index === currentStep);
    });

    // Estado textual
    elements.status.textContent =
        `${currentStep + 1}/6 · ${stages[currentStep].title}`;

    // Texto do botão de play
    elements.play.textContent = playing ? "⏸ Pausar" : "▶ Reproduzir";
}

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
    currentStep = Math.max(0, Math.min(stages.length - 1, index));
    progress = 0;
    render();
}

function tick(time, token) {
    if (!playing || token !== runToken) {
        return;
    }

    if (lastFrame === null) {
        lastFrame = time;
    }

    const delta = Math.min(time - lastFrame, 100);
    lastFrame = time;

    const speed = Number(elements.speed.value);
    progress += (delta * speed) / stages[currentStep].duration;

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

function togglePlay() {
    if (playing) {
        stop();
        render();
        return;
    }

    if (currentStep === stages.length - 1 && progress >= 1) {
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

elements.restart.addEventListener("click", reset);

elements.previous.addEventListener("click", () => {
    goTo(currentStep - 1);
});

elements.next.addEventListener("click", () => {
    goTo(currentStep + 1);
});

elements.play.addEventListener("click", togglePlay);

elements.steps.forEach((li, index) => {
    const button = li.querySelector("button");

    button.addEventListener("click", () => {
        goTo(index);
    });
});

render();