import assert from "node:assert"
import { describe, test, mock } from "node:test"
import playerDal from "../DAL/player_dal.js"
import { createPlayer } from "../service/playerService.js"
import { date } from "zod"




describe("function createPlayer", () => {
    test("valid return {player, chips}", async () => {
        const player = { _id: "6a859b01d013bb215ddecd43", chips: 1000, createdAt: 5 }
        mock.method(
            playerDal,
            "insertPlayer",() => { return { _id: "6a859b01d013bb215ddecd43", chips: 1000, createdAt: 5 } }
        )
        const newPlayer = await createPlayer()
        assert.deepStrictEqual(newPlayer, { playerId: player._id, chips: player.chips })
    })


})