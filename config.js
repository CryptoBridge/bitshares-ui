const env = process.env.NODE_ENV || "development";
const debug = env === "development";

console.log("#### PROCESS.ENV=", process.env);

const config = {
    env,
    debug,
    support: {
        url: process.env.SUPPORT_URL || "http://localhost:3000",
        publicKey: process.env.SUPPORT_PUBLIC_KEY || "",
        coinsApi: {
            url: process.env.API_COINS_URL || ""
        },
        tradingPairsApi: {
            url: process.env.API_TRADING_PAIRS_URL || ""
        },
        freshdesk: {
            apiKey: process.env.FRESHDESK_API_KEY || ""
        },
        recaptcha: {
            siteKey: process.env.RECAPTCHA_SITE_KEY || ""
        }
    }
};

export default config;
