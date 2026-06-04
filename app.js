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

/* =========================
   CREATE BOARD
========================= */

function createBoard(){

  board.innerHTML = "";

  board.style.gridTemplateColumns =
  `repeat(${gridSize},100px)`;

  boardCells = [];

  for(
    let i = 0;
    i < gridSize * gridSize;
    i++
  ){

    const cell =
    document.createElement("div");

    cell.classList.add("cell");

    cell.dataset.index = i;

    cell.addEventListener(
      "dragover",
      handleDragOver
    );

    cell.addEventListener(
      "dragleave",
      handleDragLeave
    );

    cell.addEventListener(
      "drop",
      handleDrop
    );

    board.appendChild(cell);

    boardCells.push(cell);
  }
}

/* =========================
   GENERATE PIECES
========================= */

function generatePieces(){

  tray.innerHTML = "";

  const image =
  new Image();

  image.src =
  currentImage;

  image.onload = () => {

    const size = 500;

    canvas.width = size;

    canvas.height = size;

    ctx.clearRect(
      0,
      0,
      size,
      size
    );

    ctx.drawImage(
      image,
      0,
      0,
      size,
      size
    );

    const pieceSize =
    size / gridSize;

    const pieces = [];

    for(
      let row = 0;
      row < gridSize;
      row++
    ){

      for(
        let col = 0;
        col < gridSize;
        col++
      ){

        const pieceCanvas = document.createElement(
          "canvas"
        );
        pieceCanvas.width =pieceSize;
        pieceCanvas.height =pieceSize;
        const pctx = pieceCanvas.getContext("2d");
        pctx.drawImage(
          canvas,

          col * pieceSize,
          row * pieceSize,

          pieceSize,
          pieceSize,

          0,
          0,

          pieceSize,
          pieceSize
        );

        const piece =
        document.createElement(
          "div"
        );

        piece.classList.add(
          "piece"
        );

        const correctIndex =row * gridSize + col;

        piece.dataset.correctIndex =
        correctIndex;

        piece.id =
        `piece-${correctIndex}`;

        piece.draggable = true;

        piece.style.backgroundImage =
        `url(${pieceCanvas.toDataURL()})`;

        piece.addEventListener(
          "dragstart",
          handleDragStart
        );

        pieces.push(piece);
      }
    }

    shuffleArray(pieces);

    pieces.forEach(piece => {

      tray.appendChild(piece);

    });
  };
}

/* =========================
   SHUFFLE
========================= */

function shuffleArray(array){

  for(
    let i = array.length - 1;
    i > 0;
    i--
  ){

    const j =
    Math.floor(
      Math.random() * (i + 1)
    );

    [array[i],array[j]] =
    [array[j],array[i]];
  }
}

/* =========================
   DRAG EVENTS
========================= */

function handleDragStart(e){

  e.dataTransfer.setData(
    "text/plain",
    e.target.id
  );
}

function handleDragOver(e){

  e.preventDefault();

  e.currentTarget.classList.add(
    "drag-over"
  );
}

function handleDragLeave(e){

  e.currentTarget.classList.remove(
    "drag-over"
  );
}
/* =========================
   DROP EVENT
========================= */

function handleDrop(e){
  e.preventDefault();
  const cell = e.currentTarget;
  cell.classList.remove(
    "drag-over"
  );
  const pieceId = e.dataTransfer.getData( "text/plain");
  const draggedPiece =document.getElementById(pieceId);
  if(!draggedPiece){
    return;
  }
  const existingPiece =cell.querySelector(".piece");
  if(existingPiece){
    tray.appendChild( existingPiece);
  }
  cell.innerHTML = "";
  cell.appendChild( draggedPiece );
  moves++;
  movesEl.textContent = moves;
checkAllPieces();
}
/* =========================
   CHECK PIECES
========================= */

function checkAllPieces(){

  correctCount = 0;

  boardCells.forEach(cell => {

    const piece =
    cell.querySelector(
      ".piece"
    );

    if(!piece){

      return;
    }

    const cellIndex =
    parseInt(
      cell.dataset.index
    );

    const correctIndex =
    parseInt(
      piece.dataset.correctIndex
    );

    if(cellIndex === correctIndex){

      piece.classList.add(
        "correct"
      );

      correctCount++;

    }else{

      piece.classList.remove(
        "correct"
      );
    }
  });

  updateProgress();

  checkWin();
}

/* =========================
   UPDATE PROGRESS
========================= */

function updateProgress(){

  const total =
  gridSize * gridSize;

  const progress =
  Math.round(
    (correctCount / total) * 100
  );

  progressEl.textContent =
  progress;
}

/* =========================
   CHECK WIN
========================= */

async function checkWin(){

  const total =
  gridSize * gridSize;

  if(correctCount === total){

    clearInterval(interval);

    try{

      await saveScore(

        playerNameInput.value,

        timer,

        moves
      );

      await showLeaderboard();

      setTimeout(() => {

        alert(
          `🎉 Puzzle Completed!\n\nTime: ${timer}s\nMoves: ${moves}`
        );

      },300);

    }catch(error){

      document.getElementById(
        "errorMessage"
      ).textContent =
      error.message;
    }
  }
}

/* =========================
   SAVE SCORE
========================= */

async function saveScore(
  name,
  time,
  moves
){

  try{

    const response =
    await fetch(API_URL,{

      method:"POST",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:JSON.stringify({

        playerName:name,

        difficulty:
        `${gridSize}x${gridSize}`,

        time,

        moves,

        date:new Date()
        .toLocaleDateString()
      })
    });

    if(!response.ok){

      throw new Error(
        "Failed to save score"
      );
    }

  }catch(error){

    throw error;
  }
}

/* =========================
   SHOW LEADERBOARD
========================= */

async function showLeaderboard(){

  const list =document.getElementById( "leaderboardList");

  try{

    const response =
    await fetch(API_URL);

    if(!response.ok){

      throw new Error(
        "Failed to fetch leaderboard"
      );
    }

    const scores =
    await response.json();

    if(scores.length === 0){

      list.innerHTML ="<p>No scores yet 🎯</p>";

      return;
    }

    scores.sort((a,b) => {

      if(a.time !== b.time){

        return a.time - b.time;
      }

      return a.moves - b.moves;
    });

    list.innerHTML =
    scores.slice(0,10)
    .map((score,index)=>

      `
      <p>
        ${index + 1}.
        ${score.playerName}
        <br>
        ⏱ ${score.time}s
        •
        🎯 ${score.moves}
      </p>
      `
    ).join("");

  }catch(error){

    document.getElementById(
      "errorMessage"
    ).textContent =error.message;
  }
}