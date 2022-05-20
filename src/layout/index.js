import React, { useContext } from 'react';
import { UserContext } from '../index';
import styles from './styles.module.scss';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import logo from './logo.svg';

export const Layout = () => {
    const navigate = useNavigate();
    const setUser = useContext(UserContext)[1];

    const logout = () => {
        setUser(null);
        localStorage.removeItem('radioUser');
        navigate('/login');
    };

    return (
        <div className={styles.Wrapper}>
            <header className={styles.Header}>
                <Link to="/">
                    <img src={logo} alt="" />
                </Link>
            </header>

            <div className={styles.Body}>
                <ul className={styles.Sidebar}>
                    <li>
                        <Link className={styles.SidebarButton} to="/">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path
                                    d="M3 15H21V13H3V15ZM3 19H21V17H3V19ZM3 11H21V9H3V11ZM3 5V7H21V5H3Z"
                                    fill="currentColor"
                                />
                            </svg>

                            <span>Управление радио</span>
                        </Link>
                    </li>
                    <li>
                        <Link className={styles.SidebarButton} to="/tests">
                            <svg
                                width="24"
                                height="15"
                                viewBox="0 0 12 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 0V3H4.71429V15H7.28571V3H12V0H0Z"
                                    fill="black"
                                />
                            </svg>

                            <span>A/B тестирование</span>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={logout}
                            className={styles.SidebarButton}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path
                                    d="M7 24H9V22H7V24ZM11 24H13V22H11V24ZM13 2H11V12H13V2ZM16.56 4.44L15.11 5.89C16.84 6.94 18 8.83 18 11C18 14.31 15.31 17 12 17C8.69 17 6 14.31 6 11C6 8.83 7.16 6.94 8.88 5.88L7.44 4.44C5.36 5.88 4 8.28 4 11C4 15.42 7.58 19 12 19C16.42 19 20 15.42 20 11C20 8.28 18.64 5.88 16.56 4.44ZM15 24H17V22H15V24Z"
                                    fill="currentColor"
                                />
                            </svg>

                            <span>Выйти</span>
                        </button>
                    </li>
                </ul>

                <div className={styles.Content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
