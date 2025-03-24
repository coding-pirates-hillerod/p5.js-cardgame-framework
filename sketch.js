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
function drawCardFunction(player) {
  player.drawTopCard(true);
}

// Funktion der kaldes LIGE EFTER spilleren har trukket et kort
function cardDrawnFunction(drawingPlayer, listOfPlayers) {
  // hvad skal der ske når kortet ER vendt
  andTheWinnerIs(drawingPlayer);
  
}

// ^^^^              ^^^^
// |||| Spilleregler ||||



function setup() {
  initTable();
  initPlayers(playerCount);
  initGame(dealCardsFunction, drawCardFunction, cardDrawnFunction);
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



