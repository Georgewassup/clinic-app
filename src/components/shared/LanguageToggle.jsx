import { useTranslation } from '../../i18n/TranslationProvider';

export default function LanguageToggle() {
  const { lang, switchLang } = useTranslation();

  return (
    <div className="flex items-center bg-[#e5e5ea] rounded-[8px] p-[2px]">
      <button
        onClick={() => switchLang('en')}
        className={`px-2.5 py-1 rounded-[6px] text-[13px] font-bold transition-all ${
          lang === 'en' ? 'bg-white text-[#007AFF] shadow-sm' : 'text-[#8e8e93] hover:text-[#1c1c1e]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLang('la')}
        className={`px-2.5 py-1 rounded-[6px] text-[13px] font-bold transition-all ${
          lang === 'la' ? 'bg-white text-[#007AFF] shadow-sm' : 'text-[#8e8e93] hover:text-[#1c1c1e]'
        }`}
      >
        ລາວ
      </button>
    </div>
  );
}
