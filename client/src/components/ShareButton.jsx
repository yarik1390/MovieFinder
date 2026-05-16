import { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { createShareLink } from '../api/share.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

export default function ShareButton({ type, tmdbId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      const data = await createShareLink({ type, tmdb_id: tmdbId });
      const fullUrl = `${window.location.origin}/s/${data.code}`;
      setUrl(fullUrl);
      setModal(true);
    } catch {
      alert('Помилка створення посилання');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button onClick={handleShare} disabled={loading} className="btn-secondary share-btn">
        <Share2 size={16} /> {loading ? '...' : 'Поділитися'}
      </button>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Поділитися посиланням</h3>
              <button onClick={() => setModal(false)} className="icon-btn"><X size={18} /></button>
            </div>
            <div className="share-url-row">
              <input readOnly value={url} className="share-url-input" />
              <button onClick={copy} className="btn-primary copy-btn">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Скопійовано!' : 'Копіювати'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
