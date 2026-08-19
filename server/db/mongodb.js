import { MongoClient } from "mongodb"
import dotenv from "dotenv/config"



const MONGO_URL = process.env.MONGO_URL

const client = new MongoClient(MONGO_URL)

try {
    await client.connect()
    console.log("The connection to mongodb success");
} catch (error) {
    console.log("connection to mongodb filed");
}


const db = client.db("blackjack")

export default db;


