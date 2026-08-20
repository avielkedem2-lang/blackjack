import { ObjectId } from "mongodb";
import db from "../db/mongodb.js";

const collection =  db.collection("player")


async function insertPlayer(body) {
    const res = await collection.insertOne(body)
    return { _id: res.insertedId, ...body }
}


async function findPlayerById(id) {
    return await collection.findOne({ _id: new ObjectId(id) })
}

async function updatePlayer(id, chips) {
    return await collection.updateOne({_id: new ObjectId(id)}, {$set : {chips}})
}




export default {
    insertPlayer,
    findPlayerById,
    updatePlayer,
} 