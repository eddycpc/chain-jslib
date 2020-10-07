import secp256k1 from 'secp256k1';
import ow from 'ow';
import randomBytes from 'randombytes';

import { owPrivKey, owOptionalToPubKeyOptions } from './ow.types';
import { Bytes } from '../utils/bytes/bytes';

export class KeyPair {
    private privKey: Bytes;

    /**
     * Constructor to create a KeyPair
     * @param {Bytes} privKey private key
     * @throws {Error} private key is invalid
     * @returns {KeyPair}
     * @memberof KeyPair
     */
    constructor(privKey: Bytes) {
        ow(privKey, owPrivKey);

        // `Bytes` is immutable, so no clone is needed
        this.privKey = privKey;
    }

    /**
     * Create a KeyPair from private key
     * @param {Bytes} privKey private key
     * @throws {Error} private key is invalid
     * @returns {KeyPair}
     * @memberof KeyPair
     */
    public static fromPrivKey(privKey: Bytes): KeyPair {
        ow(privKey, 'privKey', owPrivKey);

        return new KeyPair(privKey);
    }

    /**
     * generates random private key and returns KeyPair of it
     * @returns {KeyPair} generated KeyPair
     * @memberof KeyPair
     */
    public static generateRandom(): KeyPair {
        let privKey: Buffer;
        do {
            privKey = randomBytes(32);
        } while (!secp256k1.privateKeyVerify(privKey));

        return new KeyPair(new Bytes(privKey));
    }

    /**
     * Return the private key of the KeyPair
     * @returns {Bytes}
     * @memberof KeyPair
     */
    public toPrivKey(): Bytes {
        return this.privKey;
    }

    /**
     * Return the public key of the KeyPair in compressed or uncompressed form
     * @param {PubKeyOptions} [options] public key options
     * @param {boolean} options.compressed=true Whether public is compressed or not
     * @throws {Error} compressed argument is invalid
     * @returns {Bytes} public key in compressed or uncompressed form
     * @memberof KeyPair
     */
    public toPubKey(options?: PubKeyOptions): Bytes {
        ow(options, owOptionalToPubKeyOptions as any);

        const compressed = typeof options?.compressed === 'undefined' ? true : options.compressed;
        return new Bytes(secp256k1.publicKeyCreate(this.privKey.toUint8Array(), compressed));
    }

    /**
     * Sign a message using the private key in KeyPair
     * @param {Uint8Arry} message message to sign
     * @throws {Error} message is invalid
     * @returns {Bytes} signature
     * @memberof KeyPair
     */
    public sign(message: Uint8Array): Bytes {
        ow(message, ow.uint8Array);

        // secp256k1 uses RFC6979 for nonce generation
        // https://github.com/cryptocoinjs/secp256k1-node/issues/10
        const { signature } = secp256k1.ecdsaSign(message, this.privKey.toUint8Array());
        return new Bytes(signature);
    }
}

type PubKeyOptions = {
    compressed: boolean;
};
