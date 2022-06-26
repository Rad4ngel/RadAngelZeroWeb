import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import style from './DiscordShow.module.css'


class DiscordShow extends Component {

    componentDidMount() {
        console.log(this.props)
        console.log(this.props.status.status)
    }
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#292b2f', borderRadius: '1rem', width: 'fit-content', padding: '0.6rem 0.8rem 0.4rem 0.6rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <img src={this.props.status.avatar} alt={`${this.props.status.avatar}`} style={{ borderRadius: '50%', width: '64px' }} />
                    <div style={{
                        display: 'flex',
                        backgroundColor: '#292b2f',
                        borderRadius: '50%',
                        width: '26px',
                        height: '26px',
                        marginTop: '-22px',
                        marginRight: '-6px',
                        marginLeft: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            backgroundColor:
                                this.props.status.status === 'online' ?
                                    '#0C0'
                                    :
                                    this.props.status.status === 'idle' ?
                                        '#CC0'
                                        :
                                        this.props.status.status === 'dnd' ?
                                            '#C00'
                                            :
                                            '#888',
                            width: '60%',
                            height: '60%',
                            borderRadius: '50%',
                        }}>

                        </div>
                    </div>
                </div>
                <div style={{ width: '0.6rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 className={style.username}>{this.props.status.username}</h2>
                    <h3 className={style.discriminator}>#{this.props.status.discriminator}</h3>
                </div>

            </div>
        )
    }
}

export default withTranslation()(DiscordShow);