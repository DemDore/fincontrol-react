import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    
    const { register, login, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setLocalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLocalError('');

        // Валидация для регистрации
        if (!isLogin) {
            if (formData.password !== formData.confirmPassword) {
                setLocalError('Пароли не совпадают');
                setLoading(false);
                return;
            }
            if (formData.password.length < 6) {
                setLocalError('Пароль должен содержать минимум 6 символов');
                setLoading(false);
                return;
            }
            if (!formData.name.trim()) {
                setLocalError('Введите имя');
                setLoading(false);
                return;
            }
        }

        if (!formData.email || !formData.password) {
            setLocalError('Заполните все поля');
            setLoading(false);
            return;
        }

        let result;
        if (isLogin) {
            console.log('Попытка входа с:', formData.email);
            result = await login(formData.email, formData.password);
            console.log('Результат входа:', result);
        } else {
            console.log('Попытка регистрации с:', formData.email);
            result = await register(formData.name, formData.email, formData.password);
            console.log('Результат регистрации:', result);
        }

        if (result && result.success) {
            console.log('Успешно! Перенаправление на главную');
            navigate('/');
        } else {
            const errorMsg = result?.error || authError || 'Ошибка авторизации';
            console.log('Ошибка:', errorMsg);
            setLocalError(errorMsg);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <span className="logo-icon">💰</span>
                            <span className="logo-text">FinControl</span>
                        </div>
                        <p className="auth-subtitle">
                            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label>Имя</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ваше имя"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Пароль</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label>Подтверждение пароля</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {(localError || authError) && (
                            <div className="auth-error">
                                {localError || authError}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn-primary auth-btn"
                            disabled={loading}
                        >
                            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                            <button
                                type="button"
                                className="auth-switch-btn"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setLocalError('');
                                    setFormData({
                                        name: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: ''
                                    });
                                }}
                            >
                                {isLogin ? 'Зарегистрироваться' : 'Войти'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;