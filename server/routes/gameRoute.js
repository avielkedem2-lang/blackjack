import express from "express"
import { checkBet, getHeaders } from "../middleware/middlewareGame.js"
import { addCards, startRound } from "../service/gameService.js"


const router = express.Router()



router.post("/start-round", checkBet, async (req, res) => {
    try {
        const { bet } = req.body
        const player = req.player
        const game = await startRound(player, bet)
        res.status(200).json(game)
    } catch (e) {
        if (e.status) {
            res.status(e.status).json(e.message)
        }
        console.log(e);
    }
})



router.post("/hit",getHeaders, async (req, res) => {
    try {
        const playerId = req.playerId
        console.log(playerId);
        
        const game = await addCards(playerId)
        res.status(200).json(game)
    } catch (e) {
        if (e.status) {
            res.status(e.status).json(e.message)
        }
        console.log(e);
    }
})








export default router;