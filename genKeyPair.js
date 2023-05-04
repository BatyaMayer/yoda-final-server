const crypto = require('crypto')
const fs = require('fs')

function genKeyPair() {

    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    })

    // Create public key file
    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey)

    // Create private key file
    fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey)

}


genKeyPair()