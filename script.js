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
// 4. Your page should state somewhere that the data has (originally) come from [TVMaze.com](https://tvmaze.com/), and link back to that site (or the specific episode on that site). See [tvmaze.com/api#licensing](https://www.tvmaze.com/api#licensing).
// name: "Winter is Coming",
//       season: 1,
//       number: 1,
//       airdate: "2011-04-17",
//       airtime: "21:00",
//       airstamp: "2011-04-18T01:00:00+00:00",

const searchInput = document.querySelector("#search-input"); //get elements from HTML
const episodeCount = document.querySelector("#episode-count");
const episodeSelector = document.querySelector("#episode-selector");
const showAllButton = document.querySelector("#show-all-button"); //for bonus part

let allEpisodes = []; //keep allEpisode outside so that search can use it
function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  createEpisodeSelector(allEpisodes);
  makeFooter(); //call makeFooter() outside makePageForEpisodes(episodeList) to display footer
  //only once
}

function createEpisodeSelector(episodeList) {
  // for creating episode selector
  for (const episode of episodeList) {
    //loop through each episode
    const optionElement = document.createElement("option"); //create option for each element
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number // create episode code
    ).padStart(2, "0")}`;
    optionElement.textContent = `${episodeCode} - ${episode.name}`; // create option text
    optionElement.value = episode.id; //The value of this option should be this episode's ID, suppose
    //for 1st episode, value is it's id = 4952
    episodeSelector.append(optionElement); //put the option just created in to the episode selector
  }
}
episodeSelector.addEventListener("change", function (event) {
  const selectedEpisodeID = event.target.value; // gets the selected episode's ID
  const selectedEpisode = allEpisodes.find(
    (
      episode //find() searches through allEpisodes
    ) => episode.id === Number(selectedEpisodeID) // It finds the episode where the IDs match.
    //selectedEpisode now contains the whole episode object
  );
  const selectedCard = document.getElementById(
    //find episode section
    `episode-${selectedEpisode.id}`
  );
  const allCards = document.querySelectorAll("#root section"); //Find all the episode <section> cards inside #root
  // and store them in allCards

  allCards.forEach(function (card) {
    //Hide all cards except the selected one
    // when an episode is selected
    card.style.display = "none";
  });

  selectedCard.style.display = "block";
  selectedCard.scrollIntoView(); // Page jumps to the selected episode
});

showAllButton.addEventListener("click", function () {
  //make the "Show All Episodes" button work
  const allCards = document.querySelectorAll("#root section");

  allCards.forEach(function (card) {
    card.style.display = "block";
  });
});

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

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value;

  const filteredEpisodes = searchEpisodes(searchTerm, allEpisodes);

  makePageForEpisodes(filteredEpisodes);
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

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  rootElem.innerHTML = ""; //for every search it will add only new cards, not olds + new

  episodeCount.textContent = `${episodeList.length} episodes found`; //shows no. of episodes found
  // after each search

  const episodeCards = episodeList.map(createEpisodeCard);
  rootElem.append(...episodeCards);
}

function createEpisodeCard(episode) {
  const card = document.getElementById("episode-card").content.cloneNode(true);

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")}`;
  card.querySelector("h3").textContent = `${episode.name} - ${episodeCode}`;
  card.querySelector("img").src = episode.image.medium;
  card.querySelector("summary").innerHTML = episode.summary;
  card.querySelector("#episode-image").alt = episode.name;
  card.querySelector("section").id = `episode-${episode.id}`;
  return card;
}
window.onload = setup;
