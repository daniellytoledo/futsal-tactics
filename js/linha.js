
/*
 * LINHA — Jogada lateral ofensiva
 *
 * 1. Jogador 4 leva o seu marcador ao canto.
 * 2. Jogador 2 finge receber, recua e inicia a corrida.
 * 3. Jogador 1 passa quando o jogador 2 está a meio
 *    do percurso; o jogador 2 termina a corrida.
 * 4. Jogador 2 remata à baliza.
 *
 * Campo SVG: 1000 × 700.
 */

// ==========================================
// 1. POSIÇÕES
// ==========================================

const P = {
    // Jogador 1: cobrança lateral
    p1: { x: 750, y: 18 },

    // Jogador 2
    p2Start: { x: 628, y: 320 },
    p2Fake: { x: 644, y: 280 },
    p2Behind: { x: 653, y: 393 },
    p2Middle: { x: 745, y: 405 },
    p2Finish: { x: 827, y: 350 },

    // Jogador 3
    p3: { x: 731, y: 320 },

    // Jogador 4: liberta a zona do penálti
    // Jogador 4
    p4Start: { x: 815, y: 320 },

    // Posição após levar o defensor ao canto
    p4Finish: { x: 945, y: 60 },

    // Posição de apoio no primeiro poste
    p4FirstPost: { x: 945, y: 270 },

    // Defesa que acompanha o jogador 4
    defenderStart: { x: 868, y: 320 },
    defenderFinish: { x: 975, y: 110 },

    // Bola
    ballStart: { x: 750, y: 43 },
    ballFinish: { x: 827, y: 350 },

    // Remate
    goal: { x: 981, y: 345 }
};

// ==========================================
// 2. ETAPAS E DURAÇÕES
// ==========================================

// duration em milissegundos.
// Quanto maior, mais lenta será a etapa.

const stages = [
    {
        title: "Jogador 4 afasta o marcador",
        duration: 1800
    },
    {
        title: "Finta e corrida do jogador 2",
        duration: 2200
    },
    {
        title: "Passe do lateral para o penálti",
        duration: 1500
    },
    {
        title: "Remate do jogador 2",
        duration: 1000
    }
];

// ==========================================
// 3. ELEMENTOS DO HTML
// ==========================================

const elements = {
    p1: document.querySelector("#player1"),
    p2: document.querySelector("#player2"),
    p3: document.querySelector("#player3"),
    p4: document.querySelector("#player4"),

    defender4: document.querySelector("#defender4"),

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

// ==========================================
// 4. ESTADO DA REPRODUÇÃO
// ==========================================

let currentStep = 0;
let progress = 0;
let playing = false;

let frameId = null;
let lastFrame = null;
let runToken = 0;

// ==========================================
// 5. FUNÇÕES AUXILIARES
// ==========================================

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

function clamp(t) {
    return Math.max(0, Math.min(1, t));
}

// Percurso formado por vários pontos.
// Permite a corrida do jogador 2 por trás
// dos defesas, sem atravessar as suas posições.

function alongPath(points, t) {
    const progress = clamp(t);

    if (progress === 1) {
        return points[points.length - 1];
    }

    const segments = points.length - 1;
    const scaled = progress * segments;

    const index = Math.floor(scaled);
    const localProgress = scaled - index;

    return between(
        points[index],
        points[index + 1],
        localProgress
    );
}

// Corrida completa do jogador 2.
const p2RunningPath = [
    P.p2Start,
    P.p2Behind,
    P.p2Middle,
    P.p2Finish
];

// ==========================================
// 6. POSIÇÃO DO JOGADOR 4
// ==========================================


function getPlayer4Position(t) {

    // ETAPA 1:
    // Jogador 4 leva o seu marcador para o canto.
    if (currentStep === 0) {
        return between(
            P.p4Start,
            P.p4Finish,
            t
        );
    }

    // ETAPA 2:
    // Aguarda no canto enquanto o jogador 2
    // faz a finta e começa a correr.
    if (currentStep === 1) {
        return P.p4Finish;
    }

    // ETAPA 3:
    // Quando o jogador 2 está perto de receber
    // a bola, o jogador 4 começa a deslocar-se
    // em direção ao primeiro poste.
    if (currentStep === 2) {

        // Aguarda até aos 65% da etapa.
        if (t < 0.65) {
            return P.p4Finish;
        }

        // Percorre 40% do caminho até ao poste.
        const progress =
            ((t - 0.65) / 0.35) * 0.40;

        return between(
            P.p4Finish,
            P.p4FirstPost,
            progress
        );
    }

    // ETAPA 4:
    // Enquanto o jogador 2 remata,
    // o jogador 4 completa o movimento
    // até ao primeiro poste.
    return between(
        P.p4Finish,
        P.p4FirstPost,
        0.40 + t * 0.60
    );
}


// ==========================================
// 7. POSIÇÃO DO DEFESA DO JOGADOR 4
// ==========================================

function getDefenderPosition(t) {
    if (currentStep === 0) {
        return between(
            P.defenderStart,
            P.defenderFinish,
            t
        );
    }

    return P.defenderFinish;
}

// ==========================================
// 8. POSIÇÃO DO JOGADOR 2
// ==========================================

function getPlayer2Position(t) {

    // Etapa 1:
    // Mantém a posição enquanto o jogador 4
    // leva o seu marcador em direção ao canto.
    if (currentStep === 0) {
        return P.p2Start;
    }

    // Etapa 2:
    // Primeiro dá um passo curto, depois recua
    // e começa a correr por trás dos defesas.
    if (currentStep === 1) {

        // Primeiros 20%: finta para a frente.
        if (t < 0.20) {
            return between(
                P.p2Start,
                P.p2Fake,
                t / 0.20
            );
        }

        // Dos 20% aos 40%: volta ao início.
        if (t < 0.40) {
            return between(
                P.p2Fake,
                P.p2Start,
                (t - 0.20) / 0.20
            );
        }

        // Últimos 60%: começa a corrida,
        // percorrendo metade do trajeto.
        const runProgress =
            ((t - 0.40) / 0.60) * 0.5;

        return alongPath(
            p2RunningPath,
            runProgress
        );
    }

    // Etapa 3:
    // Continua da metade do percurso
    // até à marca do penálti.
    if (currentStep === 2) {
        return alongPath(
            p2RunningPath,
            0.5 + t * 0.5
        );
    }

    // Etapa 4:
    // Posição onde recebe e remata.
    return P.p2Finish;
}

// ==========================================
// 9. MOVIMENTO DA BOLA
// ==========================================

function getBallPosition(t) {

    // Etapas 1 e 2:
    // Jogador 1 continua com a bola.
    if (currentStep < 2) {
        return P.ballStart;
    }

    // Etapa 3:
    // Passe para a zona do penálti.
    if (currentStep === 2) {
        return between(
            P.ballStart,
            P.ballFinish,
            t
        );
    }

    // Etapa 4:
    // Remate à baliza.
    return between(
        P.ballFinish,
        P.goal,
        t
    );
}

// ==========================================
// 10. SETAS E NUMERAÇÃO
// ==========================================

const guidePaths = {
    move4: document.querySelector("#move4"),
    move4Post: document.querySelector("#move4Post"),
    defender: document.querySelector("#moveDefender"),
    fake: document.querySelector("#move2Fake"),
    run: document.querySelector("#move2Run"),
    pass: document.querySelector("#passGuide"),
    shot: document.querySelector("#shotGuide")
};

const guideNumbers = [
    ...document.querySelectorAll(
        "#guides .guide-number"
    )
];

function renderGuides() {

    // Esconde todas as setas.
    Object.values(guidePaths).forEach((path) => {
        path.style.opacity = "0";
    });

    guideNumbers.forEach((number) => {
        number.style.opacity = "0";
    });

    // Etapa 1: corrida do jogador 4
    // e acompanhamento do adversário.
    if (currentStep === 0) {
        guidePaths.move4.style.opacity = "1";
        guidePaths.defender.style.opacity = "1";
    }

    // Etapa 2: finta e corrida do jogador 2.
    if (currentStep === 1) {
        guidePaths.fake.style.opacity = "1";
        guidePaths.run.style.opacity = "1";
    }

    // Etapa 3: passe e continuação da corrida.
    if (currentStep === 2) {
        guidePaths.pass.style.opacity = "1";
        guidePaths.run.style.opacity = "1";
    }

    // Etapa 4: remate.
    if (currentStep === 3) {
        guidePaths.shot.style.opacity = "1";
    }

    // Número da etapa.
    if (guideNumbers[currentStep]) {
        guideNumbers[currentStep].style.opacity = "1";
    }

    // Movimento do jogador 4 para o primeiro poste.
    // A seta aparece durante o fim do passe
    // e durante o remate.

    if (
        (currentStep === 2 && progress >= 0.65) ||
        currentStep === 3
    ) {
        guidePaths.move4Post.style.opacity = "1";
    }
}

// ==========================================
// 11. DESENHAR O ESTADO DA JOGADA
// ==========================================

function render() {
    const t = clamp(progress);

    // Jogadores fixos.
    place(elements.p1, P.p1);
    place(elements.p3, P.p3);

    // Jogador 2.
    place(
        elements.p2,
        getPlayer2Position(t)
    );

    // Jogador 4.
    place(
        elements.p4,
        getPlayer4Position(t)
    );

    // Defesa do jogador 4.
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

    // Guias e setas.
    elements.guides.setAttribute(
        "class",
        `show-${currentStep}`
    );

    renderGuides();

    // Destaca a etapa nas instruções.
    elements.steps.forEach((li, index) => {
        li.classList.toggle(
            "active",
            index === currentStep
        );
    });

    // Estado da reprodução.
    elements.status.textContent =
        `${currentStep + 1}/4 · ${stages[currentStep].title}`;

    elements.play.textContent = playing
        ? "⏸ Pausar"
        : "▶ Reproduzir";
}

// ==========================================
// 12. PARAR, REINICIAR E NAVEGAR
// ==========================================

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

// ==========================================
// 13. MOTOR DE ANIMAÇÃO
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

    const speed = Number(
        elements.speed.value
    );

    progress +=
        (delta * speed) /
        stages[currentStep].duration;

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

    frameId = requestAnimationFrame((time) => {
        tick(time, token);
    });
}

// ==========================================
// 14. REPRODUZIR E PAUSAR
// ==========================================

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

// ==========================================
// 15. EVENTOS DOS BOTÕES
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

// Selecionar uma etapa no painel lateral.
elements.steps.forEach((li, index) => {
    li.querySelector("button").addEventListener(
        "click",
        () => goTo(index)
    );
});

// Estado inicial.
render();
