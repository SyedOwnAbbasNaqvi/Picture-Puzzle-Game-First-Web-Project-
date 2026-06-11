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