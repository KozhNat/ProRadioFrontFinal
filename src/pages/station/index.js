import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/button';
import { Checkbox } from '../../components/checkbox';
import styles from './styles.module.scss';

export const Station = () => {
    const [name, setName] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [radioStreamUrl, setRadioStreamUrl] = useState('');
    const [isPopular, setIsPopular] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [station, setStation] = useState(null);
    const navigate = useNavigate();

    const params = useParams();

    useEffect(() => {
        if (!params.stationId) {
            return;
        }

        const fetchStationToUpdate = async () => {
            const { data } = await axios.get(
                `/radio_channel/${params.stationId}`,
            );
            setName(data.name);
            setCoverUrl(data.cover_url);
            setRadioStreamUrl(data.radio_stream_url);
            setIsPopular(data.is_popular);
            setIsActive(data.is_active);
            setStation(data);
        };

        fetchStationToUpdate();
    }, [params.stationId]);

    const submit = async () => {
        const data = {
            cover_url: coverUrl,
            is_popular: isPopular,
            is_active: isActive,
            name,
            radio_stream_url: radioStreamUrl,
        };

        try {
            setIsLoading(true);
            if (params.stationId) {
                await axios.put(`/radio_channel/${params.stationId}`, data);
            } else {
                await axios.post('/radio_channel/', data);
            }
            navigate('/');
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    if (params.stationId && !station) {
        return null;
    }

    return (
        <div className={styles.Wrapper}>
            <div className={styles.Header}>
                <p className={styles.HeaderTitle}>
                    {params.stationId
                        ? 'Редактирование станции'
                        : 'Создание станции'}
                </p>

                <div className={styles.HeaderButtons}>
                    <Button
                        onClick={submit}
                        disabled={!name || !coverUrl || !radioStreamUrl}
                        isLoading={isLoading}
                    >
                        {params.stationId ? 'Сохранить изменения' : 'Создать'}
                    </Button>

                    <Button to="/">Назад</Button>
                </div>
            </div>

            <div>
                <label className={styles.Input}>
                    <div className={styles.InputTitle}>Название</div>
                    <input
                        placeholder="Название станции"
                        className={styles.InputField}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label className={styles.Input}>
                    <div className={styles.InputTitle}>Обложка</div>
                    <input
                        placeholder="Ссылка на обложку"
                        className={styles.InputField}
                        type="text"
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                    />
                </label>
                <label className={styles.Input}>
                    <div className={styles.InputTitle}>Адрес</div>
                    <input
                        placeholder="Адрес для прослушивания"
                        className={styles.InputField}
                        type="text"
                        value={radioStreamUrl}
                        onChange={(e) => setRadioStreamUrl(e.target.value)}
                    />
                </label>
                <label className={styles.Checkbox}>
                    <Checkbox
                        checked={isPopular}
                        onChange={(e) => setIsPopular(e.target.checked)}
                    />
                    <span className={styles.CheckboxTitle}>Популярное</span>
                </label>
                <label className={styles.Checkbox}>
                    <Checkbox
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span className={styles.CheckboxTitle}>Активно</span>
                </label>
            </div>
        </div>
    );
};
