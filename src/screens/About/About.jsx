import React, { useEffect, useState } from "react";
import { getTitle } from "../../utils/getHTMLElements";
import { getRadStatus } from "../../services/google/firebase/database";
import { t } from "i18next";
import Activity from './../../components/Activity/Activity'

export default function About() {
    const [radStatus, setRadStatus] = useState({});

    useEffect(() => {
        document.title = 'About Rad'
        getRadStatus(setRadStatus);
    }, [])

    return (
        <main>
            <h2 style={{ width: '80%', alignSelf: 'center' }}>
                {t(`about.introduction`)}
                {/* {radStatus.username}  */}
            </h2>
            {Object.keys(radStatus).length > 0 && radStatus.activities && Object.values(radStatus.activities).map((activity, i) => {
                return (<Activity key={`${activity}-${i}`} activity={activity} />)
            })}
            {/* <p>{JSON.stringify(radStatus)}</p> */}
        </main>
    );
}