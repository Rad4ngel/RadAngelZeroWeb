import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './MainNavigation.module.css';
import RadLogo from '../RadLogo/RadLogo';

export default function Navigator() {
    const { t } = useTranslation();
    let path = useLocation().pathname
    return (
        <nav>
            <Link to="/" style={path === '/' ? { color: '#00f3ff' } : {}}>{t('mainNavigation.home')}</Link>
            <Link to="/commissions" style={path === '/commissions' ? { color: '#00f3ff' } : {}}>{t('mainNavigation.commissions')}</Link>
            <Link to="/portfolio" style={path === '/portfolio' ? { color: '#00f3ff' } : {}}>{t('mainNavigation.portfolio')}</Link>
            <Link to="/about" style={path === '/about' ? { color: '#00f3ff' } : {}}>{t('mainNavigation.about')}</Link>
        </nav>
    )

}