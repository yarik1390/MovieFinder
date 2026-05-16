const IMG_BASE = 'https://image.tmdb.org/t/p/original';

const SECTIONS = [
  { key: 'flatrate', label: 'Підписка' },
  { key: 'rent', label: 'Оренда' },
  { key: 'buy', label: 'Купити' },
];

export default function ProviderList({ providers, link }) {
  if (!providers) return (
    <p className="no-providers">Немає інформації про легальний перегляд в Україні.</p>
  );

  const hasAny = SECTIONS.some(s => providers[s.key]?.length > 0);
  if (!hasAny) return (
    <p className="no-providers">Не доступно для легального перегляду в Україні.</p>
  );

  return (
    <div className="providers">
      {SECTIONS.map(({ key, label }) => providers[key]?.length > 0 && (
        <div key={key} className="provider-section">
          <h4>{label}</h4>
          <div className="provider-logos">
            {providers[key].map(p => (
              <a key={p.provider_id} href={link || '#'} target="_blank" rel="noopener noreferrer" title={p.provider_name}>
                <img src={`${IMG_BASE}${p.logo_path}`} alt={p.provider_name} className="provider-logo" />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
