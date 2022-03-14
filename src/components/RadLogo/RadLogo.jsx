import React, { Component } from "react";
import { RandomReveal } from "react-random-reveal";
import styles from './RadLogo.module.css';

class RadLogo extends Component {

    render() {
        return (
            <h1>
                <RandomReveal isPlaying duration={1} characters={'RAD'} />
            </h1>
        )
    }
}

export default RadLogo;