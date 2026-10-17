
/*
 * CANTO 1 — Animação da jogada
 *
 * Sequência:
 * 1. Jogador 2 desloca-se para bloquear o adversário.
 * 2. Jogador 3 desce em linha reta para o espaço livre.
 * 3. Jogador 1 passa a bola por trás do bloqueio.
 * 4. Jogador 3 remata diretamente à baliza.
 *
 * As coordenadas correspondem ao campo SVG
 * com viewBox="0 0 1000 700".
 */

const P = {
    p1: { x: 980, y: 677 },

    p2Start: { x: 733, y: 622 },
    p2Block: { x: 831, y: 543 },

    p3Start: { x: 720, y: 330 },
    p3Finish: { x: 720, y: 492 },

    p4Start: { x: 720, y: 210 },
    p4Finish: { x: 935, y: 275 },

    ballStart: { x: 958, y: 659 },
    ballFinish: { x: 720, y: 492 },

    goal: { x: 973, y: 345 }
};

// Etapas e duração de cada movimento (milissegundos)
const stages = [
    {
        title: "Bloqueio do jogador 2",
        duration: 1250
    },
    {
        title: "Descida do jogador 3",
        duration: 1200
    },
    {
        title: "Passe pelas costas do bloqueio",
        duration: 1100
    },
    {
        title: "Remate direto",
        duration: 800
    }
];

// Elementos da página
const elements = {
    p2: document.querySelector("#player2"),
    p3: document.querySelector("#player3"),
    ball: document.querySelector("#ball"),

    guides: document.querySelector("#guides"),
    move2: document.querySelector("#move2"),

    play: document.querySelector("#play"),
    status: document.querySelector("#status"),
    speed: document.querySelector("#speed"),

    p4: document.querySelector("#player4"),

    steps: [...document.querySelectorAll("#steps li")]
};

// Define a seta do movimento do jogador 2
elements.move2.setAttribute(
    "d",
    `M${P.p2Start.x} ${P.p2Start.y} L${P.p2Block.x} ${P.p2Block.y}`
);

// Estado da animação
let currentStep = 0;
let progress = 0;
let playing = false;

let frameId = null;
let lastFrame = null;
let runToken = 0;

// Interpolação entre dois valores
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Calcula a posição entre dois pontos
function between(a, b, t) {
    return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    };
}

// Atualiza a posição de um elemento SVG
function place(element, position) {
    element.setAttribute(
        "transform",
        `translate(${position.x} ${position.y})`
    );
}

// Desenha o estado atual da jogada
function render() {
    const t = Math.max(0, Math.min(1, progress));

    // Movimento do jogador 2 até ao bloqueio
    const position2 =
        currentStep === 0
            ? between(P.p2Start, P.p2Block, t)
            : P.p2Block;

    place(elements.p2, position2);

    // Movimento do jogador 3 em linha reta
    let position3;

    if (currentStep < 1) {
        position3 = P.p3Start;
    } else if (currentStep === 1) {
        position3 = between(P.p3Start, P.p3Finish, t);
    } else {
        position3 = P.p3Finish;
    }

    place(elements.p3, position3);

    // Jogador 4 corre entre os dois defesas
    // até ao segundo poste.
    //
    // A corrida acontece ao mesmo tempo
    // que a descida do jogador 3.

let position4;

if (currentStep < 1) {
    position4 = P.p4Start;
} else if (currentStep === 1) {
    position4 = between(
        P.p4Start,
        P.p4Finish,
        t
    );
} else {
    position4 = P.p4Finish;
}

place(elements.p4, position4);

    // Movimento da bola: canto, passe e remate
    let ballPosition;

    if (currentStep < 2) {
        ballPosition = P.ballStart;
    } else if (currentStep === 2) {
        ballPosition = between(
            P.ballStart,
            P.ballFinish,
            t
        );
    } else {
        ballPosition = between(
            P.ballFinish,
            P.goal,
            t
        );
    }

    place(elements.ball, ballPosition);

    // Mostra as setas correspondentes à etapa
    elements.guides.setAttribute(
        "class",
        `show-${currentStep}`
    );

    // Destaca a etapa atual nas instruções
    elements.steps.forEach((li, index) => {
        li.classList.toggle(
            "active",
            index === currentStep
        );
    });

    // Atualiza o texto de estado
    elements.status.textContent =
        `${currentStep + 1}/4 · ${stages[currentStep].title}`;

    // Atualiza o botão de reprodução
    elements.play.textContent = playing
        ? "⏸ Pausar"
        : "▶ Reproduzir";
}

// Interrompe a animação
function stop() {
    playing = false;
    runToken++;

    cancelAnimationFrame(frameId);

    frameId = null;
    lastFrame = null;
}

// Reinicia toda a jogada
function reset() {
    stop();

    currentStep = 0;
    progress = 0;

    render();
}

// Navega para uma etapa específica
function goTo(index) {
    stop();

    currentStep = Math.max(
        0,
        Math.min(stages.length - 1, index)
    );

    progress = 0;

    render();
}

// Executa os movimentos ao longo do tempo
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

    progress +=
        (delta * speed) / stages[currentStep].duration;

    // Quando uma etapa termina, passa à seguinte
    if (progress >= 1) {
        progress = 1;

        render();

        // Última etapa: termina a reprodução
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

// Alterna entre reproduzir e pausar
function togglePlay() {
    if (playing) {
        stop();
        render();
        return;
    }

    // Reinicia se a jogada já terminou
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

// Eventos dos botões
document
    .querySelector("#restart")
    .addEventListener("click", reset);

document
    .querySelector("#previous")
    .addEventListener("click", () => {
        goTo(currentStep - 1);
    });

document
    .querySelector("#next")
    .addEventListener("click", () => {
        goTo(currentStep + 1);
    });

elements.play.addEventListener("click", togglePlay);

// Permite selecionar uma etapa pelas instruções
elements.steps.forEach((li, index) => {
    li.querySelector("button").addEventListener(
        "click",
        () => goTo(index)
    );
});

// Apresenta o estado inicial
render();
