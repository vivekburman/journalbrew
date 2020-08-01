import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export function generateKeyPair () {
    const accessTokenPublicKeyPath = path.join(__dirname, '../id_access_rsa_pub.pem');
    const accessTokenPrivateKeyPath = path.join(__dirname, '../id_access_rsa_prv.pem');

    const refreshTokenPublicKeyPath = path.join(__dirname, '../id_refresh_rsa_pub.pem');
    const refreshTokenPrivateKeyPath = path.join(__dirname, '../id_refresh_rsa_prv.pem');

    try {
        if (fs.existsSync(accessTokenPublicKeyPath) && fs.existsSync(accessTokenPrivateKeyPath) 
            && fs.existsSync(refreshTokenPublicKeyPath) && fs.existsSync(refreshTokenPrivateKeyPath)) {
            return;
        }
    } catch(err) {
        console.log('Error Check if KEYPAIR files are correct or file name and exstension is correct = ', err);
        return;
    }
    const accessTokenKeyPair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });
    const refreshTokenKeyPair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
    fs.writeFileSync(accessTokenPublicKeyPath, accessTokenKeyPair.publicKey);
    fs.writeFileSync(accessTokenPrivateKeyPath, accessTokenKeyPair.privateKey);

    fs.writeFileSync(refreshTokenPublicKeyPath, refreshTokenKeyPair.publicKey);
    fs.writeFileSync(refreshTokenPrivateKeyPath, refreshTokenKeyPair.privateKey);
}