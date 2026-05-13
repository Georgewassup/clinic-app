import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/TranslationProvider';
import LanguageToggle from './LanguageToggle';

export default function ModuleLayout({ title, children, backPath = '/' }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f2f2f7]">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#c6c6c8]/30">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={backPath} className="text-[#007AFF] text-[15px] font-semibold hover:opacity-70 transition-opacity no-underline">
                {t('common.home')}
              </Link>
              <svg className="w-3 h-3 text-[#c6c6c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <h1 className="text-[18px] font-semibold tracking-tight text-[#1c1c1e]">{title}</h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 py-6">
        {children}
      </div>
    </div>
  );
}
