import axios from 'axios';
import React, {
    createContext,
    useState,
    useEffect,
    useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { StationList } from './pages/station-list';
import { Station } from './pages/station';
import { Layout } from './layout';
import { Login } from './pages/login';
import './index.scss';

export const UserContext = createContext(null);

axios.defaults.baseURL = 'https://newradiobacklast.herokuapp.com';

const App = ({ children }) => {
    const userState = useState(null);
    const navigate = useNavigate();
    const setUser = userState[1];

    useEffect(() => {
        let user = localStorage.getItem('radioUser');

        if (!user && !window.location.pathname.includes('login')) {
            navigate('/login');
            return;
        }

        user = JSON.parse(user);

        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`/user/${user.id}`);
                setUser(data);
            } catch (error) {
                navigate('/login');
                localStorage.removeItem('radioUser');
            }
        };

        fetchUser();
    }, [navigate, setUser]);

    useLayoutEffect(() => {
        axios.interceptors.response.use((response) => {
            if (
                response.data.hasOwnProperty('access_token') &&
                response.data.hasOwnProperty('id')
            ) {
                localStorage.setItem(
                    'radioUser',
                    JSON.stringify(response.data),
                );
            }

            return response;
        });

        axios.interceptors.request.use((request) => {
            let user = localStorage.getItem('radioUser');

            if (user) {
                user = JSON.parse(user);

                request.headers = {
                    ...request.headers,
                    Authorization: `Bearer ${user.access_token}`,
                };
            }

            return request;
        });
    }, []);

    return (
        <UserContext.Provider value={userState}>
            {children}
        </UserContext.Provider>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<StationList />} />
                        <Route path="/station/create" element={<Station />} />
                        <Route
                            path="/station/edit/:stationId"
                            element={<Station />}
                        />
                    </Route>
                </Routes>
            </App>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
);
