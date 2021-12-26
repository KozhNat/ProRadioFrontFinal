import React from 'react';
import styles from './styles.module.scss';

export const Checkbox = ({ className, ...props }) => {
    return (
        <label className={`${styles.Checkbox} ${className}`}>
            <span className={styles.CheckboxShape} />

            <input
                className={styles.CheckboxInput}
                type="checkbox"
                {...props}
            />

            <svg
                className={styles.CheckboxIcon}
                width="18"
                height="14"
                viewBox="0 0 18 14"
            >
                <path
                    d="M6.00002 11.2L1.80002 7.00001L0.400024 8.40001L6.00002 14L18 2.00001L16.6 0.600006L6.00002 11.2Z"
                    fill="black"
                />
            </svg>
        </label>
    );
};
