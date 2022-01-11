import { createPublicKey, generateKeyPairSync, sign } from 'crypto';
import { Transaction } from '../../types';

export class CryptoService {
    generateKeys(): { publicKey: string, privateKey: string } {
        const keyPair = generateKeyPairSync('ed25519' ,{
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });

        return {
            publicKey: this.stripKeyPadding(keyPair.publicKey),
            privateKey: this.stripKeyPadding(keyPair.privateKey)
        }
    }

    getPublicKey(privateKey: string): string {
        try {
            const publicKey = createPublicKey({
                key: this.addPrivateKeyPadding(privateKey),
                format: 'pem'
            }).export({
                format: 'pem',
                type: 'spki'
            })

            return this.stripKeyPadding(publicKey as string)
        } catch (e) {
            return null
        }
    }

    signTransaction(privateKey: string, tx: Transaction): string {
        return sign('SHA256', Buffer.from(tx.from + tx.to + tx.amount+tx.node), {
            key: this.addPrivateKeyPadding(privateKey),
            format: 'pem'
        }).toString('base64')
    }

    stripKeyPadding(string: string): string {
        return string.split('\n')[1]
    }

    addPublicKeyPadding(string: string): string {
        return '-----BEGIN PUBLIC KEY-----\n'+string+'\n-----END PUBLIC KEY-----';
    }

    addPrivateKeyPadding(string: string): string {
        return '-----BEGIN PRIVATE KEY-----\n'+string+'\n-----END PRIVATE KEY-----';
    }
}