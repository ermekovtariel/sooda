import React from 'react'
import PT from "prop-types";

import styles from "./index.module.scss";

const Paper = ({ children }) => {
    return (
        <div className={styles.paper}>
            {children}
        </div>
    )
}

Paper.propTypes = {
    children: PT.any,
}

export default Paper



