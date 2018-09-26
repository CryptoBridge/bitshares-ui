/**
 * The main Support component
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import React from "react";
import Translate from "react-translate-component";
import LoadingIndicator from "components/LoadingIndicator";
import Ticket from "./Ticket";
import MessageComposer from "./MessageComposer";
import {find} from "lodash-es";
import PropTypes from "prop-types";
import TicketsMenu from "./TicketsMenu";
import NewTicketModal from "./NewTicketModal";
import {STATUSES} from "./Constants";
import counterpart from "counterpart";
import {generateRequestOptions} from "./BitsharesHelpers";
import SupportActions from "./actions/SupportActions";
import SupportStore from "./stores/SupportStore";
import Notification from "./Notification";
import {log} from "./SupportUtils";
import config from "../../../config";

class Support extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super();

        this.state = {
            apiServer: props.settings.get("apiServer"),
            comments: [],
            comment: "",
            isTicketFetchPending: false,
            isCommentsFetchPending: false,
            isTicketClosePending: false,
            isTicketReplyPending: false,
            loadingIndicatorMessage: null,
            ticketFetchingError: null,
            commentsFetchingError: null,
            ticketCloseError: null,
            tickets: []
        };

        this.onSupportChange = this.onSupportChange.bind(this);
    }

    componentWillUnmount() {
        SupportStore.unlisten(this.onSupportChange);
    }

    componentDidMount() {
        SupportStore.listen(this.onSupportChange);
        SupportActions.setCurrentAccount.defer(this.props.account);
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.match.params.ticketId !== this.props.match.params.ticketId
        ) {
            this._onChangeMenu(this.props.match.params.ticketId);
        }
    }

    componentWillReceiveProps(np) {
        if (
            np.settings.get("passwordLogin") !==
            this.props.settings.get("passwordLogin")
        ) {
            const currentEntries = this._getMenuEntries(this.props);
            const menuEntries = this._getMenuEntries(np);
            const currentActive = currentEntries[this.state.activeSetting];
            const newActiveIndex = menuEntries.indexOf(currentActive);
            const newActive = menuEntries[newActiveIndex];

            this.setState({
                menuEntries
            });

            if (newActiveIndex && newActiveIndex !== this.state.activeSetting) {
                this.setState({
                    activeSetting: menuEntries.indexOf(currentActive)
                });
            } else if (
                !newActive ||
                this.state.activeSetting > menuEntries.length - 1
            ) {
                this.setState({
                    activeSetting: 0
                });
            }
        }
    }

    onSupportChange(state) {
        this.setState(state);

        this._fetchTickets(this.props);

        if (this.props.match.params.ticketId) {
            this._fetchCommentsForTicket(
                this.props.match.params.ticketId,
                this.props.account.get("name")
            );
        }
    }

    _fetchTickets = props => {
        const username = props.account.get("name");
        const requestOptions = generateRequestOptions(props.account);

        this.setState({
            ticketFetchingError: null,
            isTicketFetchPending: true,
            loadingIndicatorMessage: counterpart.translate(
                "cryptobridge.support.processing_please_wait"
            )
        });

        return fetch(
            `${
                config.support.url
            }/support/tickets?jql={{username}}~${username}`,
            requestOptions
        )
            .then(response => response.json())
            .then(response => {
                let tickets = [];
                let ticketFetchingError = null;

                if (response.isBoom) {
                    ticketFetchingError = counterpart.translate(
                        "cryptobridge.support.cannot_fetch_tickets"
                    );
                } else {
                    tickets = response;
                }

                this.setState({
                    tickets,
                    isTicketFetchPending: false,
                    loadingIndicatorMessage: null,
                    ticketFetchingError
                });
            })
            .catch(err => {
                log(`Support.jsx:_fetchTickets() - ${err}`);

                this.setState({
                    ticketFetchingError: counterpart.translate(
                        "cryptobridge.support.cannot_fetch_tickets"
                    ),
                    isTicketFetchPending: false,
                    loadingIndicatorMessage: null
                });
            });
    };

    _renderTicketComments = comments => (
        <div className="ticket-item__comments">
            {this.state.isCommentsFetchPending ? (
                <LoadingIndicator type="three-bounce" />
            ) : this.state.commentsFetchingError ? (
                <Notification
                    className="error"
                    message={this.state.commentsFetchingError}
                />
            ) : (
                comments.map(reply => (
                    <Ticket
                        key={`reply-${reply.username}${reply.datetime}`}
                        ticket={reply}
                    />
                ))
            )}
        </div>
    );

    _handleCommentCreate = async (selectedTicketId, comment) => {
        this.setState({
            isTicketReplyPending: true,
            ticketReplyError: null,
            loadingIndicatorMessage: counterpart.translate(
                "cryptobridge.support.saving_reply_please_wait"
            )
        });

        const body = JSON.stringify({
            data: comment,
            username: this.props.account.get("name")
        });

        const requestOptions = generateRequestOptions(this.props.account);

        const responseJson = await fetch(
            `${
                config.support.url
            }/support/tickets/${selectedTicketId}/comments`,
            {
                ...requestOptions,
                method: "POST",
                /*headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },*/
                body
            }
        )
            .then(response => response.json())
            .then(response => {
                return response;
            })
            .catch(error => {
                log(`Support.jsx:_handleCommentCreate() - ${error}`);
            });

        if (responseJson) {
            if (responseJson.jsdPublic) {
                this.setState({
                    comment: "",
                    isTicketReplyPending: false,
                    ticketReplyError: null,
                    loadingIndicatorMessage: null
                });

                this.refs["message-composer"].reset();

                this._fetchCommentsForTicket(
                    selectedTicketId,
                    this.props.account.get("name")
                );
            } else {
                log(
                    `Support.jsx:_handleCommentCreate() - could not create reply (${JSON.stringify(
                        responseJson
                    )})`
                );

                this.setState({
                    isTicketReplyPending: false,
                    ticketReplyError: counterpart.translate(
                        "cryptobridge.support.cannot_reply_ticket"
                    ),
                    loadingIndicatorMessage: null
                });
            }
        } else {
            log(
                "Support.jsx:_handleCommentCreate() - could not create reply (responseJson not set)"
            );

            this.setState({
                isTicketReplyPending: false,
                ticketReplyError: counterpart.translate(
                    "cryptobridge.support.cannot_reply_ticket"
                ),
                loadingIndicatorMessage: null
            });
        }
    };

    _renderInfoScreen = () => <div>RENDER INFO SCREEN HERE</div>;

    _renderClose = ticketId => (
        <Translate
            content="cryptobridge.support.close_ticket"
            component="button"
            className="button button--close"
            onClick={() => this._handleCloseTicket(ticketId)}
        />
    );

    _handleCloseTicket = ticketId => {
        const requestOptions = generateRequestOptions(this.props.account);

        this.setState({
            isTicketClosePending: true,
            ticketCloseError: null,
            loadingIndicatorMessage: counterpart.translate(
                "cryptobridge.support.processing_please_wait"
            )
        });

        return fetch(
            `${config.support.url}/support/tickets/${ticketId}/close`,
            {
                ...requestOptions,
                method: "POST"
            }
        )
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    /* Reject the response since it's not a 200-level response (i.e. there's no usable data here) */

                    this.setState({
                        isTicketClosePending: false,
                        ticketCloseError: counterpart.translate(
                            "cryptobridge.support.cannot_close_ticket"
                        ),
                        loadingIndicatorMessage: null
                    });

                    log(
                        `Support.jsx:_handleCloseTicket() - could not close ticket (status=${
                            response.status
                        }, statusText=${response.statusText})`
                    );
                    throw new Error(
                        `${response.status}: ${response.statusText}`
                    );
                }
            })
            .then(() => {
                this.setState({
                    isTicketClosePending: false,
                    ticketCloseError: null,
                    loadingIndicatorMessage: null
                });

                this._fetchTickets(this.props);
            })
            .catch(error => {
                log(
                    `Support.jsx:_handleCloseTicket() - could not close ticket (${error})`
                );

                this.setState({
                    isTicketClosePending: false,
                    ticketCloseError: counterpart.translate(
                        "cryptobridge.support.cannot_close_ticket"
                    ),
                    loadingIndicatorMessage: null
                });
            });
    };

    _stripHtmlTags = html => html.replace(/<\/?[^>]+(>|$)/g, "");

    _renderTicketDetails = selectedTicketId => {
        if (this.state.tickets) {
            const ticket = find(this.state.tickets, {key: selectedTicketId});

            return ticket ? (
                <div className="support-content--inner-div">
                    {ticket.statusId !== STATUSES.CLOSED
                        ? this._renderClose(selectedTicketId)
                        : null}
                    {this.state.ticketCloseError ? (
                        <div className="ticket-close-notification-wrapper">
                            <Notification
                                className="error"
                                message={this.state.ticketCloseError}
                            />
                        </div>
                    ) : null}
                    <Ticket ticket={ticket} />
                    {this._renderTicketComments(this.state.comments)}
                    {ticket.statusId !== STATUSES.CLOSED ? (
                        <div className="ticket-item__reply">
                            <MessageComposer
                                ref="message-composer"
                                onChange={comment => this.setState({comment})}
                            />
                            {this.state.ticketReplyError ? (
                                <Notification
                                    className="error"
                                    message={this.state.ticketReplyError}
                                />
                            ) : null}
                            {this.state.isTicketReplyPending ? (
                                <LoadingIndicator type="three-bounce" />
                            ) : null}
                            <div className="ticket-item__buttons">
                                <Translate
                                    content="cryptobridge.support.reply"
                                    component="button"
                                    className="button button--reply"
                                    disabled={
                                        this._stripHtmlTags(this.state.comment)
                                            .length === 0
                                    }
                                    onClick={() =>
                                        this._handleCommentCreate(
                                            selectedTicketId,
                                            this.state.comment
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null;
        }

        return null;
    };

    _redirectToEntry = ticketId => {
        this.props.history.push(`/support/${ticketId}`);
    };

    _fetchCommentsForTicket = (ticketId, username) => {
        const usernameParam = username ? `?username=${username}` : "";
        const requestOptions = generateRequestOptions(this.props.account);

        this.setState({
            comments: [],
            isCommentsFetchPending: true,
            commentsFetchingError: null
        });

        return fetch(
            `${
                config.support.url
            }/support/tickets/${ticketId}/comments${usernameParam}`,
            requestOptions
        )
            .then(response => response.json())
            .then(response => {
                if (response.isBoom) {
                    log(
                        `Support.jsx:_fetchCommentsForTicket() - ${
                            response.data.errorMessages[0]
                        }`
                    );

                    this.setState({
                        isCommentsFetchPending: false,
                        commentsFetchingError: counterpart.translate(
                            "cryptobridge.support.cannot_fetch_comments"
                        )
                    });
                } else {
                    this.setState({
                        comments: response,
                        isCommentsFetchPending: false,
                        commentsFetchingError: null
                    });
                }
            })
            .catch(() => {
                log(
                    "Support.jsx:_fetchCommentsForTicket() - FETCH promise catch()"
                );

                this.setState({
                    isCommentsFetchPending: false,
                    commentsFetchingError: counterpart.translate(
                        "cryptobridge.support.cannot_fetch_comments"
                    )
                });
            });
    };

    _onChangeMenu = ticketId => {
        this._redirectToEntry(ticketId);
        this._fetchCommentsForTicket(ticketId, this.props.account.get("name"));

        this.setState({
            selectedTicketId: ticketId
        });
    };

    _handleAddTicket = () => {
        this.refs["new-ticket-modal"].show();
    };

    _handleTicketCreate = ticket => {
        ticket.username = this.props.account.get("name");

        this.setState(prevState => ({
            tickets: [...prevState.tickets, ticket]
        }));
    };

    render() {
        const {
            tickets,
            isTicketFetchPending,
            isTicketClosePending,
            isTicketReplyPending,
            loadingIndicatorMessage
        } = this.state;
        const selectedTicketId = this.props.match.params.ticketId || null;

        return (
            <div className="grid-block">
                {isTicketFetchPending ||
                isTicketClosePending ||
                isTicketReplyPending ? (
                    <LoadingIndicator
                        type="cryptobridge-overlay"
                        loadingText={loadingIndicatorMessage}
                    />
                ) : null}
                <div className="grid-block main-content main-content--support margin-block">
                    <div className="grid-content shrink support-menu">
                        <Translate
                            style={{paddingBottom: 10, paddingLeft: 10}}
                            component="h3"
                            content="header.support"
                            className="panel-bg-color"
                        />

                        <TicketsMenu
                            tickets={tickets}
                            selected={selectedTicketId}
                            onItemPress={ticket =>
                                this._onChangeMenu(ticket.key)
                            }
                            onAddTicket={() => this._handleAddTicket()}
                            error={this.state.ticketFetchingError}
                        />
                    </div>

                    <div className="grid-content support-content">
                        <div className="support-content--inner">
                            {selectedTicketId !== null
                                ? this._renderTicketDetails(selectedTicketId)
                                : this._renderInfoScreen()}
                        </div>
                    </div>

                    <NewTicketModal
                        ref="new-ticket-modal"
                        account={this.props.account.get("name")}
                        onTicketCreate={this._handleTicketCreate}
                    />
                </div>
            </div>
        );
    }
}

export default Support;
