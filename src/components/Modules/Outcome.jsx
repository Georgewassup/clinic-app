import { useTranslation } from '../../i18n/TranslationProvider';
import { useFirestore } from '../../hooks/useFirestore';
import { transactionService } from '../../services/firestore/transactionService';
import ModuleLayout from '../shared/ModuleLayout';
import Button from '../shared/Button';
import EmptyState from '../shared/EmptyState';

export default function Outcome() {
  const { t } = useTranslation();
  const { data: outcomes } = useFirestore(transactionService);

  return (
    <ModuleLayout title={t('home.modules.outcome')}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('home.modules.outcome')}</h2>
        <Button>+ Add Outcome</Button>
      </div>
      {outcomes.length === 0 ? (
        <EmptyState title="No expense records" message="Track your clinic's expenses here." action={<Button>+ Add Outcome</Button>} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="bg-[#f8f8fc] border-b border-[#c6c6c8]/20">
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Date</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Category</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Description</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Amount</th>
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
