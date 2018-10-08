/**
 * Bitshares Helper Functions
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import {Aes} from "bitsharesjs/es";
import {PublicKey, TransactionHelper} from "bitsharesjs";
import WalletDb from "../../stores/WalletDb";
import {log} from "./SupportUtils";
import config from "../../../config";

/**
 * Signs a memo using the sender's private key, recipient's public key, and nonce
 *
 * @param senderPrivateKey
 * @param recipientPublicKey
 * @param nonce
 * @param memo
 * @returns {string|*}
 */
export const signMemoWithKeys = (
    senderPrivateKey,
    recipientPublicKey,
    nonce,
    memo
) => {
    try {
        return Aes.encrypt_with_checksum(
            senderPrivateKey,
            recipientPublicKey,
            nonce,
            Buffer.from(memo)
        ).toString("hex");
    } catch (error) {
        log(`BitsharesHelpers.js:signMemoWithKeys() - ${error}`);
    }
};

/**
 * Generates API request options
 *
 * @param account
 * @returns {{
 *     headers : {
 *         'Content-Type' : string,
 *         Authorization : string,
 *         'X-CryptoBridge-Nonce' : *,
 *         'X-CryptoBridge-Account' : *
 *     },
 *     mode : string
 * }}
 */
export const generateRequestOptions = account => {
    const username = account.get("name");
    const memoPublicKeyStr = account.getIn(["options", "memo_key"]);
    const memoPrivateKey = WalletDb.getPrivateKey(memoPublicKeyStr);
    const recipientPublicKeyStr = config.support.publicKey;
    const recipientPublicKey = PublicKey.fromPublicKeyString(
        recipientPublicKeyStr
    );
    const nonce = TransactionHelper.unique_nonce_uint64();

    const token = signMemoWithKeys(
        memoPrivateKey,
        recipientPublicKey,
        nonce,
        username
    );
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            "X-CryptoBridge-Nonce": nonce,
            "X-CryptoBridge-Account": username
        },
        mode: "cors"
    };

    return options;
};
