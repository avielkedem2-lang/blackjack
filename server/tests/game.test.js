import assert from "node:assert"
import { describe, test, mock } from "node:test"
import gameDal from "../DAL/game_dal.js"
import player_dal from "../DAL/player_dal.js"
import { startRound } from "../service/gameService.js"




describe("function startRound", () => {
    test("valid startRound return body", async () => {
        const playerId = "6a86fdb3fe9a1d4d413318c1"
        const bet = 50
        const game = {
            _id: "6a16fdb3fe9a1d4d413318c1",
            playerId,
            bet,
            playerCards: [
                { rank: 5, suit: "harts" },
                { rank: 9, suit: "harts" }
            ],
            dealerCards: [
                { rank: 5, suit: "harts" },
                { rank: 5, suit: "harts" }
            ],
            status: "in_progress",
            createdAt: "2026"
        }
        mock.method(
            player_dal,
            "findPlayerById",
            (playerId) => { return { playerId, chips: 1000, createdAt: "2026" } }
        )
        mock.method(
            gameDal,
            "findAllGameById",
            (playerId) => { return [] }
        )

        mock.method(
            gameDal,
            "insertGame",
            (body) => { return { ...game } }
        )

        const round = await startRound(playerId, bet)
        assert.deepStrictEqual(round, {
            roundId: game._id,
            playerCards: game.playerCards,
            dealerCards: game.dealerCards[0],
            status: game.status,
            chips: 1000 - bet
        })
    })

    test("invalid startRound return error", async () => {
        const playerId = "6a86fdb3fe9a1d4d413318c1"
        const bet = -50
        const game = {
            _id: "6a16fdb3fe9a1d4d413318c1",
            playerId,
            bet,
            playerCards: [
                { rank: 5, suit: "harts" },
                { rank: 9, suit: "harts" }
            ],
            dealerCards: [
                { rank: 5, suit: "harts" },
                { rank: 5, suit: "harts" }
            ],
            status: "in_progress",
            createdAt: "2026"
        }
        mock.method(
            player_dal,
            "findPlayerById",
            (playerId) => { return { playerId, chips: 1000, createdAt: "2026" } }
        )
        mock.method(
            gameDal,
            "findAllGameById",
            (playerId) => { return [] }
        )

        mock.method(
            gameDal,
            "insertGame",
            (body) => { return { ...game } }
        )

        // const round = await startRound(playerId, bet)
        assert.rejects(async ()=>{
            await startRound(playerId, bet)
        })
    })
})




