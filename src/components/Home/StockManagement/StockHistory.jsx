import { useState } from 'react';
import { useTranslation } from '../../../i18n/TranslationProvider';
import EmptyState from '../../shared/EmptyState';

const typeColor = (type) => {
  const m = {
    Purchase: 'bg-[#e8f5e9] text-[#2e7d32]',
    Sale: 'bg-[#fce8e8] text-[#d32f2f]',
    Adjustment: 'bg-[#e3f2fd] text-[#1565c0]',
    Transfer: 'bg-[#fff3e0] text-[#e65100]',
  };
  return m[type] || 'bg-[#f3e5f5] text-[#7b1fa2]';
};

export default function StockHistory() {
  const { t } = useTranslation();
  const [history] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = history.filter((h) => {
    const matchSearch = h.product?.toLowerCase().includes(search.toLowerCase()) || h.ref?.toLowerCase().includes(search.toLowerCase());
    return (typeFilter === 'All' || h.type === typeFilter) && matchSearch;
  });

  const cols = t('stockHistory.columns');

  return (
    <div>
      <h2 className="text-[24px] font-bold text-[#1c1c1e] mb-5">{t('stockHistory.title')}</h2>

      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder={t('stockHistory.search')} value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-[15px] placeholder-[#8e8e93] border border-[#c6c6c8]/40 focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-white rounded-xl text-[15px] text-[#1c1c1e] border border-[#c6c6c8]/40 focus:outline-none focus:border-[#007AFF] min-w-[140px] appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: '36px',
            }}>
            <option value="All">{t('stockHistory.filterAll')}</option>
            {['Purchase', 'Sale', 'Adjustment', 'Transfer'].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {history.length === 0 ? (
        <EmptyState title={t('stockHistory.empty')} message={t('stockHistory.emptyMsg')} />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('stockHistory.noResults')} message={t('stockHistory.noResultsMsg')} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="bg-[#f8f8fc] border-b border-[#c6c6c8]/20">
                  {cols.map((h) => (
                    <th key={h} className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((h, i) => (
                  <tr key={h.id} className={`${i !== filtered.length - 1 ? 'border-b border-[#c6c6c8]/20' : ''} hover:bg-[#f8f8fc] transition-colors`}>
                    <td className="py-3 px-4 text-[#8e8e93]">{h.date}</td>
                    <td className="py-3 px-4 font-semibold text-[#1c1c1e]">{h.product}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-bold ${typeColor(h.type)}`}>{h.type}</span>
                    </td>
                    <td className="py-3 px-4 text-[#8e8e93]">{h.ref}</td>
                    <td className={`py-3 px-4 font-semibold ${String(h.qty).startsWith('+') ? 'text-[#2e7d32]' : 'text-[#d32f2f]'}`}>{h.qty}</td>
                    <td className="py-3 px-4 font-semibold">{h.balance}</td>
                    <td className="py-3 px-4 text-[#8e8e93]">{h.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
