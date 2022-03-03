import React from "react";
import { useTranslation } from 'react-i18next';
import styles from './Home.module.css'

export default function About() {
    const { t } = useTranslation();
    return (
        <main>
            <h2>{t('mainNavigation.home')}</h2>
            <p>Welcome to my webpage, this website is planed as "presentation card" or portfolio of the thing that i make</p>
        </main>
    );
}