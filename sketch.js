const playerCount = 2;


// |||| Spilleregler ||||
// vvvv              vvvv

function drawCardFunction(player) {
  // hvad skal der skal når der skal vendes et kort?
  
  player.drawTopCard(true);
  
}

function cardDrawnFunction(drawingPlayer, listOfPlayers) {
  // hvad skal der ske når kortet ER vendt
  let allPlayersDrawn = true;
  listOfPlayers.forEach(player => {
    if ( player.getDrawnCardCount() < 1 ) {
      allPlayersDrawn = false;
    }
  });
  
  if ( allPlayersDrawn ) {
    // find vinderen
    let playerListCopy = [...listOfPlayers];
    playerListCopy.sort((p1, p2) => {
      return p2.drawnCards[0].value - p1.drawnCards[0].value;
    });
    let winner = playerListCopy[0];
    nextRound(winner);
  }
  // API til at give vinderen stik og klargøre bordet til næste runde
  // nextRound(winnerPlayer);
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



