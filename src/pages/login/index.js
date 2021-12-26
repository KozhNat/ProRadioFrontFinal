import axios from 'axios';
import React, { useState, useContext } from 'react';
import { UserContext } from '../../index';
import styles from './styles.module.scss';
import logo from './logo.svg';
import preloader from './preloader.svg';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const setUser = useContext(UserContext)[1];
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');
            const {
                data: { id },
            } = await axios.post('/user/login', {
                email,
                password,
            });
            const { data: userData } = await axios.get(`/user/${id}`);
            setUser(userData);
            navigate('/');
        } catch (error) {
            setError('Неправильный логин или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.Wrapper}>
            <div className={styles.Bg} />
            <form className={styles.Form} onSubmit={onSubmit}>
                <img className={styles.Logo} src={logo} alt="" />
                {error && <p className={styles.Error}>{error}</p>}
                <p className={styles.InputTitle}>Введите логин</p>
                <input
                    className={styles.FormInput}
                    placeholder="login"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className={styles.InputTitle}>Введите пароль</p>
                <input
                    className={styles.FormInput}
                    placeholder="************"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className={`${styles.Button} ${
                        loading && styles.ButtonLoading
                    }`}
                    disabled={!email || !password}
                >
                    {loading && (
                        <img
                            className={styles.Preloader}
                            src={preloader}
                            alt=""
                        />
                    )}
                    <span>Войти</span>
                </button>
            </form>
        </div>
    );
};
