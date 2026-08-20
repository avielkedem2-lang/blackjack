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
        dealerCards: game.dealerCards,
        status: game.status,
        chips: player.chips - bet
    }


}


function createGame(playerId, bet) {

    return {
        playerId: playerId,
        bet: bet,
        playerCards: [
            { rank: getCard(), suit: getSuit() },
            { rank: getCard(), suit: getSuit() }],
        dealerCards: [{ rank: getCard(), suit: getSuit() }],
        status: "in_progress",
        createdAt: new Date()
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
    console.log(newCard);
    
    const suit = getSuit()
    const sumCards = isBust(newCard, game.playerCards)
    console.log(sumCards);

    game.playerCards.push({ rank: newCard, suit })
    if (sumCards > 21) {
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
        playerTotal: sumCards,
        status: updatedGame.status,
        chips: player.chips - game.bet
    }

}






function isBust(newCard, playerCards) {
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
    if (newCard === "A") {
        if (sum + 11 > 21) {
            newCard = 1
        } else {
            newCard = 11
        }
    } else if (isNaN(newCard)){
        newCard = 10
    }
    sum += newCard
    return sum

}



function getCard() {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]
    const newCard = cards[getRandomInt(0, 13)]
    return newCard
}

function getSuit() {
    const listSuit = ["hearts", "diamonds", "clubs", "spades"]
    const suit = listSuit[getRandomInt(0, 3)]
    return suit
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}