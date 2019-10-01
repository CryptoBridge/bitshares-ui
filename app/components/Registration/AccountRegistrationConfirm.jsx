import React from "react";
import PropTypes from "prop-types";
import {connect} from "alt-react";
import AccountActions from "actions/AccountActions";
import AccountStore from "stores/AccountStore";
import WalletDb from "stores/WalletDb";
import counterpart from "counterpart";
import TransactionConfirmStore from "stores/TransactionConfirmStore";
import Translate from "react-translate-component";
import {FetchChain} from "bitsharesjs/es";
import WalletUnlockActions from "actions/WalletUnlockActions";
import {
    Notification,
    Button,
    Input,
    Checkbox,
    Form,
    Alert
} from "bitshares-ui-style-guide";
import CopyButton from "../Utility/CopyButton";

/* CRYPTOBRIDGE */
import RegistrationFormItems from "components/CryptoBridge/Registration/FormItems";
/* /CRYPTOBRIDGE */

class AccountRegistrationConfirm extends React.Component {
    static propTypes = {
        accountName: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        usCitizen: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            confirmedPassword: false,
            confirmedTermsAndConditions: true,
            confirmedDisclaimer: true,
            reCaptchaToken: null,
            loading: false
        };
        this.onFinishConfirm = this.onFinishConfirm.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.onCreateAccount = this.onCreateAccount.bind(this);
    }

    onFinishConfirm(confirmStoreState) {
        if (
            confirmStoreState.included &&
            confirmStoreState.broadcasted_transaction
        ) {
            TransactionConfirmStore.unlisten(this.onFinishConfirm);
            TransactionConfirmStore.reset();

            FetchChain("getAccount", this.state.accountName).then(() => {
                this.props.history.push(
                    "/wallet/backup/create?newAccount=true"
                );
            });
        }
    }

    onCreateAccount(e) {
        e.preventDefault();

        const accountInfo = {
            us_citizen: this.props.usCitizen,
            waiver: this.state.confirmedDisclaimer,
            terms_version: this.state.confirmedTermsAndConditions
                ? "latest"
                : null
        };

        this.createAccount(
            this.props.accountName,
            this.props.password,

            /* CRYPTOBRIDGE */
            this.state.reCaptchaToken,
            accountInfo
            /* /CRYPTOBRIDGE */
        );
    }

    createAccount(name, password, reCaptchaToken, accountInfo) {
        const {referralAccount} = AccountStore.getState();

        this.setState({loading: true});

        AccountActions.createAccountWithPassword(
            name,
            password,
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
                AccountActions.setPasswordAccount(name);
                setTimeout(() => {
                    // give the faucet & blockchain some time to assert registration
                    if (this.state.registrarAccount) {
                        FetchChain("getAccount", name).then(() => {
                            this.unlockAccount(name, password);
                        });
                        TransactionConfirmStore.listen(this.onFinishConfirm);
                    } else {
                        FetchChain("getAccount", name).then(() => {});
                        this.unlockAccount(name, password);
                        this.props.history.push("/");
                    }
                }, 5000);
            })
            .catch(error => {
                this.setState({loading: false});
                console.log("ERROR AccountActions.createAccount", error);
                let errorMsg =
                    error.base && error.base.length && error.base.length > 0
                        ? error.base[0]
                        : "unknown error";
                if (error.remote_ip) {
                    [errorMsg] = error.remote_ip;
                }
                Notification.error({
                    message: counterpart.translate("account_create_failure", {
                        account_name: name,
                        error_msg: errorMsg
                    })
                });
            });
    }

    unlockAccount(name, password) {
        WalletDb.validatePassword(password, true, name);
        WalletUnlockActions.checkLock.defer();
    }

    /* CRYPTOBRIDGE */
    getIsConfirmed() {
        const {
            confirmedPassword,
            confirmedTermsAndConditions,
            confirmedDisclaimer,
            reCaptchaToken
        } = this.state;

        return (
            confirmedPassword &&
            confirmedTermsAndConditions &&
            confirmedDisclaimer &&
            reCaptchaToken
        );
    }

    onConfirmedPasswordChange = e => {
        this.setState(
            {
                confirmedPassword: e.target.checked
            },
            () => {
                this.props.onChange(this.getIsConfirmed());
            }
        );
    };

    onFormChange = data => {
        this.setState(data, () => {
            this.props.onChange(this.getIsConfirmed());
        });
    };
    /* /CRYPTOBRIDGE */

    render() {
        return (
            <Form layout={"vertical"}>
                <Form.Item
                    label={counterpart.translate("registration.copyPassword")}
                    className="clipboard"
                >
                    <Input.Password
                        disabled={true}
                        id="password"
                        value={this.props.password}
                        addonBefore={
                            <CopyButton
                                text={this.props.password}
                                tip="tooltip.copy_password"
                                dataPlace="top"
                                className="button"
                            />
                        }
                    />
                </Form.Item>

                <Form.Item>
                    <Alert
                        showIcon
                        type={"warning"}
                        message={""}
                        description={counterpart.translate(
                            "registration.accountNote"
                        )}
                    />
                </Form.Item>

                <Form.Item>
                    <Checkbox
                        checked={this.state.confirmedPassword}
                        onChange={this.onConfirmedPasswordChange}
                    >
                        <Translate content="registration.accountConfirmation" />
                    </Checkbox>
                </Form.Item>

                {/* CRYPTOBRIDGE */}
                <RegistrationFormItems
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

                <Form.Item>
                    <Button
                        type="primary"
                        disabled={!this.getIsConfirmed()}
                        loading={this.state.loading}
                        onClick={this.onCreateAccount}
                    >
                        <Translate content="account.create_account" />
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default connect(
    AccountRegistrationConfirm,
    {
        listenTo() {
            return [AccountStore];
        },
        getProps() {
            return {};
        }
    }
);
