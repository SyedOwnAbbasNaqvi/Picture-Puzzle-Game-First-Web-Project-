const API_URL =
"http://localhost:3000/scores";

const tableBody =
document.getElementById(
  "adminTableBody"
);

/* =========================
   INITIALIZE
========================= */

document.addEventListener(
"DOMContentLoaded",
loadScores
);

/* =========================
   LOAD SCORES
========================= */

async function loadScores(){

  try{

    const response =
    await fetch(API_URL);

    if(!response.ok){

      throw new Error(
        "Failed to fetch scores"
      );
    }

    const scores =
    await response.json();

    renderTable(scores);

    renderStats(scores);

  }catch(error){

    tableBody.innerHTML =

    `
    <tr>
      <td colspan="6">
        ${error.message}
      </td>
    </tr>
    `;
  }
}
/* =========================
   RENDER TABLE
========================= */

function renderTable(scores){

  tableBody.innerHTML =
  scores.map(score =>

    `
    <tr>

      <td>
        ${score.playerName}
      </td>

      <td>
        ${score.difficulty}
      </td>

      <td>
        ${score.time}s
      </td>

      <td>
        ${score.moves}
      </td>

      <td>
        ${score.date}
      </td>

      <td>

        <button
        class="edit-btn"
        onclick="editScore('${score.id}')">

        Edit

        </button>

        <button
        class="delete-btn"
        onclick="deleteScore('${score.id}')">

        Delete

        </button>

      </td>

    </tr>
    `
  ).join("");
}

/* =========================
   RENDER STATS
========================= */

function renderStats(scores){

  document.getElementById(
    "totalPlayers"
  ).textContent =
  scores.length;

  const averageMoves =

  scores.reduce(
    (sum,score)=>

    sum + score.moves,

    0

  ) / scores.length || 0;

  document.getElementById(
    "averageMoves"
  ).textContent =
  Math.round(averageMoves);

  const bestTime =

  scores.length > 0

  ?

  Math.min(
    ...scores.map(
      score => score.time
    )
  )

  :

  0;

  document.getElementById(
    "bestTime"
  ).textContent =
  bestTime;
}

/* =========================
   DELETE SCORE
========================= */

async function deleteScore(id){

  const confirmDelete =
  confirm(
    "Delete this score?"
  );

  if(!confirmDelete){

    return;
  }

  try{

    const response =
    await fetch(

      `${API_URL}/${id}`,

      {
        method:"DELETE"
      }
    );

    if(!response.ok){

      throw new Error(
        "Delete failed"
      );
    }

    await loadScores();

  }catch(error){

    alert(error.message);
  }
}

/* =========================
   EDIT SCORE
========================= */

async function editScore(id){

  const updatedName =
  prompt(
    "Enter updated player name:"
  );

  if(!updatedName){

    return;
  }

  try{

    const response =
    await fetch(

      `${API_URL}/${id}`,

      {

        method:"PATCH",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          playerName:
          updatedName

        })
      }
    );

    if(!response.ok){

      throw new Error(
        "Update failed"
      );
    }

    await loadScores();

  }catch(error){

    alert(error.message);
  }
}

/* =========================
   GLOBAL FUNCTIONS
========================= */

window.editScore =
editScore;

window.deleteScore =
deleteScore;