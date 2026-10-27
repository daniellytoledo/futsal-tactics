
/*
 * ==========================================
 * PLAYBOOK — MODO TREINO
 * ==========================================
 *
 * Jogo de posicionamento das jogadoras.
 *
 * - Arrastar com rato ou toque
 * - Desafios sequenciais
 * - Dicas opcionais
 * - Pontuação de 0 a 100 por posição
 * - Melhores resultados por jogada
 * - Classificação semanal local
 *
 * Não necessita de backend.
 */

// ==========================================
// 1. DADOS DAS JOGADAS
// ==========================================

const TACTICS = {

    canto1: {
        name: "Canto 1",

        players: {
            1: { x: 980, y: 677 },
            2: { x: 733, y: 622 },
            3: { x: 720, y: 330 },
            4: { x: 720, y: 210 }
        },

        defenders: [
            { x: 810, y: 560 },
            { x: 865, y: 560 },
            { x: 790, y: 340 },
            { x: 805, y: 210 }
        ],

        ball: { x: 958, y: 659 },
        keeper: { x: 961, y: 350 },

        challenges: [
            {
                player: 2,
                title: "Bloqueio da adversária",
                description:
                    "A jogadora 2 deve deslocar-se para " +
                    "bloquear a adversária vermelha mais " +
                    "próxima, impedindo que ela intercete " +
                    "o passe do canto para a jogadora 3.",

                // Posição junto à adversária mais próxima
                // e não entre as duas defensoras.
                target: { x: 780, y: 580 },

                // Maior precisão para avaliar o bloqueio.
                tolerance: 30
            },
            {
                player: 3,
                title: "Receção da bola",
                description:
                    "A jogadora 3 desce em linha reta " +
                    "para o espaço livre, onde vai rematar.",
                target: { x: 720, y: 492 }
            },
            {
                player: 4,
                title: "Segundo poste",
                description:
                    "Leva a jogadora 4 até ao segundo poste, " +
                    "para apoiar a finalização.",
                target: { x: 935, y: 275 }
            }
        ]
    },

    canto2: {
        name: "Canto 2",

        players: {
            1: { x: 980, y: 677 },
            2: { x: 635, y: 660 },
            3: { x: 635, y: 70 },
            4: { x: 920, y: 70 }
        },

        defenders: [
            { x: 780, y: 305 },
            { x: 910, y: 275 },
            { x: 795, y: 520 },
            { x: 925, y: 530 }
        ],

        ball: { x: 958, y: 659 },
        keeper: { x: 961, y: 350 },

        challenges: [
            {
                player: 1,
                title: "Corrida do canto",
                description:
                    "Depois de passar para a jogadora 2, " +
                    "a jogadora 1 vai para a zona inicial da 4.",
                target: { x: 910, y: 90 }
            },
            {
                player: 4,
                title: "Preparar a finta",
                description:
                    "A jogadora 4 avança para ficar " +
                    "entre as jogadoras 3 e 1.",
                target: { x: 775, y: 105 }
            },
            {
                player: 4,
                title: "Atacar o espaço",
                description:
                    "Depois da finta, leva a jogadora 4 " +
                    "ao espaço livre entre os defensores.",
                target: { x: 840, y: 240 }
            }
        ]
    },

    linha: {
        name: "Linha",

        players: {
            1: { x: 750, y: 18 },
            2: { x: 628, y: 320 },
            3: { x: 731, y: 320 },
            4: { x: 815, y: 320 }
        },

        defenders: [
            { x: 665, y: 320 },
            { x: 762, y: 320 },
            { x: 868, y: 320 },
            { x: 866, y: 75 }
        ],

        ball: { x: 750, y: 43 },
        keeper: { x: 961, y: 350 },

        challenges: [
            {
                player: 4,
                title: "Arrastar a marcação",
                description:
                    "A jogadora 4 corre para o canto, " +
                    "libertando a zona do penálti.",
                target: { x: 945, y: 60 }
            },
            {
                player: 2,
                title: "Finta curta",
                description:
                    "A jogadora 2 dá um passo curto " +
                    "em direção à cobrança lateral.",
                target: { x: 644, y: 280 }
            },
            {
                player: 2,
                title: "Regressar à posição",
                description:
                    "Depois da finta, a jogadora 2 " +
                    "regressa à posição inicial.",
                target: { x: 628, y: 320 }
            },
            {
                player: 2,
                title: "Atacar a zona do penálti",
                description:
                    "A jogadora 2 corre por trás " +
                    "da defesa até à zona de remate.",
                target: { x: 827, y: 350 }
            },
            {
                player: 4,
                title: "Apoio ao primeiro poste",
                description:
                    "Leva a jogadora 4 até ao primeiro poste " +
                    "para aproveitar uma eventual segunda bola.",
                target: { x: 945, y: 270 }
            }
        ]
    },

    cabo1: {
        name: "Cabo Verde — Variante 1",

        players: {
            1: { x: 750, y: 18 },
            2: { x: 750, y: 315 },
            3: { x: 760, y: 445 },
            4: { x: 550, y: 60 }
        },

        defenders: [
            { x: 485, y: 105 },
            { x: 688, y: 318 },
            { x: 692, y: 445 },
            { x: 690, y: 180 }
        ],

        ball: { x: 750, y: 42 },
        keeper: { x: 930, y: 350 },

        challenges: [
            {
                player: 4,
                title: "Abrir o campo",
                description:
                    "Leva a jogadora 4 ao outro lado " +
                    "da quadra, arrastando a marcação.",
                target: { x: 550, y: 630 }
            },
            {
                player: 2,
                title: "Aproximação",
                description:
                    "A jogadora 2 aproxima-se lentamente " +
                    "da jogadora 1 junto à lateral.",
                target: { x: 750, y: 68 }
            },
            {
                player: 3,
                title: "Cobrir o espaço",
                description:
                    "A jogadora 3 ocupa a posição " +
                    "inicial da jogadora 2.",
                target: { x: 750, y: 315 }
            },
            {
                player: 2,
                title: "Arranque rápido",
                description:
                    "A jogadora 2 corre paralelamente " +
                    "à lateral, em direção ao ataque.",
                target: { x: 545, y: 68 }
            }
        ]
    },

    cabo2: {
        name: "Cabo Verde — Variante 2",

        players: {
            1: { x: 750, y: 18 },
            2: { x: 750, y: 315 },
            3: { x: 760, y: 445 },
            4: { x: 550, y: 60 }
        },

        defenders: [
            { x: 485, y: 105 },
            { x: 688, y: 318 },
            { x: 692, y: 445 },
            { x: 690, y: 180 }
        ],

        ball: { x: 750, y: 42 },
        keeper: { x: 930, y: 350 },

        challenges: [
            {
                player: 4,
                title: "Arrastar a marcação",
                description:
                    "A jogadora 4 desloca-se " +
                    "para o outro lado da quadra.",
                target: { x: 550, y: 630 }
            },
            {
                player: 2,
                title: "Aproximação",
                description:
                    "A jogadora 2 aproxima-se " +
                    "da jogadora 1.",
                target: { x: 750, y: 68 }
            },
            {
                player: 3,
                title: "Opção alternativa",
                description:
                    "O defensor acompanha a jogadora 2. " +
                    "Onde deve ficar a jogadora 3 " +
                    "para oferecer outra opção de passe?",
                target: { x: 750, y: 315 }
            },
            {
                player: 2,
                title: "Levar o marcador",
                description:
                    "A jogadora 2 acelera pela lateral " +
                    "e leva o seu marcador consigo.",
                target: { x: 545, y: 68 }
            }
        ]
    },

    cabo3: {
        name: "Cabo Verde — Variante 3",

        players: {
            1: { x: 750, y: 18 },
            2: { x: 750, y: 315 },
            3: { x: 760, y: 445 },
            4: { x: 550, y: 60 }
        },

        defenders: [
            { x: 485, y: 105 },
            { x: 688, y: 318 },
            { x: 692, y: 445 },
            { x: 690, y: 180 }
        ],

        ball: { x: 750, y: 42 },
        keeper: { x: 930, y: 350 },

        challenges: [
            {
                player: 4,
                title: "Opção longa",
                description:
                    "A jogadora 4 corre para o outro lado " +
                    "do campo e prepara a receção.",
                target: { x: 550, y: 630 }
            },
            {
                player: 2,
                title: "Movimento da jogadora 2",
                description:
                    "Aproxima a jogadora 2 da cobrança, " +
                    "mesmo com a marcação adversária.",
                target: { x: 750, y: 68 }
            },
            {
                player: 3,
                title: "Movimento da jogadora 3",
                description:
                    "A jogadora 3 ocupa o espaço " +
                    "da jogadora 2, apesar de ser seguida.",
                target: { x: 750, y: 315 }
            },
            {
                player: 2,
                title: "Movimento de distração",
                description:
                    "A jogadora 2 continua pela lateral " +
                    "e arrasta a adversária.",
                target: { x: 545, y: 68 }
            }
        ]
    },

    x: {
        name: "X — Saída pressionada",

        players: {
            1: { x: 865, y: 90 },
            2: { x: 865, y: 610 },
            3: { x: 560, y: 610 },
            4: { x: 560, y: 90 }
        },

        defenders: [
            { x: 815, y: 145 },
            { x: 815, y: 555 },
            { x: 510, y: 555 },
            { x: 510, y: 145 }
        ],

        ball: { x: 925, y: 350 },
        keeper: { x: 947, y: 350 },

        challenges: [
            {
                player: 3,
                title: "Troca de posição da 3",
                description:
                    "Leva a jogadora 3 para a posição " +
                    "inicial da jogadora 2.",
                target: { x: 865, y: 610 }
            },
            {
                player: 4,
                title: "Troca de posição da 4",
                description:
                    "Leva a jogadora 4 para a posição " +
                    "inicial da jogadora 1.",
                target: { x: 865, y: 90 }
            },
            {
                player: 1,
                title: "Cruzamento em X",
                description:
                    "A jogadora 1 atravessa diagonalmente " +
                    "para a posição inicial da jogadora 3.",
                target: { x: 560, y: 610 }
            },
            {
                player: 2,
                title: "Completar o X",
                description:
                    "A jogadora 2 cruza diagonalmente " +
                    "para a posição inicial da jogadora 4.",
                target: { x: 560, y: 90 }
            }
        ]
    }
};

// ==========================================
// 2. ELEMENTOS DA PÁGINA
// ==========================================

const el = {
    name: document.querySelector("#playerName"),
    select: document.querySelector("#tacticSelect"),
    start: document.querySelector("#startButton"),

    pitch: document.querySelector("#trainingPitch"),
    players: document.querySelector("#playersLayer"),
    defenders: document.querySelector("#defendersLayer"),
    keeper: document.querySelector("#keeperLayer"),
    ball: document.querySelector("#ballLayer"),

    target: document.querySelector("#targetZone"),

    gameTitle: document.querySelector("#gameTitle"),
    score: document.querySelector("#scoreValue"),
    step: document.querySelector("#stepCounter"),
    progress: document.querySelector("#progressFill"),

    challengeTitle: document.querySelector("#challengeTitle"),
    description: document.querySelector("#challengeDescription"),
    feedback: document.querySelector("#feedback"),

    hint: document.querySelector("#hintButton"),
    next: document.querySelector("#nextButton"),

    resultPanel: document.querySelector("#resultPanel"),
    resultTitle: document.querySelector("#resultTitle"),
    resultDescription: document.querySelector("#resultDescription"),
    retry: document.querySelector("#retryButton"),

    week: document.querySelector("#weekLabel"),
    rankingBody: document.querySelector("#rankingBody"),
    copyRanking: document.querySelector("#copyRanking")
};

// ==========================================
// 3. ESTADO DO JOGO
// ==========================================

let activeTactic = null;
let activeTacticId = null;
let activePlayerName = "";

let playerPositions = {};
let currentChallenge = 0;

let totalScore = 0;
let wrongAttempts = 0;
let hintUsed = false;

let awaitingNext = false;
let gameFinished = false;

let dragging = null;

const TARGET_TOLERANCE = 55;

// ==========================================
// 4. FUNÇÕES AUXILIARES
// ==========================================

const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement(tag, attributes = {}) {
    const element = document.createElementNS(
        SVG_NS,
        tag
    );

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, String(value));
    });

    return element;
}

function distance(a, b) {
    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );
}

function copyPoint(point) {
    return {
        x: point.x,
        y: point.y
    };
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function currentTask() {
    if (!activeTactic) {
        return null;
    }

    return activeTactic.challenges[currentChallenge];
}

function setFeedback(message, error = false) {
    el.feedback.textContent = message;
    el.feedback.classList.toggle(
        "error",
        error
    );
}

// Converte coordenadas do rato ou toque
// para o sistema do campo SVG.
function pointerToPitch(event) {
    const point = el.pitch.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    const matrix = el.pitch.getScreenCTM();

    if (!matrix) {
        return null;
    }

    const result = point.matrixTransform(
        matrix.inverse()
    );

    return {
        x: clamp(result.x, 25, 975),
        y: clamp(result.y, 25, 675)
    };
}

// ==========================================
// 5. DESENHAR O CAMPO
// ==========================================

function drawField() {
    el.players.replaceChildren();
    el.defenders.replaceChildren();
    el.keeper.replaceChildren();
    el.ball.replaceChildren();

    if (!activeTactic) {
        return;
    }

    // Adversárias.
    activeTactic.defenders.forEach((position) => {
        const circle = svgElement("circle", {
            cx: position.x,
            cy: position.y,
            r: 21,
            class: "training-defender"
        });

        el.defenders.appendChild(circle);
    });

    // Guarda-redes.
    const keeper = svgElement("g", {
        class: "training-keeper",
        transform:
            `translate(${activeTactic.keeper.x} ` +
            `${activeTactic.keeper.y})`
    });

    keeper.appendChild(
        svgElement("circle", { r: 23 })
    );

    const keeperText = svgElement("text", {
        y: 6
    });

    keeperText.textContent = "GR";
    keeper.appendChild(keeperText);

    el.keeper.appendChild(keeper);

    // Bola.
    const ball = svgElement("circle", {
        cx: activeTactic.ball.x,
        cy: activeTactic.ball.y,
        r: 10,
        class: "training-ball"
    });

    el.ball.appendChild(ball);

    // Jogadoras.
    for (let number = 1; number <= 4; number++) {
        const group = svgElement("g", {
            "data-player": number,
            class: "training-player"
        });

        group.appendChild(
            svgElement("circle", { r: 23 })
        );

        const text = svgElement("text", { y: 8 });
        text.textContent = number;

        group.appendChild(text);
        el.players.appendChild(group);
    }

    updatePlayers();
}

// ==========================================
// 6. POSICIONAR JOGADORAS
// ==========================================

function updatePlayers() {
    const task = currentTask();

    for (let number = 1; number <= 4; number++) {
        const group = el.players.querySelector(
            `[data-player="${number}"]`
        );

        if (!group) {
            continue;
        }

        const position = playerPositions[number];

        group.setAttribute(
            "transform",
            `translate(${position.x} ${position.y})`
        );

        const canDrag =
            task &&
            !awaitingNext &&
            !gameFinished &&
            task.player === number;

        group.classList.toggle(
            "draggable",
            Boolean(canDrag)
        );
    }
}

// ==========================================
// 7. INICIAR UMA JOGADA
// ==========================================

function startGame() {
    const name = el.name.value.trim();

    if (!name) {
        setFeedback(
            "Introduz o nome da jogadora para começar.",
            true
        );

        el.name.focus();
        return;
    }

    activePlayerName = name;
    activeTacticId = el.select.value;
    activeTactic = TACTICS[activeTacticId];

    if (!activeTactic) {
        setFeedback("Jogada não encontrada.", true);
        return;
    }

    playerPositions = {};

    for (let number = 1; number <= 4; number++) {
        playerPositions[number] = copyPoint(
            activeTactic.players[number]
        );
    }

    currentChallenge = 0;
    totalScore = 0;

    wrongAttempts = 0;
    hintUsed = false;

    awaitingNext = false;
    gameFinished = false;
    dragging = null;

    el.gameTitle.textContent = activeTactic.name;
    el.resultPanel.hidden = true;

    el.next.disabled = true;
    el.hint.disabled = false;

    el.target.setAttribute("visibility", "hidden");

    drawField();
    showChallenge();
}

// ==========================================
// 8. MOSTRAR O DESAFIO
// ==========================================

function showChallenge() {
    const task = currentTask();

    if (!task) {
        return;
    }

    el.challengeTitle.textContent = task.title;
    el.description.textContent = task.description;

    el.score.textContent = totalScore;

    el.step.textContent =
        `${currentChallenge + 1} / ` +
        activeTactic.challenges.length;

    const completed = currentChallenge;

    el.progress.style.width =
        `${completed / activeTactic.challenges.length * 100}%`;

    el.hint.disabled = false;
    el.hint.textContent = "Mostrar dica";

    el.next.disabled = true;

    el.target.setAttribute("visibility", "hidden");

    setFeedback(
        `Arrasta a jogadora ${task.player} ` +
        "para a posição correta."
    );

    updatePlayers();
}

// ==========================================
// 9. COMEÇAR A ARRASTAR
// ==========================================

function onPointerDown(event) {
    if (
        !activeTactic ||
        awaitingNext ||
        gameFinished
    ) {
        return;
    }

    const group = event.target.closest(
        "[data-player]"
    );

    if (!group) {
        return;
    }

    const number = Number(
        group.dataset.player
    );

    const task = currentTask();

    if (!task || number !== task.player) {
        setFeedback(
            `Nesta etapa, movimenta a jogadora ${task.player}.`,
            true
        );

        return;
    }

    const pointer = pointerToPitch(event);

    if (!pointer) {
        return;
    }

    event.preventDefault();

    const origin = copyPoint(
        playerPositions[number]
    );

    dragging = {
        number,
        pointerId: event.pointerId,
        origin,
        offsetX: origin.x - pointer.x,
        offsetY: origin.y - pointer.y
    };

    group.classList.add("dragging");

    el.pitch.setPointerCapture(
        event.pointerId
    );
}

// ==========================================
// 10. MOVIMENTAR A JOGADORA
// ==========================================

function onPointerMove(event) {
    if (
        !dragging ||
        event.pointerId !== dragging.pointerId
    ) {
        return;
    }

    event.preventDefault();

    const pointer = pointerToPitch(event);

    if (!pointer) {
        return;
    }

    playerPositions[dragging.number] = {
        x: clamp(
            pointer.x + dragging.offsetX,
            25,
            975
        ),

        y: clamp(
            pointer.y + dragging.offsetY,
            25,
            675
        )
    };

    updatePlayers();
}

// ==========================================
// 11. CONFIRMAR A POSIÇÃO
// ==========================================

function onPointerUp(event) {
    if (
        !dragging ||
        event.pointerId !== dragging.pointerId
    ) {
        return;
    }

    const number = dragging.number;
    const origin = dragging.origin;

    if (
        el.pitch.hasPointerCapture &&
        el.pitch.hasPointerCapture(event.pointerId)
    ) {
        el.pitch.releasePointerCapture(
            event.pointerId
        );
    }

    dragging = null;

    const task = currentTask();

    if (!task) {
        return;
    }

    const position = playerPositions[number];
    const difference = distance(
        position,
        task.target
    );

    // Resposta correta.
    const tolerance = task.tolerance ?? TARGET_TOLERANCE;

    if (difference <= tolerance) {
        const penalty = wrongAttempts * 15;
        const hintPenalty = hintUsed ? 25 : 0;

        const points = Math.max(
            20,
            100 - penalty - hintPenalty
        );

        totalScore += points;

        // Encaixa a jogadora na posição correta.
        playerPositions[number] = copyPoint(
            task.target
        );

        awaitingNext = true;

        el.score.textContent = totalScore;

        el.next.disabled = false;
        el.hint.disabled = true;

        el.target.setAttribute(
            "visibility",
            "hidden"
        );

        setFeedback(
            `Posição correta! +${points} pontos.`
        );
    } else {
        wrongAttempts++;

        // Regressa ao ponto de partida
        // para repetir a tentativa.
        playerPositions[number] = origin;

        setFeedback(
            "Ainda não é essa a posição. " +
            "Tenta novamente ou usa a dica.",
            true
        );
    }

    updatePlayers();
}

// ==========================================
// 12. CANCELAR O ARRASTO
// ==========================================

function onPointerCancel(event) {
    if (!dragging) {
        return;
    }

    playerPositions[dragging.number] =
        dragging.origin;

    dragging = null;
    updatePlayers();
}

// ==========================================
// 13. MOSTRAR DICA
// ==========================================

function showHint() {
    const task = currentTask();

    if (!task || awaitingNext) {
        return;
    }

    hintUsed = true;

    el.target.setAttribute(
        "cx",
        task.target.x
    );

    el.target.setAttribute(
        "cy",
        task.target.y
    );

    el.target.setAttribute(
        "visibility",
        "visible"
    );

    el.hint.textContent = "Dica ativada";

    setFeedback(
        "A zona verde indica a posição. " +
        "Esta dica reduz 25 pontos."
    );
}

// ==========================================
// 14. AVANÇAR PARA A PRÓXIMA POSIÇÃO
// ==========================================

function nextChallenge() {
    if (!awaitingNext) {
        return;
    }

    currentChallenge++;

    if (
        currentChallenge >=
        activeTactic.challenges.length
    ) {
        finishGame();
        return;
    }

    wrongAttempts = 0;
    hintUsed = false;
    awaitingNext = false;

    showChallenge();
}

// ==========================================
// 15. SEMANA ATUAL
// ==========================================

// Segunda-feira é o primeiro dia da semana.
// Usa a data local do navegador.
function getWeekInfo() {
    const today = new Date();

    today.setHours(12, 0, 0, 0);

    const day = today.getDay();
    const daysFromMonday = (day + 6) % 7;

    const monday = new Date(today);
    monday.setDate(
        monday.getDate() - daysFromMonday
    );

    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    function keyDate(date) {
        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const format = (date) =>
        date.toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short"
        });

    return {
        key: keyDate(monday),

        label:
            `${format(monday)} – ${format(sunday)}`
    };
}

function getStorageKey() {
    return (
        "futsal-playbook-ranking-" +
        getWeekInfo().key
    );
}

// ==========================================
// 16. CARREGAR RESULTADOS
// ==========================================

function loadRanking() {
    try {
        const stored = localStorage.getItem(
            getStorageKey()
        );

        if (!stored) {
            return {};
        }

        const data = JSON.parse(stored);

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            return {};
        }

        return data;
    } catch (error) {
        return {};
    }
}

// ==========================================
// 17. GUARDAR RESULTADO
// ==========================================

function saveResult() {
    const ranking = loadRanking();

    const nameKey = activePlayerName
        .trim()
        .toLocaleLowerCase("pt-PT");

    if (!ranking[nameKey]) {
        ranking[nameKey] = {
            name: activePlayerName,
            scores: {}
        };
    }

    const previous =
        Number(
            ranking[nameKey].scores[activeTacticId]
        ) || 0;

    // Normaliza o resultado para 100 pontos por jogada.
    // Assim, todas as táticas têm o mesmo peso semanal.

    const maximum = activeTactic.challenges.length * 100;

    const normalizedScore = Math.round(
        (totalScore / maximum) * 100
    );

    ranking[nameKey].scores[activeTacticId] = Math.max(
        previous,
        normalizedScore
    );

    try {
        localStorage.setItem(
            getStorageKey(),
            JSON.stringify(ranking)
        );

        return true;
    } catch (error) {
        return false;
    }
}

// ==========================================
// 18. TERMINAR O TREINO
// ==========================================

function finishGame() {
    gameFinished = true;
    awaitingNext = false;

    el.target.setAttribute(
        "visibility",
        "hidden"
    );

    el.progress.style.width = "100%";

    el.step.textContent =
        `${activeTactic.challenges.length} / ` +
        activeTactic.challenges.length;

    el.hint.disabled = true;
    el.next.disabled = true;

    const maximum =
        activeTactic.challenges.length * 100;

    const percentage = Math.round(
        totalScore / maximum * 100
    );

    const saved = saveResult();

    el.resultPanel.hidden = false;

    el.resultTitle.textContent =
        `${percentage}% de aproveitamento`;

    el.resultDescription.textContent =
        `${activePlayerName}, conseguiste ` +
        `${totalScore} de ${maximum} pontos em ` +
        `${activeTactic.name}. ` +
        (
            saved
                ? "A tua melhor pontuação desta jogada foi guardada."
                : "Não foi possível guardar neste navegador."
        );

    setFeedback(
        "Treino concluído! Podes repetir a jogada " +
        "para tentar melhorar a pontuação."
    );

    renderRanking();
    updatePlayers();
}

// ==========================================
// 19. GERAR CLASSIFICAÇÃO
// ==========================================

function getRankingRows() {
    const ranking = loadRanking();

    return Object.values(ranking)
        .filter((entry) =>
            entry &&
            typeof entry.name === "string" &&
            entry.scores &&
            typeof entry.scores === "object"
        )
        .map((entry) => {
            const scores = Object.values(
                entry.scores
            ).map(Number);

            return {
                name: entry.name,

                played: scores.length,

                total: scores.reduce(
                    (sum, score) =>
                        sum + (
                            Number.isFinite(score)
                                ? score
                                : 0
                        ),
                    0
                )
            };
        })
        .sort((a, b) =>
            b.total - a.total ||
            a.name.localeCompare(b.name)
        );
}

// ==========================================
// 20. MOSTRAR CLASSIFICAÇÃO
// ==========================================

function renderRanking() {
    const week = getWeekInfo();
    const rows = getRankingRows();

    el.week.textContent = week.label;
    el.rankingBody.replaceChildren();

    if (rows.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");

        td.colSpan = 4;
        td.textContent =
            "Ainda não há resultados nesta semana.";

        tr.appendChild(td);
        el.rankingBody.appendChild(tr);

        return;
    }

    rows.forEach((entry, index) => {
        const tr = document.createElement("tr");

        const values = [
            `${index + 1}º`,
            entry.name,
            `${entry.played} / 7`,
            entry.total
        ];

        values.forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        el.rankingBody.appendChild(tr);
    });
}

// ==========================================
// 21. COPIAR CLASSIFICAÇÃO
// ==========================================

async function copyRanking() {
    const rows = getRankingRows();

    const lines = [
        "PLAYBOOK — CLASSIFICAÇÃO SEMANAL",
        getWeekInfo().label,
        ""
    ];

    if (rows.length === 0) {
        lines.push("Sem resultados.");
    } else {
        rows.forEach((entry, index) => {
            lines.push(
                `${index + 1}º · ${entry.name} — ` +
                `${entry.total} pontos ` +
                `(${entry.played}/7 jogadas)`
            );
        });
    }

    try {
        await navigator.clipboard.writeText(
            lines.join("\n")
        );

        el.copyRanking.textContent =
            "Classificação copiada!";
    } catch (error) {
        el.copyRanking.textContent =
            "Não foi possível copiar";
    }
}

// ==========================================
// 22. EVENTOS
// ==========================================

el.start.addEventListener(
    "click",
    startGame
);

el.pitch.addEventListener(
    "pointerdown",
    onPointerDown
);

el.pitch.addEventListener(
    "pointermove",
    onPointerMove
);

el.pitch.addEventListener(
    "pointerup",
    onPointerUp
);

el.pitch.addEventListener(
    "pointercancel",
    onPointerCancel
);

el.hint.addEventListener(
    "click",
    showHint
);

el.next.addEventListener(
    "click",
    nextChallenge
);

el.retry.addEventListener(
    "click",
    startGame
);

el.copyRanking.addEventListener(
    "click",
    copyRanking
);

// ==========================================
// 23. INICIALIZAÇÃO
// ==========================================

renderRanking();
