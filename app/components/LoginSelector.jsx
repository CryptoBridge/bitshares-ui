import React from "react";
import {Link} from "react-router/es";
import Translate from "react-translate-component";
import { isIncognito } from "feature_detect";
var logo = require("assets/logo-ico-blue.png");
import SettingsActions from "actions/SettingsActions";
import WalletUnlockActions from "actions/WalletUnlockActions";
import ActionSheet from "react-foundation-apps/src/action-sheet";
import SettingsStore from "stores/SettingsStore";
import IntlActions from "actions/IntlActions";

const FlagImage = ({flag, width = 50, height = 50}) => {
     return <img height={height} width={width} src={`${__BASE_URL__}language-dropdown/${flag.toUpperCase()}.png`} />;
};

export default class LoginSelector extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            step: 1,
            locales: SettingsStore.getState().defaults.locale,
            currentLocale: SettingsStore.getState().settings.get("locale")
        };
    }

    componentWillMount(){
        isIncognito((incognito)=>{
            this.setState({incognito});
        });
    }

    onSelect(route) {
        this.props.router.push("/create-account/" + route);
    }

    render() {
        const childCount = React.Children.count(this.props.children);
        
        const flagDropdown = <ActionSheet>
            <ActionSheet.Button title="" style={{width:"64px"}}>
                <a style={{padding: "1rem", border: "none"}} className="button">
                    <FlagImage flag={this.state.currentLocale} />
                </a>
            </ActionSheet.Button>
            <ActionSheet.Content>
                <ul className="no-first-element-top-border">
                    {this.state.locales.map(locale => {
                        return (
                            <li key={locale}>
                                <a href onClick={(e) => {e.preventDefault(); IntlActions.switchLocale(locale); this.setState({currentLocale: locale});}}>
                                    <div className="table-cell"><FlagImage width="20" height="20" flag={locale} /></div>
                                    <div className="table-cell" style={{paddingLeft: 10}}><Translate content={"languages." + locale} /></div>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </ActionSheet.Content>
        </ActionSheet>;
        
        return (
            <div className="grid-block align-center">
                <div className="grid-block shrink vertical">
                    <div className="grid-content shrink text-center account-creation">
                        <div><img src={logo}/></div>
                        <Translate content="account.intro_text_title" component="h4"/>
                        <Translate unsafe content="account.intro_text_1" component="p" />
                       
                        <div className="shrink text-center">
                            <div className="grp-menu-item overflow-visible account-drop-down">
                                <div className="grp-menu-item overflow-visible" style={{margin:"0 auto"}}>
                                {flagDropdown}
                                </div>
                            </div>
                        </div>
                        
                        {!!childCount ? null :
                        <div className="button-group">
                            <label style={{textAlign: "left"}}><Translate content="account.new_user" /><br/>
                                <Link to="/create-account/password">
                                    <div className="button">
                                        <Translate content="header.create_account" />
                                    </div>
                                </Link>
                            </label>

                            <label style={{textAlign: "left"}}><Translate content="account.existing_user" /><br/>
                                <div className="button success" onClick={() => {
                                    SettingsActions.changeSetting({setting: "passwordLogin", value: true});
                                    WalletUnlockActions.unlock.defer();
                                }}>
                                    <Translate content="header.unlock_short" />
                                </div>
                            </label>
                        </div>}

                        {!!childCount ? null :
                        <div className="grid-block">
                            <div className="small-12 medium-6 creation-options"><Link to="/wallet/backup/restore"><Translate content="account.restore" /></Link></div>
                            <div className="small-12 medium-6 creation-options"><Link to="/create-account/wallet"><Translate content="account.advanced" /></Link></div>
                        </div>}

                        {this.props.children}
                    </div>
                {/* <div className="grid-block no-margin no-padding vertical medium-horizontal no-overflow login-selector">

                    {this.state.incognito ? null : <div className="box small-12 medium-5 large-4" onClick={this.onSelect.bind(this, "wallet")}>
                        <div className="block-content-header" style={{position: "relative"}}>
                            <Translate content="wallet.wallet_model" component="h4" />
                        </div>
                        <div className="box-content">
                            <Translate content="wallet.wallet_model_1" component="p" />
                            <Translate content="wallet.wallet_model_2" component="p" />

                            <Translate unsafe content="wallet.wallet_model_3" component="ul" />
                        </div>
                        <div className="button"><Link to="/create-account/wallet"><Translate content="wallet.use_wallet" /></Link></div>

                    </div>}

                    <div className="box small-12 medium-5 large-4 vertical" onClick={this.onSelect.bind(this, "password")}>
                        <div className="block-content-header" style={{position: "relative"}}>
                            <Translate content="wallet.password_model" component="h4" />
                        </div>
                        <div className="box-content">
                            <Translate content="wallet.password_model_1" component="p" />
                            <Translate content="wallet.password_model_2" unsafe component="p" />

                            <Translate unsafe content="wallet.password_model_3" component="ul" />
                        </div>
                        <div className="button"><Link to="/create-account/password"><Translate content="wallet.use_password" /></Link></div>
                    </div>
                </div> */}
                </div>
            </div>
        );
    }
}
