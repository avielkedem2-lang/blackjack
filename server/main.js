import express from "express"
import cors from "cors"
import dotenv from "dotenv/config"
import routerPlayer from "./routes/playerRouter.js"
import { connection } from "./db/mongodb.js"



const app = express()

const PORT = process.env.PORT


app.use(express.json())
app.use(cors())

app.use("/", routerPlayer)






async function run() {
    await connection()
    app.listen(PORT,  () => {
    console.log("The server run...");
})
}
run()
