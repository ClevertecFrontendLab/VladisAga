import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/checkAuthSlice';
import { RootState } from '@redux/configure-store';
import { CalendarTwoTone, HeartFilled, IdcardOutlined, MenuFoldOutlined, MenuUnfoldOutlined, TrophyFilled } from '@ant-design/icons';
import { Body } from '@components/Body/Body';
import { HeaderFC } from '@components/Header/Header';
import { LinkFC } from '@components/LInk/LinkFC';
import { Button, Layout, Menu } from 'antd';
import cn from 'classnames';
import { Link, useNavigate } from "react-router-dom";
import { useWindowWidth } from './WindowWidth';
import styles from './main-page.module.scss';

const { Sider } = Layout;
const namesOfAside = ['Календарь', 'Тренировки', 'Достижения', 'Профиль']

const items = [CalendarTwoTone, HeartFilled, TrophyFilled, IdcardOutlined].map(
    (icon, index) => ({
        key: String(index + 1),
        icon: React.createElement(icon),
        label: namesOfAside[index]
    }),
);

export const MainPage: React.FC = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.checkAuth.auth);
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [logo, setLogo] = useState('/logo.svg');
    const [dataTestId, setDataTestId] = useState('');

    const windowWidth = useWindowWidth();
    useEffect(() => {
        switch (true) {
            case (windowWidth >= 1440):
                setDataTestId('sider-switch');
                break;
            case (windowWidth >= 834):
                setDataTestId('sider-switch');
                break;
            case (windowWidth >= 360):
                setDataTestId('sider-switch-mobile');
                break;
            default:
                setDataTestId('');
        }
    }, [windowWidth]);

    useEffect(() => {
        if (windowWidth > 360) {
            setLogo(collapsed ? '/logo_collapsed.svg' : '/logo.svg');
        } else {
            setLogo('/logo_360px.svg')
        }
    }, [collapsed]);

    useEffect(() => {
        if (!isAuthenticated) navigate('/registrationPage', { replace: true});
    }, [isAuthenticated]);

    const exit = () => {
        dispatch(logout());
    };

    return (
        <div className={styles.mainBox}>
            <Layout >
                <section className={styles.sideSection}>
                    <Sider
                        collapsed={collapsed}
                        breakpoint="lg"
                        collapsedWidth={windowWidth < 480 ? '0' : "64"}
                        className={styles.sideBar}
                        width={windowWidth < 480 ? 106 : 208}
                    >
                        <section>
                            <div className={cn('demo-logo-vertical')}>
                                <div className={styles.boxLogo}>
                                    <img className={cn(styles.img, {
                                        [styles['imgCollapsed']]: collapsed,
                                    })} src={logo} alt='logo' />
                                </div>
                            </div>
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} style={windowWidth < 480 ? { padding: '0' } : { paddingLeft: collapsed ? '24px' : '16px' }} />
                        </section>
                        <section className={styles.exit} onClick={exit}>
                            <LinkFC href='#' className={cn(styles['exitElem'], {
                                [styles['exitCollapsed']]: collapsed
                            })} >{!collapsed && <span>Выход</span>}</LinkFC>
                            <Link to={'/registrationPage'}>Выход</Link>
                        </section>
                    </Sider>
                    <div className={styles.rictangle} style={windowWidth < 480 && collapsed ? { left: '0' } : undefined}>
                        <Button className={styles.sideBtn}
                            data-test-id={dataTestId}
                            type="text"
                            icon={!collapsed ? <MenuUnfoldOutlined width={12.5} height={11} /> : <MenuFoldOutlined width={12.5} height={11} />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={windowWidth < 480 ? {
                                width: 32,
                                height: 48,
                                outline: 'none',
                                border: 'none',
                            } : {
                                width: 20,
                                height: 64,
                                outline: 'none',
                                border: 'none',
                            }}
                        />
                    </div>
                </section>
                <Layout>
                    <HeaderFC />
                    <Body />
                </Layout>
            </Layout>
        </div >
    );
};


