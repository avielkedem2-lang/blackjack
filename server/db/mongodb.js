import { MongoClient } from "mongodb"
import dotenv from "dotenv/config"



const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL)

export async function connection() {
    try {
        await client.connect()
        console.log("The connection to mongodb success");
    } catch (error) {
        console.log("connection to mongodb filed");
    }
}



const db = client.db("blackjack")

export default db;

// export  function getDB(){
//     if(!db) throw new Error("NOT CONNECTED!!");
//     return db;
    
// }






