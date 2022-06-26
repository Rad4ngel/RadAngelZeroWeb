import React, { Component } from 'react';
import { withTranslation } from 'react-i18next'

class LanguageChanger extends Component {

    componentDidMount() {
        localStorage.getItem('')
    }

    render() {
        return (
            <div style={{ display: 'flex', marginRight: '1em', height: '55px', marginLeft: 'auto', border: '0px 0px 2px 0px solid #fff' }}>
                <img
                    src='https://unpkg.com/language-icons/icons/es.svg'
                    alt='Español'
                    onClick={() => this.props.i18n.changeLanguage('es')}
                    style={{}}
                />
                <p>
                    |
                </p>
                <img
                    src='https://unpkg.com/language-icons/icons/en.svg'
                    alt='English'
                    onClick={() => this.props.i18n.changeLanguage('en')}
                />
            </div>
        )
    }
}

export default withTranslation()(LanguageChanger);