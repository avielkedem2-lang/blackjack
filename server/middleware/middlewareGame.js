export const checkBet = (req, res, next) => {
    const { bet } = req.body
    if (!bet || isNaN(bet)) return res.status(400).json("bad request")
    const playerId = req.headers["x-player-id"]
    if (!playerId) return res.status(400).json("bad request")
    req.player = playerId
    next()
}


export const getHeaders = (req, res, next) => {
    const playerId = req.headers["x-player-id"]
    if (!playerId) return res.status(400).json("bad request")
    req.playerId = playerId
    next()
}