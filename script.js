//You can edit ALL of the code here

// ## Requirements

// 1. All episodes must be shown
// 2. For each episode, _at least_ following must be displayed:
//    1. The name of the episode
//    2. The season number
//    3. The episode number
//    4. The medium-sized image for the episode
//    5. The summary text of the episode
// 3. Combine season number and episode number into an **episode code**:
//    1. Each part should be zero-padded to two digits.
//    2. Example: `S02E07` would be the code for the 7th episode of the 2nd season. `S2E7` would be incorrect.
// 4. Your page should state somewhere that the data has (originally) come from [TVMaze.com]([https://tvmaze.com/](https://tvmaze.com/)), and link back to that site (or the specific episode on that site). See [tvmaze.com/api#licensing]([https://www.tvmaze.com/api#licensing](https://www.tvmaze.com/api#licensing)).
// name: "Winter is Coming",
//       season: 1,
//       number: 1,
//       airdate: "2011-04-17",
//       airtime: "21:00",
//       airstamp: "2011-04-18T01:00:00+00:00",

const rootElem = document.getElementById("root");

const searchInput = document.querySelector("#search-input"); //get elements from HTML
const episodeCount = document.querySelector("#episode-count");
const episodeSelector = document.querySelector("#episode-selector");
const showAllButton = document.querySelector("#show-all-button"); //for bonus part
const showSelector = document.querySelector("#show-selector"); //for show select
 

let allEpisodes = [];
let cachedEpisodes = {}; //this variable stores episodes that we already fetched

// ==================== SHOW SELECTOR ====================
// When the user selects a different show, load and display the episodes for that show
showSelector.addEventListener("change", function () {

  const selectedShowId = showSelector.value; //selectedShowID will store the selected show ID
  loadEpisodes(selectedShowId); 
});

// ==================== SETUP ====================
// setup () for Runs once when the page loads
async function setup() {
  const allShowUrl = "https://api.tvmaze.com/shows";
   
  rootElem.textContent = "Loading episodes..."; //shows this message when episode data is loading

  //fetch for all shows
  try {
    const response = await fetch(allShowUrl);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const allShows = await response.json(); 
    allShows.sort((show1, show2) => { //sorting show name alphabetically, ignoring case
      if(show1.name.toLowerCase() > show2.name.toLowerCase()){
      return 1;
      }
    else if(show1.name.toLowerCase() < show2.name.toLowerCase()){
      return -1;
    }
    return 0;
});
    createShowSelector(allShows); // create the show dropdown
    showSelector.value = allShows[0].id; //dropdown's first selected value matches the first show's ID
    loadEpisodes(allShows[0].id);  // load episodes for the first show

  } catch (error) {
    console.error(error.message);
    rootElem.textContent =
      "Sorry, we couldn't load the shows. Please try again.";
  }
  makeFooter(); //add footer only once
} 


// ==================== LOAD EPISODES ====================
// matches the selected show to its episodes
async function loadEpisodes(showId){
  const showUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

  if(cachedEpisodes[showId]){ //episodes for this show are already saved in cachedEpisodes
    allEpisodes = cachedEpisodes[showId]; //put those saved episodes into allEpisodes
  }
 else{ //if not saved in cachedEpisodes, then fetch
//fetch for all episodes
  try {
    
    const response = await fetch(showUrl);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    allEpisodes = await response.json();
    cachedEpisodes[showId] = allEpisodes; //save the fetched episodes for this show so we don't fetch them again
    
  } catch (error) {
    console.error(error.message);
    rootElem.textContent =
      "Sorry, we couldn't load the episodes. Please try again.";
      return;
  }
  }
   // display episodes and update the episode dropdown
  makePageForEpisodes(allEpisodes);
 createEpisodeSelector(allEpisodes);
}

// ==================== CREATE SHOW SELECTOR ====================
function createShowSelector(showList) {
    for (const show of showList) {
      //loop through each show
        const optionElement = document.createElement("option"); //create option for each element
        optionElement.textContent = show.name; //create show name
        optionElement.value = show.id; //create show id
         showSelector.append(optionElement); //put the option just created in to the show selector
    }
}

// ==================== CREATE EPISODE SELECTOR ====================
function createEpisodeSelector(episodeList) {

  episodeSelector.innerHTML = ""; //clear old episodes, only shows episodes for new show
  // for creating episode selector
  for (const episode of episodeList) {
    //loop through each episode
    const optionElement = document.createElement("option"); //create option for each element

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number, // create episode code
    ).padStart(2, "0")}`;

    optionElement.textContent = `${episodeCode} - ${episode.name}`; // create option text

    optionElement.value = episode.id; //The value of this option should be this episode's ID, suppose
    //for 1st episode, value is it's id = 4952

    episodeSelector.append(optionElement); //put the option just created in to the episode selector
  }
}

// ==================== EPISODE SELECTOR ====================
episodeSelector.addEventListener("change", function (event) {
  const selectedEpisodeID = event.target.value; // gets the selected episode's ID

  const selectedEpisode = allEpisodes.find(
    (
      episode, //find() searches through allEpisodes
    ) => episode.id === Number(selectedEpisodeID), // It finds the episode where the IDs match.
    //selectedEpisode now contains the whole episode object
  );

  const selectedCard = document.getElementById(
    //find episode section
    `episode-${selectedEpisode.id}`,
  );

  const allCards = document.querySelectorAll("#root section"); //Find all the episode <section> cards inside #root
  // and store them in allCards

  allCards.forEach(function (card) {
    //Hide all cards except the selected one
    // when an episode is selected
    card.style.display = "none";
  });

  //show only the selected episode
  selectedCard.style.display = "block";

  const selectedEpisodes = [selectedEpisode];

  episodeCount.textContent = `Displaying ${selectedEpisodes.length}/${allEpisodes.length} episodes`;

});

// ==================== SHOW ALL ====================
showAllButton.addEventListener("click", function () {
  //make the "Show All Episodes" button work
  makePageForEpisodes(allEpisodes);
});

// ==================== SEARCH ====================
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value;
  const matchingEpisodes = searchEpisodes(searchTerm, allEpisodes);
  
  makePageForEpisodes(matchingEpisodes);
});

function searchEpisodes(searchTerm, allEpisodes) {
  //only filted episodes
  const filteredEpisodes = allEpisodes.filter((episode) => {
    const name = episode.name.toLowerCase();
    const summary = episode.summary.toLowerCase();

    return (
      name.includes(searchTerm.toLowerCase()) ||
      summary.includes(searchTerm.toLowerCase())
    );
  });

  return filteredEpisodes;
}

// ==================== DISPLAY EPISODES ====================
function makePageForEpisodes(episodeList) {
  
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.innerHTML = ""; //for every search it will add only new cards, not olds + new

  episodeCount.textContent = `Displaying ${episodeList.length}/${allEpisodes.length} episodes`; //shows no. of episodes found
  // after each search
  if (episodeList.length === 0) {
    rootElem.innerHTML = "Sorry, no episode matched your search...";
  }
  const episodeCards = episodeList.map(createEpisodeCard);
  rootElem.append(...episodeCards);
}

// ==================== CREATE EPISODE CARD ====================
function createEpisodeCard(episode) {
  const card = document.getElementById("episode-card").content.cloneNode(true);

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number,
  ).padStart(2, "0")}`;

  card.querySelector("h3").textContent = `${episode.name} - ${episodeCode}`;

  card.querySelector("img").src = episode.image.medium;

  card.querySelector("summary").innerHTML = episode.summary || "";

  card.querySelector("#episode-image").alt = episode.name;

  card.querySelector("section").id = `episode-${episode.id}`;

  return card;
}

// ==================== FOOTER ====================
function makeFooter() {
  //add footer function outside
  const attribution = document.createElement("p");
  const tvMazeLink = document.createElement("a");

  tvMazeLink.href = "https://tvmaze.com/";
  tvMazeLink.textContent = "TVMaze.com";

  attribution.append("Data originally sourced from ", tvMazeLink);

  const footer = document.createElement("footer");
  footer.append(attribution);

  document.body.append(footer);
}

window.onload = setup;
