import React from "react";
import Immutable from "immutable";
import Highcharts from "react-highcharts";
import 'highcharts-more-node';
import {PropTypes} from "react";
import utils from "common/utils";
import ChainTypes from "../Utility/ChainTypes";
import {ChainStore} from "bitsharesjs/es";
import { Asset, Price } from "common/MarketClasses";
import MarketUtils from "common/market_utils";
import MarketsStore from "stores/MarketsStore";

class AccountTreemap extends React.Component {

    static propTypes = {
        balanceAssets: ChainTypes.ChainAssetsList,
        core_asset: ChainTypes.ChainAsset.isRequired
    };

    static defaultProps = {
        balanceAssets: [],
        core_asset: "1.3.0"
    }

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return (
            !utils.are_equal_shallow(nextProps.balanceAssets, this.props.balanceAssets)
        );
    }

    _calculateVisualAssetData() {
        const {core_asset, balanceAssets} = this.props;
        let {settings, hiddenAssets, orders} = this.props;
        let preferredUnit = settings.get("unit") || core_asset.get("symbol");
        let showAssetPercent = settings.get("showAssetPercent", false);

        const renderBorrow = (asset, account) => {
            let isBitAsset = asset && asset.has("bitasset_data_id");
            let modalRef = "cp_modal_" + asset.get("id");
            return {
                isBitAsset,
                borrowModal: !isBitAsset ? null : <BorrowModal
                    ref={modalRef}
                    quote_asset={asset.get("id")}
                    backing_asset={asset.getIn(["bitasset", "options", "short_backing_asset"])}
                    account={account}
                />,
                borrowLink: !isBitAsset ? null : <a onClick={() => {ReactTooltip.hide();this.refs[modalRef].show();}}><Icon name="dollar" className="icon-14px" /></a>
            };
        };

        let balances = [];
        const emptyCell = "-";

        balanceList.forEach( balance => {
            let balanceObject = ChainStore.getObject(balance);
            let asset_type = balanceObject.get("asset_type");
            let asset = ChainStore.getObject(asset_type);

            let directMarketLink, settleLink, transferLink;
            let symbol = "";
            if (!asset) return null;

            const assetName = asset.get("symbol");
            const notCore = asset.get("id") !== "1.3.0";
            const notCorePrefUnit = preferredUnit !== core_asset.get("symbol");

            let {market} = assetUtils.parseDescription(asset.getIn(["options", "description"]));
            symbol = asset.get("symbol");
            if (symbol.indexOf("OPEN.") !== -1 && !market) market = "USD";
            let preferredMarket = market ? market : preferredUnit;

            if (notCore && preferredMarket === symbol) preferredMarket = core_asset.get("symbol");

            /* Table content */
            directMarketLink = notCore ?
                <Link to={`/market/${asset.get("symbol")}_${preferredMarket}`}><Icon name="trade" className="icon-14px" /></Link> :
                notCorePrefUnit ? <Link to={`/market/${asset.get("symbol")}_${preferredUnit}`}><Icon name="trade" className="icon-14px" /></Link> :
                emptyCell;
            transferLink = <a onClick={this.triggerSend.bind(this, asset.get("id"))}><Icon name="transfer" className="icon-14px" /></a>;

            let {isBitAsset, borrowModal, borrowLink} = renderBorrow(asset, this.props.account);

            /* Popover content */
            settleLink = <a href onClick={this._onSettleAsset.bind(this, asset.get("id"))}>
                <Icon name="settle" className="icon-14px" />
            </a>;

            const includeAsset = !hiddenAssets.includes(asset_type);
            const hasBalance = !!balanceObject.get("balance");
            const hasOnOrder = !!orders[asset_type];

            const thisAssetName = asset.get("symbol").split(".");
            const canDeposit =
                (
                    (thisAssetName[0] == "OPEN" || thisAssetName[0] == "RUDEX") &&
                    !!this.props.backedCoins.get("OPEN", []).find(a => a.backingCoinType === thisAssetName[1]) ||
                    !!this.props.backedCoins.get("RUDEX", []).find(a => a.backingCoin === thisAssetName[1])
                ) || asset.get("symbol") == "BTS";

            const canDepositWithdraw = !!this.props.backedCoins.get("OPEN", []).find(a => a.symbol === asset.get("symbol"));
            const canWithdraw = canDepositWithdraw && (hasBalance && balanceObject.get("balance") != 0);
            const canBuy = !!this.props.bridgeCoins.get(symbol);

            let amount = Number(balanceObject.get("balance"));
            const finalValue = MarketUtils.convertValue(amount, ChainStore.getAsset(preferredUnit), asset, false, MarketsStore.getState().allMarketStats, core_asset);

            balances.push({
                "name": asset.get("symbol"),
                "value": finalValue
            });
        });

        console.log(balances);

        return ({
            "name": "Assets",
            "children": balances
        });
    }

    render() {
        let {balanceAssets} = this.props;
        balanceAssets = balanceAssets.toJS();
        let accountBalances = null;

        if (balanceAssets && balanceAssets.length > 0) {
            accountBalances = balanceAssets.map((balance, index) => {
                let balanceObject = ChainStore.getObject(balance);
                let asset_type = balanceObject.get("asset_type");
                let asset = ChainStore.getObject(asset_type);
                return {
                        name: asset.symbol,
                        value: utils.get_asset_amount(balanceObject.amount, asset),
                        colorValue: index
                    };

            });
        }

        if (accountBalances && accountBalances.length === 1 && accountBalances[0].value === 0) {
            accountBalances = null;
        }

        console.log("here");
        console.log(accountBalances);
        console.log(balanceAssets);

        let config = {
            chart: {
                backgroundColor: "rgba(255, 0, 0, 0)",
                height: 125,
                spacingLeft: 0,
                spacingRight: 0,
                spacingBottom: 0
            },
            colorAxis: {
                minColor: "#FCAB53",
                maxColor: "#50D2C2"
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                treemap: {
                    animation: false,
                    tooltip: {
                        pointFormat: "<b>{point.name}</b>: {point.value:,.0f}"
                    }
                }
            },
            series: [{
                type: "treemap",
                levels: [{
                    level: 1,
                    layoutAlgorithm: "sliceAndDice",
                    dataLabels: {
                        enabled: true,
                        align: "center",
                        verticalAlign: "middle",
                        style: {
                            fontSize: "13px",
                            fontWeight: "bold"
                        }
                    }
                }],
                data: accountBalances
        }],
            title: {
                text: null
            }
        };

        return (
            accountBalances ? <Highcharts config={config}/> : <div></div>
        );
    }
}

export default AccountTreemap;
