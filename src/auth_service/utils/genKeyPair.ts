import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export function generateKeyPair () {
    const publicKeyPath = path.join(__dirname, '../id_rsa_pub.pem');
    const privateKeyPath = path.join(__dirname, '../id_rsa_prv.pem');
    try {
        if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
            return;
        }
    } catch(err) {
        console.log('Error Check if KEYPAIR files are correct or file name and exstension is correct = ', err);
        return;
    }
    const keyPair = crypto.generateKeyPairSync("rsa", {
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
    fs.writeFileSync(publicKeyPath, keyPair.publicKey);
    fs.writeFileSync(privateKeyPath, keyPair.privateKey);
}