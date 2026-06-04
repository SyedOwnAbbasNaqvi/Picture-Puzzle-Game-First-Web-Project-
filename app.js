const API_URL ="http://localhost:3000/scores";
const board =document.getElementById("puzzleBoard");
const tray =document.getElementById("pieceTray");
const referenceImage =document.getElementById("referenceImage");
const timerEl =document.getElementById("timer");
const movesEl =document.getElementById("moves");
const progressEl =document.getElementById("progress");
const uploadInput =document.getElementById("uploadInput");
const difficultySelect =document.getElementById("difficulty");
const playerNameInput =document.getElementById("playerName");
const startBtn =document.getElementById("startBtn");
const canvas =document.getElementById("hiddenCanvas");
const ctx =canvas.getContext("2d");
let currentImage = "";
let gridSize = 4;
let moves = 0;
let timer = 0;
let interval;
let correctCount = 0;
let boardCells = [];

/* =========================
   INITIALIZE
========================= */

document.addEventListener(
"DOMContentLoaded",
() => {

  const activeImg = document.querySelector(
    ".saved-img.active-image"
  );
  if(activeImg){

    currentImage =activeImg.src;

    referenceImage.src =currentImage;
  }

  showLeaderboard();
}
);

/* =========================
   SELECT IMAGE
========================= */

function selectDefaultImage(img){

  document
  .querySelectorAll(".saved-img")
  .forEach(image => {

    image.classList.remove( "active-image" );
  });

  img.classList.add(
    "active-image"
  );

  currentImage =
  img.src;

  referenceImage.src =
  currentImage;
}

/* =========================
   IMAGE UPLOAD
========================= */

uploadInput.addEventListener(
"change",
function(e){

  const file =
  e.target.files[0];

  if(!file){

    return;
  }

  const reader =
  new FileReader();

  reader.onload =
  function(event){

    currentImage =
    event.target.result;

    referenceImage.src =
    currentImage;

    document
    .querySelectorAll(".saved-img")
    .forEach(img => {

      img.classList.remove(
        "active-image"
      );
    });
  };

  reader.readAsDataURL(file);
}
);

/* =========================
   START GAME
========================= */

startBtn.addEventListener(
"click",
startGame
);

function startGame(){
  const playerName = playerNameInput.value.trim();
  const nameError =document.getElementById( "nameError" );
  nameError.textContent = "";
  if(playerName === ""){
    nameError.textContent = "Please enter player name";
   return;
  }
  if(playerName.length < 3){
    nameError.textContent ="Minimum 3 characters required";
    return;
  }
  gridSize =
  parseInt(
    difficultySelect.value
  );
  resetGame();
  createBoard();
  generatePieces();
  startTimer();
}

/* =========================
   RESET GAME
========================= */

function resetGame(){
  moves = 0;
  timer = 0;
  correctCount = 0;
  movesEl.textContent = 0;
  timerEl.textContent = 0;
  progressEl.textContent = 0;
  clearInterval(interval);
  board.innerHTML = "";
  tray.innerHTML = "";
}

/* =========================
   TIMER
========================= */

function startTimer(){
  interval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;},1000);
}