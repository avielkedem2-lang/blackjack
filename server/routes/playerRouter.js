import express from "express"
import { createPlayer } from "../service/playerService.js"




const router = express.Router()


router.post("/start-game", async (req, res) => {
    try {
        const data = await createPlayer()
    } catch (err) {
        console.log(err);
        
    }
})


export default router;
