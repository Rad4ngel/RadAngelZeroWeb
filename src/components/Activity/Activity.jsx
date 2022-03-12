import React, { useEffect, useState } from "react";
import { t } from 'i18next';
import { useElapsedTime } from 'use-elapsed-time';
import styles from './Activity.module.css'
const blacklist = ['Google Play'];
const specialImageSearch = ['GitHub']
const premidBlacklist = [];
const watchlist = ['Twitch', 'YouTube'];
const watchStatuses = ['Playing', 'Paused', 'Live']
const workSoftware = ['Blender', 'Visual Studio Code'];
const modelingSoftware = ['Blender'];

export default function Activity({ activity }) {
    const [randVSC] = useState(Math.round(Math.random() * 1));
    const [randBlender] = useState(Math.round(Math.random() * 1));
    const [fetchedImage, setFetchedImage] = useState('');
    const [VSCodeTitleAccompaniment, setVSCodeTitleAccompaniment] = useState('');
    const [BlenderTitleAccompaniment, setBlenderTitleAccompaniment] = useState('');
    const [isPlayingElapsedTime, setIsPlayingElapsedTime] = useState(true);

    const { elapsedTime, reset } = useElapsedTime({
        isPlaying: isPlayingElapsedTime,
        updateInterval: 1,
    });
    console.log(activity);

    useEffect(() => {
        // setIsPlayingElapsedTime(false);
        console.log('use effect');
        console.log(activity);
        if (activity.timestamps) {
            if (Object.keys(activity.timestamps).length > 0) {
                let now = new Date()
                if (activity.timestamps.start) {
                    let start = new Date(activity.timestamps.start * 1000)
                    let startSec = (Math.floor((now - start) / 1000)).toFixed(0)
                    reset(Number(startSec));
                    setIsPlayingElapsedTime(true)
                    console.log(startSec)
                }
                // let started = new Date(time)
            }
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
    }, [activity, randBlender, randVSC, reset])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '80%',
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
                        {activity.name === 'Blender' && BlenderTitleAccompaniment + ' '}
                        {activity.name === 'Spotify' || workSoftware.includes(activity.name) ? t(`on`) + ' ' : ''}
                        {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        {((activity.assets && activity.assets.largeImageURL) || fetchedImage) &&
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
                                    {activity.assets.smallImageURL &&
                                        <div style={{
                                            display: 'flex',
                                            backgroundColor: '#2c2c2c',
                                            // backgroundColor: '#f0f',
                                            width: '4vw',
                                            minWidth: '32px',
                                            borderRadius: '50%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: '-3.4vw',
                                            marginRight: '-0.8vw',
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
                                {activity.details ? activity.details.replace('Editing', t(`about.activity.VisualStudioCode.editing`)).replace('.blend', '') : ''}
                            </h3>
                            <h4>
                                {activity.name === 'Blender' && activity.state.includes('KB') && t(`about.activity.Blender.fileSize`) + ': '}
                                {
                                    activity.state ?
                                        activity.name === 'Spotify' ?
                                            activity.state.replace(/;/g, ',')
                                            :
                                            activity.name === 'Visual Studio Code' ?
                                                activity.details === 'Idling' ?
                                                    'Pensando'
                                                    :
                                                    activity.state.replace('Workspace:', t(`about.activity.VisualStudioCode.workspace`))
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
                                                activity.assets.largeText.toLowerCase().includes('premid') ?
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
                            <div>

                                {activity.timestamps &&
                                    <h6>
                                        {Math.floor(elapsedTime.toFixed(0) / 86400) !== 0 &&
                                            Math.floor(elapsedTime.toFixed(0) / 86400) + ':'}
                                        {Math.floor(elapsedTime.toFixed(0) / 3600) !== 0 &&
                                            ((Math.floor(elapsedTime.toFixed(0) / 3600) - (Math.floor(elapsedTime.toFixed(0) / 86400) * 24)).toString().length < 2 && '0')
                                            +
                                            (Math.floor(elapsedTime.toFixed(0) / 3600) - (Math.floor(elapsedTime.toFixed(0) / 86400) * 24)) + ':'}

                                        {(Math.floor(elapsedTime.toFixed(0) / 60) - (Math.floor(elapsedTime.toFixed(0) / 3600) * 60)).toString().length < 2 && '0'}
                                        {(Math.floor(elapsedTime.toFixed(0) / 60) - (Math.floor(elapsedTime.toFixed(0) / 3600) * 60)) + ':'}

                                        {Number(elapsedTime.toFixed(0) % 60).toString().length < 2 && '0'}{elapsedTime.toFixed(0) % 60}
                                    </h6>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}