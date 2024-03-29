import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { GooglePlusOutlined } from '@ant-design/icons';
import { useWindowWidth } from '@hooks/useWindowWidth';
import { resultValues } from '@pages/RusultPage/resultValues';
import { getSavedValue, savePreviousValue, setPreviousValue } from '@redux/checkLocationSlice';
import { setStateOfLoadFalse, setStateOfLoadTrue } from '@redux/isLoadingSlice';
import { useLazyAuthUsingGoogleQuery, usePostCheckEmailMutation, usePostEnterUserMutation } from '@redux/usersApi';
import { Button, Checkbox, Form, Input } from 'antd';

import { initAuth, saveToken, setAuth } from '../../redux/checkAuthSlice';
import { usePreviousLocation, usePreviousValueRed } from '../../selectors/selectors';
import { TValues } from '../../types/commonTypes';

import styles from './EnterFC.module.scss';

const EnterFC = () => {
    const dispatch = useDispatch();
    const previousValueRed = usePreviousValueRed();
    const previousLocation = usePreviousLocation();
    const [enter, { isLoading: enterLoad }] = usePostEnterUserMutation();
    const [checkEmail, { isLoading: checkEmailLoad }] = usePostCheckEmailMutation();
    const [googleAuth, { isFetching: googleFetching }] = useLazyAuthUsingGoogleQuery();
    const [linkState, setLinkState] = useState(false);
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    const windowWidth = useWindowWidth();

    useEffect(() => {
        dispatch(getSavedValue('previousValue'));
    }, [dispatch])

    const checkAndRedirect = useCallback(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(`/main`, { replace: true, state: 'true' });
        }
    }, [navigate]);

    useEffect(() => {
        checkAndRedirect();
    }, [navigate, checkAndRedirect]);

    const registrationByGoogle = () => {
        window.location.href = 'https://marathon-api.clevertec.ru/auth/google';
        googleAuth(null);
    };

    useEffect(() => {
        if (previousLocation && previousLocation.length > 0) {
            const filteredLocations = previousLocation.filter(value => value && value.location && value.location.search.includes('accessToken'));
            if (filteredLocations.length > 0) {
                const googleToken = filteredLocations[0].location?.search.slice(13);
                localStorage.setItem('token', googleToken!);
                dispatch(initAuth());
                checkAndRedirect();
            }
        }
    }, [previousLocation, googleAuth, dispatch, checkAndRedirect]);

    useEffect(() => {
        if (previousLocation && previousLocation[1] && previousLocation[1].location?.pathname === '/result/error-check-email') {
            checkEmail({ email: previousValueRed }).unwrap()
                .then(() => {
                    dispatch(savePreviousValue(value));
                    navigate('/auth/confirm-email', { replace: true });
                })
                .catch((error) => {
                    if (error.data.message === "Email не найден") {
                        navigate(`/result/${resultValues['error-check-email-no-exist'].trigger}`, { replace: true })
                    } else {
                        dispatch(setPreviousValue(previousValueRed));
                        navigate(`/result/${resultValues['error-check-email'].trigger}`, { replace: true })
                    }
                });
        }
    }, [previousValueRed, dispatch, checkEmail, navigate, previousLocation, value]);

    const handleAddUser = (values: TValues) => {
        if (values) {
            enter({ ...values.user, password: values.password }).unwrap()
                .then((data) => {
                    const action = setAuth(true);
                    dispatch(action);
                    if (values.remember) {
                        localStorage.setItem('token', data.accessToken);
                        dispatch(initAuth());
                    }
                    dispatch(saveToken(data.accessToken));
                    navigate(`/main`, { replace: true, state: values.remember ? values.remember.toString() : '' });
                }).catch(() => {
                    navigate(`/result/${resultValues['error-login'].trigger}`, { replace: true });
                })
        }
    };

    useEffect(() => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) setLinkState(false);
    }, [value]);

    const resetPassword = () => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            checkEmail({ email: value }).unwrap()
                .then(() => {
                    dispatch(savePreviousValue(value));
                    navigate('/auth/confirm-email', { replace: true });
                })
                .catch((error) => {
                    if (error.status === 404) {
                        navigate(`/result/${resultValues['error-check-email-no-exist'].trigger}`, { replace: true })
                    } else {
                        dispatch(setPreviousValue(value));
                        navigate(`/result/${resultValues['error-check-email'].trigger}`, { replace: true })
                    }
                });
        } else {
            setLinkState(true);
        }
    };

    useEffect(() => {
        if (enterLoad || checkEmailLoad || googleFetching) {
            dispatch(setStateOfLoadTrue());
        }
        return () => { dispatch(setStateOfLoadFalse()); }
    }, [enterLoad, checkEmailLoad, googleFetching, dispatch]);

    return (
        <section className={styles.enterForm} >
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: false }}
                onFinish={handleAddUser}
            >
                <Form.Item name={['user', 'email']}
                    rules={[{ type: 'email', required: true, message: '' },
                    ]}>
                    <Input data-test-id='login-email' addonBefore='e-mail:' value={value} onChange={(e) => setValue(e.currentTarget.value)} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '' }, ({ getFieldValue }) => ({
                        validator() {
                            if (getFieldValue('password') && getFieldValue('password').length > 7) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароль не менее 8 символов, с заглавной буквой и цифрой'));
                        },
                    })]}
                >
                    <Input.Password data-test-id='login-password' placeholder='Пароль' />
                </Form.Item>
                <Form.Item style={{ marginBottom: '26px' }}>
                    <section className={styles.memorySection}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox data-test-id='login-remember'>Запомнить меня</Checkbox>
                        </Form.Item>
                        <div>
                            <button data-test-id='login-forgot-button' className="login-form-forgot" disabled={linkState} onClick={resetPassword}>
                                Забыли пароль?
                            </button>
                        </div>
                    </section>
                </Form.Item>
                <Form.Item style={{ marginBottom: '16px' }}>
                    <Button data-test-id='login-submit-button' type="primary" htmlType="submit" className="login-form-button">
                        Войти
                    </Button>
                </Form.Item>
                <Form.Item style={{ marginBottom: '0' }}>
                    <button className={styles.googleBtn} onClick={registrationByGoogle}>
                        <GooglePlusOutlined style={windowWidth <= 360 ? { display: 'none' } : {}} />
                        <NavLink to={''}>Войти через Google</NavLink>
                    </button>
                </Form.Item>
            </Form>
        </section >
    );
}

export default EnterFC;