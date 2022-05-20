import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../../components/button';
import styles from './styles.module.scss';

export const Tests = () => {
    const [probability, setProbability] = useState({
        a: '',
        b: '',
    });

    const handleProbabilityChange = useCallback((value, type) => {
        setProbability((probability) => ({
            ...probability,
            [type]: value,
        }));
    }, []);

    useEffect(() => {
        const fetchProbabilities = async () => {
            const [a, b] = await Promise.all([
                axios.get('/percent/1'),
                axios.get('/percent/2'),
            ]);

            setProbability({
                a: a.data.probability,
                b: b.data.probability,
            });
        };

        fetchProbabilities();
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const updateProbabilities = async () => {
        setIsLoading(true);

        await Promise.all([
            axios.put('/percent/1', {
                scen_id: 1,
                probability: Number(probability.a),
            }),
            axios.put('/percent/2', {
                scen_id: 2,
                probability: Number(probability.b),
            }),
        ]);

        setIsLoading(false);
    };

    const fetchScenData = useCallback(
        async (scenId) =>
            (
                await Promise.all([
                    axios.get(`/abtestget_lucky/${scenId}`),
                    axios.get(`/abtestget_all/${scenId}`),
                    axios.get(`/abtestget_convers/${scenId}`),
                    axios.get(`/abtestget_convers_intervals/${scenId}`),
                ])
            ).map((response) => response.data),
        [],
    );

    const [isDataLoading, setIsDataLoading] = useState(false);
    const [data, setData] = useState({
        a: [],
        b: [],
    });

    const fetchData = useCallback(async () => {
        setIsDataLoading(true);
        const [a, b] = await Promise.all([fetchScenData(1), fetchScenData(2)]);

        setIsDataLoading(false);
        setData({
            a,
            b,
        });
    }, [fetchScenData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className={styles.Wrapper}>
            <div className={styles.Header}>
                <p className={styles.HeaderTitle}>A/B tests</p>
            </div>

            <p className={styles.Subtitle}>
                Задание вероятности попадания сценария пользователю, %
            </p>

            <div className={styles.ConversionGroup}>
                <p className={styles.ConversionName}>А:</p>
                <input
                    value={probability?.a ?? ''}
                    onChange={(event) =>
                        handleProbabilityChange(event.target.value, 'a')
                    }
                    type="number"
                    className={`${styles.Input} ${styles.ConversionInput}`}
                />
            </div>

            <div className={styles.ConversionGroup}>
                <p className={styles.ConversionName}>В:</p>
                <input
                    value={probability?.b ?? ''}
                    onChange={(event) =>
                        handleProbabilityChange(event.target.value, 'b')
                    }
                    type="number"
                    className={`${styles.Input} ${styles.ConversionInput}`}
                />
            </div>

            <Button isLoading={isLoading} onClick={updateProbabilities}>
                Сохранить
            </Button>

            {data.a[0] !== undefined && (
                <>
                    <table className={styles.Table}>
                        <thead>
                            <tr>
                                <td />
                                <td>Конверсий</td>
                                <td>Размер выборки</td>
                                <td>Конверсия, %</td>
                                <td>Доверительный интервал, %</td>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow data={data} dataKey="a" />

                            <TableRow data={data} dataKey="b" />
                        </tbody>
                    </table>

                    <Button onClick={fetchData} isLoading={isDataLoading}>
                        Рассчитать конверсию
                    </Button>
                </>
            )}
        </div>
    );
};

const TableRow = ({ data, dataKey }) => {
    return (
        <tr>
            <td>
                <span className={styles.TableRowH}>
                    Вариант {dataKey.toUpperCase()}
                </span>
            </td>
            <td>
                <span className={styles.TableCellWrapper}>
                    <span className={styles.TableCell}>
                        {getNumber(data[dataKey][0])}
                    </span>
                </span>
            </td>
            <td>
                <span className={styles.TableCellWrapper}>
                    <span className={styles.TableCell}>
                        {getNumber(data[dataKey][1])}
                    </span>
                </span>
            </td>
            <td>
                <span className={styles.TableCellWrapper}>
                    <span className={styles.TableCell}>
                        {getNumber(data[dataKey][2])}
                    </span>
                </span>
            </td>
            <td>
                {data[dataKey][3] && (
                    <span className={styles.LastCell}>
                        <span className={styles.TableCell}>
                            {getNumber(data[dataKey][3]?.interval_first)}
                        </span>
                        -
                        <span className={styles.TableCell}>
                            {getNumber(data[dataKey][3]?.interval_second)}
                        </span>
                    </span>
                )}
            </td>
        </tr>
    );
};

const getNumber = (number) => {
    if (typeof number !== 'number') {
        return '';
    }

    return number.toFixed(2);
};
