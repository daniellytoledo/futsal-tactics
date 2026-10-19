
/*
 * ==========================================
 * ESTRATÉGIA X — SAÍDA DE BOLA PRESSIONADA
 * ==========================================
 *
 * ETAPA 1
 * Jogadora 3 ocupa a posição inicial da 2.
 * Jogadora 4 ocupa a posição inicial da 1.
 * As duas adversárias acompanham-nas até ao fim.
 *
 * ETAPA 2
 * Jogadoras 1 e 2 iniciam o cruzamento em X.
 * As respetivas adversárias acompanham-nas.
 *
 * ETAPA 3
 * As adversárias das jogadoras 1 e 2 param
 * juntas no centro do cruzamento.
 * As jogadoras continuam até às posições finais.
 *
 * ETAPA 4
 * A guarda-redes lança para a jogadora 1 ou 2.
 *
 * Campo SVG: viewBox="0 0 1000 700"
 */

// ==========================================
// 1. POSIÇÕES INICIAIS E FINAIS
// ==========================================

const P = {

    // JOGADORA 1
    p1Start: { x: 865, y: 90 },
    p1Finish: { x: 560, y: 610 },

    // JOGADORA 2
    p2Start: { x: 865, y: 610 },
    p2Finish: { x: 560, y: 90 },

    // JOGADORA 3
    p3Start: { x: 560, y: 610 },
    p3Finish: { x: 865, y: 610 },

    // JOGADORA 4
    p4Start: { x: 560, y: 90 },
    p4Finish: { x: 865, y: 90 },

    // MARCADORA DA JOGADORA 1
    d1Start: { x: 815, y: 145 },
    d1Stop: { x: 705, y: 325 },

    // MARCADORA DA JOGADORA 2
    d2Start: { x: 815, y: 555 },
    d2Stop: { x: 745, y: 375 },

    // MARCADORA DA JOGADORA 3
    d3Start: { x: 510, y: 555 },
    d3Finish: { x: 815, y: 565 },

    // MARCADORA DA JOGADORA 4
    d4Start: { x: 510, y: 145 },
    d4Finish: { x: 815, y: 135 },

    // GUARDA-REDES E BOLA
    keeper: { x: 947, y: 350 },
    ballStart: { x: 925, y: 350 }
};

// Percentagem do percurso realizado pelas
// jogadoras 1 e 2 durante a segunda etapa.
const CROSS_POINT = 0.55;

// ==========================================
// 2. ETAPAS E DURAÇÕES
// ==========================================

const stages = [
    {
        title: "Jogadoras 3 e 4 arrastam as marcações",
        duration: 1900
    },
    {
        title: "Cruzamento das jogadoras 1 e 2",
        duration: 1900
    },
    {
        title: "Desmarcação das jogadoras 1 e 2",
        duration: 1300
    },
    {
        title: "Lançamento da guarda-redes",
        duration: 1800
    }
];

// ==========================================
// 3. ELEMENTOS HTML E SVG
// ==========================================

const elements = {

    // Jogadoras
    p1: document.querySelector("#player1"),
    p2: document.querySelector("#player2"),
    p3: document.querySelector("#player3"),
    p4: document.querySelector("#player4"),

    // Adversárias
    d1: document.querySelector("#defender1"),
    d2: document.querySelector("#defender2"),
    d3: document.querySelector("#defender3"),
    d4: document.querySelector("#defender4"),

    // Bola e campo
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

    // Destino do lançamento
    target: document.querySelector("#targetPlayer"),
    passDescription: document.querySelector("#passDescription"),

    // Etapas
    steps: [
        ...document.querySelectorAll("#steps li")
    ]
};

// ==========================================
// 4. SETAS DOS MOVIMENTOS
// ==========================================

const guides = {

    // Movimentos das nossas jogadoras
    move1: document.querySelector("#move1"),
    move2: document.querySelector("#move2"),
    move3: document.querySelector("#move3"),
    move4: document.querySelector("#move4"),

    // Movimentos das adversárias
    defender1: document.querySelector("#moveDefender1"),
    defender2: document.querySelector("#moveDefender2"),
    defender3: document.querySelector("#moveDefender3"),
    defender4: document.querySelector("#moveDefender4"),

    // Lançamento da guarda-redes
    pass: document.querySelector("#passGuide")
};

// ==========================================
// 5. ESTADO DA REPRODUÇÃO
// ==========================================

let currentStep = 0;
let progress = 0;

let playing = false;

let frameId = null;
let lastFrame = null;
let runToken = 0;

// ==========================================
// 6. FUNÇÕES AUXILIARES
// ==========================================

// Limita um número entre 0 e 1.
function clamp(value) {
    return Math.max(0, Math.min(1, value));
}

// Interpolação entre dois valores.
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Calcula a posição entre dois pontos.
function between(start, end, t) {

    const value = clamp(t);

    return {
        x: lerp(start.x, end.x, value),
        y: lerp(start.y, end.y, value)
    };
}

// Movimenta um grupo SVG.
function place(element, position) {

    if (!element) {
        return;
    }

    element.setAttribute(
        "transform",
        `translate(${position.x} ${position.y})`
    );
}

// Movimenta um círculo SVG.
function placeCircle(element, position) {

    if (!element) {
        return;
    }

    element.setAttribute("cx", position.x);
    element.setAttribute("cy", position.y);
}

// Atualiza uma seta de direção única.
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

// Mostra uma seta.
function showGuide(name) {

    const path = guides[name];

    if (path) {
        path.style.opacity = "1";
    }
}

// ==========================================
// 7. DESTINO DO LANÇAMENTO
// ==========================================

function getPassDestination() {

    if (elements.target.value === "2") {
        return P.p2Finish;
    }

    return P.p1Finish;
}

// ==========================================
// 8. JOGADORA 1 — CRUZAMENTO
// ==========================================

function getPlayer1Position(t) {

    // Etapa 1: aguarda.
    if (currentStep === 0) {
        return P.p1Start;
    }

    // Etapa 2: começa o cruzamento.
    if (currentStep === 1) {

        return between(
            P.p1Start,
            P.p1Finish,
            CROSS_POINT * t
        );
    }

    // Etapa 3: completa a corrida.
    if (currentStep === 2) {

        return between(
            P.p1Start,
            P.p1Finish,
            CROSS_POINT + (1 - CROSS_POINT) * t
        );
    }

    // Etapa 4: permanece na posição final.
    return P.p1Finish;
}

// ==========================================
// 9. JOGADORA 2 — CRUZAMENTO
// ==========================================

function getPlayer2Position(t) {

    if (currentStep === 0) {
        return P.p2Start;
    }

    if (currentStep === 1) {

        return between(
            P.p2Start,
            P.p2Finish,
            CROSS_POINT * t
        );
    }

    if (currentStep === 2) {

        return between(
            P.p2Start,
            P.p2Finish,
            CROSS_POINT + (1 - CROSS_POINT) * t
        );
    }

    return P.p2Finish;
}

// ==========================================
// 10. JOGADORA 3 — TROCA DE POSIÇÃO
// ==========================================

function getPlayer3Position(t) {

    // Etapa 1:
    // Ocupa a posição inicial da jogadora 2.
    if (currentStep === 0) {

        return between(
            P.p3Start,
            P.p3Finish,
            t
        );
    }

    return P.p3Finish;
}

// ==========================================
// 11. JOGADORA 4 — TROCA DE POSIÇÃO
// ==========================================

function getPlayer4Position(t) {

    // Etapa 1:
    // Ocupa a posição inicial da jogadora 1.
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
// 12. MARCADORA DA JOGADORA 1
// ==========================================

function getDefender1Position(t) {

    // Etapa 1: permanece na posição inicial.
    if (currentStep === 0) {
        return P.d1Start;
    }

    // Etapa 2:
    // Acompanha a jogadora 1 até ao cruzamento.
    if (currentStep === 1) {

        return between(
            P.d1Start,
            P.d1Stop,
            t
        );
    }

    // Etapas 3 e 4:
    // Para no cruzamento.
    return P.d1Stop;
}

// ==========================================
// 13. MARCADORA DA JOGADORA 2
// ==========================================

function getDefender2Position(t) {

    if (currentStep === 0) {
        return P.d2Start;
    }

    // Etapa 2:
    // Acompanha a jogadora 2.
    if (currentStep === 1) {

        return between(
            P.d2Start,
            P.d2Stop,
            t
        );
    }

    // Para junto da outra marcadora.
    return P.d2Stop;
}

// ==========================================
// 14. MARCADORA DA JOGADORA 3
// ==========================================

function getDefender3Position(t) {

    // Etapa 1:
    // Segue a jogadora 3 até à posição
    // anteriormente ocupada pela jogadora 2.
    if (currentStep === 0) {

        return between(
            P.d3Start,
            P.d3Finish,
            t
        );
    }

    // Permanece atrás com a jogadora 3.
    return P.d3Finish;
}

// ==========================================
// 15. MARCADORA DA JOGADORA 4
// ==========================================

function getDefender4Position(t) {

    // Etapa 1:
    // Segue a jogadora 4 até à posição
    // anteriormente ocupada pela jogadora 1.
    if (currentStep === 0) {

        return between(
            P.d4Start,
            P.d4Finish,
            t
        );
    }

    // Permanece atrás com a jogadora 4.
    return P.d4Finish;
}

// ==========================================
// 16. BOLA DA GUARDA-REDES
// ==========================================

function getBallPosition(t) {

    // Até à última etapa, a bola
    // permanece com a guarda-redes.
    if (currentStep < 3) {
        return P.ballStart;
    }

    // Lançamento para a jogadora selecionada.
    return between(
        P.ballStart,
        getPassDestination(),
        t
    );
}

// ==========================================
// 17. SETAS E GUIAS
// ==========================================

function renderGuides() {

    // Esconde todas as setas primeiro.
    Object.values(guides).forEach((path) => {

        if (path) {
            path.style.opacity = "0";
        }
    });

    // ETAPA 1:
    // Jogadoras 3 e 4 deslocam-se.
    // Adversárias acompanham até atrás.
    if (currentStep === 0) {

        showGuide("move3");
        showGuide("move4");

        showGuide("defender3");
        showGuide("defender4");
    }

    // ETAPA 2:
    // Jogadoras 1 e 2 cruzam.
    // As adversárias acompanham até ao centro.
    if (currentStep === 1) {

        showGuide("move1");
        showGuide("move2");

        showGuide("defender1");
        showGuide("defender2");
    }

    // ETAPA 3:
    // Jogadoras 1 e 2 continuam.
    // As adversárias ficam paradas no centro.
    if (currentStep === 2) {

        showGuide("move1");
        showGuide("move2");
    }

    // ETAPA 4:
    // Lançamento para a jogadora livre.
    if (currentStep === 3) {
        showGuide("pass");
    }
}

// ==========================================
// 18. DESENHAR ESTADO DA JOGADA
// ==========================================

function render() {

    const t = clamp(progress);

    // JOGADORAS
    place(
        elements.p1,
        getPlayer1Position(t)
    );

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

    // MARCADORAS
    placeCircle(
        elements.d1,
        getDefender1Position(t)
    );

    placeCircle(
        elements.d2,
        getDefender2Position(t)
    );

    placeCircle(
        elements.d3,
        getDefender3Position(t)
    );

    placeCircle(
        elements.d4,
        getDefender4Position(t)
    );

    // BOLA
    place(
        elements.ball,
        getBallPosition(t)
    );

    // Atualiza a seta do lançamento.
    setGuide(
        "passGuide",
        P.ballStart,
        getPassDestination()
    );

    // Atualiza as setas das adversárias 3 e 4
    // com as posições definidas neste ficheiro.
    setGuide(
        "moveDefender3",
        P.d3Start,
        P.d3Finish
    );

    setGuide(
        "moveDefender4",
        P.d4Start,
        P.d4Finish
    );

    // Mostra as setas da etapa.
    renderGuides();

    // Destaca a etapa no painel direito.
    elements.steps.forEach((li, index) => {

        li.classList.toggle(
            "active",
            index === currentStep
        );
    });

    // Estado da reprodução.
    elements.status.textContent =
        `${currentStep + 1}/4 · ${stages[currentStep].title}`;

    // Texto do botão Play/Pause.
    elements.play.textContent = playing
        ? "⏸ Pausar"
        : "▶ Reproduzir";
}

// ==========================================
// 19. PARAR A REPRODUÇÃO
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
// 20. REINICIAR
// ==========================================

function reset() {

    stop();

    currentStep = 0;
    progress = 0;

    render();
}

// ==========================================
// 21. NAVEGAR ENTRE ETAPAS
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
// 22. MOTOR DE ANIMAÇÃO
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

    // Quando termina uma etapa:
    if (progress >= 1) {

        progress = 1;
        render();

        // Última etapa: terminar.
        if (currentStep === stages.length - 1) {

            stop();
            render();

            return;
        }

        // Avançar para a próxima etapa.
        currentStep++;
        progress = 0;
    }

    render();

    frameId = requestAnimationFrame(
        (nextTime) => tick(nextTime, token)
    );
}

// ==========================================
// 23. REPRODUZIR OU PAUSAR
// ==========================================

function togglePlay() {

    if (playing) {

        stop();
        render();

        return;
    }

    // Se a jogada já terminou,
    // volta à primeira etapa.
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
// 24. ESCOLHER DESTINO DO LANÇAMENTO
// ==========================================

function changeTarget() {

    // Jogadora 1
    if (elements.target.value === "1") {

        elements.passDescription.textContent =
            "A guarda-redes lança a bola para " +
            "a jogadora 1, que ficou livre " +
            "na posição inferior mais avançada.";

    } else {

        // Jogadora 2
        elements.passDescription.textContent =
            "A guarda-redes lança a bola para " +
            "a jogadora 2, que ficou livre " +
            "na posição superior mais avançada.";
    }

    // Atualiza a trajetória imediatamente.
    render();
}

// ==========================================
// 25. EVENTOS
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

// Selecionar uma etapa manualmente.
elements.steps.forEach((li, index) => {

    const button = li.querySelector("button");

    button.addEventListener(
        "click",
        () => goTo(index)
    );
});

// Alterar a jogadora que recebe.
elements.target.addEventListener(
    "change",
    changeTarget
);

// ==========================================
// 26. INICIALIZAÇÃO
// ==========================================

changeTarget();
