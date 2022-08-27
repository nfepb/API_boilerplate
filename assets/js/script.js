const API_KEY = "-7k48_CkvejbKrlMf7RwzdQZfWY";
const API_URL = "https://ci-jshint.herokuapp.com/api?api_key=";
const resultsModal = new bootstrap.Modal(
  document.getElementById("resultsModal")
);

document
  .getElementById("status")
  .addEventListener("click", (e) => getStatus(e));

async function getStatus(e) {
  const queryString = `${API_URL}${API_KEY}`;

  const response = await fetch(queryString);
  const data = await response.json();

  if (response.ok) {
    displayStatus(data);
  } else {
    throw Error(data.error);
  }
}

function displayStatus(data) {
  let heading = "API Key Status";
  let results = `<div>Your key is valid until</div>`;
  results += `<div class="key-status">${data.expiry}</div>`;

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;

  resultsModal.show();
}
