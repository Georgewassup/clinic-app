import { useState } from 'react';
import { useTranslation } from '../../i18n/TranslationProvider';
import { useFirestore } from '../../hooks/useFirestore';
import { saleService } from '../../services/firestore/saleService';
import ModuleLayout from '../shared/ModuleLayout';
import EmptyState from '../shared/EmptyState';

const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Date Range'];

export default function SaleRecord() {
  const { t } = useTranslation();
  const { data: records } = useFirestore(saleService);
  const [period, setPeriod] = useState('Daily');

  return (
    <ModuleLayout title={t('home.modules.saleRecord')}>
      <h2 className="text-[24px] font-bold text-[#1c1c1e] mb-5">{t('home.modules.saleRecord')}</h2>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all ${
              period === p ? 'bg-[#007AFF] text-white shadow-sm' : 'bg-white text-[#8e8e93] border border-[#c6c6c8]/30 hover:text-[#1c1c1e]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {records.length === 0 ? (
        <EmptyState title={`No ${period.toLowerCase()} sales`} message="Sale records will appear here once transactions are made." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="bg-[#f8f8fc] border-b border-[#c6c6c8]/20">
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Date</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Invoice</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Items</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Total</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}
