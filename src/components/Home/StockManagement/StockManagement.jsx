import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../../i18n/TranslationProvider';
import LanguageToggle from '../../shared/LanguageToggle';
import StockList from './StockList';
import AddProduct from './AddProduct';
import StockAdjustment from './StockAdjustment';
import StockTransfer from './StockTransfer';
import StockReplenishment from './StockReplenishment';
import StockHistory from './StockHistory';

const tabs = [
  { key: '', labelKey: 'list', path: '/stock' },
  { key: 'add-product', labelKey: 'list', path: '/stock/add-product' },
  { key: 'adjustment', labelKey: 'adjustment', path: '/stock/adjustment' },
  { key: 'transfer', labelKey: 'transfer', path: '/stock/transfer' },
  { key: 'replenishment', labelKey: 'replenish', path: '/stock/replenishment' },
  { key: 'history', labelKey: 'history', path: '/stock/history' },
];

export default function StockManagement() {
  const location = useLocation();
  const { t } = useTranslation();

  const activeTab = tabs.find((tab) =>
    tab.key === '' ? location.pathname === '/stock' : location.pathname === tab.path
  )?.key || '';

  return (
    <div className="min-h-screen bg-[#f2f2f7]">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#c6c6c8]/30">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-[#007AFF] text-[15px] font-semibold hover:opacity-70 transition-opacity no-underline">
                {t('common.home')}
              </Link>
              <svg className="w-3 h-3 text-[#c6c6c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <h1 className="text-[18px] font-semibold tracking-tight text-[#1c1c1e]">
                {t('stock.breadcrumb')}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-4 pb-1 overflow-x-auto">
        <div className="inline-flex bg-[#e5e5ea] rounded-[9px] p-[3px] gap-[1px]">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              to={tab.path}
              className={`px-4 py-[7px] text-[13px] font-semibold rounded-2xl transition-all duration-200 whitespace-nowrap no-underline ${
                activeTab === tab.key
                  ? 'bg-white text-[#007AFF] shadow-sm'
                  : 'text-[#8e8e93] hover:text-[#1c1c1e]'
              }`}
            >
              {t(`stock.tabs.${tab.labelKey}`)}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-4">
        <Routes>
          <Route index element={<StockList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="adjustment" element={<StockAdjustment />} />
          <Route path="transfer" element={<StockTransfer />} />
          <Route path="replenishment" element={<StockReplenishment />} />
          <Route path="history" element={<StockHistory />} />
        </Routes>
      </div>
    </div>
  );
}
