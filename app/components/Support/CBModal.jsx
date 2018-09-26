/**
 * CBModal component
 *
 * Renders a modal dialog with a standard layout, the content provided by props.children,
 * and open & close functionality. It can be used to create other modal dialogs.
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import React, {Component} from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#cb-modal");

class CBModal extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
    }

    /**
     * Displays the modal dialog
     */
    show = () => {
        this.setState({showModal: true});
    };

    /**
     * Closes the modal dialog
     */
    close = () => {
        this.setState({showModal: false});
    };

    render() {
        const classes = `cb-modal modal ${
            this.props.className ? this.props.className : ""
        }`;

        return (
            <ReactModal
                id={this.props.id}
                isOpen={this.state.showModal}
                contentLabel={this.props.title || null}
                onRequestClose={this.close}
                shouldCloseOnOverlayClick={
                    this.props.shouldCloseOnOverlayClick || false
                }
                overlayClassName="modal-overlay"
                bodyOpenClassName="opened"
                className={classes}
            >
                <div className="cb-modal__header">
                    {this.props.title ? (
                        <h1 className="cb-modal__title">{this.props.title}</h1>
                    ) : null}
                    <a href="#" className="close-button" onClick={this.close}>
                        ×
                    </a>
                </div>

                <div className="cb-modal__content">{this.props.children}</div>

                <div className="cb-modal__footer">
                    {/*<button onClick={this.close}>Cancel</button>*/}
                </div>
            </ReactModal>
        );
    }
}

export default CBModal;
