import React, { useEffect, useState } from "react";
import { t } from 'i18next';
import { useElapsedTime } from 'use-elapsed-time';
import styles from './Activity.module.css'
const blacklist = ['Twitch', 'YouTube', 'Google Play', 'GitHub'];
const premidBlacklist = [];
const watchlist = ['Twitch', 'YouTube'];
const watchStatuses = ['Playing', 'Paused', 'Live']
const workSoftware = ['Blender', 'Visual Studio Code'];
const modelingSoftware = ['Blender'];

export default function Activity({ activity }) {
    const [rand] = useState(Math.round(Math.random() * 1));
    const [gameImage, setGameImage] = useState('');
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
        // switch (rand) {
        //     case 0:
        //         return t(`about.activity.VisualStudioCode.titleAccompaniment.writingCode`)
        //     case 1:
        //         return t(`about.activity.VisualStudioCode.titleAccompaniment.doingMagic`)
        //     default:
        //         break;
        // }
        if (!activity.assets && !blacklist.includes(activity.name)) {
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
                                            setGameImage(wikiPage[Object.keys(wikiPage)[0]].imageinfo[0].url)
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
    }, [activity, rand, reset])



    const VSCTitleAccompaniment = () => {

    }




    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '80%',
            backgroundColor: '#2c2c2c',
            padding: '2vw',
            borderRadius: '2vh',
            // border: '8px solid #9e00ff',
            margin: '20px 0px',
            overflow: 'hidden'
        }}>
            {((activity.assets ? (activity.assets.largeText ? !activity.assets.largeText.toLowerCase().includes('premid') : true) : true) && !blacklist.includes(activity.name)) &&
                <div>
                    <h2>
                        {!workSoftware.includes(activity.name) ? t(`about.activity.type.${activity.type}`) : t(`about.activity.Work.working`)} {activity.name === 'Spotify' || workSoftware.includes(activity.name) ? t(`on`) : ''} {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
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
                                        activity.assets.largeImageURL || gameImage
                                    :
                                    gameImage
                            }
                            alt={activity.name === 'Spotify' ?
                                `${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`
                                :
                                `${t('about.activity.Game.coverOf')} ${activity.name}`
                            }
                            style={{
                                width: '20%',
                                objectFit: 'contain',
                                borderRadius: activity.name === 'Spotify' || activity.state === 'En partida' || !activity.assets ? '0%' : '10%',
                                minWidth: '128px',
                                alignSelf: 'flex-start'
                            }} />
                        <div style={{ width: '2%' }} />
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
                                {activity.details ? activity.details.replace('Editing', t(`about.activity.VisualStudioCode.editing`)) : ''}
                            </h3>
                            <h4>
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
                            <h5>
                                {
                                    activity.assets ?
                                        activity.name === 'Visual Studio Code' ?
                                            activity.assets.largeText === 'Idling' ? '' : t(`about.activity.VisualStudioCode.edtitingFile`, { fileType: activity.assets.largeText.split(' ')[2] })
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
            {
                (activity.assets ? (activity.assets.largeText ? activity.assets.largeText.toLowerCase().includes('premid') : false) : false) && !premidBlacklist.includes(activity.name) &&
                <div>
                    <h2>
                        {watchlist.includes(activity.name) && t(`about.activity.type.WATCHING`)} {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '20%',
                            objectFit: 'contain',
                        }}>
                            <img src={activity.assets.largeImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`}
                                style={{
                                    width: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '10%'
                                }} />
                            {activity.assets.smallText &&
                                <div style={{
                                    display: 'flex',
                                    backgroundColor: '#2c2c2c',
                                    // backgroundColor: '#f0f',
                                    width: '4vw',
                                    height: '4vw',
                                    borderRadius: '50%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '-3.4vw',
                                    marginRight: '-0.8vw',
                                    marginLeft: 'auto'

                                }}>
                                    {watchlist.includes(activity.name) &&
                                        // <div style={{
                                        //     backgroundColor: '#f00',
                                        //     width: '60%',
                                        //     height: '60%',
                                        //     borderRadius: '50%'
                                        // }} />
                                        <img src={activity.assets.smallImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.smallImageURL}`}
                                            style={{
                                                width: '125%',
                                                height: '125%',
                                                objectFit: 'contain',
                                                borderRadius: '10%'
                                            }} />
                                    }
                                </div>
                            }
                        </div>

                        <div style={{ width: '2%' }} />
                        <div>
                            <h3 style={{
                                marginBlock: '0px'
                            }}>
                                {activity.details}
                            </h3>
                            <h4>{activity.state}</h4>
                            <h5>{activity.assets.smallText}</h5>
                        </div>
                    </div>
                </div >
            }
        </div >
    )
}