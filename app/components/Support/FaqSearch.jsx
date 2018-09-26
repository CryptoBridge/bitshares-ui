/**
 * FAQ Search component
 *
 * Renders an FAQ Search component. Results matching the search criteria are fetched from the API,
 * and rendered as a list with clickable links.
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import React from "react";
import {request} from "./RequestHelpers";
import counterpart from "counterpart";
import {log} from "./SupportUtils";

class FaqSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
            searchTerm: props.searchTerm || ""
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchTerm !== prevProps.searchTerm) {
            this._fetchSearchResults(this.props.searchTerm);
        }
    }

    /**
     * Fetch search results from the Freshdesk API matching the supplied search term
     *
     * @param searchTerm
     * @private
     */
    _fetchSearchResults = searchTerm => {
        let searchResults = [];
        const url = `https://cryptobridge.freshdesk.com/search/solutions.json?search_key=${searchTerm}`;

        request({url})
            .then(res => res.json())
            .then(response => {
                response.results.forEach(article => {
                    searchResults.push({
                        id: article.id,
                        type: article.result_type,
                        title: article.title,
                        text: article.description,
                        url: `https://cryptobridge.freshdesk.com/${
                            article.path
                        }`
                    });
                });

                this.setState({
                    searchResults
                });
            })
            .catch(error => {
                log(
                    `FaqSearch.jsx:_fetchSearchResults() - Freshdesk API fetch promise catch() (${error})`
                );
            });
    };

    /**
     * Handles the search text change event
     *
     * @param event
     * @private
     */
    _handleSearchTextChange = event => {
        const {value} = event.target;

        this._fetchSearchResults(value);

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };

    /**
     * Renders the search results list
     *
     * @returns {null}
     * @private
     */
    _renderSearchResults = () => {
        return this.state.searchResults.length > 0 ? (
            <div className="search-results__wrapper">
                <ol className="search-results">
                    {this.state.searchResults.map((result, index) => {
                        return (
                            <li
                                key={`search-result-${index}`}
                                className="search-result__item"
                            >
                                <a
                                    href={result.url}
                                    className="search-result__link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div
                                        className="search-result__title"
                                        dangerouslySetInnerHTML={{
                                            __html: result.title
                                        }}
                                    />
                                    <div
                                        className="search-result__text"
                                        dangerouslySetInnerHTML={{
                                            __html: result.text
                                        }}
                                    />
                                </a>
                            </li>
                        );
                    })}
                </ol>
            </div>
        ) : null;
    };

    render() {
        return (
            <div className="faq-search">
                <div>
                    <label htmlFor="faq_search" style={{marginBottom: 0}}>
                        <input
                            id="faq_search"
                            type="text"
                            placeholder={counterpart.translate(
                                "cryptobridge.support.faq_search_placeholder"
                            )}
                            aria-label={counterpart.translate(
                                "cryptobridge.support.faq_search_aria_label"
                            )}
                            onChange={this._handleSearchTextChange}
                            value={this.props.searchTerm}
                            style={{marginBottom: 0}}
                        />
                    </label>
                </div>
                {this._renderSearchResults()}
            </div>
        );
    }
}

export default FaqSearch;
