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
  const films = getAllEpisodes();
  console.log(films);
  makePageForEpisodes(films);

  const rootElem = document.getElementById("root");

  makePageForEpisodes(films, rootElem);
  const filmCards = films.map(createFilmCard);
  rootElem.append(...filmCards);
}
function createFilmCard(films) {
  const card = document.getElementById("film-card").content.cloneNode(true);
  // Now we are querying our cloned fragment, not the entire page.
  const episodeCode = `S${String(films.season).padStart(2, "0")}E${String(films.number).padStart(2, "0")}`;
  card.querySelector("h3").textContent = films.name;
  card.querySelector("episodeCode").textContent = episodeCode;
  card.querySelector("summary").textContent = films.summary;
  return card;
}
window.onload = setup;
