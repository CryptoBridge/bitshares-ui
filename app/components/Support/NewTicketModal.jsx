/**
 * NewTicketModal component
 *
 * Renders a modal dialog for creating a new support ticket.
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import React, {Component} from "react";
import counterpart from "counterpart";
import Translate from "react-translate-component";
import {ReCaptcha} from "react-recaptcha-v3";
import LoadingIndicator from "components/LoadingIndicator";
import FaqSearch from "./FaqSearch";
import DepositWithdrawForm from "./NewTicketModal/DepositWithdrawForm";
import {ISSUES, STATUSES, IssuesEnum} from "./Constants";
import Select from "react-select";
import {generateRequestOptions} from "./BitsharesHelpers";
import SupportStore from "./stores/SupportStore";
import Notification from "./Notification";
import CBModal from "./CBModal";
import config from "../../../config";

export default class NewTicketModal extends Component {
    state = {
        searchTerm: "",
        otherIssue: false,
        selectedIssueId: -1,
        isTicketCreatePending: false,
        ticketCreateError: null,
        sendClicked: false
    };

    depositWithdrawForm = null;
    reCaptchaEl = null;
    reCaptchaToken = "";

    constructor(props) {
        super(props);

        this.onSupportChange = this.onSupportChange.bind(this);
    }

    componentDidMount() {
        SupportStore.listen(this.onSupportChange);
    }

    componentWillUnmount() {
        SupportStore.unlisten(this.onSupportChange);
    }

    onSupportChange(state) {
        this.setState(state);
    }

    /**
     * Displays the modal dialog
     */
    show() {
        this.refs["new-ticket-modal"].show();

        this.setState({
            searchResults: [],
            searchTerm: "",
            otherIssue: false,
            selectedIssueId: -1
            /*disabledCoinsMessage: null,
            selectedCoin: -1,
            explorerUrl: "",
            transactionId: "",
            transactionNotFound: false,
            amount: 0,
            recipientAddress: "",
            message: ""*/
        });
    }

    /**
     * Closes the modal dialog
     */
    close = () => {
        this.refs["new-ticket-modal"].close();
    };

    /**
     * Handles clicking on "Other Issue" link button
     *
     * @param event
     * @private
     */
    _handleOtherIssue = event => {
        event.preventDefault();

        this.setState({
            searchResults: [],
            searchTerm: "",
            otherIssue: true,
            selectedIssueId: -1
            /*disabledCoinsMessage: null,
            selectedCoin: -1,
            explorerUrl: "",
            transactionId: "",
            transactionNotFound: false,
            amount: 0,
            recipientAddress: "",
            message: ""*/
        });
    };

    /**
     * Handles a given search term
     *
     * @param searchTerm
     * @returns {*}
     * @private
     */
    _handleSearchTerm = searchTerm => this.setState({searchTerm});

    /**
     * Handles Issue selection change
     * @param selectedOption
     * @param event
     * @private
     */
    _handleIssuesChange = (selectedOption, event) => {
        if (event.action === "select-option") {
            const selectedIssueId = parseInt(selectedOption.value);

            this.setState({
                selectedIssueId
            });
        }
    };

    /**
     * Gets a list of issue options for the dropdown list
     *
     * @type {{label, key : string, value : string}[]}
     * @private
     */
    _getIssuesOptions = Object.keys(ISSUES).map((issueId, index) => ({
        label: counterpart.translate(
            `cryptobridge.support.${ISSUES[issueId]}s`
        ),
        key: `modal-new-ticket__issues-option${index}`,
        value: issueId
    }));

    /**
     * Renders the Issues dropdown
     *
     * @returns {*}
     * @private
     */
    _renderIssuesDropdown = () => {
        const issuesClasses = `modal-new-ticket__issues ${
            this.state.otherIssue ? "visible" : ""
        }`;

        return (
            <div className={issuesClasses}>
                <label htmlFor="modal-new-ticket__issues">
                    {counterpart.translate("cryptobridge.support.issue")}
                    <Select
                        id="modal-new-ticket__issues"
                        name="modal-new-ticket__issues"
                        className="react-select"
                        classNamePrefix="react-select"
                        isSearchable={false}
                        required
                        onChange={this._handleIssuesChange}
                        options={this._getIssuesOptions}
                        placeholder={counterpart.translate(
                            "cryptobridge.support.issues_dropdown_placeholder"
                        )}
                    />
                </label>
            </div>
        );
    };

    /**
     * Automatically generates a Subject field from various properties
     *
     * @param properties
     * @returns {string}
     * @private
     */
    _generateSubject = properties =>
        `${counterpart
            .translate(
                `cryptobridge.support.${ISSUES[properties.selectedIssueId]}`
            )
            .toUpperCase()}: ${properties.amount} ${
            properties.selectedCoin.coinType
        } / USER: ${properties.username}`;

    /**
     * Creates a support ticket from the selection state data
     *
     * @returns {Promise<void>}
     * @private
     */
    _handleTicketCreate = async () => {
        let formState = {};
        let ticket = {};
        const {account: username} = this.props;

        this.setState({
            isTicketCreatePending: true,
            ticketCreateError: null
        });

        switch (this.state.selectedIssueId) {
            case 1:
            case 2:
                formState = this.depositWithdrawForm.getState();
                ticket = {
                    // type: 1, // Transfer
                    title: this._generateSubject({
                        ...this.state,
                        ...formState,
                        username
                    }), // formState.subject
                    coin: formState.selectedCoin.coinType,
                    transferTypeId: this.state.selectedIssueId,
                    recipientAddress: formState.recipientAddress,
                    transactionId: formState.transactionId,
                    amount: formState.amount,
                    comment: formState.message,
                    username,
                    reCaptchaToken: this.reCaptchaToken
                    /*id: 67678,
                    datetime: new Date().getTime(),
                    statusId: 1*/
                };
                break;
            default:
                log(
                    `NewTicketModal.jsx:_handleTicketCreate() - unknown selectedIssueId (${
                        this.state.selectedIssueId
                    })`
                );
                break;
        }

        const requestOptions = generateRequestOptions(
            this.state.currentAccount
        );

        const responseJson = await fetch(
            `${config.support.url}/support/tickets`,
            {
                ...requestOptions,
                method: "POST",
                body: JSON.stringify(ticket)
            }
        )
            .then(response => response.json())
            .then(response => {
                return response;
            })
            .catch(error => {
                log(
                    `NewTicketModal.jsx:_handleTicketCreate() - FETCH promise catch() (${error})`
                );

                this.setState({
                    ticketCreateError: counterpart.translate(
                        "cryptobridge.support.cannot_create_ticket"
                    ),
                    isTicketCreatePending: false,
                    sendClicked: false
                });
            });

        if (responseJson.key) {
            ticket.key = responseJson.key;
            ticket.id = responseJson.id;
            ticket.statusId = STATUSES.OPEN;
            ticket.datetime = new Date().getTime();

            if (this.props.onTicketCreate) {
                this.props.onTicketCreate(ticket);
            }

            this.setState({
                ticketCreateError: null,
                isTicketCreatePending: false,
                sendClicked: false
            });

            this.close();
        } else {
            log(
                `NewTicketModal.jsx:_handleTicketCreate() - no responseJson.key (${JSON.stringify(
                    responseJson
                )})`
            );

            this.setState({
                ticketCreateError: counterpart.translate(
                    "cryptobridge.support.cannot_create_ticket"
                ),
                isTicketCreatePending: false,
                sendClicked: false
            });
        }
    };

    /**
     * Validates the form fields
     *
     * @returns {boolean}
     * @private
     */
    _validateFormFields = () => {
        if (this.state.selectedIssueId !== -1) {
            const formState = this.depositWithdrawForm.getState();

            switch (this.state.selectedIssueId) {
                case IssuesEnum.DEPOSIT:
                    return (
                        formState.amount > 0 &&
                        formState.transactionId !== "" &&
                        formState.selectedCoin !== null
                    );

                case IssuesEnum.WITHDRAWAL:
                    return (
                        formState.amount > 0 &&
                        formState.recipientAddress !== "" &&
                        formState.selectedCoin !== null
                    );
            }
        }
        return false;
    };

    /**
     * Generates a new reCaptcha token
     * @private
     */
    _generateNewRecaptchaToken = () => {
        const {reCaptchaEl} = this;

        if (reCaptchaEl) {
            reCaptchaEl.execute();
        }
    };

    /**
     * Handles the form submission
     *
     * @param event
     * @private
     */
    _handleSubmit = event => {
        event.preventDefault();

        this.setState({
            sendClicked: true
        });

        if (this._validateFormFields()) {
            // TODO: validate fields
            this._generateNewRecaptchaToken();
        } else {
            alert(
                counterpart.translate(
                    "cryptobridge.support.incomplete_form_fields"
                )
            );
        }
    };

    /**
     * Verifies the reCaptcha callback
     *
     * @param reCaptchaToken
     * @private
     */
    _verifyRecaptchaCallback = reCaptchaToken => {
        if (this.state.sendClicked) {
            this.reCaptchaToken = reCaptchaToken;

            this._handleTicketCreate()
                .then(() => {
                    // DO NOTHING
                })
                .catch(error => {
                    log(
                        `NewTicketModal.jsx:_verifyRecaptchaCallback() - _handleTicketCreate catch() (${error})`
                    );
                });
        }
    };

    render() {
        const {isTicketCreatePending} = this.state;

        return (
            <CBModal
                id="new-ticket-modal"
                ref="new-ticket-modal"
                title="Create Ticket"
                className="new-ticket-modal"
            >
                <form
                    id="form-new-support-ticket"
                    noValidate
                    autoComplete="off"
                >
                    <div className="grid-block vertical no-overflow modal-new-ticket__content-inner">
                        <Translate
                            content="cryptobridge.support.new_ticket_intro1"
                            component="p"
                            style={{lineHeight: 1.2, marginBottom: 10}}
                        />

                        <Translate
                            content="cryptobridge.support.new_ticket_intro2"
                            component="p"
                            style={{lineHeight: 1.2, marginBottom: 10}}
                        />

                        <FaqSearch
                            searchTerm={this.state.searchTerm}
                            onChange={this._handleSearchTerm}
                        />

                        <Translate
                            content="cryptobridge.support.have_another_issue"
                            component="button"
                            className="modal-new-ticket__other-issue-button"
                            onClick={this._handleOtherIssue}
                        />

                        {this._renderIssuesDropdown(this.state.selectedIssueId)}
                        {[IssuesEnum.DEPOSIT, IssuesEnum.WITHDRAWAL].indexOf(
                            this.state.selectedIssueId
                        ) !== -1 && (
                            <DepositWithdrawForm
                                ref={depositWithdrawForm =>
                                    (this.depositWithdrawForm = depositWithdrawForm)
                                }
                                selectedIssueId={this.state.selectedIssueId}
                            />
                        )}

                        <ReCaptcha
                            ref={el => {
                                this.reCaptchaEl = el;
                            }}
                            sitekey={config.support.recaptcha.siteKey}
                            action="create_support_ticket"
                            verifyCallback={this._verifyRecaptchaCallback}
                        />
                        {this.state.ticketCreateError ? (
                            <Notification
                                className="error"
                                message={this.state.ticketCreateError}
                            />
                        ) : null}
                        <div className="button-group no-overflow modal-new-ticket__footer">
                            {isTicketCreatePending ? (
                                <LoadingIndicator type="three-bounce" />
                            ) : null}
                            <Translate
                                content="cryptobridge.support.cancel"
                                component="button"
                                onClick={this.close}
                                className="button button--cancel"
                            />

                            <Translate
                                content="cryptobridge.support.create_ticket"
                                component="button"
                                className="button button--add"
                                onClick={this._handleSubmit}
                                disabled={
                                    !this.state.otherIssue ||
                                    this.state.sendClicked
                                }
                            />
                        </div>
                    </div>
                </form>
            </CBModal>
        );
    }
}
