import React from "react";

import styles from '../../components/button/index.module.css' with {type: 'css'};

export const ButtonReset = React.memo(() => {
    return (
        <button type="button" className={styles.Button}>
            Reset to default
        </button>
    )
})