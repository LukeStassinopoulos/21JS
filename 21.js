//Variables for total cards

var dealerSum = 0;
var playerSum = 0;

//Variables for number of aces

var dealerAceCount = 0;
var playerAceCount = 0;


//Variable for dealer hidden card and deck of cards
var hidden;
var deck;

var haveStood = false; // Can player still hit boolean

//When page is loaded create deck and start game
window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
}
//Loops through all possible cards in deck and adds to deck
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let suits = ["C", "S", "H", "D"];
    deck = [];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + suits[i]);

        }
    }
}
//Rearranges deck
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}
//Starts game by giving dealer one face up card
//and giving player two faceup cards
function startGame() {
    //dealer cards
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount = checkAce(hidden);

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);

    for (let i = 0; i < 2; i++) {
        //player cards
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);

    }
    //update player current count
    document.getElementById("player-sum").innerText = reduceAce(playerSum, playerAceCount);
    //if 21 achieved player should stand
    if (playerSum == 21) {
        stand();
    }
    //activate buttons
    document.getElementById("hit") / addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand)
    document.getElementById("play-again").addEventListener("click", playAgain)
}
//If player can hit another card is given to them
//Also checks if player has bust or reached 21
function hit() {
    if (haveStood) {
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    if (reduceAce(playerSum, playerAceCount) > 21) {
        haveStood = true;
        //skips to results as player has lost
        //this means the dealer does not draw
        results();
    }
    if (reduceAce(playerSum, playerAceCount) == 21) {
        haveStood = true;
        stand()
    }
    document.getElementById("player-sum").innerText = reduceAce(playerSum, playerAceCount);
}
//Dealer draws until card count is over 17
function stand() {
    while (reduceAce(dealerSum, dealerAceCount) < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    results();
}


//Displays if player won or lost
function results() {
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    playerSum = reduceAce(playerSum, playerAceCount);

    haveStood = true;

    let message = " ";
    if (playerSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You Win!";
    }
    else if (playerSum == dealerSum) {
        message = "Standoff";
    }
    else if (playerSum > dealerSum) {
        message = "You Win!";
    }
    else if (playerSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = playerSum;

    document.getElementById("results").innerText = message;
}

//Returns value of card
function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }

    return parseInt(value);
}
//Checks if card is an Ace
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;

}
//Returns value of current hand
//Accounts for aces being worth 1 or 11
function reduceAce(sum, aceCount) {
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}
//Reloads page to play again
function playAgain() {
    location.reload();
}