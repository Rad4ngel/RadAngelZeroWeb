import React, { useEffect, useState } from "react";
import { getTitle } from "../../utils/getHTMLElements";
import { getRadStatus } from "../../services/google/firebase/database";
import { t } from "i18next";

function Activity({ activity }) {
    console.log(activity)
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '80%',
        }}>
            <h2>
                {t(`about.activity.type.${activity.type}`)} {activity.name}
            </h2>
            {activity.name === 'Spotify' &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <img src={activity.assets.largeImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`}
                    style={{
                        width: '20%',
                        objectFit: 'contain'
                    }}/>
                    <div style={{width: '2%'}}/>
                    <div>
                        <h3 style={{
                            marginBlock: '0px'
                        }}>
                            {activity.details}
                        </h3>
                        {/* <h4>{}</h4> */}
                    </div>

                </div>

            }

        </div>
    )
}

export default function About() {
    const [radStatus, setRadStatus] = useState({});

    useEffect(() => {
        document.title = 'About Rad'
        getRadStatus(setRadStatus);
    }, [])

    return (
        <main>
            <h2>About</h2>
            {Object.keys(radStatus).length > 0 && console.log(Object.values(radStatus.activities))}
            {Object.keys(radStatus).length > 0 && Object.values(radStatus.activities).map((activity, i) => {
                return (<Activity key={`${activity}-${i}`} activity={activity} />)
            })}
            {/* <p>{JSON.stringify(radStatus)}</p> */}
        </main>
    );
}