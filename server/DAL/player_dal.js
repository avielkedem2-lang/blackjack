import { ObjectId } from "mongodb";
import db from "../db/mongodb.js";


const collection = await db.collection("player")


async function insertPlayer(body) {
    const res = await collection.insertOne(body)
    return {_id: res.insertedId, ...body}
}


async function findPlayerById(id) {
    return await collection.findOne({_id: new ObjectId(id)})
}




export default {
    insertPlayer,
    findPlayerById,
} 