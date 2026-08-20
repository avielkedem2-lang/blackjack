import express from "express"
import { checkBet } from "../middleware/middlewareGame.js"
import { startRound } from "../service/gameService.js"


const router = express.Router()



router.post("/start-round", checkHeaders, async (req, res) => {
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







export default router;