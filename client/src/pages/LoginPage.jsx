import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function LoginPage() {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form);
      setAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <h1>Вхід</h1>
        <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="Пароль"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            className="form-input"
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary full-width">
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>
        <p className="auth-switch">Немає акаунту? <Link to="/register">Зареєструватися</Link></p>
      </div>
    </main>
  );
}
