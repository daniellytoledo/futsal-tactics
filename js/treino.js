
"use strict";

/*
 * PLAYBOOK — MODO TREINO
 *
 * Funcionalidades:
 * - Treino das 7 opções táticas
 * - Arrastar jogadoras com rato ou dedo
 * - Tocar na jogadora e depois no destino
 * - Dicas e pontuação
 * - Classificação semanal no navegador
 */

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // 1. DADOS DAS JOGADAS
    // ========================================

    const TACTICS = {
        canto1: {
            name: "Canto 1",
            players: {
                1: { x: 950, y: 660 },
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
                        "Leva a jogadora 2 até à adversária " +
                        "mais próxima para executar o bloqueio.",
                    target: { x: 780, y: 580 },
                    tolerance: 35
                },
                {
                    player: 3,
                    title: "Desmarcação para o remate",
                    description:
                        "A jogadora 3 desce em linha reta " +
                        "para receber e rematar.",
                    target: { x: 720, y: 492 }
                },
                {
                    player: 4,
                    title: "Ataque ao segundo poste",
                    description:
                        "Coloca a jogadora 4 junto ao " +
                        "segundo poste.",
                    target: { x: 935, y: 275 }
                }
            ]
        },

        canto2: {
            name: "Canto 2",
            players: {
                1: { x: 950, y: 660 },
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
                    title: "Movimento depois do passe",
                    description:
                        "A jogadora 1 desloca-se para " +
                        "a zona inicial da jogadora 4.",
                    target: { x: 910, y: 90 }
                },
                {
                    player: 4,
                    title: "Preparar a finta",
                    description:
                        "Coloca a jogadora 4 entre " +
                        "as jogadoras 3 e 1.",
                    target: { x: 775, y: 105 }
                },
                {
                    player: 4,
                    title: "Atacar o espaço livre",
                    description:
                        "Depois da finta, a jogadora 4 " +
                        "ataca o espaço para rematar.",
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
                        "Leva a jogadora 4 até ao canto.",
                    target: { x: 945, y: 60 }
                },
                {
                    player: 2,
                    title: "Finta curta",
                    description:
                        "A jogadora 2 aproxima-se " +
                        "da cobrança para fazer a finta.",
                    target: { x: 644, y: 280 }
                },
                {
                    player: 2,
                    title: "Regressar",
                    description:
                        "Depois da finta, a jogadora 2 " +
                        "regressa à posição inicial.",
                    target: { x: 628, y: 320 }
                },
                {
                    player: 2,
                    title: "Corrida para o remate",
                    description:
                        "Leva a jogadora 2 até " +
                        "à zona de finalização.",
                    target: { x: 827, y: 350 }
                },
                {
                    player: 4,
                    title: "Primeiro poste",
                    description:
                        "A jogadora 4 desloca-se " +
                        "para o primeiro poste.",
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
                        "A jogadora 4 atravessa o campo, " +
                        "levando o seu marcador.",
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
                    title: "Cobrir o espaço",
                    description:
                        "A jogadora 3 ocupa " +
                        "a posição inicial da jogadora 2.",
                    target: { x: 750, y: 315 }
                },
                {
                    player: 2,
                    title: "Arranque rápido",
                    description:
                        "A jogadora 2 acelera " +
                        "pela linha lateral.",
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
                        "Leva a jogadora 4 " +
                        "para o outro lado do campo.",
                    target: { x: 550, y: 630 }
                },
                {
                    player: 2,
                    title: "Aproximação",
                    description:
                        "A jogadora 2 aproxima-se " +
                        "da cobrança lateral.",
                    target: { x: 750, y: 68 }
                },
                {
                    player: 3,
                    title: "Alternativa de passe",
                    description:
                        "Com a jogadora 2 marcada, " +
                        "coloca a jogadora 3 no espaço livre.",
                    target: { x: 750, y: 315 }
                },
                {
                    player: 2,
                    title: "Arrastar o adversário",
                    description:
                        "A jogadora 2 acelera pela lateral " +
                        "levando o marcador.",
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
                    title: "Preparar o passe longo",
                    description:
                        "A jogadora 4 desloca-se " +
                        "para o outro lado do campo.",
                    target: { x: 550, y: 630 }
                },
                {
                    player: 2,
                    title: "Aproximação marcada",
                    description:
                        "A jogadora 2 aproxima-se " +
                        "da cobrança com a adversária.",
                    target: { x: 750, y: 68 }
                },
                {
                    player: 3,
                    title: "Movimento marcado",
                    description:
                        "A jogadora 3 ocupa o espaço " +
                        "da jogadora 2, acompanhada " +
                        "pela adversária.",
                    target: { x: 750, y: 315 }
                },
                {
                    player: 2,
                    title: "Corrida de distração",
                    description:
                        "A jogadora 2 arranca pela lateral, " +
                        "levando a sua marcadora.",
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
                    title: "Movimento da jogadora 3",
                    description:
                        "Leva a jogadora 3 " +
                        "para a posição inicial da 2.",
                    target: { x: 865, y: 610 }
                },
                {
                    player: 4,
                    title: "Movimento da jogadora 4",
                    description:
                        "Leva a jogadora 4 " +
                        "para a posição inicial da 1.",
                    target: { x: 865, y: 90 }
                },
                {
                    player: 1,
                    title: "Cruzamento em X",
                    description:
                        "A jogadora 1 cruza diagonalmente " +
                        "para a posição inicial da 3.",
                    target: { x: 560, y: 610 }
                },
                {
                    player: 2,
                    title: "Completar o X",
                    description:
                        "A jogadora 2 cruza diagonalmente " +
                        "para a posição inicial da 4.",
                    target: { x: 560, y: 90 }
                }
            ]
        }
    };

    // ========================================
    // 2. ELEMENTOS HTML
    // ========================================

    const $ = (selector) =>
        document.querySelector(selector);

    const el = {
        name: $("#playerName"),
        select: $("#tacticSelect"),
        start: $("#startButton"),

        pitch: $("#trainingPitch"),
        players: $("#playersLayer"),
        defenders: $("#defendersLayer"),
        keeper: $("#keeperLayer"),
        ball: $("#ballLayer"),
        target: $("#targetZone"),

        gameTitle: $("#gameTitle"),
        score: $("#scoreValue"),
        step: $("#stepCounter"),
        progress: $("#progressFill"),

        challengeTitle: $("#challengeTitle"),
        description: $("#challengeDescription"),
        feedback: $("#feedback"),

        hint: $("#hintButton"),
        next: $("#nextButton"),

        resultPanel: $("#resultPanel"),
        resultTitle: $("#resultTitle"),
        resultDescription: $("#resultDescription"),
        retry: $("#retryButton"),

        week: $("#weekLabel"),
        rankingBody: $("#rankingBody"),
        copyRanking: $("#copyRanking")
    };

    // Verifica a ligação entre HTML e JS.
    const missing = Object.entries(el)
        .filter(([, element]) => !element)
        .map(([name]) => name);

    if (missing.length > 0) {
        console.error(
            "Elementos HTML não encontrados:",
            missing
        );

        alert(
            "Não foi possível iniciar o Modo Treino. " +
            "Verifica os IDs do HTML no Console."
        );

        return;
    }

    // ========================================
    // 3. ESTADO DO JOGO
    // ========================================

    let activeTactic = null;
    let activeTacticId = null;
    let activePlayerName = "";

    let positions = {};

    let currentChallenge = 0;
    let totalScore = 0;
    let wrongAttempts = 0;
    let hintUsed = false;

    let awaitingNext = false;
    let gameFinished = false;

    let dragging = null;
    let selectedPlayer = null;

    const TARGET_TOLERANCE = 55;
    const TOUCH_OFFSET = 45;
    const SVG_NS = "http://www.w3.org/2000/svg";

    // ========================================
    // 4. FUNÇÕES AUXILIARES
    // ========================================

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function copyPoint(point) {
        return {
            x: point.x,
            y: point.y
        };
    }

    function distance(a, b) {
        return Math.hypot(
            a.x - b.x,
            a.y - b.y
        );
    }

    function svgElement(tag, attributes = {}) {
        const element = document.createElementNS(
            SVG_NS,
            tag
        );

        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, String(value));
        }

        return element;
    }

    function currentTask() {
        if (!activeTactic) {
            return null;
        }

        return activeTactic.challenges[currentChallenge] || null;
    }

    function setFeedback(message, error = false) {
        el.feedback.textContent = message;
        el.feedback.classList.toggle("error", error);
    }

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
            x: clamp(result.x, 24, 976),
            y: clamp(result.y, 24, 676)
        };
    }

    // ========================================
    // 5. DESENHAR O CAMPO
    // ========================================

    function drawField() {
        el.players.replaceChildren();
        el.defenders.replaceChildren();
        el.keeper.replaceChildren();
        el.ball.replaceChildren();

        if (!activeTactic) {
            return;
        }

        activeTactic.defenders.forEach((position) => {
            const circle = svgElement("circle", {
                cx: position.x,
                cy: position.y,
                r: 21,
                class: "training-defender"
            });

            el.defenders.appendChild(circle);
        });

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

        el.ball.appendChild(
            svgElement("circle", {
                cx: activeTactic.ball.x,
                cy: activeTactic.ball.y,
                r: 10,
                class: "training-ball"
            })
        );

        for (let number = 1; number <= 4; number++) {
            const group = svgElement("g", {
                "data-player": number,
                class: "training-player"
            });

            // Área invisível maior para o dedo.
            group.appendChild(
                svgElement("circle", {
                    r: 43,
                    class: "touch-area",
                    fill: "transparent",
                    stroke: "none",
                    "pointer-events": "all"
                })
            );

            group.appendChild(
                svgElement("circle", {
                    r: 23
                })
            );

            const label = svgElement("text", {
                y: 8
            });

            label.textContent = number;

            group.appendChild(label);
            el.players.appendChild(group);
        }

        updatePlayers();
    }

    // ========================================
    // 6. ATUALIZAR POSIÇÕES
    // ========================================

    function updatePlayers() {
        const task = currentTask();

        for (let number = 1; number <= 4; number++) {
            const group = el.players.querySelector(
                `[data-player="${number}"]`
            );

            if (!group || !positions[number]) {
                continue;
            }

            const position = positions[number];

            group.setAttribute(
                "transform",
                `translate(${position.x} ${position.y})`
            );

            const draggable =
                task &&
                !awaitingNext &&
                !gameFinished &&
                task.player === number;

            group.classList.toggle(
                "draggable",
                Boolean(draggable)
            );

            group.classList.toggle(
                "selected",
                selectedPlayer === number
            );
        }
    }

    // ========================================
    // 7. INICIAR TREINO
    // ========================================

    function startGame() {
        const name = el.name.value.trim();
        const tacticId = el.select.value;

        if (!name) {
            setFeedback(
                "Escreve o teu nome para começar.",
                true
            );

            el.name.focus();
            return;
        }

        const tactic = TACTICS[tacticId];

        if (!tactic) {
            setFeedback(
                "A jogada selecionada não existe.",
                true
            );
            return;
        }

        activePlayerName = name;
        activeTacticId = tacticId;
        activeTactic = tactic;

        positions = {};

        for (let number = 1; number <= 4; number++) {
            positions[number] = copyPoint(
                tactic.players[number]
            );
        }

        currentChallenge = 0;
        totalScore = 0;
        wrongAttempts = 0;
        hintUsed = false;

        awaitingNext = false;
        gameFinished = false;
        dragging = null;
        selectedPlayer = null;

        el.score.textContent = "0";
        el.gameTitle.textContent = tactic.name;

        el.resultPanel.hidden = true;
        el.target.setAttribute("visibility", "hidden");

        drawField();
        showChallenge();
    }

    // ========================================
    // 8. APRESENTAR DESAFIO
    // ========================================

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
        const total = activeTactic.challenges.length;

        el.progress.style.width =
            `${completed / total * 100}%`;

        el.hint.disabled = false;
        el.hint.textContent = "Mostrar dica";

        el.next.disabled = true;
        el.next.textContent = "Próxima posição";

        el.target.setAttribute("visibility", "hidden");

        setFeedback(
            `Seleciona e movimenta a jogadora ${task.player}. ` +
            "Podes arrastar ou tocar no destino."
        );

        updatePlayers();
    }

    // ========================================
    // 9. AVALIAR A POSIÇÃO
    // ========================================

    function evaluatePosition(number, origin) {
        const task = currentTask();

        if (
            !task ||
            awaitingNext ||
            gameFinished ||
            number !== task.player
        ) {
            return;
        }

        const position = positions[number];

        const difference = distance(
            position,
            task.target
        );

        const tolerance =
            task.tolerance ?? TARGET_TOLERANCE;

        if (difference <= tolerance) {
            const penalty = wrongAttempts * 15;
            const hintPenalty = hintUsed ? 25 : 0;

            const points = Math.max(
                20,
                100 - penalty - hintPenalty
            );

            totalScore += points;

            positions[number] = copyPoint(
                task.target
            );

            awaitingNext = true;
            selectedPlayer = null;

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

            // Não perde a posição anterior.
            positions[number] = copyPoint(origin);

            selectedPlayer = null;

            setFeedback(
                "Ainda não é a posição correta. " +
                "Tenta novamente ou usa a dica.",
                true
            );
        }

        updatePlayers();
    }

    // ========================================
    // 10. INICIAR TOQUE OU ARRASTO
    // ========================================

    function onPointerDown(event) {
        if (
            !activeTactic ||
            awaitingNext ||
            gameFinished
        ) {
            return;
        }

        const task = currentTask();

        if (!task) {
            return;
        }

        const group = event.target.closest(
            "[data-player]"
        );

        const pointer = pointerToPitch(event);

        if (!pointer) {
            return;
        }

        // Tocou numa jogadora.
        if (group) {
            const number = Number(
                group.getAttribute("data-player")
            );

            if (number !== task.player) {
                setFeedback(
                    `Nesta etapa movimenta a jogadora ${task.player}.`,
                    true
                );
                return;
            }

            event.preventDefault();

            selectedPlayer = number;

            const origin = copyPoint(
                positions[number]
            );

            dragging = {
                number,
                pointerId: event.pointerId,
                pointerType: event.pointerType,

                origin,

                startPointer: copyPoint(pointer),

                offsetX: origin.x - pointer.x,
                offsetY: origin.y - pointer.y,

                moved: false
            };

            try {
                el.pitch.setPointerCapture(
                    event.pointerId
                );
            } catch (error) {
                // Alguns navegadores não suportam
                // captura de determinados toques.
            }

            updatePlayers();

            setFeedback(
                `Jogadora ${number} selecionada. ` +
                "Arrasta ou toca no destino."
            );

            return;
        }

        // Tocou num ponto do campo após
        // selecionar uma jogadora.
        if (selectedPlayer === task.player) {
            event.preventDefault();

            const number = selectedPlayer;

            const origin = copyPoint(
                positions[number]
            );

            positions[number] = copyPoint(pointer);

            evaluatePosition(number, origin);
        }
    }

    // ========================================
    // 11. ARRASTAR
    // ========================================

    function onPointerMove(event) {
        if (
            !dragging ||
            event.pointerId !== dragging.pointerId
        ) {
            return;
        }

        const pointer = pointerToPitch(event);

        if (!pointer) {
            return;
        }

        const movement = distance(
            pointer,
            dragging.startPointer
        );

        // Evita considerar um simples toque
        // como movimento.
        if (!dragging.moved && movement < 12) {
            return;
        }

        dragging.moved = true;

        event.preventDefault();

        // Converte o deslocamento acima do dedo
        // para uma distância visual aproximada.
        const isTouch =
            dragging.pointerType === "touch";

        const offsetY = isTouch
            ? TOUCH_OFFSET
            : 0;

        positions[dragging.number] = {
            x: clamp(
                pointer.x + dragging.offsetX,
                24,
                976
            ),

            y: clamp(
                pointer.y + dragging.offsetY - offsetY,
                24,
                676
            )
        };

        updatePlayers();
    }

    // ========================================
    // 12. TERMINAR O ARRASTO
    // ========================================

    function onPointerUp(event) {
        if (
            !dragging ||
            event.pointerId !== dragging.pointerId
        ) {
            return;
        }

        const data = dragging;

        dragging = null;

        try {
            if (
                el.pitch.hasPointerCapture(
                    event.pointerId
                )
            ) {
                el.pitch.releasePointerCapture(
                    event.pointerId
                );
            }
        } catch (error) {
            // Ignora caso o navegador já tenha
            // terminado a captura.
        }

        // Um toque curto apenas seleciona.
        if (!data.moved) {
            selectedPlayer = data.number;

            updatePlayers();

            setFeedback(
                `Jogadora ${data.number} selecionada. ` +
                "Agora toca no destino no campo."
            );

            return;
        }

        // Se arrastou, avalia a posição.
        selectedPlayer = null;

        evaluatePosition(
            data.number,
            data.origin
        );
    }

    // ========================================
    // 13. CANCELAR ARRASTO
    // ========================================

    function onPointerCancel(event) {
        if (
            !dragging ||
            event.pointerId !== dragging.pointerId
        ) {
            return;
        }

        positions[dragging.number] =
            copyPoint(dragging.origin);

        dragging = null;
        selectedPlayer = null;

        updatePlayers();
    }

    // ========================================
    // 14. MOSTRAR DICA
    // ========================================

    function showHint() {
        const task = currentTask();

        if (!task || awaitingNext || gameFinished) {
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

        el.hint.disabled = true;
        el.hint.textContent = "Dica ativada";

        setFeedback(
            "A área verde indica a posição correta. " +
            "A dica reduz 25 pontos."
        );
    }

    // ========================================
    // 15. PRÓXIMO DESAFIO
    // ========================================

    function nextChallenge() {
        if (!awaitingNext || !activeTactic) {
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
        selectedPlayer = null;
        dragging = null;

        showChallenge();
    }

    // ========================================
    // 16. IDENTIFICAR SEMANA
    // ========================================

    function getWeekInfo() {
        const today = new Date();

        today.setHours(12, 0, 0, 0);

        const daysFromMonday =
            (today.getDay() + 6) % 7;

        const monday = new Date(today);

        monday.setDate(
            today.getDate() - daysFromMonday
        );

        const sunday = new Date(monday);

        sunday.setDate(
            monday.getDate() + 6
        );

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

    function storageKey() {
        return (
            "futsal-playbook-ranking-" +
            getWeekInfo().key
        );
    }

    // ========================================
    // 17. CARREGAR CLASSIFICAÇÃO
    // ========================================

    function loadRanking() {
        try {
            const raw = localStorage.getItem(
                storageKey()
            );

            if (!raw) {
                return {};
            }

            const data = JSON.parse(raw);

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

    // ========================================
    // 18. GUARDAR PONTUAÇÃO
    // ========================================

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

        const maximum =
            activeTactic.challenges.length * 100;

        // Todas as táticas valem até 100 pontos.
        const normalizedScore = Math.round(
            totalScore / maximum * 100
        );

        const previous = Number(
            ranking[nameKey].scores[activeTacticId]
        ) || 0;

        ranking[nameKey].scores[activeTacticId] =
            Math.max(
                previous,
                normalizedScore
            );

        try {
            localStorage.setItem(
                storageKey(),
                JSON.stringify(ranking)
            );

            return true;
        } catch (error) {
            return false;
        }
    }

    // ========================================
    // 19. TERMINAR TREINO
    // ========================================

    function finishGame() {
        gameFinished = true;
        awaitingNext = false;
        selectedPlayer = null;
        dragging = null;

        const maximum =
            activeTactic.challenges.length * 100;

        const percentage = Math.round(
            totalScore / maximum * 100
        );

        const saved = saveResult();

        el.score.textContent = totalScore;

        el.progress.style.width = "100%";

        el.step.textContent =
            `${activeTactic.challenges.length} / ` +
            activeTactic.challenges.length;

        el.hint.disabled = true;
        el.next.disabled = true;

        el.target.setAttribute(
            "visibility",
            "hidden"
        );

        el.resultPanel.hidden = false;

        el.resultTitle.textContent =
            `${percentage}% de aproveitamento`;

        el.resultDescription.textContent =
            `${activePlayerName}, conseguiste ` +
            `${totalScore} de ${maximum} pontos em ` +
            `${activeTactic.name}. ` +
            (
                saved
                    ? "O teu melhor resultado foi guardado."
                    : "Não foi possível guardar o resultado."
            );

        setFeedback(
            "Treino concluído! Podes repetir " +
            "para melhorar a tua pontuação."
        );

        updatePlayers();
        renderRanking();
    }

    // ========================================
    // 20. CALCULAR CLASSIFICAÇÃO
    // ========================================

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

                const total = scores.reduce(
                    (sum, score) =>
                        sum + (
                            Number.isFinite(score)
                                ? score
                                : 0
                        ),
                    0
                );

                return {
                    name: entry.name,
                    played: scores.length,
                    total
                };
            })
            .sort((a, b) =>
                b.total - a.total ||
                a.name.localeCompare(b.name)
            );
    }

    // ========================================
    // 21. MOSTRAR CLASSIFICAÇÃO
    // ========================================

    function renderRanking() {
        const rows = getRankingRows();

        el.week.textContent = getWeekInfo().label;

        el.rankingBody.replaceChildren();

        if (!rows.length) {
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

    // ========================================
    // 22. COPIAR CLASSIFICAÇÃO
    // ========================================

    async function copyRanking() {
        const rows = getRankingRows();

        const lines = [
            "PLAYBOOK — CLASSIFICAÇÃO SEMANAL",
            getWeekInfo().label,
            ""
        ];

        if (!rows.length) {
            lines.push("Sem resultados.");
        }

        rows.forEach((entry, index) => {
            lines.push(
                `${index + 1}º · ${entry.name} — ` +
                `${entry.total} pontos ` +
                `(${entry.played}/7 jogadas)`
            );
        });

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

    // ========================================
    // 23. EVENTOS DOS BOTÕES
    // ========================================

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

    // Permite começar com Enter no nome.
    el.name.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                startGame();
            }
        }
    );

    // ========================================
    // 24. INICIALIZAÇÃO
    // ========================================

    renderRanking();

    console.log(
        "Playbook — Modo Treino carregado."
    );

});
