import ls from "./localStorage";
import {cryptoBridgeAPIs} from "api/apiConfig";
import {availableGateways} from "common/gateways";
const blockTradesStorage = new ls("");

/* CRYPTOBRIDGE */
import {getBasicHeaders} from "api/cryptobridge/apiHelpers";
import {getCleanAssetSymbol} from "lib/cryptobridge/assetMethods";
/* /CRYPTOBRIDGE */

let fetchInProgess = {};
let fetchCache = {};
let clearIntervals = {};
const fetchCacheTTL = 30000;
function setCacheClearTimer(key) {
    clearIntervals[key] = setTimeout(() => {
        delete fetchCache[key];
        delete clearIntervals[key];
    }, fetchCacheTTL);
}

export function fetchCoins(
    url = cryptoBridgeAPIs.BASE_V1 + cryptoBridgeAPIs.COINS_LIST
) {
    const key = "fetchCoins_" + url;
    let currentPromise = fetchInProgess[key];
    if (fetchCache[key]) {
        return Promise.resolve(fetchCache[key]);
    } else if (!currentPromise) {
        fetchInProgess[key] = currentPromise = fetch(url)
            .then(reply =>
                reply.json().then(result => {
                    // throw new Error("Test");
                    return result;
                })
            )
            .catch(err => {
                console.log(`fetchCoins error from ${url}: ${err}`);
                throw err;
            });
    }
    return new Promise((res, rej) => {
        currentPromise
            .then(result => {
                fetchCache[key] = result;
                res(result);
                delete fetchInProgess[key];
                if (!clearIntervals[key]) setCacheClearTimer(key);
            })
            .catch(rej);
    });
}

export function fetchCoinsSimple(
    url = cryptoBridgeAPIs.BASE_V1 + cryptoBridgeAPIs.COINS_LIST
) {
    return fetch(url)
        .then(reply =>
            reply.json().then(result => {
                return result;
            })
        )
        .catch(err => {
            console.log(`fetchCoinsSimple error from ${url}: ${err}`);
            throw err;
        });
}

export function fetchTradingPairs(
    url = cryptoBridgeAPIs.BASE_V1 + cryptoBridgeAPIs.TRADING_PAIRS
) {
    const key = "fetchTradingPairs_" + url;
    let currentPromise = fetchInProgess[key];
    if (fetchCache[key]) {
        return Promise.resolve(fetchCache[key]);
    } else if (!currentPromise) {
        fetchInProgess[key] = currentPromise = fetch(url, {
            method: "get",
            headers: new Headers({Accept: "application/json"})
        })
            .then(reply =>
                reply.json().then(result => {
                    return result;
                })
            )
            .catch(err => {
                console.log(`fetchTradingPairs error from ${url}: ${err}`);
                throw err;
            });
    }
    return new Promise((res, rej) => {
        currentPromise
            .then(result => {
                fetchCache[key] = result;
                res(result);
                delete fetchInProgess[key];
                if (!clearIntervals[key]) setCacheClearTimer(key);
            })
            .catch(rej);
    });
}

export function getDepositLimit(
    inputCoin,
    outputCoin,
    url = cryptoBridgeAPIs.BASE_V1 + cryptoBridgeAPIs.DEPOSIT_LIMIT
) {
    return fetch(
        url +
            "?inputCoinType=" +
            encodeURIComponent(inputCoin) +
            "&outputCoinType=" +
            encodeURIComponent(outputCoin),
        {method: "get", headers: new Headers({Accept: "application/json"})}
    )
        .then(reply =>
            reply.json().then(result => {
                return result;
            })
        )
        .catch(err => {
            console.log(
                "error fetching deposit limit of",
                inputCoin,
                outputCoin,
                err
            );
        });
}

export function estimateOutput(
    inputAmount,
    inputCoin,
    outputCoin,
    url = cryptoBridgeAPIs.BASE_V1 + cryptoBridgeAPIs.ESTIMATE_OUTPUT
) {
    return fetch(
        url +
            "?inputAmount=" +
            encodeURIComponent(inputAmount) +
            "&inputCoinType=" +
            encodeURIComponent(inputCoin) +
            "&outputCoinType=" +
            encodeURIComponent(outputCoin),
        {method: "get", headers: new Headers({Accept: "application/json"})}
    )
        .then(reply =>
            reply.json().then(result => {
                return result;
            })
        )
        .catch(err => {
            console.log(
                "error fetching deposit limit of",
                inputCoin,
                outputCoin,
                err
            );
        });
}

export function estimateInput(
    outputAmount,
    inputCoin,
    outputCoin,
    url = cryptoBridgeAPIs.BASE_V1 + cryptoBridgeAPIs.ESTIMATE_INPUT
) {
    return fetch(
        url +
            "?outputAmount=" +
            encodeURIComponent(outputAmount) +
            "&inputCoinType=" +
            encodeURIComponent(inputCoin) +
            "&outputCoinType=" +
            encodeURIComponent(outputCoin),
        {
            method: "get",
            headers: new Headers({Accept: "application/json"})
        }
    )
        .then(reply =>
            reply.json().then(result => {
                return result;
            })
        )
        .catch(err => {
            console.log(
                "error fetching deposit limit of",
                inputCoin,
                outputCoin,
                err
            );
        });
}

export function getActiveWallets(
    url = cryptoBridgeAPIs.BASE_V1 + cryptoBridgeAPIs.ACTIVE_WALLETS
) {
    const key = "getActiveWallets_" + url;
    let currentPromise = fetchInProgess[key];

    if (fetchCache[key]) {
        return Promise.resolve(fetchCache[key]);
    } else if (!currentPromise) {
        fetchInProgess[key] = currentPromise = fetch(url)
            .then(reply =>
                reply.json().then(result => {
                    return result;
                })
            )
            .catch(err => {
                console.log(
                    "error fetching blocktrades active wallets",
                    err,
                    url
                );
            });
    }

    return new Promise(res => {
        currentPromise.then(result => {
            fetchCache[key] = result;
            res(result);
            delete fetchInProgess[key];
            if (!clearIntervals[key]) setCacheClearTimer(key);
        });
    });
}

export function getDepositAddress({coin, account, stateCallback}) {
    const url = `${
        cryptoBridgeAPIs.BASE_V2
    }/accounts/${account}/assets/${getCleanAssetSymbol(coin)}/addresses/latest`;

    return fetch(url, {
        headers: getBasicHeaders()
    })
        .then(
            reply => {
                if (!reply.ok) {
                    throw new Error("Address not found");
                } else {
                    return reply.json().then(
                        json => {
                            const address = {
                                address: json.address,
                                memo: json.memo || null,
                                error: json.error || null,
                                loading: false
                            };
                            if (stateCallback) stateCallback(address);
                            return address;
                        },
                        error => {
                            throw new Error(error.message);
                        }
                    );
                }
            },
            error => {
                throw new Error(error.message);
            }
        )
        .catch(err => {
            if (stateCallback) {
                stateCallback({address: err.message, memo: null});
            }
            throw err;
        });
}

let depositRequests = {};
export function requestDepositAddress({
    inputCoinType,
    outputCoinType,
    outputAddress,
    url = cryptoBridgeAPIs.BASE_V2,
    stateCallback,
    selectedGateway
}) {
    let gatewayStatus = availableGateways[selectedGateway];
    inputCoinType =
        !!gatewayStatus && !!gatewayStatus.assetWithdrawlAlias
            ? gatewayStatus.assetWithdrawlAlias[inputCoinType.toLowerCase()] ||
              inputCoinType.toLowerCase()
            : inputCoinType;

    let body = {
        inputCoinType,
        outputCoinType,
        outputAddress
    };

    const account = outputAddress;

    let body_string = JSON.stringify(body);
    if (depositRequests[body_string]) return;
    depositRequests[body_string] = true;

    url = `${
        cryptoBridgeAPIs.BASE_V2
    }/accounts/${account}/assets/${getCleanAssetSymbol(
        inputCoinType
    )}/addresses`;

    return fetch(url, {
        method: "POST",
        headers: getBasicHeaders()
    })
        .then(
            reply => {
                reply.json().then(
                    json => {
                        delete depositRequests[body_string];
                        // console.log( "reply: ", json );
                        let address = {
                            address: json.address || "unknown",
                            memo: null,
                            error: json.error || null
                        };
                        if (stateCallback) stateCallback(address);
                    },
                    error => {
                        console.log("error: ", error);
                        delete depositRequests[body_string];
                        if (stateCallback) stateCallback(null);
                    }
                );
            },
            error => {
                console.log("error: ", error);
                delete depositRequests[body_string];
                if (stateCallback) stateCallback(null);
            }
        )
        .catch(err => {
            console.log("fetch error:", err);
            delete depositRequests[body_string];
        });
}

export function getBackedCoins({allCoins, tradingPairs, backer}) {
    let gatewayStatus = availableGateways[backer];
    let coins_by_type = {};

    // Backer has no coinType == backingCoinType but uses single wallet style
    if (!!gatewayStatus.singleWallet) {
        allCoins.forEach(
            coin_type => (coins_by_type[coin_type.backingCoinType] = coin_type)
        );
    }

    allCoins.forEach(
        coin_type => (coins_by_type[coin_type.coinType] = coin_type)
    );

    let allowed_outputs_by_input = {};
    tradingPairs.forEach(pair => {
        if (!allowed_outputs_by_input[pair.inputCoinType])
            allowed_outputs_by_input[pair.inputCoinType] = {};
        allowed_outputs_by_input[pair.inputCoinType][
            pair.outputCoinType
        ] = true;
    });

    let backedCoins = [];
    allCoins.forEach(inputCoin => {
        let outputCoin = coins_by_type[inputCoin.backingCoinType];
        if (
            inputCoin.walletSymbol.startsWith(backer + ".") &&
            inputCoin.backingCoinType &&
            outputCoin
        ) {
            let isDepositAllowed =
                inputCoin.depositAllowed &&
                allowed_outputs_by_input[inputCoin.backingCoinType] &&
                allowed_outputs_by_input[inputCoin.backingCoinType][
                    inputCoin.coinType
                ];
            let isWithdrawalAllowed =
                inputCoin.withdrawalAllowed &&
                allowed_outputs_by_input[inputCoin.coinType] &&
                allowed_outputs_by_input[inputCoin.coinType][
                    inputCoin.backingCoinType
                ];

            backedCoins.push({
                name: outputCoin.name,
                intermediateAccount: !!gatewayStatus.intermediateAccount
                    ? gatewayStatus.intermediateAccount
                    : outputCoin.intermediateAccount,
                gateFee: outputCoin.gateFee || outputCoin.transactionFee,
                walletType: outputCoin.walletType,
                backingCoinType: !!gatewayStatus.singleWallet
                    ? inputCoin.backingCoinType.toUpperCase()
                    : outputCoin.walletSymbol,
                minAmount: outputCoin.minAmount || 0,
                maxAmount: outputCoin.maxAmount || 999999999,
                symbol: inputCoin.walletSymbol,
                supportsMemos: outputCoin.supportsOutputMemos,
                depositAllowed: isDepositAllowed,
                withdrawalAllowed: isWithdrawalAllowed,

                /* CRYPTOBRIDGE */

                requiredConfirmations: outputCoin.requiredConfirmations,
                withdrawalPaymentIdEnabled:
                    outputCoin.withdrawalPaymentIdEnabled,

                depositAccount: outputCoin.depositAccount,
                depositFee: outputCoin.depositFee,
                depositFeeEnabled: outputCoin.depositFeeEnabled,
                depositFeeTimeframe: outputCoin.depositFeeTimeframe,
                depositFeePercentage: outputCoin.depositFeePercentage,
                depositFeeMinimum: outputCoin.depositFeeMinimum,
                depositFeePercentageLowAmounts:
                    outputCoin.depositFeePercentageLowAmounts,

                info: outputCoin.info,
                scoring: outputCoin.scoring,
                badges: outputCoin.badges

                /* /CRYPTOBRIDGE */
            });
        }
    });
    return backedCoins;
}

export function validateAddress({
    url = cryptoBridgeAPIs.BASE_V2,
    account,
    walletType,
    newAddress,
    output_coin_type = null,
    method = null
}) {
    if (!newAddress) return new Promise(res => res());

    /* CRYPTOBRIDGE */
    url = `${
        cryptoBridgeAPIs.BASE_V2
    }/accounts/${account}/assets/${getCleanAssetSymbol(
        output_coin_type
    )}/addresses/validate?address=${encodeURIComponent(newAddress)}`;

    return fetch(url, {
        headers: getBasicHeaders()
    })
        .then(reply => {
            return reply.ok;
        })
        .catch(e => {
            console.log("validateAddress error", e);
        });
    /* /CRYPTOBRIDGE */
}

let _conversionCache = {};
export function getConversionJson(inputs) {
    const {input_coin_type, output_coin_type, url, account_name} = inputs;
    if (!input_coin_type || !output_coin_type) return Promise.reject();
    const body = JSON.stringify({
        inputCoinType: input_coin_type,
        outputCoinType: output_coin_type,
        outputAddress: account_name,
        inputMemo:
            "blocktrades conversion: " +
            input_coin_type +
            "to" +
            output_coin_type
    });

    const _cacheString =
        url + input_coin_type + output_coin_type + account_name;
    return new Promise((resolve, reject) => {
        if (_conversionCache[_cacheString])
            return resolve(_conversionCache[_cacheString]);
        fetch(url + "/simple-api/initiate-trade", {
            method: "post",
            headers: new Headers({
                Accept: "application/json",
                "Content-Type": "application/json"
            }),
            body: body
        })
            .then(reply => {
                reply
                    .json()
                    .then(json => {
                        _conversionCache[_cacheString] = json;
                        resolve(json);
                    }, reject)
                    .catch(reject);
            })
            .catch(reject);
    });
}

function hasWithdrawalAddress(wallet) {
    return blockTradesStorage.has(`history_address_${wallet}`);
}

function setWithdrawalAddresses({wallet, addresses}) {
    blockTradesStorage.set(`history_address_${wallet}`, addresses);
}

function getWithdrawalAddresses(wallet) {
    return blockTradesStorage.get(`history_address_${wallet}`, []);
}

function setLastWithdrawalAddress({wallet, address}) {
    blockTradesStorage.set(`history_address_last_${wallet}`, address);
}

function getLastWithdrawalAddress(wallet) {
    return blockTradesStorage.get(`history_address_last_${wallet}`, "");
}

export const WithdrawAddresses = {
    has: hasWithdrawalAddress,
    set: setWithdrawalAddresses,
    get: getWithdrawalAddresses,
    setLast: setLastWithdrawalAddress,
    getLast: getLastWithdrawalAddress
};
