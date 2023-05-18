const crypto = require('crypto')
const fs = require('fs')


function genKeyPair() {

    const publicKeyPath = './id_rsa_pub.pem';
    const privateKeyPath = './id_rsa_priv.pem';

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

    
    try {
        if (!fs.existsSync(publicKeyPath)) {
          fs.writeFileSync(publicKeyPath, keyPair.publicKey);
        }
      
        if (!fs.existsSync(privateKeyPath)) {
          fs.writeFileSync(privateKeyPath, keyPair.privateKey);
        }
        console.log('PEM files created successfully.');
      } catch (err) {
        console.error('Error creating PEM files:', err);
      }
      
}

module.exports = genKeyPair;
