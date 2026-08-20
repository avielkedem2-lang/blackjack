import playerDal from "../DAL/player_dal.js";



export function createError(status, message) {
    const err = new Error(message)
    err.status = status
    return err
}



export async function createPlayer(player) {
    const chips = 1000
    const createdAt = new Date()
    const body = { chips, createdAt }
    const data = await playerDal.insertPlayer(body)
    return {playerId: data._id, chips: data.chips}
}






// export default {
//     createPlayer,
// }