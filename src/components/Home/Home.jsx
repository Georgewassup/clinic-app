import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/TranslationProvider';
import LanguageToggle from '../shared/LanguageToggle';

const groups = [
  {
    id: 'sales',
    modules: [
      { id: 'sale', path: '/sale' },
      { id: 'saleRecord', path: '/sale-record' },
    ],
  },
  {
    id: 'inventory',
    modules: [
      { id: 'stock', path: '/stock' },
      { id: 'promotion', path: '/promotion' },
    ],
  },
  {
    id: 'reports',
    modules: [
      { id: 'reports', path: '/reports' },
      { id: 'income', path: '/income' },
      { id: 'outcome', path: '/outcome' },
    ],
  },
  {
    id: 'finance',
    modules: [{ id: 'billing', path: '/billing' }],
  },
  {
    id: 'management',
    modules: [
      { id: 'patient', path: '/patient' },
      { id: 'product', path: '/product' },
      { id: 'supplier', path: '/supplier' },
      { id: 'staff', path: '/staff' },
      { id: 'purchase', path: '/purchase' },
      { id: 'order', path: '/order' },
      { id: 'currency', path: '/currency' },
    ],
  },
];

export default function Home() {
  const { t } = useTranslation();
  const [activeGroup, setActiveGroup] = useState(null);

  const currentGroup = groups.find((g) => g.id === activeGroup);

  return (
    <div className="min-h-screen bg-[#f2f2f7]">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#c6c6c8]/30">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#007AFF]" />
              <h1 className="text-[24px] font-semibold tracking-tight text-[#1c1c1e]">{t('app.title')}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/setup" className="w-8 h-8 rounded-xl hover:bg-[#f2f2f7] flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-[#8e8e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <LanguageToggle />
              <span className="text-[13px] text-[#8e8e93] font-medium">
                {new Date().toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="text-[30px] font-bold text-[#1c1c1e] mb-1">{t('home.welcome')}</h2>
        <p className="text-[15px] text-[#8e8e93] font-medium mb-6">{t('home.subtitle')}</p>

        {!currentGroup ? (
          /* Category buttons */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className="bg-white rounded-2xl p-5 text-left shadow-sm border border-[#c6c6c8]/20 hover:shadow-md hover:border-[#007AFF]/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center mb-3">
                  <div className="w-5 h-5 rounded-full bg-[#007AFF]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#1c1c1e] mb-0.5">{t(`home.categories.${g.id}`)}</h3>
                <p className="text-[12px] text-[#8e8e93] font-medium">{g.modules.length} modules</p>
              </button>
            ))}
          </div>
        ) : (
          /* Modules in selected category */
          <div>
            <button
              onClick={() => setActiveGroup(null)}
              className="flex items-center gap-1.5 text-[#007AFF] text-[14px] font-semibold mb-5 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              All Categories
            </button>

            <h3 className="text-[22px] font-bold text-[#1c1c1e] mb-4">{t(`home.categories.${currentGroup.id}`)}</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentGroup.modules.map((mod) => (
                <Link
                  key={mod.id}
                  to={mod.path}
                  className="bg-white rounded-2xl p-5 text-left shadow-sm border border-[#c6c6c8]/20 hover:shadow-md hover:border-[#007AFF]/30 transition-all duration-200 active:scale-[0.98] no-underline"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#007AFF]" />
                  </div>
                  <h4 className="text-[15px] font-semibold text-[#1c1c1e] mb-0.5">{t(`home.modules.${mod.id}`)}</h4>
                  <p className="text-[13px] text-[#8e8e93] font-medium leading-tight">{t(`home.desc.${mod.id}`)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
