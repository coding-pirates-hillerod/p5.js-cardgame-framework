const playerCount = 2;

// API

// Spillerens kort
// player.cards[0|1|..]

// Spillerens trukne kort
// player.drawnCards[0|1|...]

// Tilføj en liste af kort til spilleren
// player.addCards(cards)

// Vend øverste kort - true: hvis kortet skal have forsiden op / false: hvis kortet skal have bagsiden op
// player.drawTopCard(true|false)

// Få fat i spillerens øverste kort
// let card = player.cards[0];

// kortets kulør (hearts / diamonds / clubs / spades)
// card.suit

// kortets værdi ( 2 - 14 )
// card.value

// true: hvis kortet vender værdisiden op / false: hvis kortets bagside vender op
// card.flipped

// |||| Spilleregler ||||
// vvvv              vvvv

// Funktion der kaldes når spilleres skal trække et kort
function traekEtKort(player) {
  if ( player.getDrawnCardCount() < 1 ) {
    player.drawTopCard(true);
  }
}

// Funktion der kaldes når 'Næste runde' knappen er trykkes
function findVinderen(listOfPlayers) {
  // angiv rundens vinder - vinderen får alle trukne kort og bordet klargøres til næste runde
  andTheWinnerIs(listOfPlayers[0]);
  
}

// ^^^^              ^^^^
// |||| Spilleregler ||||



function setup() {
  initTable();
  initPlayers(playerCount);
  initGame(dealCardsFunction, traekEtKort, findVinderen);
}

function dealCardsFunction(listOfCards, listOfPlayers) {
  // this function decides how the cards should be dealt to the players
  
  let cardsToGiveEachPlayer = floor(listOfCards.length/playerCount);
  
  // for each player extract cards from listOfCards and give it to the player
  listOfPlayers.forEach(player => {
    let cardsToGive = listOfCards.splice(0, cardsToGiveEachPlayer);
    player.addCards(cardsToGive);
  });
}



