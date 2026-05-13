import { useState } from 'react';
import { useTranslation } from '../../i18n/TranslationProvider';
import ModuleLayout from '../shared/ModuleLayout';

const reportTypes = [
  { id: 'sale', label: 'Sale Report' },
  { id: 'profit', label: 'Profit Report' },
  { id: 'stock', label: 'Stock Report' },
  { id: 'customer', label: 'Customer Report' },
  { id: 'supplier', label: 'Supplier Report' },
  { id: 'staff', label: 'Staff Report' },
  { id: 'purchase', label: 'Purchase Report' },
  { id: 'order', label: 'Order Report' },
];

export default function Reports() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('sale');

  return (
    <ModuleLayout title={t('home.modules.reports')}>
      <h2 className="text-[24px] font-bold text-[#1c1c1e] mb-5">{t('home.modules.reports')}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {reportTypes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            className={`bg-white rounded-2xl p-4 text-left border transition-all ${
              selected === r.id ? 'border-[#007AFF] shadow-sm' : 'border-[#c6c6c8]/20 hover:border-[#007AFF]/30'
            }`}
          >
            <h3 className="text-[15px] font-semibold text-[#1c1c1e]">{r.label}</h3>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 p-8">
        <div className="flex flex-col items-center justify-center py-12 text-[#8e8e93]">
          <svg className="w-12 h-12 mb-3 text-[#c6c6c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-[15px] font-medium">Report data will appear here once transactions exist.</p>
        </div>
      </div>
    </ModuleLayout>
  );
}
