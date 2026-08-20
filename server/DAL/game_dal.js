import { ObjectId } from "mongodb";
import db from "../db/mongodb.js";


const collection = await db.collection("game-blackjack")

async function insertGame(body) {
    const res = await collection.insertOne(body)
    return {_id: res.insertedId, ...body}
}




async function findAllGameById(playerId) {
    return await collection.find({playerId: playerId}).toArray()
}



async function updateGame(id, newGame) {
    return await collection.updateOne({_id: new ObjectId(id)}, { $set: { ...newGame }})
}

async function findGameById(playerId) {
    return await collection.findOne({playerId: playerId})
}


export default {
    insertGame,
    findAllGameById,
    updateGame,
    findGameById,
}