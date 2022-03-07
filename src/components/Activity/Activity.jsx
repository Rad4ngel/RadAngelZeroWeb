import React, { useState } from "react"
import { t } from 'i18next'
const blacklist = ['Spotify', 'Visual Studio Code']

export default function Activity({ activity }) {
    const [rand, setRand] = useState(Math.round(Math.random() * 1));
    const [gameImage, setGameImage] = useState('')
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

    if (!activity.assets) {
        const searchWikis = new XMLHttpRequest();
        searchWikis.open("GET", `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${activity.name}&format=json&origin=*`);
        searchWikis.send();
        searchWikis.onreadystatechange = (wikisResult) => {
            if (wikisResult.target.readyState === 4 && wikisResult.target.status === 200) {
                let title = JSON.parse(searchWikis.response).query.search[0].title
                const getWiki = new XMLHttpRequest();
                getWiki.open("GET", `https://en.wikipedia.org/w/rest.php/v1/page/${title}`);
                getWiki.send();
                getWiki.onreadystatechange = (wiki) => {
                    if (wiki.target.readyState === 4 && wiki.target.status === 200) {
                        let wikiContent = JSON.parse(getWiki.response).source.split('\n');

                        wikiContent.every((element) => {
                            if (element.includes('image')) {
                                const getWikiImage = new XMLHttpRequest();
                                getWikiImage.open("GET", `https://en.wikipedia.org/w/api.php?action=query&titles=Image:${element.split(' = ')[1]}&prop=imageinfo&iiprop=url&format=json&origin=*`);
                                getWikiImage.send();
                                getWikiImage.onreadystatechange = (wikiImage) => {
                                    if (wikiImage.target.readyState === 4 && wikiImage.target.status === 200) {
                                        let wikiPage = JSON.parse(getWikiImage.response).query.pages;
                                        setGameImage(wikiPage[Object.keys(wikiPage)[0]].imageinfo[0].url)
                                        console.log(wikiPage[Object.keys(wikiPage)[0]].imageinfo[0].url)
                                    }
                                }
                                return false;
                            }
                            return true;
                        });
                    }
                }
            }
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
                <div>
                    <h2>
                        {t(`about.activity.type.${activity.type}`)} {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img src={gameImage} alt={`${t('about.activity.Spotify.coverOf')}`}
                            style={{
                                width: '20%',
                                objectFit: 'contain'
                            }} />
                    </div>
                </div>
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
                            <h4>{activity.state.replace(/;/g, ',')}</h4>
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