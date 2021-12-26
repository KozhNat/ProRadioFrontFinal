import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '../../components/checkbox';
import { Button } from '../../components/button';
import styles from './styles.module.scss';

export const StationList = () => {
    const [list, setList] = useState([]);

    const fetchList = useCallback(async () => {
        const { data } = await axios.get('/radio_channel/');

        setList(data);
    }, []);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    const deleteStation = async (station) => {
        if (
            !window.confirm(
                `Вы действительно хотите удалить станцию "${station.name}"?`,
            )
        ) {
            return;
        }

        try {
            await axios.delete(`/radio_channel/${station.id}`);
            fetchList();
        } catch (error) {
            alert('При удалении станции произошла ошибка');
        }
    };

    return (
        <div className={styles.Wrapper}>
            <div className={styles.Head}>
                <p className={styles.HeadTitle}>Управление радио</p>

                <Button to="/station/create">Добавить новую станцию</Button>
            </div>

            <div>
                <table className={styles.Table} cellSpacing={0}>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Обложка</th>
                            <th>Radio Stream Url</th>
                            <th>Активно</th>
                            <th>Популярное</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>
                                    <div>
                                        <img src={item.cover_url} alt="" />
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <a
                                            href={item.radio_stream_url}
                                            target="_blank"
                                        >
                                            ссылка
                                        </a>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <Checkbox
                                            className={styles.Checkbox}
                                            defaultChecked={item.is_active}
                                            disabled={true}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <Checkbox
                                            className={styles.Checkbox}
                                            defaultChecked={item.is_popular}
                                            disabled={true}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.Actions}>
                                        <Link to={`/station/edit/${item.id}`}>
                                            <svg
                                                width="19"
                                                height="19"
                                                viewBox="0 0 19 19"
                                            >
                                                <path
                                                    d="M0 14.2525V18.0025H3.75L14.81 6.9425L11.06 3.1925L0 14.2525ZM17.71 4.0425C18.1 3.6525 18.1 3.0225 17.71 2.6325L15.37 0.2925C14.98 -0.0975 14.35 -0.0975 13.96 0.2925L12.13 2.1225L15.88 5.8725L17.71 4.0425Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => deleteStation(item)}
                                        >
                                            <svg
                                                width="14"
                                                height="19"
                                                viewBox="0 0 14 19"
                                            >
                                                <path
                                                    d="M1 16.0025C1 17.1025 1.9 18.0025 3 18.0025H11C12.1 18.0025 13 17.1025 13 16.0025V4.0025H1V16.0025ZM14 1.0025H10.5L9.5 0.00250244H4.5L3.5 1.0025H0V3.0025H14V1.0025Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
