import React from 'react';
import { Link } from 'react-router-dom';
import preloader from './preloader.svg';
import styles from './styles.module.scss';

export const Button = ({ children, disabled, isLoading, to, ...props }) => {
    const content = (
        <>
            <span>{children}</span>

            {isLoading && (
                <img className={styles.Preloader} src={preloader} alt="" />
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={styles.Button}>
                {content}
            </Link>
        );
    } else {
        return (
            <button
                className={`${styles.Button} ${
                    isLoading && styles.Button_Loading
                }`}
                disabled={isLoading || disabled}
                {...props}
            >
                {content}
            </button>
        );
    }
};
