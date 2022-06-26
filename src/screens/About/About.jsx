import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTitle } from "../../utils/getHTMLElements";
import { getRadStatus } from "../../services/google/firebase/database";
import Activity from './../../components/Activity/Activity';
import DiscordShow from "../../components/DiscordShow/DiscordShow";

export default function About() {
    const { t } = useTranslation();
    const [radStatus, setRadStatus] = useState({});

    useEffect(() => {
        document.title = 'About Rad'
        getRadStatus(setRadStatus);
    }, [])

    return (
        <>
            {Object.keys(radStatus).length > 0 &&
                <main style={{display: 'flex', margin: '0px auto', padding: '1rem'}}>
                    <h2>
                        {t(`about.introduction`)}
                        {/* {radStatus.username}  */}
                    </h2>
                    <div>
                        <DiscordShow status={radStatus} />
                    </div>
                    {/* <h2 style={{ width: '80%', alignSelf: 'center' }}>
                    {t(`about.status.iam`)} {radStatus.status ? t(`about.status.${radStatus.status}`) : t(`about.status.none`)}
                </h2> */}
                    {Object.keys(radStatus).length > 0 && radStatus.activities && Object.values(radStatus.activities).map((activity, i) => {
                        return (<Activity key={`${activity}-${i}`} activity={activity} />)
                    })}
                    {/* <p>{JSON.stringify(radStatus)}</p> */}
                </main>
            }
        </>
    );
}