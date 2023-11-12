import { Scene, Act, Play } from "./play-module.js";

document.addEventListener("DOMContentLoaded", function () {
  // API URL for fetching Shakespeare play data
  const apiUrl = 'https://www.randyconnolly.com//funwebdev/3rd/api/shakespeare/play.php';
  
  // DOM elements
  const playListDropdown = document.querySelector("#playList");
  const playHereContainer = document.querySelector("#playHere");
  const playOptionsContainer = document.querySelector("#interface");
  const actListDropdown = playOptionsContainer.querySelector("#actList");
  const sceneListDropdown = playOptionsContainer.querySelector("#sceneList");
  const playerListDropdown = playOptionsContainer.querySelector("#playerList");

  // Hide play options initially
  playOptionsContainer.style.display = "none";

  // Event listener for play selection change
  playListDropdown.addEventListener("change", (event) => {
    // Create a new API URL based on the selected play
    const newApiUrl = createApiUrl(apiUrl, event.target.value);

    // Clear act dropdown
    actListDropdown.innerHTML = "";

    // Fetch play data from the API
    fetch(newApiUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch JSON data');
        }
      })
      .then(playData => {
        console.log(playData);
        // Display play options
        playOptionsContainer.style.display = "block";
        playerListDropdown.innerHTML = "";

        // Create a new Play object
        var newPlay = new Play(playData.title, playData.short, playData.persona, playData.acts);
        // Display filtered speeches
        filterAndDisplaySpeeches(newPlay, 0, 0, "", "0");

        // Populate act dropdown
        populateActList(actListDropdown, playData);

        // Event listener for act selection change
        actListDropdown.addEventListener("change", (event) => {
          const actIndex = event.target.options[event.target.selectedIndex].id;
          sceneListDropdown.innerHTML = "";

          // Populate scenes dropdown based on the selected act
          populateScenesList(sceneListDropdown, playData, actIndex);

          // Event listener for scene selection change
          sceneListDropdown.addEventListener("change", (event) => {
            const sceneIndex = event.target.options[event.target.selectedIndex].id;
            console.log("sceneIndex");
            console.log(sceneIndex);

            // Event listener for filter button click
            var filterButton = document.getElementById("btnHighlight");
            filterButton.addEventListener("click", (e) => {
              console.log("I am coming from filter button");
              console.log(actIndex);
              console.log(sceneIndex);
              const searchText = txtHighlight.value;
              console.log(searchText);
              const selectedPlayer = playerListDropdown.value;
              filterAndDisplaySpeeches(playData, actIndex, sceneIndex, searchText, selectedPlayer);
            });
          });
        });

        // Populate player dropdown
        populatePlayerList(playerListDropdown, playData.persona);
      });
  });

  // Function to filter and display speeches
  function filterAndDisplaySpeeches(play, actIndex, sceneIndex, searchText, selectedPlayer) {
    const selectedAct = play.acts[actIndex];
    if (selectedAct) {
      const selectedScene = selectedAct.scenes[sceneIndex];
      if (selectedScene) {
        let filteredSpeeches = selectedScene.speeches;
        console.log('Search Text:', searchText);
        // Check if search text is provided
        if (searchText.trim() !== "") {
          const lowerCaseSearchText = searchText.toLowerCase().trim();

          filteredSpeeches = filteredSpeeches.filter((speech) => {
            const lineIncludesSearchText = speech.lines.some((line) =>
              line.toLowerCase().includes(lowerCaseSearchText)
            );

            // Return the entire speech.lines array if any line includes the searchText
            return lineIncludesSearchText ? speech.lines : null;
          });

          // Remove null values from the filteredSpeeches array
          filteredSpeeches = filteredSpeeches.filter((lines) => lines !== null);
        }

        console.log("filteredspeech: ", filteredSpeeches);

        // Check if a specific player is selected
        if (selectedPlayer !== "0") {
          filteredSpeeches = filteredSpeeches.filter((speech) => {
            return speech.speaker === selectedPlayer;
          });
        }

        console.log('Filtered Speeches:', filteredSpeeches);

        // Display the filtered speeches
        const actScene = new Act(selectedAct.name, [{ ...selectedScene, speeches: filteredSpeeches }]);
        playHereContainer.innerHTML = "";
        playHereContainer.appendChild(actScene.makeAct(searchText));
      }
    }
  }

  // Function to create API URL
  function createApiUrl(apiUrl, value) {
    return apiUrl + "?name=" + value;
  }

  // Function to populate act dropdown
  function populateActList(actListDropdown, data) {
    var optionElement = document.createElement("option");
    optionElement.textContent = "Choose an Act";
    optionElement.id = -1;
    actListDropdown.appendChild(optionElement);

    for (var i = 0; i < data.acts.length; i++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = data.acts[i].name;
      optionElement.id = i;
      actListDropdown.appendChild(optionElement);
    }
  }

  // Function to populate scene dropdown
  function populateScenesList(sceneListDropdown, data, actIndex) {
    var optionElement = document.createElement("option");
    optionElement.textContent = "Choose a Scene";
    optionElement.id = -1;
    sceneListDropdown.appendChild(optionElement);

    console.log("andar aage");
    console.log(data.acts[actIndex].name);
    for (var j = 0; j < data.acts[actIndex].scenes.length; j++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = data.acts[actIndex].scenes[j].name;
      optionElement.id = j;
      sceneListDropdown.appendChild(optionElement);
    }
  }

  // Function to populate player dropdown
  function populatePlayerList(playerListDropdown, personaData) {
    var optionElement = document.createElement("option");
    optionElement.textContent = "All Players";
    optionElement.value = "0";
    playerListDropdown.appendChild(optionElement);

    for (var j = 0; j < personaData.length; j++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = personaData[j].player;
      optionElement.value = personaData[j].player;
      playerListDropdown.appendChild(optionElement);
    }
  }
});
