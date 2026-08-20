import gameDal from "../DAL/game_dal.js";
import playerDal from "../DAL/player_dal.js"
import { createError } from "./playerService.js";


export async function startRound(playerId, bet) {
    const player = await playerDal.findPlayerById(playerId)
    if (!player) throw createError(404, "player not fond")
    if (bet < 0 || player.chips < bet) throw createError(404, "There is not enough money");

    const games = await gameDal.findAllGameById(playerId)
    games.forEach((g) => {
        if (g.status === "in_progress") throw createError(409, "There is already game in progress")
    });

    const body = createGame(playerId, bet)
    const game = await gameDal.insertGame(body)
    return {
        roundId: game._id,
        playerCards: game.playerCards,
        dealerCards: game.dealerCards[0],
        status: game.status,
        chips: player.chips - bet
    }
}








export async function addCards(playerId) {
    const games = await gameDal.findAllGameById(playerId)
    console.log(games);

    if (!games) throw createError(404, "player not fond")
    let game = null;
    games.forEach((g) => {
        if (g.status === "in_progress") {
            game = g
        }
    });
    if (!game) throw createError(404, "There is no round in progress")

    const newCard = getCard()
    const suit = getSuit()
    let sumAllCards = sumCards(game.playerCards)
    sumAllCards = addNewCard(newCard, sumAllCards)

    game.playerCards.push({ rank: newCard, suit })
    if (sumAllCards > 21) {
        game.status = "player_bust"
        const player = await playerDal.findPlayerById(playerId)
        const newChips = player.chips - game.bet
        await playerDal.updatePlayer(playerId, newChips)
    }
    const player = await playerDal.findPlayerById(playerId)
    await gameDal.updateGame(game._id, game)
    const updatedGame = await gameDal.findGameById(playerId)
    return {
        playerCards: updatedGame.playerCards,
        playerTotal: sumAllCards,
        status: updatedGame.status,
        chips: player.chips - game.bet
    }

}





export async function stand(playerId) {
    const games = await gameDal.findAllGameById(playerId)
    console.log(games);

    if (!games) throw createError(404, "player not fond")
    let game = null;
    games.forEach((g) => {
        if (g.status === "in_progress") {
            game = g
        }
    });
    
    
    let sumCardsDealer = sumCards(game.dealerCards)
    
    
    while (sumCardsDealer < 17) {
        const newCard = getCard()
        const suit = getSuit()
        sumCardsDealer = addNewCard(newCard, sumCardsDealer);
        game.dealerCards.push({ rank: newCard, suit })
    }
    
    // console.log(game.dealerCards);
    
    const player = await playerDal.findPlayerById(playerId)
    // console.log(player);
    const sumCardsPlayer = sumCards(game.playerCards)
    
    if (sumCardsDealer > 21) {
        game.status = "dealer_bust"
        const newChips = player.chips += game.bet
        await playerDal.updatePlayer(playerId, newChips);
    } else if (sumCardsDealer > sumCardsPlayer){
        game.status = "dealer_win"
        const newChips = player.chips -= game.bet
        await playerDal.updatePlayer(playerId, newChips);
    }  else if(sumCardsPlayer > sumCardsDealer){
        game.status = "player_win";
        const newChips = player.chips += game.bet
        await playerDal.updatePlayer(playerId, newChips);
    } else if (sumCardsDealer === sumCardsPlayer){
        game.status = "push"
    }
    console.log(game);
    
    const updatedPlayer = await playerDal.findPlayerById(playerId)
    await gameDal.updateGame(game._id, game)
    const updatedGame = await gameDal.findGameById(playerId)
    console.log(updatedGame);
    
    return {
        playerCards: updatedGame.playerCards,
        dealerCards: updatedGame.dealerCards,
        playerTotal: sumCardsPlayer,
        dealerTotal: sumCardsDealer,
        status: updatedGame.status,
        chips: updatedPlayer.chips - game.bet
    }
}





export async function getRound(playerId) {
    const player = await playerDal.findPlayerById(playerId)
    const games = await gameDal.findAllGameById(playerId)
    if (!player) throw createError(404, "player not fond")  
    let game = null;
    games.forEach((g) => {
        if (g.status === "in_progress") {
            game = g
        }
    });

    return {
        roundId: game._id,
        playerCards: game.playerCards,
        dealerCards: game.dealerCards[0],
        status: game.status,
        chips: player.chips - game.bet
    }

}





function sumCards(playerCards) {
    let sum = 0
    let countA = 0
    for (let card of playerCards) {
        let amount = card.rank
        if (amount === "J" || amount === "Q" || amount === "K") {
            amount = 10
        }
        if (amount === "A") {
            countA += 1
            if (countA > 1) {
                sum - 10
                countA = 1
            }
            if (sum + 11 > 21) {
                amount = 1
            } else {
                amount = 11
            }
        }

        sum += amount
    }

    return sum

}


function addNewCard(newCard, sum) {
    if (newCard === "A") {
        if (sum + 11 > 21) {
            newCard = 1
        } else {
            newCard = 11
        }
    } else if (isNaN(newCard)) {
        newCard = 10
    }
    sum += newCard
    return sum
}





function createGame(playerId, bet) {

    return {
        playerId: playerId,
        bet: bet,
        playerCards: [
            { rank: getCard(), suit: getSuit() },
            { rank: getCard(), suit: getSuit() }],
        dealerCards: [
            { rank: getCard(), suit: getSuit() },
            { rank: getCard(), suit: getSuit() }],
        status: "in_progress",
        createdAt: new Date()
    }
}



function getCard() {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]
    const newCard = cards[getRandomInt(cards)]
    return newCard
}

function getSuit() {
    const listSuit = ["hearts", "diamonds", "clubs", "spades"]
    const suit = listSuit[getRandomSuit(listSuit)]
    return suit
}

function getRandomInt(cards) {
    return Math.floor(Math.random() * cards.length) ;
}

function getRandomSuit(suits) {
    return Math.floor(Math.random() * suits.length) ;
}
