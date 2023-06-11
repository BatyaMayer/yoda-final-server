const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const pathToKey = path.join(__dirname, 'keys', 'id_rsa_priv.pem')
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8')

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

function validToken(token) {

    const tokenVerify = jsonwebtoken.verify(token, PRIV_KEY, { algorithms: ['RS256'] })
    console.log(token === tokenVerify)
    return token === tokenVerify
}


function issueJWT(user) {
    const __id = user.__id
    const expiresIn = Math.floor(Date.now() / 1000) + (10 * 60) // 10 minutes for testing 

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
module.exports.validToken = validToken
module.exports.issueJWT = issueJWT