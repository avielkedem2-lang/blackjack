import express from "express"
import cors from "cors"
import dotenv from "dotenv/config"
import routerPlayer from "./routes/playerRouter.js"
import { connection } from "./db/mongodb.js"
import routerGame from "./routes/gameRoute.js"




const app = express()

const PORT = process.env.PORT


app.use(express.json())
app.use(cors())

app.use("/", routerPlayer)
app.use("/", routerGame)






async function run() {
    await connection()
    app.listen(PORT,  () => {
    console.log("The server run...");
})
}
run()
