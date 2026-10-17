// Pequenas melhorias progressivas para a página inicial.
const playCards = document.querySelectorAll(".play-card");
const playCount = document.querySelector("#play-count");

if (playCount) {
  playCount.textContent = String(playCards.length).padStart(2, "0");
}
