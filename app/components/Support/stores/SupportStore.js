import BaseStore from "../../../stores/BaseStore";
import alt from "alt-instance";
import SupportActions from "../actions/SupportActions";
import ls from "common/localStorage";
import Immutable from "immutable";

let supportStorage = new ls("__cryptobridge__");

/**
 *  This Store holds information about accounts in this wallet
 *
 */
class SupportStore extends BaseStore {
    constructor() {
        super();

        this.state = {
            currentAccount: Immutable.Map()
        };

        this.bindListeners({
            handleSetCurrentAccount: SupportActions.setCurrentAccount,
            handleGetCurrentAccount: SupportActions.getCurrentAccount,
            handleResetCurrentAccount: SupportActions.resetCurrentAccount
        });
    }

    handleSetCurrentAccount(currentAccount) {
        this.setState({
            currentAccount: Immutable.Map(
                supportStorage.get("currentAccount", {
                    currentAccount
                })
            )
        });

        supportStorage.set("currentAccount", currentAccount);
    }

    handleGetCurrentAccount() {
        return this.state.currentAccount;
    }

    handleResetCurrentAccount() {
        this.handleSetCurrentAccount(null);
    }
}

export default alt.createStore(SupportStore, "SupportStore");
