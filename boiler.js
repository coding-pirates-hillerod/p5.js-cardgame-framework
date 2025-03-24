// Global vars

// Table vars
let global_tableWidth = 600;
let global_tableHeight = 600;

// Card vars
let global_cardWidth = 70;
let global_cardHeight = 100;
let global_backBack;
let global_mainDeck;

// colors
let global_tableColor = '#0B6623'; // green
let global_cardBorderColor = '#C5A442A0'

// for global event listeners to iterate to find the correct one
let global_allCardPlacements = [];
let global_playerDecks = [];

let global_dealCardFunction;
let global_drawCardFunction;
let global_cardDrawnFunction;

let roundCounter = 0;

let global_lastLog;

// p5 event listeners
function mouseClicked() {
  let index = global_allCardPlacements.findIndex(cp => cp.isClickedOn(mouseX, mouseY));
  if ( index > -1 ) {
    global_allCardPlacements[index].doClickAction();
  }
}

function preload() {
  global_cardBack = loadImage('https://i.ebayimg.com/images/g/5jgAAOSwynFiE9c3/s-l1600.webp'); // Standard kortbagside
}

function startGame() {
  roundCounter++;
  logText("Runde: "+roundCounter);
}

function andTheWinnerIs(winnerPlayer) {
  global_playerDecks.forEach(player => {
    winnerPlayer.addCards(
      player.getAndResetDrawnCards()
    );
    player.drawBorder();
  });
  
  repaintTable();
  
  roundCounter++;
  logText("Runde: "+roundCounter+" \nPlayer: "+winnerPlayer.name+" vandt");
}

function logText(textToLog) {
  stroke(global_tableColor);
  fill(global_tableColor);
  rect(0,0, 250, 250);
  global_lastLog = textToLog;
  fill('#000000'); // tekstfarve (sort)
  textSize(16); // tekststørrelse
  text(global_lastLog, 20, 20);
}


function initTable() {
  createCanvas(global_tableWidth, global_tableHeight);
  background(global_tableColor);
  drawMainDeck();
}

function initPlayers(playerCount) {
  let spacing = global_tableWidth / (playerCount + 1);

  // spread player decs evenly over x
  for (let i = 1; i <= playerCount; i++) {
    let posX = i * spacing - (global_cardWidth/2);
    let playerDeck = new DeckPlacement("p"+i, posX, global_tableHeight-global_cardHeight-10);
    playerDeck.addClickAction(() => {
      global_drawCardFunction(playerDeck);
      repaintTable();
    });
    playerDeck.addCardDrawnAction(() => {
      global_cardDrawnFunction(playerDeck, global_playerDecks);
    });
    playerDeck.drawBorder();
    
    global_playerDecks.push(playerDeck);
  }
}

function initGame(dealCardFunction, drawCardFunction, cardDrawnFunction) {
  global_dealCardFunction = dealCardFunction;
  global_drawCardFunction = drawCardFunction;
  global_cardDrawnFunction = cardDrawnFunction;
}

function _dealCards() {
  global_dealCardFunction(global_mainDeck.cards, global_playerDecks)
}

function drawMainDeck() {
  global_mainDeck = new DeckPlacement("MainDeck",global_tableWidth/2-global_cardWidth/2, 10, () => {
    _dealCards();
    startGame();
    global_mainDeck.drawBorder();
  });
  
  // Opretter et standard kortspil (52 kort)
  let suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  for (let s = 0; s < suits.length; s++) {
    for (let r = 2; r <= 14; r++) { // 2-10, J(11), Q(12), K(13), A(14)
      global_mainDeck.addCard({ suit: suits[s], value: r, flipped: false });
    }
  }
  
  shuffleDeck(global_mainDeck.cards);  
}

function repaintTable() {
  background(global_tableColor);
  global_allCardPlacements.forEach(player => {
    player.drawBorder();
  });
  logText(global_lastLog);
}

function shuffleDeck(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index
    [array[i], array[j]] = [array[j], array[i]];   // swap
  }
  return array;
}

class DeckPlacement {
  constructor(name, x, y, clickActionFunction) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.cards = [];
    this.drawnCards = [];
    this.clickActionFunction = clickActionFunction;
    global_allCardPlacements.push(this);
  }
  deconstructor() {
    let thisIndex = global_allCardPlacements.indexOf(this);
    global_allCardPlacements.splice(thisIndex, 1);
  }
  
  drawBorder() {
   
    stroke(global_cardBorderColor);     
    strokeWeight(2);       
    fill(global_tableColor);   
    rect(this.x, this.y, global_cardWidth, global_cardHeight, 5);
    if ( this.cards.length > 0 ) {
      // add card backside
      image(global_cardBack, this.x, this.y, global_cardWidth, global_cardHeight);
      
      // add card count
      fill(255); // tekstfarve (sort)
      textSize(16); // tekststørrelse
      text(this.cards.length, this.x, this.y+global_cardHeight); // (tekst, x, y)
    }
    
    // draw drawn cards above the deck
    let _spacing = 20;
    let _center = this.x;
    let _x = (_center - ((this.drawnCards.length-1) * _spacing)/2);
    
    for ( let i = 0; i < this.drawnCards.length; i++ ) {
      drawCard(this.drawnCards[i], _x, this.y-global_cardHeight-15);
      
      _x += _spacing;
    }  
  }
  
  
  addCard(card) {
    const preSize = this.cards.length;
    this.cards.push(card);
    if ( preSize == 0 ) {
      this.drawBorder();
    }
  }
  
  addCards(cards) {
    const preSize = this.cards.length;
    this.cards.push(...cards);
    if ( preSize == 0 ) {
      this.drawBorder();
    }
  }
  
  drawTopCard(flipCard) {
    if ( this.cards.length > 0 ) {
      let drawnCards = this.cards.splice(0, 1);
      drawnCards[0].flipped = flipCard;
      this.drawnCards.push(...drawnCards);
    }
    this.drawBorder();
    this.cardDrawnActionFunction();
  }
  
  getDrawnCardCount() {
    return this.drawnCards.length;
  }
  
  getAndResetDrawnCards() {
    let _drawnCards = this.drawnCards.splice(0);
    this.drawBorder();
    return _drawnCards; 
  }
  
  isClickedOn(clickX, clickY) {
    return clickX > this.x && clickX < this.x + global_cardWidth && clickY > this.y && clickY < this.y + global_cardHeight;
  }
  
  doClickAction() {
    if ( typeof this.clickActionFunction === 'function' ) {
      this.clickActionFunction(this.x, this.y);
    }
  }
  
  addClickAction(clickAction) {
    this.clickActionFunction = clickAction;
  } 
  
  addCardDrawnAction(cardDrawnAction) {
    this.cardDrawnActionFunction = cardDrawnAction;
  }
}

function drawCard(_card, _x, _y) {
  if ( !_card.flipped ) {
          image(global_cardBack, _x, _y, global_cardWidth, global_cardHeight);
      } else {
          stroke('#000000');     
          strokeWeight(2);       
          fill('#FFFFFFF');   
          rect(_x, _y-15, global_cardWidth, global_cardHeight, 5);
          
          if ( _card.suit == 'hearts' ) {
            drawHeart(_x+global_cardWidth/2,_y+global_cardHeight/4,0.35)
            fill('#F70A0A');
          } else if ( _card.suit == 'diamonds') {
            drawCurvedRude(_x+global_cardWidth/2,_y+global_cardHeight/3.2,25);
            fill('#F70A0A');
          } else if ( _card.suit == 'spades') {
            drawSpade(_x+global_cardWidth/2,_y+global_cardHeight/3.1,0.4);
            fill('#000000');
          }
        else {
            drawClub(_x+global_cardWidth/2,_y+global_cardHeight/3.1,0.4);
            fill('#000000')
          }
          textSize(20)
          let _textWidth = textWidth(_card.value);
          text(_card.value, _x+5, _y+5); // (tekst, x, y)
          text(_card.value, _x+global_cardWidth-_textWidth-5, _y+global_cardHeight-20);
    
      }
}



function drawHeart(x, y, s) {
  push();               // gem nuværende transformationsstatus
  translate(x, y);      // flyt til ønsket position
  scale(s);             // skaler størrelsen (1 = normal)
  fill('#F70A0A');    // hjertefarve
  noStroke();

  beginShape();
  vertex(0, 0);
  bezierVertex(50, -80, 100, 0, 0, 100);
  bezierVertex(-100, 0, -50, -80, 0, -50);
  endShape(CLOSE);

  pop();
}

function drawCurvedRude(x, y, s) {
  push();
  translate(x, y); // flyt koordinatsystemet til midten

  fill('#F70A0A');
  noStroke();

  beginShape();

  // Top til højre
  vertex(0, -s);
  bezierVertex(s * 0.5, -s * 0.7, s * 0.7, -s * 0.5, s, 0);

  // Højre til bund
  bezierVertex(s * 0.7, s * 0.5, s * 0.5, s * 0.7, 0, s);

  // Bund til venstre
  bezierVertex(-s * 0.5, s * 0.3, -s * 0.3, s * 0.5, -s, 0);

  // Venstre til top
  bezierVertex(-s * 0.3, -s * 0.5, -s * 0.5, -s * 0.3, 0, -s);

  endShape(CLOSE);

  pop();
}

function drawSpade(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  fill(0);
  noStroke();

  // Blade (tegnes som én form)
  beginShape();
  //vertex(0, -60);
  //bezierVertex(35, 100, 70, 010, 0, 20);
  //bezierVertex(-70, -10, -35, -100, 0, -60);
  
  vertex(0, -50); // bund midt

  // Højre side
  bezierVertex(50, 80, 75, 50, 0, 25);

  // Venstre side
  bezierVertex(-100, 0, -50, 80, 0, -50);
  
  endShape(CLOSE);

  // Stilk
  rect(-10, 20, 20, 35, 5);

  // Fod
  beginShape();
  vertex(-20, 55);
  bezierVertex(-10, 65, 10, 65, 20, 55);
  vertex(-20, 55);
  endShape(CLOSE);

  pop();
}

function drawClub(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  fill(0);
  noStroke();

  // Top del (tegnes som én sammensat figur)
  ellipse(0, -40, 40, 40);  // top
  ellipse(-25, -10, 40, 40); // venstre
  ellipse(25, -10, 40, 40);  // højre

  // Samlende cirkel i midten
  ellipse(0, -5, 30, 30);

  // Stilk
  rect(-8, 15, 16, 35, 5);

  // Fod
  beginShape();
  vertex(-18, 50);
  bezierVertex(-10, 60, 10, 60, 18, 50);
  vertex(-18, 50);
  endShape(CLOSE);

  pop();
}
