import {ChainConfig} from "bitsharesjs-ws";

export default class {
    static overrideChainConfigNetworksTestSetting() {
        ChainConfig.networks.Test = {
            core_asset: "BTS",
            address_prefix: "BTS",
            chain_id:
                "2821abbb9923c830cf8300136c431674756270d9019f56c00e80b296e3afc079"
        };
    }
}
