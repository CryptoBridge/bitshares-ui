import React from "react";
import PropTypes from "prop-types";
import Translate from "react-translate-component";
import {ChainStore, FetchChain} from "bitsharesjs/es";
import counterpart from "counterpart";
import AccountActions from "actions/AccountActions";
import WalletUnlockActions from "actions/WalletUnlockActions";
import WalletActions from "actions/WalletActions";
import AccountStore from "stores/AccountStore";
import WalletDb from "stores/WalletDb";
import TransactionConfirmStore from "stores/TransactionConfirmStore";
import utils from "common/utils";
import AccountNameInput from "./../Forms/AccountNameInputStyleGuide";
import PasswordInput from "./../Forms/PasswordInputStyleGuide";
import Icon from "../Icon/Icon";
import {
    Notification,
    Form,
    Input,
    Button,
    Select,
    Alert,
    Tooltip
} from "bitshares-ui-style-guide";

/* CRYPTOBRIDGE */
import RegistrationFormItems from "components/CryptoBridge/Registration/FormItems";
/* /CRYPTOBRIDGE */

class WalletRegistrationForm extends React.Component {
    static propTypes = {
        continue: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            validAccountName: false,
            accountName: "",
            validPassword: false,
            registrarAccount: undefined,
            loading: false,
            showIdenticon: false,
            password: ""
        };
        this.onFinishConfirm = this.onFinishConfirm.bind(this);
        this.onRegistrarAccountChange = this.onRegistrarAccountChange.bind(
            this
        );
        this.unmounted = false;

        this.onSubmit = this.onSubmit.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onPasswordValidationChange = this.onPasswordValidationChange.bind(
            this
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !utils.are_equal_shallow(nextState, this.state);
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    onAccountNameChange(e) {
        const state = {};
        if (e.valid !== undefined) {
            state.validAccountName = e.valid;
        }
        if (e.value !== undefined) {
            state.accountName = e.value;
        }
        if (!this.state.showIdenticon) {
            state.showIdenticon = true;
        }
        this.setState(state);
    }

    onPasswordChange(value) {
        this.setState({password: value});
    }

    onPasswordValidationChange(validation) {
        this.setState({validPassword: validation.valid});
    }

    onFinishConfirm(confirmStoreState) {
        if (
            confirmStoreState.included &&
            confirmStoreState.broadcasted_transaction
        ) {
            TransactionConfirmStore.unlisten(this.onFinishConfirm);
            TransactionConfirmStore.reset();

            FetchChain("getAccount", this.state.accountName, undefined, {
                [this.state.accountName]: true
            }).then(() => {
                console.log("onFinishConfirm");
                this.props.history.push(
                    "/wallet/backup/create?newAccount=true"
                );
            });
        }
    }

    onRegistrarAccountChange(registrarAccount) {
        this.setState({registrarAccount});
    }

    /* CRYPTOBRIDGE */
    onFormChange = data => {
        this.setState(data);
    };
    /* /CRYPTOBRIDGE */

    onSubmit(e) {
        e.preventDefault();
        if (!this.isValid()) {
            return;
        }
        const {accountName, reCaptchaToken} = this.state;
        /* CRYPTOBRIDGE */
        const accountInfo = {
            us_citizen: this.state.usCitizen,
            waiver: this.state.confirmedDisclaimer,
            terms_version: this.state.confirmedTermsAndConditions
                ? "latest"
                : null
        };
        /* CRYPTOBRIDGE */

        if (WalletDb.getWallet()) {
            this.createAccount(
                accountName,

                /* CRYPTOBRIDGE */
                reCaptchaToken,
                accountInfo
                /* /CRYPTOBRIDGE */
            );
        } else {
            const password = this.state.password;
            this.createWallet(password).then(() =>
                this.createAccount(
                    accountName,

                    /* CRYPTOBRIDGE */
                    reCaptchaToken,
                    accountInfo
                    /* /CRYPTOBRIDGE */
                )
            );
        }
    }

    createAccount(name, reCaptchaToken, accountInfo) {
        const {referralAccount} = AccountStore.getState();
        WalletUnlockActions.unlock().then(() => {
            this.setState({loading: true});

            AccountActions.createAccount(
                name,
                this.state.registrarAccount,
                referralAccount || this.state.registrarAccount,
                0,
                undefined,

                /* CRYPTOBRIDGE */
                reCaptchaToken,
                accountInfo
                /* /CRYPTOBRIDGE */
            )
                .then(() => {
                    // User registering his own account
                    FetchChain("getAccount", name, undefined, {
                        [name]: true
                    }).then(() => {
                        this.props.continue();
                        if (this.unmounted) {
                            return;
                        }
                        this.setState({
                            loading: false
                        });
                    });
                    if (this.state.registrarAccount) {
                        TransactionConfirmStore.listen(this.onFinishConfirm);
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    console.log("ERROR AccountActions.createAccount", error);
                    let errorMsg =
                        error.base && error.base.length && error.base.length > 0
                            ? error.base[0]
                            : "unknown error";
                    if (error.remote_ip) [errorMsg] = error.remote_ip;
                    Notification.error({
                        message: counterpart.translate(
                            "notifications.account_create_failure",
                            {
                                account_name: name,
                                error_msg: errorMsg
                            }
                        )
                    });
                });
        });
    }

    createWallet(password) {
        this.setState({
            loading: true
        });
        return WalletActions.setWallet("default", password)
            .then(() => {
                console.log(
                    "Congratulations, your wallet was successfully created."
                );
            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                console.log("CreateWallet failed:", err);
                Notification.error({
                    message: counterpart.translate(
                        "notifications.account_wallet_create_failure",
                        {
                            error_msg: err
                        }
                    )
                });
            });
    }

    isValid() {
        /* CRYPTOBRIDGE */
        if (
            (this.state.usCitizen !== true && this.state.usCitizen !== false) ||
            this.state.confirmedTermsAndConditions !== true ||
            this.state.confirmedDisclaimer !== true ||
            !this.state.reCaptchaToken
        ) {
            return false;
        }
        /* /CRYPTOBRIDGE */

        const firstAccount = AccountStore.getMyAccounts().length === 0;
        let valid = this.state.validAccountName;
        if (!WalletDb.getWallet()) {
            valid = valid && this.state.validPassword;
        }
        if (!firstAccount) {
            valid = valid && this.state.registrarAccount;
        }
        return valid;
    }

    renderDropdown(myAccounts, isLTM) {
        const {registrarAccount} = this.state;

        return (
            <Form.Item label={counterpart.translate("account.pay_from")}>
                <Select
                    placeholder={counterpart.translate(
                        "account.select_placeholder"
                    )}
                    style={{width: "100%"}}
                    value={this.state.registrarAccount}
                    onChange={this.onRegistrarAccountChange}
                >
                    {myAccounts.map(accountName => (
                        <Select.Option key={accountName} value={accountName}>
                            {accountName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        );
    }

    renderPasswordInput() {
        return (
            <PasswordInput
                ref="password"
                onChange={this.onPasswordChange}
                onValidationChange={this.onPasswordValidationChange}
                label={
                    <span>
                        <span className="vertical-middle">
                            {counterpart.translate("settings.password")}
                        </span>
                        &nbsp;
                        <Tooltip
                            title={counterpart.translate(
                                "tooltip.registration.password"
                            )}
                        >
                            <span>
                                <Icon
                                    name="question-in-circle"
                                    className="icon-14px question-icon vertical-middle"
                                />
                            </span>
                        </Tooltip>
                    </span>
                }
            />
        );
    }

    renderAccountCreateForm() {
        const {registrarAccount} = this.state;

        const myAccounts = AccountStore.getMyAccounts();
        const firstAccount = myAccounts.length === 0;
        const hasWallet = WalletDb.getWallet();
        const valid = this.isValid();
        let isLTM = false;
        const registrar = registrarAccount
            ? ChainStore.getAccount(registrarAccount)
            : null;
        if (registrar) {
            if (registrar.get("lifetime_referrer") === registrar.get("id")) {
                isLTM = true;
            }
        }

        const isButtonDisabled = () => {
            return !valid || (registrarAccount && !isLTM);
        };

        return (
            <Form layout={"vertical"} onSubmit={this.onSubmit}>
                <AccountNameInput
                    cheapNameOnly={!!firstAccount}
                    onChange={e => this.onAccountNameChange(e)}
                    accountShouldNotExist
                    placeholder={counterpart.translate("account.name")}
                    label={
                        <span>
                            <span className="vertical-middle">
                                {counterpart.translate("account.name")}
                            </span>
                            &nbsp;
                            <Tooltip
                                title={counterpart.translate(
                                    "tooltip.registration.accountName"
                                )}
                            >
                                <span>
                                    <Icon
                                        name="question-in-circle"
                                        className="icon-14px question-icon vertical-middle"
                                    />
                                </span>
                            </Tooltip>
                        </span>
                    }
                    noLabel
                />

                {hasWallet ? null : this.renderPasswordInput()}

                {firstAccount ? null : this.renderDropdown(myAccounts, isLTM)}

                {/* CRYPTOBRIDGE */}
                <RegistrationFormItems
                    citizenship={false}
                    onChange={this.onFormChange}
                    recaptchaPayload={{user: this.props.accountName}}
                />

                <p>
                    <Translate
                        content="cryptobridge.registration.terms_and_conditions.hint"
                        with={{
                            cryptobridge_terms_and_conditions: (
                                <a
                                    href="https://crypto-bridge.org/terms-and-conditions"
                                    target="_blank"
                                >
                                    <Translate content="cryptobridge.registration.terms_and_conditions.title" />
                                </a>
                            )
                        }}
                    />
                </p>
                {/*/ CRYPTOBRIDGE */}

                {registrar && !isLTM ? (
                    <Form.Item>
                        <Alert
                            type="error"
                            description={
                                <Translate content="wallet.must_be_ltm" />
                            }
                        />
                    </Form.Item>
                ) : null}

                <Form.Item>
                    <Button
                        type="primary"
                        disabled={this.state.loading || isButtonDisabled()}
                        htmlType="submit"
                        loading={this.state.loading}
                    >
                        {counterpart.translate("registration.continue")}
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    render() {
        const hasWallet = WalletDb.getWallet();
        const firstAccount = AccountStore.getMyAccounts().length === 0;

        return (
            <div>
                <div className="text-left">
                    {firstAccount ? (
                        <Translate
                            component="h3"
                            content="registration.createAccountTitle"
                        />
                    ) : (
                        <Translate component="h3" content="wallet.create_a" />
                    )}
                    {!hasWallet ? (
                        <Translate
                            component="p"
                            content="registration.walletDescription"
                            className="model-description"
                        />
                    ) : null}
                </div>
                {this.renderAccountCreateForm()}
            </div>
        );
    }
}

export default WalletRegistrationForm;
