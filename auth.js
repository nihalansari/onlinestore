const jwt = require('jsonwebtoken')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'password'
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }
let User = require('./models/user.model');

passport.use(adminStrategy())
const authenticate = passport.authenticate('local', { session: false })
module.exports = {
    authenticate,
    login: login,
    ensureAdmin: ensureAdmin
}
async function login (req, res, next) {
    const token = await sign({username: req.user.username})
    res.cookie('jwt', token, {httpOnly: true})
    res.json({success: true, token: token})
}
async function ensureAdmin (req, res, next) {
    const jwtString = req.headers.authorization || req.cookies.jwt
    try {
        const payload = await verify(jwtString)
        console.log("Payload")
        console.log(payload.username)
        if (payload.username === 'admin') return next()
    } catch(e) {
        const err = new Error('Unauthorized')
        err.statusCode = 401
        next(err)
    }
}
async function sign (payload) {
    const token = await jwt.sign(payload, jwtSecret, jwtOpts)
    return token
}
async function verify (jwtString = '') {
    jwtString = jwtString.replace(/^Bearer /i, '')

    try {
        const payload = await jwt.verify(jwtString, jwtSecret)
        return payload
    } catch (err) {
        err.statusCode = 401
        throw err
    }
}
function adminStrategy () {
    return new Strategy(async function (username, password, cb) {
        const isAdmin = username === 'admin' && password === adminPassword
        if (isAdmin) return cb(null, { username: 'admin' })
        try {
            console.log("Fetching for :" + username + "," + password);
            const user = await User.get(username)
            if (!user) return cb(null, false)
            const isUser = (password === user.password)?true:false;
            //const isUser = await bcrypt.compare(password, user.password)
            //if (isUser) return cb(null, { username: user.username })
            if (isUser) return cb(null, { username: 'admin' })
        } catch (err) { }
        cb(null, false)
    })
}
