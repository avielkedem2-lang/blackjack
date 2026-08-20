import { ObjectId } from "mongodb";
import db from "../db/mongodb.js";


const collection = await db.collection("game-blackjack")

async function insertGame(body) {
    const res = await collection.insertOne(body)
    return {_id: res.insertedId, ...body}
}




async function findGameById(playerId) {
    return await collection.find({playerId: playerId}).toArray()
}


export default {
    insertGame,
    findGameById,
}