// "use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51",
  "#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51",
];

let colors = shuffle(COLORS);



/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

let cards = [];
function createCards(colors) {
  for (let color of colors) {
    const gameBoard = document.getElementById("game");
    const card = document.createElement('div');
    card.style.backgroundColor = "#cfe1b9";
    card.classList.add(color, "card", "down");
    gameBoard.appendChild(card);
  }
  cards = document.querySelectorAll(".card");
  for (let card of cards) {
    card.addEventListener('click', function (e) {
      const classList = Object.values(card.classList);
      if (classList.includes('down')) {
        handleCardClick(card);
      }
    });
  }
}

createCards(colors);
// =============== Stuff ==================
let cardsUp = [];
let pairsMatched = 0;
let maxPairs = (COLORS.length) / 2;
let turns = 0;
let hsNum = localStorage.getItem("highscore");

/**============== Flip a card face-up. ============== */

function flipCard(card) {
  const color = card.classList[0];
  card.style.backgroundColor = color;
  card.classList.remove("down");
  cardsUp.push(card, color);
}


/** ============== Flip a card face-down. ==============*/


function unFlipCard(card) {
  card.style.backgroundColor = "#cfe1b9";
  card.classList.add("down");
  card.style.pointerEvents = 'auto';
}

/** ============== Update Current Score ==============*/
const scoreNum = document.querySelector("#scoreNum");
function updateScore() {
  scoreNum.innerHTML = turns;
}

// ============== Highscore ==============
const hsNumContainer = document.querySelector("#hsNumContainer");
function newHighscore(turns) {
  if (hsNum == null) { hsNum = Infinity; }
  if (turns < hsNum) {
    hsNum = turns;
    localStorage.setItem("highscore", hsNum);
    hsNumContainer.innerHTML = localStorage.getItem("highscore");
  }
}

/** ============== Handle clicking on a card: this could be first-card or second-card. ============== */
// for (let card of cards) {
//   card.addEventListener('click', function (e) {
//     console.log('wooooh');
//     const classList = Object.values(card.classList);
//     if (classList.includes('down')) {
//       handleCardClick(card);
//     }
//   });
// }


// check if cards facing up are pairs
function checkCards() {
  if (cardsUp[1] == cardsUp[3]) {
    cardsUp = [];
    return true;
  } else {
    // if cards don't match, unflip them after 1 sec and reset cards facing up
    setTimeout(function () {
      unFlipCard(cardsUp[0]);
      unFlipCard(cardsUp[2]);
      cardsUp = [];
    }, FOUND_MATCH_WAIT_MSECS);
  }
}


function handleCardClick(card) {
  // update turn count & flip card up
  turns++;
  updateScore();
  flipCard(card);
  // when two cards are up
  if (cardsUp.length == 4) {
    // disable events on other cards for 1 sec
    for (let card of cards) {
      card.style.pointerEvents = 'none';
      setTimeout(function () {
        card.style.pointerEvents = 'auto';
      }, FOUND_MATCH_WAIT_MSECS);
    }
    // check if the two cards facing up match
    if (checkCards() == true) {
      pairsMatched++;
    };
  }
  // game over - update highscore
  if (pairsMatched == maxPairs) {
    newHighscore(turns);
    if (hsContainer.classList.length != 0) {
      hsContainer.classList.remove("hide");
    }
  }
}


// ============== Start Game ==============
const start = document.querySelector("#start");
const reset = document.querySelector("#reset");
const score = document.querySelector("#score");
const hsContainer = document.querySelector("#hsContainer");

start.addEventListener('click', function () {
  const gameBoard = document.getElementById("game");
  start.classList.add('hide');
  gameBoard.classList.remove('hide');
  reset.classList.remove('hide');
  score.classList.remove('hide');
  hsContainer.classList.remove('hide');
  hsNumContainer.innerHTML = localStorage.getItem("highscore");
  // if first game, hide highscore message
  if (hsNumContainer.innerHTML == '') {
    hsContainer.classList.add('hide');
  }
});

// ============== Reset Game ==============

reset.addEventListener('click', function () {
  // for (let card of cards) {
  //   unFlipCard(card);
  // }
  turns = 0;
  updateScore();
  pairsMatched = 0;
  cardsUp = [];

  const gameBoard = document.getElementById("game");
  for (let card of cards) {
    gameBoard.removeChild(card);
  }
  colors = shuffle(COLORS);
  createCards(colors);
});



