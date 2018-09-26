/**
 * The Support Container component
 *
 * A wrapper component that passes in data from various stores.
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import React from "react";
import AltContainer from "alt-container";
import Support from "./Support";
import BindToChainState from "../Utility/BindToChainState";
import GatewayStore from "stores/GatewayStore";
import MarketsStore from "stores/MarketsStore";
import AccountStore from "stores/AccountStore";
import SettingsStore from "stores/SettingsStore";
import WalletUnlockStore from "stores/WalletUnlockStore";
import IntlStore from "stores/IntlStore";
import Translate from "react-translate-component";
import {connect} from "alt-react";
import {withRouter} from "react-router-dom";
import WalletDb from "../../stores/WalletDb";
import AccountActions from "../../actions/AccountActions";
import WalletUnlockActions from "../../actions/WalletUnlockActions";
import {ChainStore} from "bitsharesjs";
import {log} from "./SupportUtils";

class SupportContainer extends React.Component {
    componentWillMount() {
        if (WalletDb.isLocked()) {
            this._unlockWallet();
        }
    }

    _unlockWallet = () => {
        WalletUnlockActions.unlock()
            .then(() => {
                AccountActions.tryToSetCurrentAccount();
            })
            .catch(error => {
                log(
                    `SupportContainer.jsx:_unlockWallet() - WalletUnlockActions.unlock catch() (${error})`
                );
            });
    };

    render() {
        return (
            <AltContainer
                stores={[
                    GatewayStore,
                    MarketsStore,
                    AccountStore,
                    SettingsStore,
                    WalletUnlockStore,
                    IntlStore
                ]}
                inject={{
                    settings: () => {
                        return SettingsStore.getState().settings;
                    },
                    defaults: () => {
                        return SettingsStore.getState().defaults;
                    }
                }}
            >
                {WalletDb.isLocked() ? (
                    <div className="support-login">
                        <div className="small-10 medium-6 large-4 xlarge-3 text-center">
                            <Translate
                                component="h3"
                                content="header.support"
                            />

                            <div className="support-login__content">
                                <div className="content-block">
                                    <Translate
                                        component="p"
                                        content="cryptobridge.support.support_intro_text"
                                    />
                                    <div>
                                        <Translate
                                            content="header.unlock_short"
                                            component="button"
                                            className="button primary"
                                            onClick={this._unlockWallet}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Support {...this.props} />
                )}
            </AltContainer>
        );
    }
}

SupportContainer = BindToChainState(SupportContainer, {
    auth_required: true,
    auth_required_redirect_home: true
});

SupportContainer = withRouter(SupportContainer);

export default connect(SupportContainer, {
    listenTo() {
        return [AccountStore, SettingsStore, GatewayStore];
    },
    getProps() {
        const currentAccount = AccountStore.getState().currentAccount;

        return {
            account: ChainStore.getAccount(currentAccount, false),
            servicesDown: GatewayStore.getState().down || {}
        };
    }
});
