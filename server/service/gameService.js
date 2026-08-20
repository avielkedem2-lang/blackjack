import gameDal from "../DAL/game_dal.js";
import playerDal from "../DAL/player_dal.js"
import { createError } from "./playerService.js";


export async function startRound(playerId, bet) {
    const player = await playerDal.findPlayerById(playerId)
    if (!player) throw createError(404, "player not fond")
    if (bet < 0 || player.chips < bet) throw createError(404, "There is not enough money");

    const games = await gameDal.findGameById(playerId)
    games.forEach((g) => {
        if (g.status === "in_progress") throw createError(409, "There is already game in progress")
    });

    const body = createGame(playerId, bet)
    const game = await gameDal.insertGame(body)
    return {roundId: game._id, playerCards: game.playerCards, dealerCards: game.dealerCards, status: game.status, chips: player.chips - bet}


}


function createGame(playerId, bet) {
    const listSuit = ["hearts", "diamonds", "clubs", "spades"]
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]
    return {
        playerId: playerId,
        bet: bet,
        playerCards: [
            { rank: cards[getRandomInt(0, 13)], suit: listSuit[getRandomInt(0, 3)] },
            { rank: cards[getRandomInt(0, 13)], suit: listSuit[getRandomInt(0, 3)] }],
        dealerCards: [{ rank: cards[getRandomInt(0, 13)], suit: listSuit[getRandomInt(0, 3)] }],
        status: "in_progress",
        createdAt: new Date()
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}