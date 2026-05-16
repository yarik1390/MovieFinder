import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function RegisterPage() {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(form);
      setAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <h1>Реєстрація</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Нікнейм"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            required
            className="form-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            className="form-input"
          />
          <input
            type="password"
            placeholder="Пароль (мін. 6 символів)"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            minLength={6}
            className="form-input"
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary full-width">
            {loading ? 'Реєстрація...' : 'Зареєструватися'}
          </button>
        </form>
        <p className="auth-switch">Вже є акаунт? <Link to="/login">Увійти</Link></p>
      </div>
    </main>
  );
}
