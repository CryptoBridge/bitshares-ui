import React from "react";
import CryptoBridgeGatewayDepositRequest from "../DepositWithdraw/cryptobridge/CryptoBridgeGatewayDepositRequest";
import { DropdownList } from "react-widgets";
import Translate from "react-translate-component";
import { connect } from "alt-react";
import CryptoBridgeStore from "stores/CryptoBridgeStore";
import CryptoBridgeActions from "actions/CryptoBridgeActions";
import SettingsStore from "stores/SettingsStore";
import SettingsActions from "actions/SettingsActions";
import { RecentTransactions, TransactionWrapper } from "components/Account/RecentTransactions";
import Immutable from "immutable";
import cnames from "classnames";
import LoadingIndicator from "../LoadingIndicator";
import { cryptoBridgeAPIs } from "../../api/apiConfig";
import AssetName from "../Utility/AssetName";
import AssetImage from "../Utility/AssetImage";

class CryptoBridgeGateway extends React.Component {
    constructor(props) {
        super();

        const action = props.viewSettings.get(`${props.provider}Action`, "deposit");
        const activeCoin = this._getActiveCoin(props, {action});

        this.state = {
            action,
            activeCoin
        };
    }

    _getActiveCoin(props, state) {
        let cachedCoin = props.viewSettings.get(`activeCoin_${props.provider}`, null);
		let firstTimeCoin = null;
		if (props.provider == 'cryptobridge') {
			firstTimeCoin = 'BCO';
		}
        let activeCoin = cachedCoin ? cachedCoin : firstTimeCoin;
        console.log('Active COIN = ', activeCoin);
        return activeCoin;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.provider !== this.props.provider) {
            this.setState({
                activeCoin: this._getActiveCoin(nextProps, this.state.action)
            });
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextState.action !== this.state.action) {
    //         this.setState({
    //             activeCoin: this._getActiveCoin(nextProps, nextState)
    //         });
    //     }

    //     return true;
    // }

    onSelectCoin(selectedCoin) {

        const activeCoin = (this.state.action === "deposit" ? selectedCoin.backingCoinType : selectedCoin.symbol).toUpperCase().replace('BRIDGE.', '');

        let setting = {};
        setting[`activeCoin_${this.props.provider}`] = activeCoin;
        SettingsActions.changeViewSetting(setting);

        this.setState({ activeCoin });
    }

    changeAction(type) {

        let activeCoin = this._getActiveCoin(this.props, {action: type});

        console.log(activeCoin);
        this.setState({
            action: type,
            activeCoin: activeCoin
        });

        SettingsActions.changeViewSetting({[`${this.props.provider}Action`]: type});
    }

    render() {
        let {coins, account, provider} = this.props;
        let {activeCoin, action} = this.state;
        if (!coins.length) {
            return <LoadingIndicator />;
        }

        let filteredCoins = coins.filter(a => {
            if (!a || !a.symbol) {
                return false;
            } else {
                return action === "deposit" ? a.depositAllowed : a.withdrawalAllowed;
            }
        });

        let coin = filteredCoins.filter(coin => {
            return (action === "deposit" ? coin.backingCoinType.toUpperCase().replace('BRIDGE.', '') === activeCoin : coin.symbol.toUpperCase().replace('BRIDGE.', '') === activeCoin);
        })[0];

        if (!coin) coin = filteredCoins[0];

        let issuers = {
            cryptobridge: {name: "cryptobridge", id: "1.2.374566", support: "support@crypto-bridge.org"},
        };

        let issuer = issuers[provider];

        let isDeposit = this.state.action === "deposit";

        const CoinComponent = ({ item }) => {

            return (
                <span>
                    <AssetImage style={{height:"24px",marginRight:"10px"}} name={item.symbol} />
                    <strong><AssetName name={item.symbol} noTip={true} /></strong> ({item.name})
                </span>
            );
        };

        return (

            <div style={this.props.style}>
                <div className="grid-block no-margin vertical medium-horizontal no-padding">
                    <div className="medium-4">
                        <div>
                            <label style={{minHeight: "2rem"}} className="left-label"><Translate content={"gateway.choose_" + action} />: </label>
                            <DropdownList
                                filter
                                data={filteredCoins}
                                value={coin}
                                defaultValue={coin}
                                valueComponent={CoinComponent}
                                itemComponent={CoinComponent}
                                textField={(item) => { return item.symbol.replace(/^BRIDGE\./, ''); }}
                                onChange={this.onSelectCoin.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="medium-6 medium-offset-1">
                        <label style={{minHeight: "2rem"}} className="left-label"><Translate content="gateway.gateway_text" />:</label>
                        <div style={{paddingBottom: 15}}>
                            <ul className="button-group segmented no-margin">
                            <li className={action === "deposit" ? "is-active" : ""}><a onClick={this.changeAction.bind(this, "deposit")}><Translate content="gateway.deposit" /></a></li>
                            <li className={action === "withdraw" ? "is-active" : ""}><a onClick={this.changeAction.bind(this, "withdraw")}><Translate content="gateway.withdraw" /></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {!coin ? <LoadingIndicator/> :
                <div>


                    <div style={{marginBottom: 15}}>

                        <CryptoBridgeGatewayDepositRequest
                            key={`${provider}.${coin.symbol}`}
                            gateway={provider}
                            issuer_account={issuer.name}
                            account={account}
                            deposit_asset={coin.backingCoinType.toUpperCase().replace('BRIDGE.', '')}
                            deposit_asset_name={coin.name}
                            deposit_coin_type={coin.backingCoinType.toLowerCase()}
                            deposit_account={coin.depositAccount}
                            deposit_wallet_type={coin.walletType}
                            receive_asset={coin.symbol}
                            receive_coin_type={coin.symbol.toLowerCase()}
                            supports_output_memos={coin.supportsMemos}
                            transactionFee={coin.transactionFee}
                            symbol={coin.symbol}
                            required_confirmations={coin.requiredConfirmations}
                            action={this.state.action}
                            url={cryptoBridgeAPIs.BASE}
                        />
                        <label className="left-label">Support</label>
                        <div><Translate content="gateway.support_block_cb" /><br /><br /><a href={"mailto:" + issuer.support}>{issuer.support}</a></div>
                    </div>

                    {coin && coin.symbol ?
                    <TransactionWrapper
                        asset={coin.symbol}
                        fromAccount={
                            isDeposit ? (issuer.id) :
                            this.props.account.get("id")
                        }
                        to={
                            isDeposit ? ( this.props.account.get("id") ) :
                            (issuer.id)
                        }

                    >
                        { ({asset, to, fromAccount}) => {
                            return <RecentTransactions
                                accountsList={Immutable.List([this.props.account.get("id")])}
                                limit={10}
                                compactView={true}
                                fullHeight={true}
                                filter="transfer"
                                title={<Translate content={"gateway.recent_" + this.state.action} />}
                                customFilter={{
                                    fields: ["to", "from", "asset_id"],
                                    values: {
                                        to: to.get("id"),
                                        from: fromAccount.get("id") ,
                                        asset_id: asset.get("id")
                                    }
                                }}
                            />;
                        }
                        }
                    </TransactionWrapper> : null}
                </div>
                }
            </div>
        )
    }
}

export default connect(CryptoBridgeGateway, {
    listenTo() {
        return [SettingsStore];
    },
    getProps() {
        return {
            viewSettings: SettingsStore.getState().viewSettings
        };
    }
});
