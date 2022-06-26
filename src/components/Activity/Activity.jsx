import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useElapsedTime } from 'use-elapsed-time';
import styles from './Activity.module.css'
const blacklist = ['Google Play'];
const specialImageSearch = ['GitHub']
const premidBlacklist = [];
const watchlist = ['Twitch', 'YouTube'];
const watchStatuses = ['Playing', 'Paused', 'Live']
const workSoftware = ['Visual Studio Code', 'Blender', 'VRoid Studio'];
const modelingSoftware = ['Blender', 'VRoid Studio'];

export default function Activity({ activity }) {
    const { t } = useTranslation();
    const [randVSC] = useState(Math.round(Math.random() * 1));
    const [randBlender] = useState(Math.round(Math.random() * 1));
    const [fetchedImage, setFetchedImage] = useState('');
    const [VSCodeTitleAccompaniment, setVSCodeTitleAccompaniment] = useState('');
    const [BlenderTitleAccompaniment, setBlenderTitleAccompaniment] = useState('');
    const [duration, setDuration] = useState(0);
    const [isPlayingElapsedTime, setIsPlayingElapsedTime] = useState(false);

    const { elapsedTime, reset } = useElapsedTime({
        isPlaying: isPlayingElapsedTime,
        updateInterval: 1,
    });

    useEffect(() => {
        console.log(activity)
        if (activity.timestamps) {
            if (Object.keys(activity.timestamps).length > 0) {
                let now = new Date()
                let start = new Date(now)
                reset(0)
                if (activity.timestamps.start) {
                    start = new Date(activity.timestamps.start * 1000)
                    let startSec = (Math.floor((now - start) / 1000)).toFixed(0)
                    reset(Number(startSec));
                }
                if (activity.timestamps.end) {
                    let end = new Date(activity.timestamps.end * 1000)
                    let durationSecs = (Math.floor((end - start) / 1000) - 1).toFixed(0)
                    setDuration(Number(durationSecs))
                }
            }
            setIsPlayingElapsedTime(true)
        } else {
            setIsPlayingElapsedTime(false)
        }
        switch (randVSC) {
            case 0:
                setVSCodeTitleAccompaniment(t(`about.activity.VisualStudioCode.titleAccompaniment.writingCode`).toLowerCase())
                break;
            case 1:
                setVSCodeTitleAccompaniment(t(`about.activity.VisualStudioCode.titleAccompaniment.doingMagic`).toLowerCase())
                break;
            default:
                break;
        }
        switch (randBlender) {
            case 0:
                setBlenderTitleAccompaniment(t(`about.activity.Blender.titleAccompaniment.modeling`).toLowerCase())
                break;
            case 1:
                setBlenderTitleAccompaniment(t(`about.activity.Blender.titleAccompaniment.makingWaifus`).toLowerCase())
                break;
            default:
                break;
        }
        if (specialImageSearch.includes(activity.name)) {
            if (activity.name === 'GitHub') {
                if (activity.details.includes('profile')) {
                    setFetchedImage(`https://github.com/${activity.details.split(' ')[1].split('\'')[0]}.png`)
                }
                if (activity.state) {
                    setFetchedImage(`https://github.com/${activity.state.split('/')[0]}.png`)
                }
            }
        }
        if (!activity.assets && !specialImageSearch.includes(activity.name)) {
            console.log('search on wiki ' + activity.name)
            const searchWikis = new XMLHttpRequest();
            searchWikis.open("GET", `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${activity.name}&format=json&origin=*`);
            searchWikis.send();
            searchWikis.onreadystatechange = (wikisResult) => {
                if (wikisResult.target.readyState === 4 && wikisResult.target.status === 200) {
                    console.log(JSON.parse(searchWikis.response))
                    if (JSON.parse(searchWikis.response).query.search.length > 0) {
                        let title = JSON.parse(searchWikis.response).query.search[activity.name === 'Blender' ? 1 : 0].title
                        const getWiki = new XMLHttpRequest();
                        getWiki.open("GET", `https://en.wikipedia.org/w/rest.php/v1/page/${title}`);
                        getWiki.send();
                        getWiki.onreadystatechange = (wiki) => {
                            if (wiki.target.readyState === 4 && wiki.target.status === 200) {
                                let wikiContent = JSON.parse(getWiki.response).source.split('\n');
                                wikiContent.every((element) => {
                                    if (element.includes('logo') || element.includes('File:') || element.includes('image')) {
                                        let imgProcessor = element
                                        if (imgProcessor.includes(' = ')) {
                                            imgProcessor = imgProcessor.split(' = ')[1]
                                        }
                                        if (imgProcessor.includes('|')) {
                                            imgProcessor = imgProcessor.split('|')[0]
                                        }
                                        const getWikiImage = new XMLHttpRequest();
                                        getWikiImage.open("GET", `https://en.wikipedia.org/w/api.php?action=query&titles=Image:${imgProcessor.replace(/\[/g, '').replace('File:', '')}&prop=imageinfo&iiprop=url&format=json&origin=*`);
                                        getWikiImage.send();
                                        getWikiImage.onreadystatechange = (wikiImage) => {
                                            if (wikiImage.target.readyState === 4 && wikiImage.target.status === 200) {
                                                let wikiPage = JSON.parse(getWikiImage.response).query.pages;
                                                setFetchedImage(wikiPage[Object.keys(wikiPage)[0]].imageinfo[0].url)
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
        }
    }, [activity, randBlender, randVSC, reset, t])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'flex-start',
            backgroundColor: '#2c2c2c',
            padding: '1.2em',
            borderRadius: '2vh',
            // border: '8px solid #9e00ff',
            margin: '20px 0px',
        }}>
            {(!blacklist.includes(activity.name)) &&
                <div style={{ overflow: 'hidden' }}>
                    <h2>
                        {!workSoftware.includes(activity.name) && !watchlist.includes(activity.name) ? t(`about.activity.type.${activity.type}`) + ' ' : ''}
                        {workSoftware.includes(activity.name) && t(`about.activity.Work.working`) + ' '}
                        {watchlist.includes(activity.name) && t(`about.activity.type.WATCHING`) + ' '}
                        {activity.name === 'Visual Studio Code' && VSCodeTitleAccompaniment + ' '}
                        {modelingSoftware.includes(activity.name) && BlenderTitleAccompaniment + ' '}
                        {activity.name === 'Spotify' || workSoftware.includes(activity.name) ? t(`on`) + ' ' : ''}
                        {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        {((activity.assets && activity.assets.largeImageURL) || fetchedImage || activity.name === 'League of Legends') &&
                            <>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '20%',
                                    minWidth: '128px',
                                    objectFit: 'contain',
                                }}>
                                    <img
                                        src={
                                            activity.assets ?
                                                activity.name === 'League of Legends' ?
                                                    activity.state === 'En Selección de campeones' || activity.state === 'En Sala' || activity.state === 'En cola' ?
                                                        activity.assets.largeImageURL
                                                        :
                                                        `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${activity.assets.largeText === 'Kai\'Sa' ? 'Kaisa' : activity.assets.largeText.replace(' ', '').replace('\'', '')}_0.jpg`
                                                    :
                                                    (activity.name === 'GitHub' && (activity.state || activity.details.includes('profile'))) ?
                                                        fetchedImage
                                                        :
                                                        activity.assets.largeImageURL || fetchedImage
                                                :
                                                fetchedImage
                                        }
                                        alt={activity.name === 'Spotify' ?
                                            `${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`
                                            :
                                            `${t('about.activity.Game.coverOf')} ${activity.name}`
                                        }
                                        style={{
                                            width: '100%',
                                            objectFit: 'contain',
                                            borderRadius: activity.name === 'Spotify' || activity.state === 'En partida' || !activity.assets ? '0%' : '10%',
                                            alignSelf: 'flex-start'
                                        }} />
                                    {activity.assets && activity.assets.smallImageURL &&
                                        <div style={{
                                            display: 'flex',
                                            backgroundColor: '#2c2c2c',
                                            // backgroundColor: '#f0f',
                                            width: '30%',
                                            minWidth: '32px',
                                            borderRadius: '50%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: '-20%',
                                            marginRight: '-8%',
                                            marginLeft: 'auto'
                                        }}>
                                            <img src={activity.assets.smallImageURL}
                                                alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.smallImageURL}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: '10%'
                                                }} />
                                        </div>
                                    }
                                </div>
                                <div style={{ width: '12px' }} />
                            </>
                        }
                        <div>
                            <h3 style={{
                                marginBlock: '0px'
                            }}>
                                {/* {activity.name === 'Spotify' &&
                                    < a href="null">
                                        {activity.details ? activity.details.replace('Editing', t(`about.activity.VisualStudioCode.editing`)) : ''}
                                    </a>
                                } */}
                                {/* {activity.name !== 'Spotify' &&
                                     activity.details ? activity.details.replace('Editing', t(`about.activity.VisualStudioCode.editing`)) : ''
                                } */}
                                {activity.name === 'Blender' && t(`about.activity.Blender.project`) + ': '}
                                {(activity.details && activity.name !== 'League of Legends') ?
                                    activity.details.includes('Viewing home page') ?
                                        t(`about.activity.Watch.BrowsingMain`)
                                        :
                                        activity.details.includes('Browsing') ?
                                            t(`about.activity.Watch.Browsing`)
                                            :
                                            activity.details.replace('Editing', t(`about.activity.VisualStudioCode.editing`)).replace('.blend', '')
                                    :
                                    ''}
                                {activity.name === 'League of Legends' ?
                                    activity.details ?
                                        activity.details.includes('Grieta del Invocador') ?
                                            t(`about.activity.LeagueOfLegends.Map.SummonersRift`)
                                            :
                                            activity.details.includes('Abismo de los Lamentos') ?
                                                t(`about.activity.LeagueOfLegends.Map.HowlingAbyss`)
                                                :
                                                t(`about.activity.LeagueOfLegends.Map.TFT`)
                                        :
                                        ''
                                    :
                                    ''
                                }
                                {activity.name === 'League of Legends' ?
                                    ' (' +
                                    (activity.details ?
                                        activity.details.includes('Clasificación') ?
                                            t(`about.activity.LeagueOfLegends.Mode.Ranked`)
                                            :
                                            activity.details.includes('Cooperativo vs. IA') ?
                                                t(`about.activity.LeagueOfLegends.Mode.CoopVSAI`)
                                                :

                                                t(`about.activity.LeagueOfLegends.Mode.${/\(([^)]+)\)/.exec(activity.details)[1]}`)
                                        :
                                        '')
                                    + ')'
                                    :
                                    ''
                                }
                            </h3>
                            <h4>
                                {activity.name === 'Blender' && activity.state.includes('KB') && t(`about.activity.Blender.fileSize`) + ': '}
                                {activity.state ?
                                    activity.name === 'Spotify' ?
                                        activity.state.replace(/;/g, ',')
                                        :
                                        activity.name === 'Visual Studio Code' ?
                                            activity.details === 'Idling' ?
                                                'Pensando'
                                                :
                                                activity.state.replace('Workspace:', t(`about.activity.VisualStudioCode.workspace`))
                                            :
                                            activity.name === 'Twitch' ?
                                                activity.state.replace(' (undefined)', '')
                                                :
                                                activity.state
                                    :
                                    ''
                                }
                            </h4>
                            {activity.name === 'Blender' &&
                                <h5>
                                    {console.log(activity.assets.smallText)}
                                    {
                                        t(
                                            `about.activity.Blender.modeOrderer.${activity.assets.smallText.replace(/ /g, '')}`,
                                            {
                                                type: t(`about.activity.Blender.modes.${activity.assets.smallText.split(' ')[0]}`),
                                                mode: t(`about.activity.Blender.modes.${activity.assets.smallText.split(' ')[1]}`)
                                            }
                                        )
                                    }
                                </h5>
                            }
                            <h5>
                                {
                                    activity.assets ?
                                        activity.name === 'Visual Studio Code' ?
                                            activity.assets.largeText === 'Idling' ? '' : t(`about.activity.VisualStudioCode.edtitingFile`, { fileType: activity.assets.largeText.split(' ')[2] })
                                            :
                                            activity.name === 'Blender' ?
                                                t(`about.activity.Blender.engine`, { engine: activity.assets.largeText.split(' ')[0] })
                                                + ' ' +
                                                t(`in`)
                                                + ' ' +
                                                t(`about.activity.Blender.version`, { version: activity.assets.largeText.split(' ')[activity.assets.largeText.split(' ').length - 1] })
                                                :
                                                activity.assets.largeText && activity.assets.largeText.toLowerCase().includes('premid') ?
                                                    watchStatuses.includes(activity.assets.smallText) ?
                                                        t(`about.activity.Watch.${activity.assets.smallText}`)
                                                        :
                                                        ''
                                                    :
                                                    activity.assets.largeText || ''
                                        :
                                        ''
                                }
                            </h5>

                            {activity.timestamps &&
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                                    {activity.timestamps.start &&
                                        <h6>
                                            {'Tiempo transcurrido: '}
                                            {Math.floor(elapsedTime / 86400) !== 0 &&
                                                Math.floor(elapsedTime / 86400) + ':'}

                                            {Math.floor(elapsedTime / 3600) !== 0 &&
                                                ((Math.floor(elapsedTime / 3600) - (Math.floor(elapsedTime / 86400) * 24)).toString().length < 2 && '0')
                                                +
                                                (Math.floor(elapsedTime / 3600) - (Math.floor(elapsedTime / 86400) * 24)) + ':'}

                                            {(Math.floor(elapsedTime / 60) - (Math.floor(elapsedTime / 3600) * 60)).toString().length < 2 && '0'}
                                            {(Math.floor(elapsedTime / 60) - (Math.floor(elapsedTime / 3600) * 60)) + ':'}

                                            {Number(elapsedTime % 60).toString().length < 2 && '0'}{elapsedTime % 60}
                                        </h6>
                                    }
                                    {activity.timestamps.end &&
                                        <h6>
                                            {'Tiempo restante: '}

                                            {(duration - elapsedTime) <= 0 &&
                                                '00:00'
                                            }
                                            {(duration - elapsedTime) > 0 &&
                                                ((Math.floor((duration - elapsedTime) / 86400)) !== 0 ?
                                                    (Math.floor((duration - elapsedTime) / 86400)) + ':'
                                                    :
                                                    '')
                                                +
                                                (Math.floor((duration - elapsedTime) / 3600) !== 0 ?
                                                    ((Math.floor((duration - elapsedTime) / 3600) - (Math.floor((duration - elapsedTime) / 86400) * 24).toString().length < 2) ? '0' : '')
                                                    +
                                                    (Math.floor((duration - elapsedTime) / 3600) - (Math.floor((duration - elapsedTime) / 86400) * 24) - (Math.floor(elapsedTime / 3600))) + ':'
                                                    :
                                                    '')

                                                +
                                                ((Math.floor((duration - elapsedTime) / 60) - (Math.floor((duration - elapsedTime) / 3600) * 60).toString().length < 2) ? '0' : '')
                                                +
                                                (Math.floor((duration - elapsedTime) / 60) - (Math.floor((duration - elapsedTime) / 3600) * 60)) + ':'
                                                +
                                                (Number((duration - elapsedTime) % 60).toString().length < 2 ? '0' : '') + ((duration - elapsedTime) % 60 + (((duration - elapsedTime) % 60) < 0 ? 60 : 0))
                                            }
                                        </h6>
                                    }
                                    {activity.timestamps.end && activity.timestamps.start &&
                                        <h6>
                                            {'Duration: '}

                                            {Math.floor(duration / 86400) !== 0 &&
                                                Math.floor(duration / 86400) + ':'}

                                            {Math.floor(duration / 3600) !== 0 &&
                                                ((Math.floor(duration / 3600) - (Math.floor(duration / 86400) * 24)).toString().length < 2 && '0')
                                                +
                                                (Math.floor(duration / 3600) - (Math.floor(duration / 86400) * 24)) + ':'}

                                            {(Math.floor(duration / 60) - (Math.floor(duration / 3600) * 60)).toString().length < 2 && '0'}
                                            {(Math.floor(duration / 60) - (Math.floor(duration / 3600) * 60)) + ':'}
                                            {Number(duration % 60).toString().length < 2 && '0'}{duration % 60}
                                        </h6>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}