const API_KEY = "-7k48_CkvejbKrlMf7RwzdQZfWY";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(
  document.getElementById("resultsModal")
);

// 1. Add event listeners to HTML elements
document
  .getElementById("status")
  .addEventListener("click", (e) => getStatus(e));
document.getElementById("submit").addEventListener("click", (e) => postForm(e));

// 4. Tranform form data into a new object with FormData()
async function postForm(e) {
  const form = processOptions(
    new FormData(document.getElementById("checksform"))
  ); //Calling on processOptions function to display for options (9.)

  //   // 8. Listing the options selected in the form
  //   for (let entry of form.entries()) {
  //     console.log(entry);
  //   }

  // 5. Await promise to be fulfilled and POST response
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: API_KEY,
    },
    body: form, // a. Attach form as body of the request
  });
  // b. Turn response into JSON
  const data = await response.json();
  if (response.ok) {
    displayErrors(data); // Change from console.log to call on next defined function and display errors
  } else {
    throw new Error(data.error);
  }
}

// 6. Function that will display errors
function displayErrors(data) {
  let results = "";
  let heading = `JSHint Results for ${data.file}`;
  if (data.total_errors === 0) {
    results = `<div class="no_errors">No errors reported !</div>`;
  } else {
    results = `<div>Total errors: <span class="error_count">${data.total_errors}</span></div>`;
    for (let error of data.error_list) {
      results += `<div>At line <span class="line">${error.line}</span>, `;
      results += `column <span class="column">${error.col}</div></div>`;
      results += `<div class="error">${error.error}</div>`;
    }
  }

  // 7. Update the modal
  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;

  resultsModal.show();
}

// 2. Check the status of the API, convert to JSON and see values
async function getStatus(e) {
  const queryString = `${API_URL}?api_key=${API_KEY}`;

  const response = await fetch(queryString);
  const data = await response.json();

  if (response.ok) {
    displayStatus(data);
  } else {
    throw new Error(data.error);
  }
}

// 3. Update HTML to display the data on page
function displayStatus(data) {
  let heading = "API Key Status";
  let results = `<div>Your key is valid until</div>`;
  results += `<div class="key-status">${data.expiry}</div>`;

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;

  resultsModal.show();
}

// 9. Re-writing 8. console logging PostForm entries to display selected options in a array
function processOptions(form) {
  // Iterate through option
  let optArray = [];
  for (let entry of form.entries()) {
    // Push each value in temporary array
    if (entry[0] === "options") {
      optArray.push(entry[1]);
    }
  }
  // Delete all occurences of "options" in FormData
  form.delete("options");
  // Convert array into a string with "option" as the key
  form.append("options", optArray.join());
  return form;
}
