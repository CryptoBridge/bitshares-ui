import alt from "alt-instance";

/**
 *  @brief  Actions for CB Support
 */
class SupportActions {
    setCurrentAccount(account) {
        return dispatch => {
            dispatch(account);
            return account;
        };
    }

    getCurrentAccount() {
        return account;
    }

    resetCurrentAccount(account) {
        return account;
    }
}

export default alt.createActions(SupportActions);
