/**
 * CoinsDropdown component
 *
 * Renders a coins dropdown list.
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import React from "react";
import Select from "react-select";
import counterpart from "counterpart";

class CoinsDropdown extends React.Component {
    state = {};

    /**
     * Handles the coin selection change
     *
     * @param selectedOption
     * @param event
     * @private
     */
    _handleCoinChange = (selectedOption, event) => {
        if (event.action === "select-option") {
            const selectedCoin = this.props.coins.filter(
                coin =>
                    coin.coinType.toLowerCase() ===
                    selectedOption.value.toLowerCase()
            )[0];

            if (this.props.onChange) {
                this.props.onChange(selectedCoin);
            }
        }
    };

    /**
     * Converts the options to a different JSON format
     * @param options
     * @returns {*}
     * @private
     */
    _transformOptions = options =>
        options.map(option => ({
            value: option.symbol,
            label: `${option.name} (${option.backingCoinType.toUpperCase()})`
        }));

    render() {
        // const selectedCoinSymbol = this.props.selected || -1;

        return (
            <div>
                <label htmlFor="coin-list">
                    Coin
                    <Select
                        id="coin-list"
                        name="coin-list"
                        className="react-select"
                        classNamePrefix="react-select"
                        onChange={this._handleCoinChange}
                        options={this._transformOptions(this.props.coins)}
                        loadingMessage={counterpart.translate(
                            "cryptobridge.support.loading_coin_list"
                        )}
                        placeholder={counterpart.translate(
                            "cryptobridge.support.coin_list_placeholder"
                        )}
                        required
                        styles={{
                            container: (base, state) => ({
                                ...base
                            }),
                            input: (base, state) => ({
                                ...base,
                                height: 20,
                                marginTop: -20
                            })
                        }}
                    />
                </label>
            </div>
        );
    }
}

export default CoinsDropdown;
