import React from "react";
import Translate from "react-translate-component";

import Icon from "components/Icon/Icon";
import counterpart from "counterpart";
import PropTypes from "prop-types";

import {Form, Radio, Checkbox, Tooltip} from "bitshares-ui-style-guide";
import ReCAPTCHA from "components/Utility/CryptoBridge/ReCAPTCHA";

export class Citizenship extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired
    };

    render() {
        return (
            <Form.Item
                label={
                    <span>
                        <Translate content="cryptobridge.registration.us_citizen.label" />
                        &nbsp;
                        <Tooltip
                            title={counterpart.translate(
                                "cryptobridge.registration.us_citizen.help"
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
            >
                <Radio.Group buttonStyle="solid" onChange={this.props.onChange}>
                    <Radio.Button value="non-us">
                        <Translate content="cryptobridge.registration.us_citizen.no" />
                    </Radio.Button>
                    <Radio.Button value="us">
                        <img
                            height={20}
                            width={20}
                            style={{marginRight: 5}}
                            src={`${__BASE_URL__}language-dropdown/EN.png`}
                        />
                        <Translate content="cryptobridge.registration.us_citizen.yes" />
                    </Radio.Button>
                </Radio.Group>
            </Form.Item>
        );
    }
}

export class Disclaimer extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired
    };

    render() {
        return (
            <Form.Item>
                <Checkbox onChange={this.props.onChange}>
                    <Translate content="cryptobridge.registration.terms_and_conditions.disclaimer" />
                </Checkbox>
            </Form.Item>
        );
    }
}

export class TermsAndConditions extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired
    };

    render() {
        return (
            <Form.Item>
                <Checkbox onChange={this.props.onChange}>
                    <Translate
                        content="cryptobridge.registration.terms_and_conditions.accept"
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
                </Checkbox>
            </Form.Item>
        );
    }
}

export default class RegisterFormItems extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        recaptchaPayload: PropTypes.object,
        citizenship: PropTypes.bool.isRequired,
        disclaimer: PropTypes.bool.isRequired,
        terms: PropTypes.bool.isRequired
    };

    static defaultProps = {
        citizenship: false,
        disclaimer: true,
        terms: true
    };

    constructor() {
        super();

        this.state = {
            usCitizen: false,
            confirmedTermsAndConditions: true,
            confirmedDisclaimer: true,
            reCaptchaToken: null
        };
    }

    onCitizenShipChange = e => {
        this.setState(
            {
                usCitizen: e.target.value === "us"
            },
            () => {
                this.props.onChange(this.state);
            }
        );
    };

    onConfirmedTermsAndConditionsChange = e => {
        this.setState(
            {
                confirmedTermsAndConditions: e.target.checked
            },
            () => {
                this.props.onChange(this.state);
            }
        );
    };

    onConfirmedDisclaimerChange = e => {
        this.setState(
            {
                confirmedDisclaimer: e.target.checked
            },
            () => {
                this.props.onChange(this.state);
            }
        );
    };

    onRecaptchaChange = token => {
        this.setState(
            {
                reCaptchaToken: token
            },
            () => {
                this.props.onChange(this.state);
            }
        );
    };

    render() {
        return (
            <div>
                {this.props.recaptchaPayload ? (
                    <ReCAPTCHA
                        onChange={this.onRecaptchaChange}
                        payload={this.props.recaptchaPayload}
                    />
                ) : null}
            </div>
        );
    }
}
