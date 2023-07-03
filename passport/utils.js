const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const pathToPrivKey = path.join(__dirname, 'keys', 'id_rsa_priv.pem')
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8')



function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex')
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    return {
        salt: salt,
        hash: genHash
    }
}

function validPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === hashVerify
}


function validateToken(req, res, next) {
    const authHeader = req.headers['authorization']


    if (!authHeader) {
        return res.status(403).send({ error: 'No token provided' })
    }
    const token = authHeader.replace(/^Bearer\s/, '')

    try {
        const decodedToken = jsonwebtoken.verify(token, PRIV_KEY, { algorithms: ['RS256'] })
        const userId = decodedToken.sub
        req.user = userId

        next()
    } catch (err) {
        return res.status(403).send({ error: 'Failed to authenticate token' })
    }
}


function issueJWT(user) {
    const __id = user._id

    // const expiresIn = Math.floor(Date.now() / 1000) + (10 * 60) // 10 minutes for testing 
    const expiresIn = '1d'

    const payload = {
        sub: __id,
        iat: Date.now()

    }
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' })
    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}


module.exports.genPassword = genPassword
module.exports.validPassword = validPassword
module.exports.validateToken = validateToken
module.exports.issueJWT = issueJWT