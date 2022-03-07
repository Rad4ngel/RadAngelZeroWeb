import React, { useState } from "react"
import { t } from 'i18next'
const blacklist = ['Spotify', 'Visual Studio Code']

export default function Activity({ activity }) {
    const [rand, setRand] = useState(Math.round(Math.random() * 1))
    console.log(activity)

    const VSCTitleAccompaniment = () => {
        switch (rand) {
            case 0:
                return t(`about.activity.VisualStudioCode.titleAccompaniment.writingCode`)
            case 1:
                return t(`about.activity.VisualStudioCode.titleAccompaniment.doingMagic`)
            default:
                break;
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '80%',
        }}>
            {((activity.assets ? !activity.assets.largeText.toLowerCase().includes('premid') : true) && !blacklist.includes(activity.name)) &&
                <h2>
                    {t(`about.activity.type.${activity.type}`)} {activity.name}
                </h2>

            }
            {activity.name === 'Spotify' &&
                <div>
                    <h2>
                        {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img src={activity.assets.largeImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`}
                            style={{
                                width: '20%',
                                objectFit: 'contain'
                            }} />
                        <div style={{ width: '2%' }} />
                        <div>
                            <h3 style={{
                                marginBlock: '0px'
                            }}>
                                {activity.details}
                            </h3>
                            <h4>{activity.state.replace(';', ',')}</h4>
                            <h5>{activity.assets.largeText}</h5>
                        </div>
                    </div>
                </div >
            }
            {activity.name === 'Visual Studio Code' &&
                <div>
                    <h2>
                        {VSCTitleAccompaniment()} {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img src={activity.assets.largeImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`}
                            style={{
                                width: '20%',
                                objectFit: 'contain',
                                borderRadius: '10%'
                            }} />
                        <div style={{ width: '2%' }} />
                        <div>
                            <h3 style={{
                                marginBlock: '0px'
                            }}>
                                {t(`about.activity.VisualStudioCode.editing`)} {activity.details.split(' ').pop()}
                            </h3>
                            <h4>{t(`about.activity.VisualStudioCode.workspace`)} {activity.state.split(' ').pop()}</h4>
                            <h5>{t(`about.activity.VisualStudioCode.edtitingFile`, { fileType: activity.assets.largeText.split(' ')[2] })}</h5>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}