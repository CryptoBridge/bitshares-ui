import React from "react";
import {connect} from "alt-react";

import {ChainStore} from "bitsharesjs/es";

import AccountStore from "stores/AccountStore";
import WalletUnlockStore from "stores/WalletUnlockStore";

import SettingsStore from "stores/SettingsStore";

import CryptoBridgeAccountStore from "stores/cryptobridge/CryptoBridgeAccountStore";
import CryptoBridgeAccountActions from "actions/cryptobridge/CryptoBridgeAccountActions";

import {getBasicToken} from "api/cryptobridge/apiHelpers";

import counterpart from "counterpart";
import Translate from "react-translate-component";

import RegisterFormItems from "./Registration/FormItems";

import {message, Notification, Button, Form} from "bitshares-ui-style-guide";

import {withRouter} from "react-router-dom";
import ZfApi from "react-foundation-apps/src/utils/foundation-api";

import CryptoBridgeIcon from "components/CryptoBridge/Global/CryptoBridgeIcon";
import Cookies from "cookies-js";

export class CryptoBridgeUser {
    constructor({me, rewards, access}) {
        this.me = me || {};
        this.rewards = rewards || [];
        this.access = access || null;
    }

    getName() {
        return this.me.name;
    }

    getAvatar() {
        return `${__BASE_URL__}cryprobridge/cryptobridge-logo.svg`; // TODO get user avatar
    }

    getRequiresUserVerification() {
        const {kyc} = this.me;

        if (!kyc) {
            return null;
        }

        return kyc.required !== false && kyc.status !== "complete";
    }

    getRequiresUserVerificationEnforcement() {
        const {kyc} = this.me;

        return (
            this.getRequiresUserVerification() &&
            (!kyc.deadline || (kyc.deadline && kyc.expired))
        );
    }

    getRequiresTermsAndConditions() {
        const {terms} = this.me;

        if (!terms) {
            return null;
        }

        return terms.status !== "complete";
    }

    getRequiresTermsAndConditionsEnforcement() {
        const {terms} = this.me;

        return (
            this.getRequiresTermsAndConditions() &&
            (!terms.latest.deadline ||
                (terms.latest.deadline && terms.latest.expired))
        );
    }

    getUserVerificationIsPending() {
        return (
            this.getRequiresUserVerification() &&
            this.me.kyc.status === "pending"
        );
    }

    getIsAuthenticated() {
        return this.me && this.me.name;
    }

    getIsCompliant() {
        return (
            !this.getRequiresTermsAndConditions() &&
            !this.getRequiresUserVerification()
        );
    }

    getRequiresComplianceEnforcement() {
        return (
            this.getRequiresUserVerificationEnforcement() ||
            this.getRequiresTermsAndConditionsEnforcement()
        );
    }

    getUserVerificationProviderUrl() {
        const {kyc} = this.me;

        if (!kyc) {
            return null;
        }

        return kyc.link;
    }

    getLatestTermsAndConditionsUrl(theme) {
        const {terms} = this.me;

        if (!terms) {
            return null;
        }

        return `${terms.latest.link}&theme=${theme}`;
    }

    getRequiresUsCitizen() {
        return false;
    }

    getRequiresDisclaimer() {
        const {terms} = this.me;

        return !terms || terms.waiver !== true;
    }

    getLatestTermsAndConditionsVersion() {
        const {terms} = this.me;

        if (!terms) {
            return null;
        }

        return terms.latest.version;
    }

    getHasRewards() {
        const {rewards} = this.me;

        return rewards === true;
    }

    getRewards() {
        return this.rewards;
    }
}

class CryptoBridgeAccount extends React.Component {
    static defaultProps = {};

    constructor(props) {
        super(props);

        this.state = {
            actionNotificationConfirmLoading: false,
            actionNotificationForm: null
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.locked !== this.props.locked) {
            if (this.props.locked) {
                CryptoBridgeAccountActions.logout();
                this.fetchOnAccount = false;
            } else {
                this.fetchOnAccount = true;
            }
        }

        if (this.props.account && this.fetchOnAccount) {
            this.fetchOnAccount = false;
            CryptoBridgeAccountActions.login(this.props.account).catch(e => {
                message.error(e.message);
            });
        }

        if (
            prevProps.bearerToken !== this.props.bearerToken &&
            this.props.bearerToken &&
            this.props.account
        ) {
            CryptoBridgeAccountActions.fetchMe()
                .then(me => {
                    message.success(
                        counterpart.translate(
                            "cryptobridge.account.login.success",
                            {username: me.name}
                        )
                    );

                    if (me.rewards) {
                        CryptoBridgeAccountActions.fetchRewards().catch(
                            () => {}
                        );
                    }
                })
                .catch(e => {
                    message.error(e.message);
                });
        }

        if (
            JSON.stringify(prevProps.me) !== JSON.stringify(this.props.me) &&
            this.props.me.getIsAuthenticated()
        ) {
            this.checkRequiredAccountActions();
        }
    }

    componentDidMount() {
        ZfApi.subscribe("check_required_account_actions", () => {
            this.checkRequiredAccountActions();
        });

        this.checkRequiredAccountActions();
    }

    componentWillUnmount() {
        ZfApi.unsubscribe("check_required_account_actions");
    }

    openUserVerificationProvider() {
        window.open(this.props.me.getUserVerificationProviderUrl(), "_blank");
    }

    checkRequiredAccountActions() {
        const {locked, me} = this.props;
        const {actionNotificationConfirmLoading} = this.state;

        if (!locked && me.getIsAuthenticated()) {
            // TOS
            if (me.getRequiresTermsAndConditions()) {
                const termsAndConditionsModalKey = "termsAndConditionsModal";
                Notification.warning({
                    key: termsAndConditionsModalKey,
                    message: counterpart.translate(
                        "cryptobridge.registration.terms_and_conditions.required"
                    ),
                    description: (
                        <Form layout={"vertical"} className="accountForm">
                            <RegisterFormItems
                                onChange={actionNotificationForm => {
                                    this.setState(
                                        {actionNotificationForm},
                                        this.checkRequiredAccountActions
                                    );
                                }}
                                citizenship={me.getRequiresUsCitizen()}
                                disclaimer={me.getRequiresDisclaimer()}
                            />

                            <Translate
                                content="cryptobridge.registration.terms_and_conditions.confirm_hint"
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
                        </Form>
                    ),
                    btn: (
                        <Button
                            type="primary"
                            size="small"
                            loading={actionNotificationConfirmLoading}
                            onClick={() => {
                                this.handleActionNotificationConfirm(
                                    termsAndConditionsModalKey
                                );
                            }}
                        >
                            <Translate content="global.confirm" />
                        </Button>
                    ),
                    duration: 0,
                    placement: "bottomRight"
                });
            }

            // USER VERIFICATION
            if (me.getRequiresUserVerification()) {
                if (me.getUserVerificationIsPending()) {
                    Notification.info({
                        message: counterpart.translate(
                            "cryptobridge.registration.user_verification.status.pending.title"
                        ),
                        description: counterpart.translate(
                            "cryptobridge.registration.user_verification.status.pending.info"
                        ),
                        duration: 0,
                        placement: "bottomRight"
                    });
                } else {
                    const userVerficationModalKey = "userVerficationModal";
                    Notification.warning({
                        key: userVerficationModalKey,
                        message: counterpart.translate(
                            "cryptobridge.registration.user_verification.required"
                        ),
                        description: (
                            <Translate
                                content="cryptobridge.registration.user_verification.info"
                                unsafe
                            />
                        ),
                        btn: (
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => {
                                    Notification.close(userVerficationModalKey);
                                    this.openUserVerificationProvider();
                                }}
                            >
                                <Translate content="cryptobridge.registration.user_verification.start" />
                            </Button>
                        ),
                        duration: 0,
                        placement: "bottomRight"
                    });
                }
            }

            // BRIDGECOIN REWARDS
            if (me.getRewards().length) {
                const bridgeCoinRewardsModalKey = "bridgeCoinRewardsModal";
                Notification.info({
                    key: bridgeCoinRewardsModalKey,
                    message: counterpart.translate(
                        "cryptobridge.account.rewards.notification.title"
                    ),
                    description: counterpart.translate(
                        "cryptobridge.account.rewards.notification.description"
                    ),
                    btn: (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                this.props.history.push(
                                    "/earn/bridgecoin-staking"
                                );
                                Notification.close(bridgeCoinRewardsModalKey);
                            }}
                        >
                            <Translate content="cryptobridge.account.rewards.notification.action" />
                        </Button>
                    ),
                    duration: 0,
                    placement: "bottomRight"
                });
            }
        }
    }

    handleActionNotificationConfirm = notificationKey => {
        this.setState(
            {
                actionNotificationConfirmLoading: true,
                actionNotificationForm: {
                    usCitizen: null,
                    confirmedTermsAndConditions: true,
                    confirmedDisclaimer: true
                }
            },
            this.checkRequiredAccountActions
        );

        if (this.getActionFormIsValid()) {
            const usCitizen = false;
            const confirmedDisclaimer = true;
            const confirmedTermsAndConditions = true;
            const {me} = this.props;

            const terms_version = confirmedTermsAndConditions
                ? me.getLatestTermsAndConditionsVersion()
                : null;
            const waiver = confirmedDisclaimer || !me.getRequiresDisclaimer();

            const data = {
                terms_version,
                waiver
            };

            if (me.getRequiresUsCitizen()) {
                data.us_citizen = usCitizen;
            }

            CryptoBridgeAccountActions.updateMe(data)
                .then(() => {
                    CryptoBridgeAccountActions.fetchMe().then(() => {
                        Notification.close(notificationKey);
                        message.success(
                            counterpart.translate(
                                "cryptobridge.account.update.success"
                            )
                        );
                    });
                })
                .catch(e => {
                    message.error(e.message);

                    this.setState(
                        {actionNotificationConfirmLoading: false},
                        this.checkRequiredAccountActions
                    );
                });
        }
    };

    getActionFormIsValid() {
        return true;
    }

    render() {
        return null;
    }
}

CryptoBridgeAccount = withRouter(CryptoBridgeAccount);

export default connect(
    CryptoBridgeAccount,
    {
        listenTo() {
            return [
                SettingsStore,
                AccountStore,
                CryptoBridgeAccountStore,
                WalletUnlockStore
            ];
        },
        getProps() {
            const currentAccount =
                AccountStore.getState().currentAccount ||
                AccountStore.getState().passwordAccount;
            const locked = WalletUnlockStore.getState().locked;
            const account = !locked
                ? ChainStore.getAccount(currentAccount, null)
                : null;

            const bearerToken = CryptoBridgeAccountStore.getBearerToken();
            const me = new CryptoBridgeUser(
                CryptoBridgeAccountStore.getState()
            );
            const theme = SettingsStore.getState().settings.get("themes");

            return {
                currentAccount,
                account: getBasicToken(account) ? account : null,
                bearerToken,
                locked,
                me,
                theme
            };
        }
    }
);
