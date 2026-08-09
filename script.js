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
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  const episodeCards = episodeList.map(createEpisodeCard);
  rootElem.append(...episodeCards);
  const attribution = document.createElement("p");
  const tvMazeLink = document.createElement("a");
  tvMazeLink.href = "https://tvmaze.com/";
  tvMazeLink.textContent = "TVMaze.com";
  attribution.append("Data originally sourced from ", tvMazeLink);
  const footer = document.createElement("footer");
  footer.append(attribution);
  document.body.append(footer);
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
  return card;
}
window.onload = setup;
